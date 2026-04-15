import { useState } from "react";
import { Check } from "lucide-react";

const ORGS = [
  { id: "powergrid", name: "PowerGrid", isPrimary: true },
  { id: "puc", name: "Premium Utility Contractor", isPrimary: false },
  { id: "conexus", name: "Conexus", isPrimary: false },
  { id: "mcstorm", name: "MC Storm", isPrimary: false },
  { id: "csr", name: "CSR", isPrimary: false },
  { id: "ampp", name: "AMPP", isPrimary: false },
];

export default function OrgSwitcher() {
  const [selected, setSelected] = useState("all");

  const isAllSelected = selected === "all";

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center pt-20">
      <div className="w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        {/* All Organizations */}
        <div className="px-3 pt-2">
            <button
              onClick={() => setSelected("all")}
              className="w-full flex items-center gap-3 px-2 py-3 text-left"
            >
              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 ${
                isAllSelected ? "border-gray-900" : "border-gray-300"
              }`}>
                {isAllSelected && <Check className="w-3 h-3 text-gray-900" />}
              </div>
              <span className="text-sm font-semibold text-gray-900 flex-1">
                All Organizations
              </span>
            </button>

            <div className="border-t border-gray-200" />
          </div>

        {/* Org list */}
        <div className="px-3 py-1 max-h-[320px] overflow-y-auto">
          {ORGS.map((org) => {
              const isSelected = selected === org.id;
              return (
                <button
                  key={org.id}
                  onClick={() => setSelected(org.id)}
                  className="w-full flex items-center gap-3 px-2 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-gray-900" : "border-gray-300"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-gray-900" />}
                  </div>
                  <span className="text-sm font-medium text-gray-900 flex-1 min-w-0 truncate">
                    {org.name}
                  </span>
                  {org.isPrimary && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 border border-orange-200">
                      HOME
                    </span>
                  )}
                </button>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
