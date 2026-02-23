import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
};

export async function handler(event: any): Promise<any> {
    try {
        const mapId = event.queryStringParameters?.mapId || 'suburban-map'

        const result = await docClient.send(new ScanCommand({
            TableName: 'RouteBot-Routes',
            FilterExpression: 'mapId = :mapId',
            ExpressionAttributeValues: {
                ':mapId': mapId
            }
        }))

        const sorted = (result.Items || [])
            .sort((a, b) => a.totalDistance - b.totalDistance)
            .slice(0, 10);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ leaderboard: sorted })
        };
    } catch (error: any) {
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ message: 'Something went wrong', error: error.message })
        }
    }
}