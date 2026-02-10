import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

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

    const routesLambda = new lambda.Function(this, 'RouteBot-RoutesHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'routes.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        ROUTES_TABLE: routesTable.tableName
      }
    });

    const mapsLambda = new lambda.Function(this, 'RouteBot-MapsHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'maps.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        MAPS_TABLE: mapTable.tableName
      }
    });

    routesTable.grantReadWriteData(routesLambda);
    mapTable.grantReadData(mapsLambda);

    const api = new apigateway.RestApi(this, 'RouteBotApi', {
      restApiName: 'RouteBot API',
      description: 'API for route-bot delivery optimizer',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      }
    });

    const routes = api.root.addResource('routes');
    routes.addMethod('POST', new apigateway.LambdaIntegration(routesLambda));
    routes.addMethod('GET', new apigateway.LambdaIntegration(routesLambda));

    const maps = api.root.addResource('maps');
    maps.addMethod('GET', new apigateway.LambdaIntegration(mapsLambda));

    const mapsWithId = maps.addResource('{id}');
    mapsWithId.addMethod('GET', new apigateway.LambdaIntegration(mapsLambda));
  }
}

