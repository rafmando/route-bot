import * as cdk from 'aws-cdk-lib/core';
import { Template } from 'aws-cdk-lib/assertions';
import { BackendStack } from '../lib/route-bot-backend-stack';
import * as fs from 'fs';

let template: Template;

beforeAll(() => {
  console.log('dist exists:', fs.existsSync('../frontend/dist'));
  console.log('cwd:', process.cwd());
  // create a fake dist folder so CDK doesn't fail
  if (!fs.existsSync('../frontend/dist')) {
    fs.mkdirSync('../frontend/dist', { recursive: true });
    fs.writeFileSync('../frontend/dist/index.html', '<html></html>');
  }

  const app = new cdk.App();
  const stack = new BackendStack(app, 'TestStack');
  template = Template.fromStack(stack);
});

test('DynamoDB tables created', () => {
  template.resourceCountIs('AWS::DynamoDB::GlobalTable', 3);
});

test('Cognito User Pool created', () => {
  template.hasResourceProperties('AWS::Cognito::UserPool', {
    UserPoolName: 'RouteBot-UserPool',
  });
});

test('Lambda functions created', () => {
  template.resourceCountIs('AWS::Lambda::Function', 5);
});

test('API Gateway created', () => {
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
});

test('S3 bucket created', () => {
  template.resourceCountIs('AWS::S3::Bucket', 1);
});

test('CloudFront distribution created', () => {
  template.resourceCountIs('AWS::CloudFront::Distribution', 1);
});