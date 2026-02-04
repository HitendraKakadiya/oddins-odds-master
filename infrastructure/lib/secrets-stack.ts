import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { config } from './config';

export class SecretsStack extends cdk.Stack {
  public readonly databaseSecret: secretsmanager.ISecret;
  public readonly apiFootballSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Database credentials secret
    this.databaseSecret = new secretsmanager.Secret(this, 'DatabaseSecret', {
      secretName: `sports/${config.environment}/database`,
      description: 'PostgreSQL database credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: config.database.username,
          database: config.database.databaseName,
        }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
        passwordLength: 32,
      },
    });

    // API Football API key secret (placeholder - needs manual update)
    this.apiFootballSecret = new secretsmanager.Secret(this, 'ApiFootballSecret', {
      secretName: `sports/${config.environment}/api-football-key`,
      description: 'API-Football API key',
      secretStringValue: cdk.SecretValue.unsafePlainText('PLACEHOLDER_UPDATE_AFTER_DEPLOYMENT'),
    });

    // Outputs
    new cdk.CfnOutput(this, 'DatabaseSecretArn', {
      value: this.databaseSecret.secretArn,
      description: 'Database secret ARN',
      exportName: `${config.appName}-${config.environment}-database-secret-arn`,
    });

    new cdk.CfnOutput(this, 'ApiFootballSecretArn', {
      value: this.apiFootballSecret.secretArn,
      description: 'API Football secret ARN',
      exportName: `${config.appName}-${config.environment}-api-football-secret-arn`,
    });

    // Add instructions for manual secret update
    new cdk.CfnOutput(this, 'UpdateApiFootballSecretCommand', {
      value: `aws secretsmanager update-secret --secret-id ${this.apiFootballSecret.secretName} --secret-string '{"apiKey":"YOUR_API_KEY_HERE"}' --profile sports-cli --region ${config.region}`,
      description: 'Command to update API Football secret',
    });
  }
}

