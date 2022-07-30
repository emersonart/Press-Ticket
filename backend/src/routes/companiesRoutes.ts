import { Router } from "express";

import isAuth from "../middleware/isAuth";
import * as CompaniesController from "../controllers/CompaniesController";

const companiesRouter = Router();

companiesRouter.get("/companies", isAuth, CompaniesController.index);

companiesRouter.post("/companies", isAuth, CompaniesController.store);

companiesRouter.put(
  "/companies/:companyId",
  isAuth,
  CompaniesController.update
);

companiesRouter.get("/companies/:companyId", isAuth, CompaniesController.show);

companiesRouter.delete(
  "/companies/:companyId",
  isAuth,
  CompaniesController.remove
);

export default companiesRouter;
