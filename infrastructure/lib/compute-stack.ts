import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { config } from './config';

export interface ComputeStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  ecsSecurityGroup: ec2.ISecurityGroup;
  databaseSecret: secretsmanager.ISecret;
  apiFootballSecret: secretsmanager.ISecret;
  apiRepository: ecr.IRepository;
  frontendRepository: ecr.IRepository;
  workerRepository: ecr.IRepository;
  apiTargetGroup?: elbv2.IApplicationTargetGroup;
  frontendTargetGroup?: elbv2.IApplicationTargetGroup;
}

export class ComputeStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly apiService: ecs.FargateService;
  public readonly frontendService: ecs.FargateService;
  public readonly workerTaskDefinition: ecs.FargateTaskDefinition;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    // ECS Cluster
    this.cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: `${config.appName}-${config.environment}`,
      vpc: props.vpc,
      containerInsights: true,
    });

    // ============================================================================
    // API Service
    // ============================================================================

    // API Task Definition
    const apiTaskDefinition = new ecs.FargateTaskDefinition(this, 'ApiTaskDefinition', {
      family: `${config.appName}-${config.environment}-api`,
      cpu: config.ecs.api.cpu,
      memoryLimitMiB: config.ecs.api.memory,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64, // Graviton
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    // Grant read access to secrets
    props.databaseSecret.grantRead(apiTaskDefinition.taskRole);
    props.apiFootballSecret.grantRead(apiTaskDefinition.taskRole);

    // API Log Group
    const apiLogGroup = new logs.LogGroup(this, 'ApiLogGroup', {
      logGroupName: `/ecs/${config.appName}-${config.environment}-api`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // API Container
    const apiContainer = apiTaskDefinition.addContainer('api', {
      containerName: 'api',
      image: ecs.ContainerImage.fromEcrRepository(props.apiRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'api',
        logGroup: apiLogGroup,
      }),
      environment: {
        APP_ENV: 'production',
        NODE_ENV: 'production',
        PORT: config.ecs.api.containerPort.toString(),
        DB_NAME: 'oddins_odds',
      },
      secrets: {
        DB_HOST: ecs.Secret.fromSecretsManager(props.databaseSecret, 'host'),
        DB_PORT: ecs.Secret.fromSecretsManager(props.databaseSecret, 'port'),
        DB_USER: ecs.Secret.fromSecretsManager(props.databaseSecret, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.databaseSecret, 'password'),
        SPORTS_PROVIDER_API_KEY: ecs.Secret.fromSecretsManager(props.apiFootballSecret, 'apiKey'),
      },
      healthCheck: {
        command: ['CMD-SHELL', `wget --spider -q http://localhost:${config.ecs.api.containerPort}/health || exit 1`],
        interval: cdk.Duration.seconds(30),
        timeout: cdk.Duration.seconds(5),
        retries: 3,
        startPeriod: cdk.Duration.seconds(60),
      },
    });

    apiContainer.addPortMappings({
      containerPort: config.ecs.api.containerPort,
      protocol: ecs.Protocol.TCP,
    });

    // API Service
    this.apiService = new ecs.FargateService(this, 'ApiService', {
      serviceName: `${config.appName}-${config.environment}-api`,
      cluster: this.cluster,
      taskDefinition: apiTaskDefinition,
      desiredCount: config.ecs.api.desiredCount,
      minHealthyPercent: 50,
      maxHealthyPercent: 200,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1,
          base: 0,
        },
      ],
      securityGroups: [props.ecsSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      enableExecuteCommand: true, // For debugging
      circuitBreaker: {
        rollback: true,
      },
    });

    // API Auto Scaling
    const apiScaling = this.apiService.autoScaleTaskCount({
      minCapacity: config.ecs.api.minCapacity,
      maxCapacity: config.ecs.api.maxCapacity,
    });

    apiScaling.scaleOnCpuUtilization('ApiCpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(300),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    apiScaling.scaleOnMemoryUtilization('ApiMemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(300),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Attach to target group if provided
    if (props.apiTargetGroup) {
      this.apiService.attachToApplicationTargetGroup(props.apiTargetGroup);
    }

    // ============================================================================
    // Frontend Service
    // ============================================================================

    // Frontend Task Definition
    const frontendTaskDefinition = new ecs.FargateTaskDefinition(this, 'FrontendTaskDefinition', {
      family: `${config.appName}-${config.environment}-frontend`,
      cpu: config.ecs.frontend.cpu,
      memoryLimitMiB: config.ecs.frontend.memory,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64, // Graviton
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    // Frontend Log Group
    const frontendLogGroup = new logs.LogGroup(this, 'FrontendLogGroup', {
      logGroupName: `/ecs/${config.appName}-${config.environment}-frontend`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Frontend Container
    const frontendContainer = frontendTaskDefinition.addContainer('frontend', {
      containerName: 'frontend',
      image: ecs.ContainerImage.fromEcrRepository(props.frontendRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'frontend',
        logGroup: frontendLogGroup,
      }),
      environment: {
        NODE_ENV: 'production',
        PORT: config.ecs.frontend.containerPort.toString(),
        NEXT_PUBLIC_API_URL: `https://${config.apiSubdomain}.${config.domain}`,
      },
      // Health check removed - relying on ALB target health checks instead
      // ALB will only route traffic to healthy containers
    });

    frontendContainer.addPortMappings({
      containerPort: config.ecs.frontend.containerPort,
      protocol: ecs.Protocol.TCP,
    });

    // Frontend Service
    this.frontendService = new ecs.FargateService(this, 'FrontendService', {
      serviceName: `${config.appName}-${config.environment}-frontend`,
      cluster: this.cluster,
      taskDefinition: frontendTaskDefinition,
      desiredCount: config.ecs.frontend.desiredCount,
      minHealthyPercent: 50,
      maxHealthyPercent: 200,
      capacityProviderStrategies: [
        {
          capacityProvider: 'FARGATE_SPOT',
          weight: 1,
          base: 0,
        },
      ],
      securityGroups: [props.ecsSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      enableExecuteCommand: true,
      circuitBreaker: {
        rollback: true,
      },
    });

    // Frontend Auto Scaling
    const frontendScaling = this.frontendService.autoScaleTaskCount({
      minCapacity: config.ecs.frontend.minCapacity,
      maxCapacity: config.ecs.frontend.maxCapacity,
    });

    frontendScaling.scaleOnCpuUtilization('FrontendCpuScaling', {
      targetUtilizationPercent: 70,
      scaleInCooldown: cdk.Duration.seconds(300),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    frontendScaling.scaleOnMemoryUtilization('FrontendMemoryScaling', {
      targetUtilizationPercent: 80,
      scaleInCooldown: cdk.Duration.seconds(300),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });

    // Attach to target group if provided
    if (props.frontendTargetGroup) {
      this.frontendService.attachToApplicationTargetGroup(props.frontendTargetGroup);
    }

    // ============================================================================
    // Worker Task Definition (Scheduled)
    // ============================================================================

    this.workerTaskDefinition = new ecs.FargateTaskDefinition(this, 'WorkerTaskDefinition', {
      family: `${config.appName}-${config.environment}-worker`,
      cpu: config.ecs.worker.cpu,
      memoryLimitMiB: config.ecs.worker.memory,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.ARM64, // Graviton
        operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
      },
    });

    // Grant read access to secrets
    props.databaseSecret.grantRead(this.workerTaskDefinition.taskRole);
    props.apiFootballSecret.grantRead(this.workerTaskDefinition.taskRole);

    // Worker Log Group
    const workerLogGroup = new logs.LogGroup(this, 'WorkerLogGroup', {
      logGroupName: `/ecs/${config.appName}-${config.environment}-worker`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Worker Container
    this.workerTaskDefinition.addContainer('worker', {
      containerName: 'worker',
      image: ecs.ContainerImage.fromEcrRepository(props.workerRepository, 'latest'),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'worker',
        logGroup: workerLogGroup,
      }),
      environment: {
        APP_ENV: 'production',
        NODE_ENV: 'production',
        FORCE_UPDATE: '3', // Force task definition update
      },
      secrets: {
        DB_HOST: ecs.Secret.fromSecretsManager(props.databaseSecret, 'host'),
        DB_PORT: ecs.Secret.fromSecretsManager(props.databaseSecret, 'port'),
        DB_USER: ecs.Secret.fromSecretsManager(props.databaseSecret, 'username'),
        DB_PASSWORD: ecs.Secret.fromSecretsManager(props.databaseSecret, 'password'),
        DB_NAME: ecs.Secret.fromSecretsManager(props.databaseSecret, 'dbname'),
        SPORTS_PROVIDER_API_KEY: ecs.Secret.fromSecretsManager(props.apiFootballSecret, 'apiKey'),
      },
      command: ['node', 'apps/worker/dist/index.js', 'sync:leagues'], // Run the sync leagues job
    });

    // EventBridge Rule for scheduled worker execution
    const workerRule = new events.Rule(this, 'WorkerScheduleRule', {
      ruleName: `${config.appName}-${config.environment}-sync-leagues`,
      description: 'Trigger worker to sync leagues daily at 3 AM UTC',
      schedule: events.Schedule.expression(config.ecs.worker.schedule),
    });

    // Add ECS task as target
    workerRule.addTarget(
      new targets.EcsTask({
        cluster: this.cluster,
        taskDefinition: this.workerTaskDefinition,
        taskCount: 1,
        subnetSelection: {
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        securityGroups: [props.ecsSecurityGroup],
        platformVersion: ecs.FargatePlatformVersion.LATEST,
      })
    );

    // Grant EventBridge permission to run the task
    workerRule.addTarget;

    // Outputs
    new cdk.CfnOutput(this, 'ClusterName', {
      value: this.cluster.clusterName,
      description: 'ECS Cluster name',
      exportName: `${config.appName}-${config.environment}-cluster-name`,
    });

    new cdk.CfnOutput(this, 'ApiServiceName', {
      value: this.apiService.serviceName,
      description: 'API Service name',
    });

    new cdk.CfnOutput(this, 'FrontendServiceName', {
      value: this.frontendService.serviceName,
      description: 'Frontend Service name',
    });

    new cdk.CfnOutput(this, 'WorkerTaskDefinitionArn', {
      value: this.workerTaskDefinition.taskDefinitionArn,
      description: 'Worker Task Definition ARN',
    });
  }
}

