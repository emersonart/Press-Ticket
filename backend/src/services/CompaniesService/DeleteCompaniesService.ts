import Companies from "../../models/Companies";
import AppError from "../../errors/AppError";

const DeleteCompaniesService = async (id: string): Promise<void> => {
  const company = await Companies.findOne({
    where: { id }
  });

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  await company.destroy();
};

export default DeleteCompaniesService;
