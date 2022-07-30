import Companies from "../../models/Companies";

const AssociateCompaniesUser = async (
  campany: Companies,
  userIds: number[]
): Promise<void> => {
  await campany.$set("users", userIds);

  await campany.reload();
};

export default AssociateCompaniesUser;
