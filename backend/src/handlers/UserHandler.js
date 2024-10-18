import User from '../models/user.js'

export const findUserAndUpdateByUserId = async (options) => {
  try {
    const user = new User(options);
    return user.save()
  } catch (error) {
    throw new Error("Error finding organization data");
  }
};  
