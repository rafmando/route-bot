import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

export async function handler(event: any): Promise<any> {
    const method = event.requestContext.http.method;
    let result: any;
    const userId = event.queryStringParameters?.userId || 'test-user';
    try {
        if (method === 'POST') {
            result = await docClient.send(new PutCommand({
                TableName: 'RouteBot-Routes',
                Item: JSON.parse(event.body)
            }))
            return {
                statusCode: 201,
                headers: corsHeaders,
                body: JSON.stringify({ message: 'Route saved!' })
            };
        }

        if (method === 'GET') {
            result = await docClient.send(new QueryCommand({
                TableName: 'RouteBot-Routes',
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }));
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify({ routes: result.Items })
            };
        }


    } catch (error: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                message: 'Something went wrong',
                error: error.message
            })
        };
    }

}