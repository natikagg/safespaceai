import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

// Configure the AWS Region
const REGION = "us-east-1";

const getUserData = async () => {
    try {
        const session = await fetchAuthSession();
        const { userId } = await getCurrentUser();

        if (!session || !session.credentials) {
            console.log("Session credentials are missing.");
            return null;
        }
        console.log("Session Info:", session);
        
        // Initialize DynamoDB Client with Cognito credentials
        const client = new DynamoDBClient({
            region: REGION,
            credentials: {
                accessKeyId: session.credentials.accessKeyId,
                secretAccessKey: session.credentials.secretAccessKey,
                sessionToken: session.credentials.sessionToken
            }
        });

        const docClient = DynamoDBDocumentClient.from(client);

        const params = {
            TableName: 'safespaceai',
            Key: { 'userID': userId }
        };

        const command = new GetCommand(params);
        const { Item } = await docClient.send(command);
        return Item || null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

export default getUserData;
