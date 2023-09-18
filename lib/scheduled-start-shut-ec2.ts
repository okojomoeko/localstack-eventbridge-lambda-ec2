import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';
import { Duration } from 'aws-cdk-lib';

export interface ScheduledStartStopEC2Props {
  /**
   * The EC2 instance ID for scheduled start and stop
   */
  ec2InstanceId: string;
  vpc: ec2.Vpc;
}

export class ScheduledStartStopEC2 extends Construct {
  constructor(scope: Construct, id: string, props: ScheduledStartStopEC2Props) {
    super(scope, id);
    const startStopEC2Lambda = new lambda.Function(this, 'StartStopEC2Lambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'start_stop_ec2.lambda_handler',
      code: lambda.Code.fromAsset('./lib/lambda'),
      environment: {
        EC2_INSTANCE_ID: props.ec2InstanceId,
      },
      timeout: Duration.minutes(3),
      vpc: props.vpc,
      vpcSubnets: props.vpc.selectSubnets({
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      }),
    });
    startStopEC2Lambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:Start*', 'ec2:Stop*'],
        resources: ['*'], // 面倒なのでひとまずwildcard
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const startEvent = new events.Rule(this, 'EC2StartEvent', {
      // すぐに確認したいので適当に偶数分ごとに実行する
      schedule: events.Schedule.cron({ minute: '0/2' }),
      targets: [
        new targets.LambdaFunction(startStopEC2Lambda, {
          event: events.RuleTargetInput.fromObject({
            COMMAND: 'START',
          }),
        }),
      ],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stopEvent = new events.Rule(this, 'EC2StopEvent', {
      // すぐに確認したいので適当に奇数分ごとに実行する
      schedule: events.Schedule.cron({ minute: '1/2' }),
      targets: [
        new targets.LambdaFunction(startStopEC2Lambda, {
          event: events.RuleTargetInput.fromObject({
            COMMAND: 'STOP',
          }),
        }),
      ],
    });
  }
}
