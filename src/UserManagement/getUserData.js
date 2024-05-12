import AWS from 'aws-sdk';
import { fetchAuthSession } from '@aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';

const getUserData = async () => {
    try {
        // Fetch the current session
        const session = await fetchAuthSession();
        const { username, userId, signInDetails } = await getCurrentUser();

        if (session && session.credentials) {
            AWS.config.update({
                region: 'us-east-1',
                credentials: {
                    accessKeyId: session.credentials.accessKeyId,
                    secretAccessKey: session.credentials.secretAccessKey,
                    sessionToken: session.credentials.sessionToken
                }
            });

            const dynamoDb = new AWS.DynamoDB.DocumentClient();
            const tableName = 'safespaceai'; // DynamoDB table name

            // DynamoDB get item parameters
            const params = {
                TableName: tableName,
                Key: { 'userID': userId }
            };

            // Fetch data from DynamoDB
            const data = await dynamoDb.get(params).promise();
            if (data && data.Item) {
                //console.log("User data found:", data.Item);
                return data.Item; // Return the user data
            } else {
                //console.log("No data found for this userID.");
                return null; // Return null if no data found
            }
        } else {
            //console.log("Session credentials are missing.");
            return null; // Return null if session credentials are missing
        }
    } catch (error) {
        //console.error('Error fetching user session:', error);
        return null; // Return null on error
    }
};

export default getUserData;
