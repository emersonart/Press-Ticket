import { Sequelize, Op } from "sequelize";
import User from "../../models/User";
import Whatsapp from "../../models/Whatsapp";
import Companies from "../../models/Companies";

interface Request {
  searchParam?: string;
  pageNumber?: string;
}

interface Response {
  companies: Companies[];
  count: number;
  hasMore: boolean;
}
const ListCompaniessService = async ({
  searchParam = "",
  pageNumber = "1"
}: Request): Promise<Response> => {
  const whereCondition = {
    [Op.or]: [
      {
        name: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("name")),
          "LIKE",
          `%${searchParam.toLowerCase().trim()}%`
        )
      },
      { document: { [Op.like]: `%${searchParam.toLowerCase().trim()}%` } },
      {
        email: Sequelize.where(
          Sequelize.fn("LOWER", Sequelize.col("email")),
          "LIKE",
          `%${searchParam.toLowerCase().trim()}%`
        )
      }
    ]
  };
  const limit = 20;
  const offset = limit * (+pageNumber - 1);

  const { count, rows: companies } = await Companies.findAndCountAll({
    where: whereCondition,
    limit,
    offset,
    order: [["name", "ASC"]],
    include: [
      { model: User, as: "users", attributes: ["id", "name", "email"] },
      { model: Whatsapp, as: "whatsapp", attributes: ["id", "name"] }
    ]
  });

  const hasMore = count > offset + companies.length;

  return {
    companies,
    count,
    hasMore
  };
};

export default ListCompaniessService;
