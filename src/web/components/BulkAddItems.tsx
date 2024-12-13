import React, { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";

interface BulkAddProps {
  onBulkAdd: (items: Partial<InventoryItem>[]) => Promise<void>;
  onClose: () => void;
}

export const BulkAddItems: React.FC<BulkAddProps> = ({
  onBulkAdd,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Partial<InventoryItem>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateRow = (row: any): string[] => {
    const errors: string[] = [];
    if (!row.sku) errors.push("SKU is required");
    if (!row.product) errors.push("Product name is required");
    if (!row.price || isNaN(row.price)) errors.push("Valid price is required");

    return errors;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate and transform data
        const validatedData = data
          .map((row: any, index) => {
            const rowErrors = validateRow(row);
            if (rowErrors.length > 0) {
              setErrors((prev) => [
                ...prev,
                `Row ${index + 1}: ${rowErrors.join(", ")}`,
              ]);
              return null;
            }

            return {
              sku: row.sku,
              product: row.product,
              price: parseFloat(row.price),
              platforms: {
                tiktok: {
                  stock: parseInt(row.tiktok_stock) || 0,
                  sales: 0,
                  status: "active",
                },
                instagram: {
                  stock: parseInt(row.instagram_stock) || 0,
                  sales: 0,
                  status: "active",
                },
                shopify: {
                  stock: parseInt(row.shopify_stock) || 0,
                  sales: 0,
                  status: "active",
                },
              },
            };
          })
          .filter(Boolean);

        setPreview(validatedData as InventoryItem[]);
      } catch (error) {
        setErrors(["Failed to parse file. Please check the format."]);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (!preview.length) return;

    try {
      await onBulkAdd(preview);
      onClose();
    } catch (error) {
      setErrors(["Failed to upload items. Please try again."]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl p-6">
        <h2 className="text-xl font-semibold mb-4">Bulk Add Items</h2>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-gray-600">
                Click to upload or drag and drop
              </span>
              <span className="text-sm text-gray-500">
                XLSX or CSV files only
              </span>
            </label>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Validation Errors</span>
              </div>
              <ul className="list-disc list-inside text-sm text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {preview.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">
                Preview ({preview.length} items)
              </h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">SKU</th>
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-right">Price</th>
                      <th className="p-2 text-right">Total Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{item.sku}</td>
                        <td className="p-2">{item.product}</td>
                        <td className="p-2 text-right">${item.price}</td>
                        <td className="p-2 text-right">
                          {item.platforms &&
                            Object.values(item.platforms).reduce(
                              (sum, p) => sum + (p.stock || 0),
                              0
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!preview.length || errors.length > 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Upload {preview.length} Items
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
