import Whatsapp from "../../models/Whatsapp";
import AppError from "../../errors/AppError";
import User from "../../models/User";
import Companies from "../../models/Companies";

const ShowCompaniesService = async (
  id: string | number
): Promise<Companies> => {
  const company = await Companies.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email", "profile"]
      },
      {
        model: Whatsapp,
        as: "whatsapp",
        attributes: ["id", "name", "status"]
      }
    ],
    order: [["whatsapp", "id", "ASC"]]
  });

  if (!company) {
    throw new AppError("ERR_NO_COMPANY_FOUND", 404);
  }

  return company;
};

export default ShowCompaniesService;
