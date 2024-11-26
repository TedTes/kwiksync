import { Request, Response, NextFunction } from "express";
import { linkProductToSupplier } from "../services/supplier.service";

export const assignSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.productId;
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
