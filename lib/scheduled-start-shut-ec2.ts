import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

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
    const startEC2Lambda = new lambda.Function(this, 'StartEC2Lambda', {
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'start_ec2.lambda_handler',
      code: lambda.Code.fromAsset('./lib/lambda'),
      environment: {
        EC2_INSTANCE_ID: props.ec2InstanceId,
      },
      // 今回はPrivate SubnetにLambdaを配置しない構成
      // vpc: props.vpc,
      // vpcSubnets: props.vpc.selectSubnets({
      //   subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      // }),
    });
    startEC2Lambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:Start*'],
        resources: ['*'], // 面倒なのでひとまずwildcard
      }),
    );

    const stopEC2Lambda = new lambda.Function(this, 'StopEC2Lambda', {
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'stop_ec2.lambda_handler',
      code: lambda.Code.fromAsset('./lib/lambda'),
      environment: {
        EC2_INSTANCE_ID: props.ec2InstanceId,
      },
      // 今回はPrivate SubnetにLambdaを配置しない構成
      // vpc: props.vpc,
      // vpcSubnets: props.vpc.selectSubnets({
      //   subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      // }),
    });
    stopEC2Lambda.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['ec2:Stop*'],
        resources: ['*'], // 面倒なのでひとまずwildcard
      }),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const startEvent = new events.Rule(this, 'EC2StartEvent', {
      // すぐに確認したいので適当に偶数分ごとに実行する
      schedule: events.Schedule.cron({ minute: '0/2' }),
      targets: [new targets.LambdaFunction(startEC2Lambda)],
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stopEvent = new events.Rule(this, 'EC2StopEvent', {
      // すぐに確認したいので適当に奇数分ごとに実行する
      schedule: events.Schedule.cron({ minute: '1/2' }),
      targets: [new targets.LambdaFunction(stopEC2Lambda)],
    });

    // localstack Proじゃないと、EventBridgeからPrivate Subnet に配置したLambdaを叩くためのvpc endpointが作れないので保留
    // props.vpc.addInterfaceEndpoint('EventBridgeEndpoint', {
    //   service: ec2.InterfaceVpcEndpointAwsService.EVENTBRIDGE,
    // });
  }
}
