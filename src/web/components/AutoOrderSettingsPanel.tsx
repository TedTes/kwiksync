import { Building2 } from "lucide-react";

interface AutoOrderSettingsPanelProps {
  setSettings: React.Dispatch<React.SetStateAction<AutoOrderSettings>>;
  setIsAutomationEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isAutomationEnabled: boolean;
  settings: AutoOrderSettings;
}
export const AutoOrderSettingsPanel: React.FC<AutoOrderSettingsPanelProps> = ({
  setSettings,
  setIsAutomationEnabled,
  isAutomationEnabled,
  settings,
}) => {
  return (
    <div className="absolute left-0 top-full mt-2 w-[400px] p-4 bg-white rounded-lg shadow-lg z-50 border space-y-4">
      {/* Existing settings */}
      <div className="flex items-center justify-between border-b pb-3">
        <span className="font-medium">Auto-Order Settings</span>
        <div className="flex items-center space-x-2">
          <span>Active</span>

          <button
            onClick={() => setIsAutomationEnabled(!isAutomationEnabled)}
            className={`
              relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full
              transition-colors duration-200 ease-in-out
              ${isAutomationEnabled ? "bg-green-500" : "bg-gray-200"}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0
                transition duration-200 ease-in-out mt-0.5
                ${isAutomationEnabled ? "translate-x-4" : "translate-x-0.5"}
              `}
            />
          </button>
        </div>
      </div>

      {/* Thresholds */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Low Stock Threshold
          </label>
          <input
            type="number"
            value={settings.lowStockThreshold}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                lowStockThreshold: parseInt(e.target.value),
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Reorder Point
          </label>
          <input
            type="number"
            value={settings.reorderPoint}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                reorderPoint: parseInt(e.target.value),
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Supplier Preferences - New Section */}
      <div className="space-y-3 pt-2 border-t">
        <h3 className="font-medium flex items-center">
          <Building2 size={16} className="mr-2" />
          Supplier Preferences
        </h3>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Primary Supplier
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={settings.primarySupplier}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                primarySupplier: e.target.value,
              }))
            }
          >
            <option value="SUP-1">Fashion Wholesale Co</option>
            <option value="SUP-2">Textile Direct</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Secondary Supplier (Backup)
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={settings.secondarySupplier}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                secondarySupplier: e.target.value,
              }))
            }
          >
            <option value="SUP-1">Fashion Wholesale Co</option>
            <option value="SUP-2">Textile Direct</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Selection Criteria
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={settings.selectionCriteria}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                selectionCriteria: e.target.value as
                  | "price"
                  | "leadTime"
                  | "reliability"
                  | "auto",
              }))
            }
          >
            <option value="auto">Automatic (Best Available)</option>
            <option value="price">Lowest Price</option>
            <option value="leadTime">Fastest Delivery</option>
            <option value="reliability">Most Reliable</option>
          </select>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600">
            When set to "Automatic", the system will choose the best supplier
            based on:
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Current stock levels</li>
              <li>Supplier availability</li>
              <li>Price and lead time</li>
              <li>Historical reliability</li>
            </ul>
          </p>
        </div>
      </div>
    </div>
  );
};
