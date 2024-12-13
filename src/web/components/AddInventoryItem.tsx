import React, { useState } from "react";
import { PlusCircle, XCircle } from "lucide-react";

interface AddInventoryItemProps {
  onAdd: (item: Partial<InventoryItem>) => void;
  onClose: () => void;
}

export const AddInventoryItem: React.FC<AddInventoryItemProps> = ({
  onAdd,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    product: "",
    sku: "",
    price: "",
    platforms: {
      tiktok: { stock: "", sales: "0", status: "active" },
      instagram: { stock: "", sales: "0", status: "active" },
      shopify: { stock: "", sales: "0", status: "active" },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate total stock
    const totalStock = Object.values(formData.platforms).reduce(
      (sum, platform) => sum + Number(platform.stock),
      0
    );

    const newItem: InventoryItem = {
      id: formData.sku,
      product: formData.product,
      sku: formData.sku,
      price: Number(formData.price),
      stock: totalStock,
      stockChange: 0,
      status: "healthy",
      lastUpdated: "Just now",
      platform: "All",
      platforms: {
        tiktok: {
          stock: Number(formData.platforms.tiktok.stock),
          sales: Number(formData.platforms.tiktok.sales),
        },
        instagram: {
          stock: Number(formData.platforms.instagram.stock),
          sales: Number(formData.platforms.instagram.sales),
        },
        shopify: {
          stock: Number(formData.platforms.shopify.stock),
          sales: Number(formData.platforms.shopify.sales),
        },
      },
    };

    onAdd(newItem);
    onClose();
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [platform, field] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        platforms: {
          ...prev.platforms,
          [platform]: {
            ...prev.platforms[platform as keyof typeof prev.platforms],
            [field]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Inventory Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="product"
                required
                value={formData.product}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                name="sku"
                required
                value={formData.sku}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Enter SKU"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              required
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Enter price"
            />
          </div>

          {/* Platform Stock Levels */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Platform Stock Levels
            </h3>
            <div className="space-y-4">
              {(
                Object.keys(formData.platforms) as Array<
                  keyof typeof formData.platforms
                >
              ).map((platform) => (
                <div key={platform} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium capitalize">
                      {platform}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Initial Stock
                      </label>
                      <input
                        type="number"
                        name={`${platform}.stock}`}
                        required
                        min="0"
                        value={formData.platforms[platform].stock}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Initial Sales
                      </label>
                      <input
                        type="number"
                        name={`${platform}.sales`}
                        required
                        min="0"
                        value={formData.platforms[platform].sales}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
