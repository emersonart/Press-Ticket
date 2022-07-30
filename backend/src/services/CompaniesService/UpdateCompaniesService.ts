import * as Yup from "yup";
import { Op } from "sequelize";

import AppError from "../../errors/AppError";
import Companies from "../../models/Companies";
import ShowCompaniesService from "./ShowCompaniesService";
import AssociateCompaniesUser from "./AssociateCompaniesUser";

interface CompaniesData {
  name?: string;
  status?: string;
  logo?: string;
  document?: string;
  email?: string;
  phone?: string;
  limitConnections?: number;
  userIds?: number[];
}

interface Request {
  companiesData: CompaniesData;
  companyId: string;
}

interface Response {
  company: Companies;
}

const UpdateComapniesService = async ({
  companiesData,
  companyId
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string().min(2),
    status: Yup.string(),
    document: Yup.string(),
    limitConnections: Yup.number()
  });

  const {
    name,
    status,
    logo,
    document,
    email,
    phone,
    limitConnections,
    userIds = []
  } = companiesData;

  try {
    await schema.validate({ name, status, document, limitConnections });
  } catch (err) {
    throw new AppError(err.message);
  }

  const company = await ShowCompaniesService(companyId);

  await company.update({
    name,
    status,
    logo,
    document,
    email,
    limitConnections
  });

  await AssociateCompaniesUser(company, userIds);

  return { company };
};

export default UpdateComapniesService;
