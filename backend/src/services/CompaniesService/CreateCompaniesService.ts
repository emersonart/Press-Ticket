import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Companies from "../../models/Companies";
import AssociateCompaniesUser from "./AssociateCompaniesUser";

interface Request {
  name: string;
  userIds?: number[];
  email: string;
  phone?: string;
  document?: string;
  status?: string;
  limitConnections?: number;
}

interface Response {
  companies: Companies;
}

const CreateCompaniesService = async ({
  name,
  status = "OPENING",
  userIds = [],
  phone,
  document,
  limitConnections = 3
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    document: Yup.string()
      .required()
      .min(2)
      .test("Check-document", "This document is already used.", async value => {
        if (!value) return false;
        const documentExists = await Companies.findOne({
          where: { document: value }
        });
        return !documentExists;
      }),
    limitConnections: Yup.number().required(),
    email: Yup.string()
      .required()
      .test("Check-email", "This Email is already used.", async value => {
        if (!value) return false;
        const emailExists = await Companies.findOne({
          where: { email: value }
        });
        return !emailExists;
      })
  });

  try {
    await schema.validate({ name, status, limitConnections });
  } catch (err) {
    throw new AppError(err.message);
  }

  const company = await Companies.create(
    {
      name,
      status,
      phone,
      document,
      limitConnections
    },
    { include: ["user"] }
  );

  await AssociateCompaniesUser(company, userIds);

  return { companies: company };
};

export default CreateCompaniesService;
