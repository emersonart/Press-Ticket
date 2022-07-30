import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import Companies from "../../models/Companies";

const ListCompaniesService = async (): Promise<Companies[]> => {
  const companies = await Companies.findAll({
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
    ]
  });

  return companies;
};

export default ListCompaniesService;
