import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
};

export async function handler(event: any): Promise<any> {
  const method = event.requestContext.http.method;
  const mapId = event.pathParameters?.id; 
  
  try {
    if (method === 'GET' && !mapId) {
      const result = await docClient.send(new ScanCommand({
        TableName: 'RouteBot-Maps'
      }));
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ maps: result.Items })
      };
    }
    
    if (method === 'GET' && mapId) {
      const result = await docClient.send(new GetCommand({
        TableName: 'RouteBot-Maps',
        Key: { id: mapId }
      }));
      
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify(result.Item)
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