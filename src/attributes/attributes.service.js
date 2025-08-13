import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create new attribute
export const createAttribute = async (attributeData) => {
  try {
    const { name, slug } = attributeData;

    // Validate required fields
    if (!name) {
      throw new Error("Name is required");
    }
    if (!slug) {
      throw new Error("Slug is required");
    }

    // Check if attribute with this slug already exists
    const existingAttribute = await prisma.attribute.findUnique({
      where: { slug },
    });

    if (existingAttribute) {
      throw new Error("Attribute with this slug already exists");
    }

    // Create attribute
    const attribute = await prisma.attribute.create({
      data: {
        name,
        slug,
      },
      include: {
        values: true,
      },
    });

    return attribute;
  } catch (error) {
    throw error;
  }
};

// Get all attributes
export const getAllAttributes = async () => {
  try {
    const attributes = await prisma.attribute.findMany();

    return attributes;
  } catch (error) {
    throw error;
  }
};

// Get attribute by ID
export const getAttributeById = async (attributeId) => {
  try {
    const attribute = await prisma.attribute.findUnique({
      where: { id: parseInt(attributeId) },
      include: {
        values: true,
      },
    });

    if (!attribute) {
      throw new Error("Attribute not found");
    }

    return attribute;
  } catch (error) {
    throw error;
  }
};

// Get attribute by slug
export const getAttributeBySlug = async (slug) => {
  try {
    const attribute = await prisma.attribute.findUnique({
      where: { slug },
      include: {
        values: true,
      },
    });

    if (!attribute) {
      throw new Error("Attribute not found");
    }

    return attribute;
  } catch (error) {
    throw error;
  }
};

// Update attribute
export const updateAttribute = async (attributeId, updateData) => {
  try {
    const { name, slug } = updateData;

    // Check if slug is being updated and if it already exists
    if (slug) {
      const existingAttribute = await prisma.attribute.findFirst({
        where: {
          slug,
          id: { not: parseInt(attributeId) },
        },
      });

      if (existingAttribute) {
        throw new Error("Attribute with this slug already exists");
      }
    }

    const attribute = await prisma.attribute.update({
      where: { id: parseInt(attributeId) },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
      },
      include: {
        values: true,
      },
    });

    return attribute;
  } catch (error) {
    throw error;
  }
};

// Delete attribute
export const deleteAttribute = async (attributeId) => {
  try {
    const attribute = await prisma.attribute.findUnique({
      where: { id: parseInt(attributeId) },
    });

    if (!attribute) {
      throw new Error("Attribute not found");
    }

    // Delete associated attribute values first
    await prisma.attributeValue.deleteMany({
      where: { attributeId: parseInt(attributeId) },
    });

    // Delete the attribute
    await prisma.attribute.delete({
      where: { id: parseInt(attributeId) },
    });

    return { message: "Attribute deleted successfully" };
  } catch (error) {
    throw error;
  }
};

// Create attribute value
export const createAttributeValue = async (attributeValueData) => {
  try {
    const { value, attributeId } = attributeValueData;

    // Validate required fields
    if (!value) {
      throw new Error("Value is required");
    }
    if (!attributeId) {
      throw new Error("Attribute ID is required");
    }

    // Check if attribute exists
    const attribute = await prisma.attribute.findUnique({
      where: { id: parseInt(attributeId) },
    });

    if (!attribute) {
      throw new Error("Attribute not found");
    }

    // Check if value already exists for this attribute
    const existingValue = await prisma.attributeValue.findFirst({
      where: {
        value,
        attributeId: parseInt(attributeId),
      },
    });

    if (existingValue) {
      throw new Error("Value already exists for this attribute");
    }

    // Create attribute value
    const attributeValue = await prisma.attributeValue.create({
      data: {
        value,
        attributeId: parseInt(attributeId),
      },
      include: {
        attribute: true,
      },
    });

    return attributeValue;
  } catch (error) {
    throw error;
  }
};

// Get all attribute values for an attribute
export const getAttributeValues = async (attributeId) => {
  try {
    // Check if attribute exists
    const attribute = await prisma.attribute.findUnique({
      where: { id: parseInt(attributeId) },
    });

    if (!attribute) {
      throw new Error("Attribute not found");
    }

    const values = await prisma.attributeValue.findMany({
      where: { attributeId: parseInt(attributeId) },
      include: {
        attribute: true,
      },
      orderBy: { value: "asc" },
    });

    return values;
  } catch (error) {
    throw error;
  }
};

// Get attribute value by ID
export const getAttributeValueById = async (valueId) => {
  try {
    const attributeValue = await prisma.attributeValue.findUnique({
      where: { id: parseInt(valueId) },
      include: {
        attribute: true,
      },
    });

    if (!attributeValue) {
      throw new Error("Attribute value not found");
    }

    return attributeValue;
  } catch (error) {
    throw error;
  }
};

// Update attribute value
export const updateAttributeValue = async (valueId, updateData) => {
  try {
    const { value } = updateData;

    if (!value) {
      throw new Error("Value is required");
    }

    // Check if value already exists for the same attribute
    const currentValue = await prisma.attributeValue.findUnique({
      where: { id: parseInt(valueId) },
    });

    if (!currentValue) {
      throw new Error("Attribute value not found");
    }

    const existingValue = await prisma.attributeValue.findFirst({
      where: {
        value,
        attributeId: currentValue.attributeId,
        id: { not: parseInt(valueId) },
      },
    });

    if (existingValue) {
      throw new Error("Value already exists for this attribute");
    }

    const attributeValue = await prisma.attributeValue.update({
      where: { id: parseInt(valueId) },
      data: { value },
      include: {
        attribute: true,
      },
    });

    return attributeValue;
  } catch (error) {
    throw error;
  }
};

// Delete attribute value
export const deleteAttributeValue = async (valueId) => {
  try {
    const attributeValue = await prisma.attributeValue.findUnique({
      where: { id: parseInt(valueId) },
    });

    if (!attributeValue) {
      throw new Error("Attribute value not found");
    }

    await prisma.attributeValue.delete({
      where: { id: parseInt(valueId) },
    });

    return { message: "Attribute value deleted successfully" };
  } catch (error) {
    throw error;
  }
};
