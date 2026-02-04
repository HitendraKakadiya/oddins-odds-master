import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { config } from './config';

export interface DatabaseStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  databaseSecurityGroup: ec2.ISecurityGroup;
}

export class DatabaseStack extends cdk.Stack {
  public readonly database: rds.DatabaseInstance;
  public readonly secret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: DatabaseStackProps) {
    super(scope, id, props);

    // Subnet group for RDS (private subnets only)
    const subnetGroup = new rds.SubnetGroup(this, 'DatabaseSubnetGroup', {
      description: 'Subnet group for RDS PostgreSQL',
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Parameter group for PostgreSQL tuning
    const parameterGroup = new rds.ParameterGroup(this, 'DatabaseParameterGroup', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      description: 'Parameter group for Oddins PostgreSQL',
      parameters: {
        'shared_buffers': '{DBInstanceClassMemory/32768}', // ~128MB for t4g.micro
        'max_connections': '100',
        'work_mem': '4096', // 4MB in KB
        'maintenance_work_mem': '16384', // 16MB in KB
        'effective_cache_size': '{DBInstanceClassMemory/10240}', // ~384MB for t4g.micro
        'log_statement': 'all',
        'log_duration': 'on',
        'log_min_duration_statement': '1000', // Log queries > 1s
      },
    });

    // RDS PostgreSQL instance
    this.database = new rds.DatabaseInstance(this, 'Database', {
      instanceIdentifier: `${config.appName}-${config.environment}-postgres`,
      databaseName: config.database.databaseName,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO
      ),
      credentials: rds.Credentials.fromGeneratedSecret(config.database.username),
      vpc: props.vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [props.databaseSecurityGroup],
      subnetGroup,
      parameterGroup,
      allocatedStorage: config.database.allocatedStorage,
      maxAllocatedStorage: config.database.maxAllocatedStorage,
      storageType: rds.StorageType.GP3,
      storageEncrypted: true,
      multiAz: config.database.multiAz,
      publiclyAccessible: false,
      backupRetention: cdk.Duration.days(config.database.backupRetention),
      preferredBackupWindow: '02:00-03:00', // Before worker jobs at 3 AM
      preferredMaintenanceWindow: 'sun:04:00-sun:05:00',
      deletionProtection: true, // Safety: prevent accidental deletion
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT, // Take snapshot on stack deletion
      autoMinorVersionUpgrade: true,
      enablePerformanceInsights: false, // Extra cost
      cloudwatchLogsExports: ['postgresql'], // Export logs to CloudWatch
      monitoringInterval: cdk.Duration.seconds(60), // Enhanced monitoring
    });

    // Export the secret (RDS creates a secret with connection info)
    this.secret = this.database.secret!;

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: this.database.dbInstanceEndpointAddress,
      description: 'Database endpoint address',
      exportName: `${config.appName}-${config.environment}-database-endpoint`,
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: this.database.dbInstanceEndpointPort,
      description: 'Database port',
    });

    new cdk.CfnOutput(this, 'DatabaseName', {
      value: config.database.databaseName,
      description: 'Database name',
    });

    new cdk.CfnOutput(this, 'DatabaseConnectionString', {
      value: `postgresql://${config.database.username}:<password>@${this.database.dbInstanceEndpointAddress}:${this.database.dbInstanceEndpointPort}/${config.database.databaseName}`,
      description: 'Database connection string (replace <password> with actual password from secrets)',
    });
  }
}

