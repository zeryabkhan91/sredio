import Organization from '../models/organization.js';

export const findOrganizationByUserId = async (options) => {
  try {
    return Organization.findOne(options);
  } catch (error) {
    throw new Error("Error finding organization data");
  }
};

export const deleteOrganization = async (integrationId) => {
  try {
    return Organization.deleteMany({ integrationId });
  } catch (error) {
    throw new Error("Error finding organization data");
  } 
}

export const saveOrganizationDetails = async (options) => {
  try {
    const organization = new Organization(options); 

    await organization.save();
  } catch (error) {
    console.log("Error:: ", error)
    throw new Error("Error saving organization data");
  }
};