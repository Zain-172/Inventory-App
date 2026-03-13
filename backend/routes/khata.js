import express from "express";
import Khata from "../controller/khata.js";

const khataRouter = express.Router();
const khataInstance = new Khata();

khataRouter.get("/", khataInstance.getKhataAccounts);
khataRouter.post("/add-khata", khataInstance.insertKhataAccount);
khataRouter.put("/:id", khataInstance.updateKhataAccount);
khataRouter.delete("/:id", khataInstance.deleteKhataAccount);
khataRouter.get("/count", khataInstance.countKhataAccounts);

export default khataRouter;
