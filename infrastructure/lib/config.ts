/**
 * Configuration for production infrastructure
 */
export const config = {
  // AWS Account & Region
  account: '545586473769',
  region: 'us-east-1',
  
  // Environment
  environment: 'production',
  appName: 'oddins',
  
  // Domain
  domain: 'oddins-odds.com',
  apiSubdomain: 'api',
  
  // VPC Configuration
  vpc: {
    cidr: '10.0.0.0/16',
    maxAzs: 2,
    natGateways: 1, // Cost optimization: single NAT
  },
  
  // RDS Configuration
  database: {
    instanceType: 't4g.micro',
    allocatedStorage: 20,
    maxAllocatedStorage: 100,
    backupRetention: 7, // days
    multiAz: false, // Cost optimization
    databaseName: 'oddins_odds',
    username: 'oddins',
  },
  
  // ECS Configuration
  ecs: {
    api: {
      cpu: 256, // 0.25 vCPU
      memory: 512, // MB
      desiredCount: 2,
      minCapacity: 2,
      maxCapacity: 4,
      containerPort: 3001,
    },
    frontend: {
      cpu: 256,
      memory: 512,
      desiredCount: 2,
      minCapacity: 2,
      maxCapacity: 4,
      containerPort: 3000,
    },
    worker: {
      cpu: 256,
      memory: 512,
      schedule: 'cron(0 3 * * ? *)', // Daily at 3 AM UTC
    },
  },
  
  // ALB Configuration
  alb: {
    healthCheckPath: '/health',
    healthCheckInterval: 30, // seconds
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 3,
    healthCheckTimeout: 10, // seconds
  },
  
  // Monitoring Configuration
  monitoring: {
    logRetentionDays: 30,
    alarmEmail: 'urieah.avni@gmail.com',
  },
  
  // Tags (for cost tracking)
  tags: {
    Project: 'sports',
    Environment: 'production',
    ManagedBy: 'CDK',
  },
};

