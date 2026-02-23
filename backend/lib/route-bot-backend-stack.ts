import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito'
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //s3 bucket for frontend 
    const frontendBucket = new s3.Bucket(this, 'RouteBot-FrontendBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // cloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'RouteBot-Distribution', {
      defaultBehavior: {
        origin: new origins.S3StaticWebsiteOrigin(frontendBucket),
      },
      defaultRootObject: 'index.html',
      errorResponses: [{
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: '/index.html',
      }],
    });

    new s3deploy.BucketDeployment(this, 'RouteBot-FrontendDeployment', {
      sources: [s3deploy.Source.asset('../frontend/dist')],
      destinationBucket: frontendBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    new cdk.CfnOutput(this, 'FrontendUrl', {
      value: `https://${distribution.distributionDomainName}`
    });

    // dynamo tables
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

    // cognito
    const userPool = new cognito.UserPool(this, 'RouteBot-UserPool', {
      userPoolName: 'RouteBot-UserPool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireDigits: true,
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, 'RouteBot-UserPoolClient', {
      userPool,
      authFlows: {
        userPassword: true,
        userSrp: true
      }
    })

    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId })

    // lambda functions
    const routesLambda = new NodejsFunction(this, 'RouteBot-RoutesHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/routes.ts',
      handler: 'handler',
      bundling: {
        forceDockerBundling: false
      },
      environment: {
        ROUTES_TABLE: routesTable.tableName
      }
    });

    const mapsLambda = new NodejsFunction(this, 'RouteBot-MapsHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/maps.ts',
      handler: 'handler',
      bundling: {
        forceDockerBundling: false
      },
      environment: {
        MAPS_TABLE: mapTable.tableName
      }
    });

    const leaderboardLambda = new NodejsFunction(this, 'RouteBot-LeaderboardHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: 'lambda/leaderboard.ts',
      handler: 'handler',
      bundling: { forceDockerBundling: false },
      environment: {
        ROUTES_TABLE: routesTable.tableName
      }
    });

    routesTable.grantReadWriteData(routesLambda);
    mapTable.grantReadData(mapsLambda);
    routesTable.grantReadData(leaderboardLambda);

    // api
    const api = new apigateway.RestApi(this, 'RouteBotApi', {
      restApiName: 'RouteBot API',
      description: 'API for route-bot delivery optimizer',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      }
    });

    // protected roots
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'RouteBot-Authorizer', {
      cognitoUserPools: [userPool]
    });
    const routes = api.root.addResource('routes');
    routes.addMethod('POST', new apigateway.LambdaIntegration(routesLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO
    });
    routes.addMethod('GET', new apigateway.LambdaIntegration(routesLambda), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO
    });

    const maps = api.root.addResource('maps');
    maps.addMethod('GET', new apigateway.LambdaIntegration(mapsLambda));

    const mapsWithId = maps.addResource('{id}');
    mapsWithId.addMethod('GET', new apigateway.LambdaIntegration(mapsLambda));

    const leaderboard = api.root.addResource('leaderboard');
    leaderboard.addMethod('GET', new apigateway.LambdaIntegration(leaderboardLambda));
  }
}