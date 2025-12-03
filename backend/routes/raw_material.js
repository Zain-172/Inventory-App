import express from "express"
import RawMaterial from "../controller/raw_material.js"

const raw_material_router = express.Router();

const RawMaterialInstance = new RawMaterial();

raw_material_router.get("/", RawMaterialInstance.getRawMaterials);
raw_material_router.post("/add-raw-material", RawMaterialInstance.insertRawMaterial);
raw_material_router.delete("/:id", RawMaterialInstance.deleteRawMaterial);
raw_material_router.put("/:id", RawMaterialInstance.updateRawMaterial);

export default raw_material_router;