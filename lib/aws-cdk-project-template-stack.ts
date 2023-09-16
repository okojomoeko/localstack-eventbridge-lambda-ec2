import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { SampleEC2 } from './sample-ec2';
import { ScheduledStartStopEC2 } from './scheduled-start-shut-ec2';

export class AwsCdkProjectTemplateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const sampleEc2 = new SampleEC2(this, 'SampleEC2');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const scheduledStartStopEC2 = new ScheduledStartStopEC2(
      this,
      'ScheduledStartStopEC2',
      {
        ec2InstanceId: sampleEc2.instance.instanceId,
        vpc: sampleEc2.vpc,
      },
    );
  }
}
