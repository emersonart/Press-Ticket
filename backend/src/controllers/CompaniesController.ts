import { Request, Response } from "express";
import { getIO } from "../libs/socket";

import CheckSettingsHelper from "../helpers/CheckSettings";
import AppError from "../errors/AppError";

import CreateCompaniesService from "../services/CompaniesService/CreateCompaniesService";
import ListCompaniesService from "../services/CompaniesService/ListCompaniesService";
import UpdateCompaniesService from "../services/CompaniesService/UpdateCompaniesService";
import ShowCompaniesService from "../services/CompaniesService/ShowCompaniesService";
import DeleteCompaniesService from "../services/CompaniesService/DeleteCompaniesService";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;

  const { companies, count, hasMore } = await ListCompaniesService({
    searchParam,
    pageNumber
  });

  return res.json({ companies, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { companies } = await ListCompaniesService({});

  if (companies.length >= Number(process.env.USER_LIMIT)) {
    throw new AppError("ERR_USER_CREATION_COUNT", 403);
  }

  const { email, name, phone, document, limitConnections } = req.body;

  if (
    req.url === "/signup" &&
    (await CheckSettingsHelper("companyCreation")) === "disabled"
  ) {
    throw new AppError("ERR_COMPANY_CREATION_DISABLED", 403);
  } else if (req.url !== "/signup" && req.company.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const company = await CreateCompaniesService({
    email,
    name,
    phone,
    document,
    limitConnections
  });

  const io = getIO();
  io.emit("company", {
    action: "create",
    company
  });

  return res.status(200).json(company);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.params;

  const company = await ShowCompaniesService(companyId);

  return res.status(200).json(company);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.params;

  const newCompanyId = companyId.toString();
  const sessionCompanyId = req.company.id.toString();

  if (req.company.profile !== "admin" && sessionCompanyId !== newCompanyId) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const companyData = req.body;

  const company = await UpdateCompaniesService({ companyData, companyId });

  const io = getIO();
  io.emit("company", {
    action: "update",
    company
  });

  return res.status(200).json(company);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.params;

  if (req.company.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await DeleteCompaniesService(companyId);

  const io = getIO();
  io.emit("company", {
    action: "delete",
    companyId
  });

  return res.status(200).json({ message: "Company deleted" });
};
