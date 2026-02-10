import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const usersTable = new dynamodb.TableV2(this, 'RouteBot-UsersTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING, },
      tableName: 'RouteBot-Users'
    });

    const routesTable = new dynamodb.TableV2(this, 'RouteBot-RoutesTable', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      tableName: 'RouteBot-Routes'
    });

    const mapTable = new dynamodb.TableV2(this, 'RouteBot-MapsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableName: 'RouteBot-Maps'
    });
  }
}
