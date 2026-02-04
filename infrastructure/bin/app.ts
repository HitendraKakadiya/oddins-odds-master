#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NetworkStack } from '../lib/network-stack';
import { SecretsStack } from '../lib/secrets-stack';
import { DatabaseStack } from '../lib/database-stack';
import { CICDStack } from '../lib/cicd-stack';
import { ComputeStack } from '../lib/compute-stack';
import { LoadBalancerStack } from '../lib/loadbalancer-stack';
import { MonitoringStack } from '../lib/monitoring-stack';
import { config } from '../lib/config';

const app = new cdk.App();

const env = {
  account: config.account,
  region: config.region,
};

// Stack 1: Network (VPC, Subnets, Security Groups)
const networkStack = new NetworkStack(app, 'NetworkStack', {
  env,
  description: 'Oddins Sports - Network Infrastructure',
  tags: config.tags,
});

// Stack 2: Secrets (Secrets Manager)
const secretsStack = new SecretsStack(app, 'SecretsStack', {
  env,
  description: 'Oddins Sports - Secrets Management',
  tags: config.tags,
});

// Stack 3: Database (RDS PostgreSQL)
const databaseStack = new DatabaseStack(app, 'DatabaseStack', {
  env,
  vpc: networkStack.vpc,
  databaseSecurityGroup: networkStack.databaseSecurityGroup,
  description: 'Oddins Sports - Database',
  tags: config.tags,
});

// Stack 4: CICD (ECR Repositories)
const cicdStack = new CICDStack(app, 'CICDStack', {
  env,
  description: 'Oddins Sports - CI/CD Infrastructure',
  tags: config.tags,
});

// Stack 5: LoadBalancer (ALB, Target Groups, ACM Certificate)
// Must be created before ComputeStack so target groups exist
const loadBalancerStack = new LoadBalancerStack(app, 'LoadBalancerStack', {
  env,
  vpc: networkStack.vpc,
  albSecurityGroup: networkStack.albSecurityGroup,
  description: 'Oddins Sports - Load Balancer',
  tags: config.tags,
});

// Stack 6: Compute (ECS Cluster, Task Definitions, Services)
const computeStack = new ComputeStack(app, 'ComputeStack', {
  env,
  vpc: networkStack.vpc,
  ecsSecurityGroup: networkStack.ecsSecurityGroup,
  databaseSecret: databaseStack.secret, // Use RDS-generated secret
  apiFootballSecret: secretsStack.apiFootballSecret,
  apiRepository: cicdStack.apiRepository,
  frontendRepository: cicdStack.frontendRepository,
  workerRepository: cicdStack.workerRepository,
  apiTargetGroup: loadBalancerStack.apiTargetGroup,
  frontendTargetGroup: loadBalancerStack.frontendTargetGroup,
  description: 'Oddins Sports - Compute Infrastructure',
  tags: config.tags,
});

// Stack 7: Monitoring (CloudWatch Logs, Alarms, Dashboards)
const monitoringStack = new MonitoringStack(app, 'MonitoringStack', {
  env,
  loadBalancer: loadBalancerStack.loadBalancer,
  apiTargetGroup: loadBalancerStack.apiTargetGroup,
  frontendTargetGroup: loadBalancerStack.frontendTargetGroup,
  apiService: computeStack.apiService,
  frontendService: computeStack.frontendService,
  database: databaseStack.database,
  description: 'Oddins Sports - Monitoring & Alerting',
  tags: config.tags,
});

// Add dependencies
databaseStack.addDependency(networkStack);
cicdStack.addDependency(networkStack);
loadBalancerStack.addDependency(networkStack);
computeStack.addDependency(databaseStack);
computeStack.addDependency(cicdStack);
computeStack.addDependency(secretsStack); // For API Football secret
computeStack.addDependency(loadBalancerStack);
monitoringStack.addDependency(loadBalancerStack);
monitoringStack.addDependency(computeStack);
monitoringStack.addDependency(databaseStack);

