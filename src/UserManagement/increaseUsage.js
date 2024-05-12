import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { fetchAuthSession, getCurrentUser } from '@aws-amplify/auth';

// Function to fetch user data from the API
const increaseUsage = async () => {
    try {
        // Get the userId from the current user
        const session = await fetchAuthSession();
        const userId  = session.userSub;

        // Define the URL of the API endpoint
        const apiUrl = 'https://r7tpc8vi6j.execute-api.us-east-1.amazonaws.com/dev';

        // Make an HTTP POST request to the API
        const response = await fetch(apiUrl, {
            method: 'POST', // Set the method to POST
            headers: {
                'Content-Type': 'application/json' // Set the content type header for JSON
            },
            body: JSON.stringify({ userId}) // Send the userId in the request body as JSON
        });

        if (!response.ok) {
            // Handle non-2xx HTTP responses
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const userData = await response.json();

    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
};

export default increaseUsage;
