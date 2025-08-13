import {
  createAttribute,
  getAllAttributes,
  getAttributeById,
  getAttributeBySlug,
  updateAttribute,
  deleteAttribute,
  createAttributeValue,
  getAttributeValues,
  getAttributeValueById,
  updateAttributeValue,
  deleteAttributeValue,
} from "./attributes.service.js";

// Create new attribute
export const createNewAttribute = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const result = await createAttribute({
      name,
      slug,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Create attribute error:", error);

    if (error.message === "Attribute with this slug already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Name is required" ||
      error.message === "Slug is required"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all attributes
export const getAttributes = async (req, res) => {
  try {
    const attributes = await getAllAttributes();

    res.status(200).json(attributes);
  } catch (error) {
    console.error("Get all attributes error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get attribute by ID
export const getAttribute = async (req, res) => {
  try {
    const { attributeId } = req.params;

    const attribute = await getAttributeById(attributeId);

    res.status(200).json(attribute);
  } catch (error) {
    console.error("Get attribute by ID error:", error);

    if (error.message === "Attribute not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get attribute by slug
export const getAttributeBySlugRoute = async (req, res) => {
  try {
    const { slug } = req.params;

    const attribute = await getAttributeBySlug(slug);

    res.status(200).json({
      success: true,
      message: "Attribute retrieved successfully",
      data: attribute,
    });
  } catch (error) {
    console.error("Get attribute by slug error:", error);

    if (error.message === "Attribute not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update attribute
export const updateAttributeById = async (req, res) => {
  try {
    const { attributeId } = req.params;
    const updateData = req.body;

    const attribute = await updateAttribute(attributeId, updateData);

    res.status(200).json(attribute);
  } catch (error) {
    console.error("Update attribute error:", error);

    if (error.message === "Attribute not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Attribute with this slug already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete attribute
export const deleteAttributeById = async (req, res) => {
  try {
    const { attributeId } = req.params;

    const result = await deleteAttribute(attributeId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete attribute error:", error);

    if (error.message === "Attribute not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create attribute value
export const createNewAttributeValue = async (req, res) => {
  try {
    const { value } = req.body;
    const { attributeId } = req.params;

    const result = await createAttributeValue({
      value,
      attributeId,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("Create attribute value error:", error);

    if (error.message === "Value already exists for this attribute") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Value is required" ||
      error.message === "Attribute ID is required" ||
      error.message === "Attribute not found"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get attribute values
export const getAttributeValuesRoute = async (req, res) => {
  try {
    const { attributeId } = req.params;

    const values = await getAttributeValues(attributeId);

    res.status(200).json(values);
  } catch (error) {
    console.error("Get attribute values error:", error);

    if (error.message === "Attribute not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get attribute value by ID
export const getAttributeValue = async (req, res) => {
  try {
    const { valueId } = req.params;

    const attributeValue = await getAttributeValueById(valueId);

    res.status(200).json({
      success: true,
      message: "Attribute value retrieved successfully",
      data: attributeValue,
    });
  } catch (error) {
    console.error("Get attribute value by ID error:", error);

    if (error.message === "Attribute value not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update attribute value
export const updateAttributeValueById = async (req, res) => {
  try {
    const { valueId } = req.params;
    const updateData = req.body;

    const attributeValue = await updateAttributeValue(valueId, updateData);

    res.status(200).json({
      success: true,
      message: "Attribute value updated successfully",
      data: attributeValue,
    });
  } catch (error) {
    console.error("Update attribute value error:", error);

    if (error.message === "Attribute value not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Value already exists for this attribute") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Value is required") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete attribute value
export const deleteAttributeValueById = async (req, res) => {
  try {
    const { valueId } = req.params;

    const result = await deleteAttributeValue(valueId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete attribute value error:", error);

    if (error.message === "Attribute value not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
