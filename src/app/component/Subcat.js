"use client";
import React, { useState } from "react";
import DynamicTable from "./Table";
import AllDisbursed from "./AllDisnursed";
import InventoryData from "./inventoryData";
import ViewRequest from "./ViewRequests";
import TransferView from "./TransfersView";

export default function Subcat() {
  const [selectedTable, setSelectedTable] = useState("inventory");

  const handleTableChange = (table) => {
    setSelectedTable(table);
  };

  return (
    <section className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-7xl w-full">
        <div id="services" className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 border-b-2 border-gray-200 pb-2">
          <button
            onClick={() => handleTableChange("inventory")}
            className={`flex-1 sm:flex-none sm:w-40 py-3 text-sm font-semibold text-[#123962] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#123962] ${
              selectedTable === "inventory" ? "border-b-2 border-[#123962] bg-[#EEF2FF]" : "hover:bg-gray-100"
            }`}
          >
            Records
          </button>
          <button
            onClick={() => handleTableChange("received")}
            className={`flex-1 sm:flex-none sm:w-40 py-3 text-sm font-semibold text-[#123962] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#123962] ${
              selectedTable === "received" ? "border-b-2 border-[#123962] bg-[#EEF2FF]" : "hover:bg-gray-100"
            }`}
          >
            Inward
          </button>
          <button
            onClick={() => handleTableChange("disbursed")}
            className={`flex-1 sm:flex-none sm:w-40 py-3 text-sm font-semibold text-[#123962] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#123962] ${
              selectedTable === "disbursed" ? "border-b-2 border-[#123962] bg-[#EEF2FF]" : "hover:bg-gray-100"
            }`}
          >
            Outward
          </button>
          <button
            onClick={() => handleTableChange("transfers")}
            className={`flex-1 sm:flex-none sm:w-40 py-3 text-sm font-semibold text-[#123962] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#123962] ${
              selectedTable === "transfers" ? "border-b-2 border-[#123962] bg-[#EEF2FF]" : "hover:bg-gray-100"
            }`}
          >
            Transfers
          </button>
          <button
            onClick={() => handleTableChange("requests")}
            className={`flex-1 sm:flex-none sm:w-48 py-3 text-sm font-semibold text-[#123962] rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#123962] ${
              selectedTable === "requests" ? "border-b-2 border-[#123962] bg-[#EEF2FF]" : "hover:bg-gray-100"
            }`}
          >
            View Requests
          </button>
        </div>
        {/* Render the corresponding table */}
        <div className="mt-6 w-full">
          {selectedTable === "inventory" && <InventoryData />}
          {selectedTable === "received" && <DynamicTable />}
          {selectedTable === "disbursed" && <AllDisbursed />}
          {selectedTable === "requests" && <ViewRequest />}
          {selectedTable === "transfers" && <TransferView />}
        </div>
      </div>
    </section>
  );
}