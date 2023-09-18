import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class SampleEC2 extends Construct {
  public readonly instance: ec2.Instance;
  public readonly vpc: ec2.Vpc;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    // わかりやすくAZは1つで今回試す
    this.vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 1,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          name: 'Isolated Subnet',
        },
      ],
    });

    this.instance = new ec2.Instance(this, 'SampleEC2', {
      vpc: this.vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.NANO,
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023({
        cpuType: ec2.AmazonLinuxCpuType.ARM_64,
      }),
    });
    this.vpc.addInterfaceEndpoint('Ec2endpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.EC2,
    });
  }
}
