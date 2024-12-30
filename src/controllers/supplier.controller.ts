import { Request, Response, NextFunction } from "express";
import {
  linkProductToSupplier,
  createSupplier,
  editSupplier,
  deleteSupplier,
  fetchMerchantSuppliers,
} from "../services";

export const assignSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = parseInt(req.params.productId);
    const { supplierId } = req.body;
    const merchantId = (req as any).user.id;

    const updatedProduct = await linkProductToSupplier(
      productId,
      supplierId,
      merchantId
    );

    res.status(200).json({
      message: "Supplier linked successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const addSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      next({ status: 400, message: "Name and contactEmail are required" });
    }

    const newSupplier = await createSupplier(name, email, phone);

    res.status(201).json({
      message: "Supplier created successfully",
      supplier: newSupplier,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplierId = parseInt(req.params.id);
    const updates = req.body;

    const updatedSupplier = await editSupplier(supplierId, updates);

    res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const supplierId = parseInt(req.params.id);

    await deleteSupplier(supplierId);

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMerchantSuppliers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const merchantId = (req as any).user.id;

    const suppliers = await fetchMerchantSuppliers(merchantId);

    res.status(200).json({ suppliers });
  } catch (error) {
    next(error);
  }
};
