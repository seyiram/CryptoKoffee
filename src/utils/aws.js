
import { DynamoDBClient, GetItemCommand, QueryCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

export const dynamodb = new DynamoDBClient({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET_ACCESS_KEY,
  },
});

export const getUserProfile = async (userId) => {
  const params = {
    TableName: "UserProfiles",
    Key: marshall({ user_id: userId }),
  };

  try {
    const { Item } = await dynamodb.send(new GetItemCommand(params));
    return Item ? unmarshall(Item) : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};


export const getUserProfileByCustomUrl = async (customUrl) => {
  const params = {
    TableName: "UserProfiles",
    IndexName: "CustomUrlIndex",
    KeyConditionExpression: "custom_url = :customUrl",
    ExpressionAttributeValues: marshall({
      ":customUrl": customUrl
    })
  };

  try {
    const { Items } = await dynamodb.send(new QueryCommand(params));
    return Items ? Items.map((item) => unmarshall(item))[0] : null;
  } catch (error) {
    console.error("Error fetching user profile by custom URL:", error);
    return null;
  }
};

export const deleteUserProfile = async (userId) => {
  const params = {
    TableName: "UserProfiles",
    Key: marshall({ user_id: userId }),
  };

  try {
    await dynamodb.send(new DeleteItemCommand(params));
    return true;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return false;
  }
};