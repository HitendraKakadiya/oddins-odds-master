import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as cw_actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { config } from './config';

export interface MonitoringStackProps extends cdk.StackProps {
  loadBalancer: elbv2.ApplicationLoadBalancer;
  apiTargetGroup: elbv2.ApplicationTargetGroup;
  frontendTargetGroup: elbv2.ApplicationTargetGroup;
  apiService: ecs.FargateService;
  frontendService: ecs.FargateService;
  database: rds.DatabaseInstance;
}

export class MonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    // SNS Topic for alerts
    const alertTopic = new sns.Topic(this, 'AlertTopic', {
      topicName: `${config.appName}-${config.environment}-alerts`,
      displayName: 'Oddins Production Alerts',
    });

    // Subscribe email to alerts
    alertTopic.addSubscription(
      new subscriptions.EmailSubscription(config.monitoring.alarmEmail)
    );

    // ============================================================================
    // ALB Alarms
    // ============================================================================

    // ALB 5xx Errors
    const alb5xxAlarm = new cloudwatch.Alarm(this, 'ALB5xxErrorsAlarm', {
      alarmName: `${config.appName}-${config.environment}-alb-5xx-errors`,
      alarmDescription: 'ALB is returning 5xx errors',
      metric: props.loadBalancer.metricHttpCodeTarget(
        elbv2.HttpCodeTarget.TARGET_5XX_COUNT,
        {
          statistic: 'Sum',
          period: cdk.Duration.minutes(5),
        }
      ),
      threshold: 10,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    alb5xxAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // Unhealthy Target Count
    const unhealthyTargetsAlarm = new cloudwatch.Alarm(this, 'UnhealthyTargetsAlarm', {
      alarmName: `${config.appName}-${config.environment}-unhealthy-targets`,
      alarmDescription: 'One or more targets are unhealthy',
      metric: props.apiTargetGroup.metricUnhealthyHostCount({
        statistic: 'Average',
        period: cdk.Duration.minutes(1),
      }),
      threshold: 1,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    unhealthyTargetsAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // High Latency
    const highLatencyAlarm = new cloudwatch.Alarm(this, 'HighLatencyAlarm', {
      alarmName: `${config.appName}-${config.environment}-high-latency`,
      alarmDescription: 'API response time is high',
      metric: props.apiTargetGroup.metricTargetResponseTime({
        statistic: 'p99',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 2, // 2 seconds
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    highLatencyAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // ============================================================================
    // ECS Service Alarms
    // ============================================================================

    // API Service Task Count
    const apiTaskCountAlarm = new cloudwatch.Alarm(this, 'ApiTaskCountAlarm', {
      alarmName: `${config.appName}-${config.environment}-api-task-count-low`,
      alarmDescription: 'API service has fewer tasks than desired',
      metric: props.apiService.metricCpuUtilization({
        statistic: 'SampleCount',
        period: cdk.Duration.minutes(5),
      }),
      threshold: config.ecs.api.desiredCount,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.BREACHING,
    });
    apiTaskCountAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // High CPU Utilization
    const highCpuAlarm = new cloudwatch.Alarm(this, 'HighCpuAlarm', {
      alarmName: `${config.appName}-${config.environment}-ecs-high-cpu`,
      alarmDescription: 'ECS tasks are running at high CPU',
      metric: props.apiService.metricCpuUtilization({
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    highCpuAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // High Memory Utilization
    const highMemoryAlarm = new cloudwatch.Alarm(this, 'HighMemoryAlarm', {
      alarmName: `${config.appName}-${config.environment}-ecs-high-memory`,
      alarmDescription: 'ECS tasks are running at high memory',
      metric: props.apiService.metricMemoryUtilization({
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 3,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    highMemoryAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // ============================================================================
    // RDS Alarms
    // ============================================================================

    // High CPU
    const dbHighCpuAlarm = new cloudwatch.Alarm(this, 'DatabaseHighCpuAlarm', {
      alarmName: `${config.appName}-${config.environment}-rds-high-cpu`,
      alarmDescription: 'Database CPU utilization is high',
      metric: props.database.metricCPUUtilization({
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 80,
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dbHighCpuAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // Low Storage
    const dbLowStorageAlarm = new cloudwatch.Alarm(this, 'DatabaseLowStorageAlarm', {
      alarmName: `${config.appName}-${config.environment}-rds-low-storage`,
      alarmDescription: 'Database free storage is low',
      metric: props.database.metricFreeStorageSpace({
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 2 * 1024 * 1024 * 1024, // 2 GB in bytes
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dbLowStorageAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // High Connections
    const dbHighConnectionsAlarm = new cloudwatch.Alarm(this, 'DatabaseHighConnectionsAlarm', {
      alarmName: `${config.appName}-${config.environment}-rds-high-connections`,
      alarmDescription: 'Database connection count is high',
      metric: props.database.metricDatabaseConnections({
        statistic: 'Average',
        period: cdk.Duration.minutes(5),
      }),
      threshold: 50, // t4g.micro supports ~87 max connections
      evaluationPeriods: 2,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
    dbHighConnectionsAlarm.addAlarmAction(new cw_actions.SnsAction(alertTopic));

    // ============================================================================
    // CloudWatch Dashboard
    // ============================================================================

    const dashboard = new cloudwatch.Dashboard(this, 'ProductionDashboard', {
      dashboardName: `${config.appName}-${config.environment}-overview`,
    });

    // API Metrics Widget
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'API Requests',
        left: [
          props.apiTargetGroup.metricRequestCount({
            statistic: 'Sum',
            period: cdk.Duration.minutes(5),
            label: 'Total Requests',
          }),
          props.loadBalancer.metricHttpCodeTarget(elbv2.HttpCodeTarget.TARGET_2XX_COUNT, {
            statistic: 'Sum',
            period: cdk.Duration.minutes(5),
            label: '2xx Responses',
          }),
          props.loadBalancer.metricHttpCodeTarget(elbv2.HttpCodeTarget.TARGET_4XX_COUNT, {
            statistic: 'Sum',
            period: cdk.Duration.minutes(5),
            label: '4xx Responses',
          }),
          props.loadBalancer.metricHttpCodeTarget(elbv2.HttpCodeTarget.TARGET_5XX_COUNT, {
            statistic: 'Sum',
            period: cdk.Duration.minutes(5),
            label: '5xx Responses',
          }),
        ],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'API Response Time',
        left: [
          props.apiTargetGroup.metricTargetResponseTime({
            statistic: 'p50',
            period: cdk.Duration.minutes(5),
            label: 'p50',
          }),
          props.apiTargetGroup.metricTargetResponseTime({
            statistic: 'p95',
            period: cdk.Duration.minutes(5),
            label: 'p95',
          }),
          props.apiTargetGroup.metricTargetResponseTime({
            statistic: 'p99',
            period: cdk.Duration.minutes(5),
            label: 'p99',
          }),
        ],
        width: 12,
      })
    );

    // ECS Metrics Widget
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'ECS Task Count',
        left: [
          props.apiService.metricCpuUtilization({
            statistic: 'SampleCount',
            period: cdk.Duration.minutes(5),
            label: 'API Tasks',
          }),
          props.frontendService.metricCpuUtilization({
            statistic: 'SampleCount',
            period: cdk.Duration.minutes(5),
            label: 'Frontend Tasks',
          }),
        ],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'ECS CPU & Memory Utilization',
        left: [
          props.apiService.metricCpuUtilization({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'API CPU',
          }),
          props.frontendService.metricCpuUtilization({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'Frontend CPU',
          }),
        ],
        right: [
          props.apiService.metricMemoryUtilization({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'API Memory',
          }),
          props.frontendService.metricMemoryUtilization({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'Frontend Memory',
          }),
        ],
        width: 12,
      })
    );

    // Database Metrics Widget
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Database CPU & Connections',
        left: [
          props.database.metricCPUUtilization({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'CPU %',
          }),
        ],
        right: [
          props.database.metricDatabaseConnections({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'Connections',
          }),
        ],
        width: 12,
      }),
      new cloudwatch.GraphWidget({
        title: 'Database Storage & IOPS',
        left: [
          props.database.metricFreeStorageSpace({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'Free Storage (bytes)',
          }),
        ],
        right: [
          props.database.metricReadIOPS({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'Read IOPS',
          }),
          props.database.metricWriteIOPS({
            statistic: 'Average',
            period: cdk.Duration.minutes(5),
            label: 'Write IOPS',
          }),
        ],
        width: 12,
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'AlertTopicArn', {
      value: alertTopic.topicArn,
      description: 'SNS Topic ARN for alerts',
    });

    new cdk.CfnOutput(this, 'DashboardUrl', {
      value: `https://console.aws.amazon.com/cloudwatch/home?region=${config.region}#dashboards:name=${dashboard.dashboardName}`,
      description: 'CloudWatch Dashboard URL',
    });

    new cdk.CfnOutput(this, 'ConfirmEmailSubscription', {
      value: `Check email ${config.monitoring.alarmEmail} and confirm SNS subscription`,
      description: 'Action required after deployment',
    });
  }
}

