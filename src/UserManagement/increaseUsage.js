import AWS from 'aws-sdk';
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

const decrementCallsLeft = async () => {
    try {
        // Fetch the current session
        const session = await fetchAuthSession();
        const { userId } = await getCurrentUser();

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

            // Prepare update parameters
            const params = {
                TableName: tableName,
                Key: { 'userID': userId },
                UpdateExpression: "SET CallsLeft = CallsLeft - :val",
                ConditionExpression: "CallsLeft > :zero", // Ensure there are calls left to decrement
                ExpressionAttributeValues: {
                    ":val": 1,
                    ":zero": 0
                },
                ReturnValues: "UPDATED_NEW" // Returns all of the attributes of the item after the update
            };

            // Update the data in DynamoDB
            const data = await dynamoDb.update(params).promise();
            console.log("Updated data:", data);
            return data.Attributes; // Return the updated attributes
        } else {
            console.log("Session credentials are missing.");
            return null; // Return null if session credentials are missing
        }
    } catch (error) {
        if (error.code === "ConditionalCheckFailedException") {
            console.error("No more calls left to decrement.");
        } else {
            console.error("Error updating DynamoDB:", error);
        }
        return null; // Return null on error
    }
};

export default decrementCallsLeft;
