import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { Construct } from 'constructs';
import { config } from './config';

export class CICDStack extends cdk.Stack {
  public readonly apiRepository: ecr.Repository;
  public readonly frontendRepository: ecr.Repository;
  public readonly workerRepository: ecr.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ECR Repository for API
    this.apiRepository = new ecr.Repository(this, 'ApiRepository', {
      repositoryName: `${config.appName}/api`,
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.MUTABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // WARNING: Will delete images on stack deletion
      emptyOnDelete: true,
      lifecycleRules: [
        {
          description: 'Remove untagged images after 1 day',
          tagStatus: ecr.TagStatus.UNTAGGED,
          maxImageAge: cdk.Duration.days(1),
          rulePriority: 1,
        },
        {
          description: 'Keep last 10 images',
          maxImageCount: 10,
          rulePriority: 2,
        },
      ],
    });

    // ECR Repository for Frontend
    this.frontendRepository = new ecr.Repository(this, 'FrontendRepository', {
      repositoryName: `${config.appName}/frontend`,
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.MUTABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
      lifecycleRules: [
        {
          description: 'Remove untagged images after 1 day',
          tagStatus: ecr.TagStatus.UNTAGGED,
          maxImageAge: cdk.Duration.days(1),
          rulePriority: 1,
        },
        {
          description: 'Keep last 10 images',
          maxImageCount: 10,
          rulePriority: 2,
        },
      ],
    });

    // ECR Repository for Worker
    this.workerRepository = new ecr.Repository(this, 'WorkerRepository', {
      repositoryName: `${config.appName}/worker`,
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.MUTABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      emptyOnDelete: true,
      lifecycleRules: [
        {
          description: 'Remove untagged images after 1 day',
          tagStatus: ecr.TagStatus.UNTAGGED,
          maxImageAge: cdk.Duration.days(1),
          rulePriority: 1,
        },
        {
          description: 'Keep last 10 images',
          maxImageCount: 10,
          rulePriority: 2,
        },
      ],
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiRepositoryUri', {
      value: this.apiRepository.repositoryUri,
      description: 'API Repository URI',
      exportName: `${config.appName}-${config.environment}-api-repo-uri`,
    });

    new cdk.CfnOutput(this, 'FrontendRepositoryUri', {
      value: this.frontendRepository.repositoryUri,
      description: 'Frontend Repository URI',
      exportName: `${config.appName}-${config.environment}-frontend-repo-uri`,
    });

    new cdk.CfnOutput(this, 'WorkerRepositoryUri', {
      value: this.workerRepository.repositoryUri,
      description: 'Worker Repository URI',
      exportName: `${config.appName}-${config.environment}-worker-repo-uri`,
    });

    // ECR Login command
    new cdk.CfnOutput(this, 'EcrLoginCommand', {
      value: `aws ecr get-login-password --region ${config.region} --profile sports-cli | docker login --username AWS --password-stdin ${config.account}.dkr.ecr.${config.region}.amazonaws.com`,
      description: 'ECR login command',
    });
  }
}

