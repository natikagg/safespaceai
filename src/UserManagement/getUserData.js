import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';
import AWS from 'aws-sdk';

const getUserData = async () => {
    try {
        // Fetch the current session
        const session = await fetchAuthSession();
        const { username, userId, signInDetails } = await getCurrentUser();

        if (!session || !session.credentials) {
            console.log("Session credentials are missing.");
            return null; // Return null if session credentials are missing
        }

        // Configure AWS SDK
        AWS.config.update({
            region: 'us-east-1',
            credentials: {
                accessKeyId: session.credentials.accessKeyId,
                secretAccessKey: session.credentials.secretAccessKey,
                sessionToken: session.credentials.sessionToken
            }
        });

        // Initialize DynamoDB DocumentClient
        const dynamoDb = new AWS.DynamoDB.DocumentClient();

        // DynamoDB table name and get item parameters
        const tableName = 'safespaceai';
        const params = {
            TableName: tableName,
            Key: { 'userID': userId }
        };

        // Fetch data from DynamoDB
        const data = await dynamoDb.get(params).promise();
        if (!data || !data.Item) {
            console.log("No data found for this userID.");
            return null; // Return null if no data found
        }

        //console.log("User data found:", data.Item);
        return data.Item; // Return the user data
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null; // Return null on error
    }
};

export default getUserData;
