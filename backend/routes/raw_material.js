import express from "express"
import RawMaterial from "../controller/raw_material.js"

const raw_material_router = express.Router();

const RawMaterialInstance = new RawMaterial();

raw_material_router.get("/", RawMaterialInstance.getRawMaterials);
raw_material_router.post("/add-raw-material", RawMaterialInstance.insertRawMaterial);

export default raw_material_router;