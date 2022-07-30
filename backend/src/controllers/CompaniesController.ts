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

  const { users, count, hasMore } = await ListCompaniesService({
    searchParam,
    pageNumber
  });

  return res.json({ users, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { users } = await ListCompaniesService({});

  if (users.length >= Number(process.env.USER_LIMIT)) {
    throw new AppError("ERR_USER_CREATION_COUNT", 403);
  }

  const { email, password, name, profile, queueIds, whatsappId, companyId } =
    req.body;

  if (
    req.url === "/signup" &&
    (await CheckSettingsHelper("userCreation")) === "disabled"
  ) {
    throw new AppError("ERR_USER_CREATION_DISABLED", 403);
  } else if (req.url !== "/signup" && req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const user = await CreateCompaniesService({
    email,
    password,
    name,
    profile,
    queueIds,
    whatsappId,
    companyId
  });

  const io = getIO();
  io.emit("user", {
    action: "create",
    user
  });

  return res.status(200).json(user);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.params;

  const user = await ShowCompaniesService(companyId);

  return res.status(200).json(user);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.params;

  const newCompanyId = companyId.toString();
  const sessionCompanyId = req.user.id.toString();

  if (req.user.profile !== "admin" && sessionCompanyId !== newCompanyId) {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const companyData = req.body;

  const user = await UpdateCompaniesService({ companyData, companyId });

  const io = getIO();
  io.emit("user", {
    action: "update",
    user
  });

  return res.status(200).json(user);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { companyId } = req.params;

  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await DeleteCompaniesService(companyId);

  const io = getIO();
  io.emit("user", {
    action: "delete",
    companyId
  });

  return res.status(200).json({ message: "Company deleted" });
};
