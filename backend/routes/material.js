import express from "express";
import Material from "../controller/materials.js";

const material_router = express.Router();
const MaterialInstance = new Material();

material_router.get("/", MaterialInstance.getMaterials);
material_router.post("/add-material", MaterialInstance.insertMaterial);
material_router.get("/by-date", MaterialInstance.getDailyMaterials);
material_router.delete("/:id", MaterialInstance.deleteMaterial);
material_router.put("/:id", MaterialInstance.updateMaterial);

export default material_router;