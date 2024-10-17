import Repository from "../models/repository";

export const saveRepository = async (newRepository) => {
  try {
    const repository = new Repository(newRepository); 

    await repository.save();
  } catch (error) {
    throw new Error("Error saving repository data");
  }
};

export const findRepository = async (options) => {
  try {
    return Repository.findOne(options);
  } catch (error) {
    throw new Error("Error finding repository data");
  }
}