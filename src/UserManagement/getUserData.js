import AWS from 'aws-sdk';
import { fetchAuthSession } from '@aws-amplify/auth';
import { getCurrentUser } from 'aws-amplify/auth';



const getUserData = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();

console.log("username", username);
console.log("user id", userId);
console.log("sign-in details", signInDetails);
    try {
        // Fetch the current session
        const session = await fetchAuthSession();
        console.log('User session:', session);

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
            const userId = session.identityId; // User ID from the token payload
            console.log('User ID:', userId);

            // DynamoDB get item parameters
            const params = {
                TableName: tableName,
                Key: { 'userID': userId }
            };

            // Fetch data from DynamoDB
            const data = await dynamoDb.get(params).promise();
            if (data && data.Item) {
                // Check if the MembershipPlan is 'Freemium' and conditionally update the record if needed
                console.log('User data:', data.Item);
                return data.Item; // Return the user data
            
            } else {
                console.log("No data found for this userID.");
                return null; // Return null if no data found
            }
        } else {
            console.log("Session credentials are missing.");
            return null; // Return null if session credentials are missing
        }
    } catch (error) {
        console.error('Error fetching user session:', error);
        return null; // Return null on error
    }
};

export default getUserData;
