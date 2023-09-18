# localstack-eventbridge-lambda-ec2

[こちら](https://github.com/okojomoeko/aws-cdk-project-template)のテンプレートから作成した。

localstackを使って、aws cdkの練習を行う。

詳細な内容は[zennの記事](https://zenn.dev/okojomoeko/articles/localstack-eventbridge-lambda-ec2)

##

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`AwsCdkProjectTemplateStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
