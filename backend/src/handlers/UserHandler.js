import User from '../models/user.js'

export const saveUserDetails = async (options) => {
  try {
    const user = new User(options);
    return user.save()
  } catch (error) {
    throw new Error("Error finding organization data");
  }
};

export const deleteUsers = async (repoId) => {
  try {
    await User.deleteMany({ repoId })
  } catch(error) {
    throw new Error("Error finding organization data");
  }
}


export const deleteUsersByOptions = async (options) => {
  try {
    await User.deleteMany(options)
  } catch(error) {
    throw new Error("Error finding organization data");
  }
}