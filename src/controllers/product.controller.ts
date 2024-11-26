import { Request, Response, NextFunction } from "express";
import {
  fetchAllProducts,
  createProduct,
  removeProduct,
  fetchLowStockProducts,
  fetchMerchantProducts,
  updateProduct,
  fetchProductById,
  setRestockingRules,
} from "../services";

export const getAllProducts = async (req: Request, res: Response) => {
  const products = await fetchAllProducts();
  res.json(products);
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await fetchProductById(req.params.id);
  res.json(product);
};

export const addProduct = async (req: Request, res: Response) => {
  const newProduct = await createProduct(req.body);
  res.status(201).json(newProduct);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await removeProduct(req.params.id);
  res.status(204).send();
};

export const getMerchantProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const merchantId = (req as any).user.id;
    const products = await fetchMerchantProducts(merchantId);

    res.status(200).json({ products });
  } catch (error) {
    next(error);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const merchantId = (req as any).user.id;
    const updates = req.body;

    const updatedProduct = await updateProduct(productId, merchantId, updates);

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
export const updateRestockingRules = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = req.params.id;
    const merchantId = (req as any).user.id;
    const { restockThreshold, restockAmount } = req.body;

    const updatedProduct = await setRestockingRules(
      productId,
      merchantId,
      restockThreshold,
      restockAmount
    );

    res.status(200).json({
      message: "Restocking rules updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getLowStockProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const merchantId = (req as any).user.id;
    const products = await fetchLowStockProducts(merchantId);

    res.status(200).json({ lowStockProducts: products });
  } catch (error) {
    next(error);
  }
};
