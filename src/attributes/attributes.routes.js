import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createNewAttribute,
  getAttributes,
  getAttribute,
  getAttributeBySlugRoute,
  updateAttributeById,
  deleteAttributeById,
  createNewAttributeValue,
  getAttributeValuesRoute,
  getAttributeValue,
  updateAttributeValueById,
  deleteAttributeValueById,
} from "./attributes.controller.js";

const router = express.Router();

// Attribute routes
router.get("/", getAttributes);
router.post("/", createNewAttribute);
router.get("/slug/:slug", getAttributeBySlugRoute);
router.get("/:attributeId", getAttribute);
router.put("/:attributeId", updateAttributeById);
router.delete("/:attributeId", deleteAttributeById);

// Attribute value routes
router.post("/:attributeId/values", createNewAttributeValue);
router.get("/:attributeId/values", getAttributeValuesRoute);
router.get("/values/:valueId", getAttributeValue);
router.put("/values/:valueId", updateAttributeValueById);
router.delete("/values/:valueId", deleteAttributeValueById);

export default router;
