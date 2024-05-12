import AWS from 'aws-sdk';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

// It's a good practice to configure AWS as early as possible in your application
AWS.config.update({
    region: 'us-east-1'
});

const getUserData = async () => {
    try {
        const session = await fetchAuthSession();
        const { userId } = await getCurrentUser();

        if (!session || !session.credentials) {
            console.log("Session credentials are missing.");
            return null;
        }

        // Update credentials after fetching them
        AWS.config.credentials = {
            accessKeyId: session.credentials.accessKeyId,
            secretAccessKey: session.credentials.secretAccessKey,
            sessionToken: session.credentials.sessionToken
        };

        const dynamoDb = new AWS.DynamoDB.DocumentClient();

        const params = {
            TableName: 'safespaceai',
            Key: { 'userID': userId }
        };

        const data = await dynamoDb.get(params).promise();
        return data.Item || null;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

export default getUserData;
