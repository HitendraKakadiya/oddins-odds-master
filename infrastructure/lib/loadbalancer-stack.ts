import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { Construct } from 'constructs';
import { config } from './config';

export interface LoadBalancerStackProps extends cdk.StackProps {
  vpc: ec2.IVpc;
  albSecurityGroup: ec2.ISecurityGroup;
}

export class LoadBalancerStack extends cdk.Stack {
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;
  public readonly apiTargetGroup: elbv2.ApplicationTargetGroup;
  public readonly frontendTargetGroup: elbv2.ApplicationTargetGroup;
  public readonly certificate: acm.Certificate;

  constructor(scope: Construct, id: string, props: LoadBalancerStackProps) {
    super(scope, id, props);

    // Application Load Balancer
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'LoadBalancer', {
      loadBalancerName: `${config.appName}-${config.environment}-alb`,
      vpc: props.vpc,
      internetFacing: true,
      securityGroup: props.albSecurityGroup,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      deletionProtection: false, // Set to true in production after testing
    });

    // Lookup existing hosted zone
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: config.domain,
    });

    // ACM Certificate for *.oddins-odds.com
    this.certificate = new acm.Certificate(this, 'Certificate', {
      domainName: config.domain,
      subjectAlternativeNames: [`*.${config.domain}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // Target Group for API
    this.apiTargetGroup = new elbv2.ApplicationTargetGroup(this, 'ApiTargetGroup', {
      targetGroupName: `${config.appName}-${config.environment}-api-tg`,
      vpc: props.vpc,
      port: config.ecs.api.containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: config.alb.healthCheckPath,
        interval: cdk.Duration.seconds(config.alb.healthCheckInterval),
        timeout: cdk.Duration.seconds(config.alb.healthCheckTimeout),
        healthyThresholdCount: config.alb.healthyThresholdCount,
        unhealthyThresholdCount: config.alb.unhealthyThresholdCount,
        healthyHttpCodes: '200',
      },
      deregistrationDelay: cdk.Duration.seconds(30),
    });

    // Target Group for Frontend
    this.frontendTargetGroup = new elbv2.ApplicationTargetGroup(this, 'FrontendTargetGroup', {
      targetGroupName: `${config.appName}-${config.environment}-fe-tg`,
      vpc: props.vpc,
      port: config.ecs.frontend.containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targetType: elbv2.TargetType.IP,
      healthCheck: {
        path: config.alb.healthCheckPath,
        interval: cdk.Duration.seconds(config.alb.healthCheckInterval),
        timeout: cdk.Duration.seconds(config.alb.healthCheckTimeout),
        healthyThresholdCount: config.alb.healthyThresholdCount,
        unhealthyThresholdCount: config.alb.unhealthyThresholdCount,
        healthyHttpCodes: '200',
      },
      deregistrationDelay: cdk.Duration.seconds(30),
    });

    // Note: Services will attach themselves to these target groups in ComputeStack

    // HTTP Listener (redirect to HTTPS)
    this.loadBalancer.addListener('HttpListener', {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: 'HTTPS',
        port: '443',
        permanent: true,
      }),
    });

    // HTTPS Listener
    const httpsListener = this.loadBalancer.addListener('HttpsListener', {
      port: 443,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [this.certificate],
      defaultAction: elbv2.ListenerAction.forward([this.frontendTargetGroup]),
    });

    // Add rules for API subdomain
    httpsListener.addAction('ApiRule', {
      priority: 1,
      conditions: [
        elbv2.ListenerCondition.hostHeaders([`${config.apiSubdomain}.${config.domain}`]),
      ],
      action: elbv2.ListenerAction.forward([this.apiTargetGroup]),
    });

    // Route53 records (A record pointing to ALB)
    new route53.ARecord(this, 'RootAliasRecord', {
      zone: hostedZone,
      recordName: config.domain,
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(this.loadBalancer)
      ),
    });

    new route53.ARecord(this, 'WwwAliasRecord', {
      zone: hostedZone,
      recordName: `www.${config.domain}`,
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(this.loadBalancer)
      ),
    });

    new route53.ARecord(this, 'ApiAliasRecord', {
      zone: hostedZone,
      recordName: `${config.apiSubdomain}.${config.domain}`,
      target: route53.RecordTarget.fromAlias(
        new targets.LoadBalancerTarget(this.loadBalancer)
      ),
    });

    // Outputs
    new cdk.CfnOutput(this, 'LoadBalancerDNS', {
      value: this.loadBalancer.loadBalancerDnsName,
      description: 'Load Balancer DNS name',
      exportName: `${config.appName}-${config.environment}-alb-dns`,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: `https://${config.apiSubdomain}.${config.domain}`,
      description: 'API URL',
    });

    new cdk.CfnOutput(this, 'FrontendUrl', {
      value: `https://${config.domain}`,
      description: 'Frontend URL',
    });

    new cdk.CfnOutput(this, 'CertificateArn', {
      value: this.certificate.certificateArn,
      description: 'ACM Certificate ARN',
    });
  }
}

