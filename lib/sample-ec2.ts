import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class SampleEC2 extends Construct {
  public readonly instance: ec2.Instance;
  public readonly vpc: ec2.Vpc;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // わかりやすくAZは1つで今回試す
    // localstackのfree版の都合で、Private Subnet配置のEC2については対象外
    this.vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 1,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'PublicSubnet',
        },
      ],
    });

    this.instance = new ec2.Instance(this, 'SampleEC2', {
      vpc: this.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.NANO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
    });
  }
}
