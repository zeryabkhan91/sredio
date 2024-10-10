import Integration from "../models/auth.js";

export const findIntegrationByUserId = async (userId) => {
  try {
    return Integration.findOne({ userId });
  } catch (error) {
    throw new Error("Error finding integration data");
  }
};

export const saveIntegration = async ({ userId, accessToken }) => {
  try {
    const integration = new Integration({ userId, accessToken }); 

    await integration.save();
  } catch (error) {
    throw new Error("Error saving integration data");
  }
};

export const deleteIntegrationById = async (userId) => {
  try {
    await Integration.findOneAndDelete({ userId }); 
  } catch (error) {
    throw new Error("Error finding integration data");
  }
};