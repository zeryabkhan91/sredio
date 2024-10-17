import User from "../models/user";

export const findUserAndUpdateByUserId = async (options) => {
  try {
    return User.findOneAndUpdate(options);
  } catch (error) {
    throw new Error("Error finding organization data");
  }
};
