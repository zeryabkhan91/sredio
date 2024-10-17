import Organization from "../models/organization";

export const findOrganizationByUserId = async (options) => {
  try {
    return Organization.findOne(options);
  } catch (error) {
    throw new Error("Error finding organization data");
  }
};


export const saveOrganizationDetails = async (options) => {
  try {
    const organization = new Organization(options); 

    await organization.save();
  } catch (error) {
    throw new Error("Error saving organization data");
  }
};