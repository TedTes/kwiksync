import { Request, Response } from "express";
import {
  fetchAllProducts,
  fetchProductById,
  createProduct,
  modifyProduct,
  removeProduct,
  fetchLowStockProducts,
  restockProductById,
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

export const updateProduct = async (req: Request, res: Response) => {
  const updatedProduct = await modifyProduct(req.params.id, req.body);
  res.json(updatedProduct);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await removeProduct(req.params.id);
  res.status(204).send();
};

export const getLowStockProducts = async (req: Request, res: Response) => {
  const lowStockProducts = await fetchLowStockProducts();
  res.json(lowStockProducts);
};

export const restockProduct = async (req: Request, res: Response) => {
  const restockedProduct = await restockProductById(
    req.params.id,
    req.body.quantity
  );
  res.json(restockedProduct);
};
