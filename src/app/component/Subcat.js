"use client";
import React, { useState } from "react";
import DynamicTable from "./Table";
import AllDisbursed from "./AllDisnursed";
import InventoryData from "./inventoryData";
import ViewRequest from "./ViewRequests";



export default function Subcat() {
  const [selectedTable, setSelectedTable] = useState("received");

  const handleTableChange = (table) => {
    setSelectedTable(table);
  };


  return (
    <section className="py-[26px] gap-y-[14px]w-full lg:w-[1280px] text-[12px] justify-center flex flex-col mx-auto items-center">
        <div id="services" className="grid lg:grid-cols-4 gap-[24px] mb-[4px]">
          <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleTableChange("inventory")}
          className={`px-4 text-[#123962] w-[200px] h-[50px] bg-none font-semibold py-1 text-[12px]  ${selectedTable === "inventory" ? "border-[#123962] border" : "border-b-none"}`}
        >
          Inventory
          (Records)
        </button>
        <button
          onClick={() => handleTableChange("received")}
          className={`px-4 text-[#123962] w-[200px] h-[50px] bg-none font-semibold py-1 text-[12px] ${selectedTable === "received" ? "border-[#123962] py-2 border-b-2" : "border-b-none"}`}
        >
          Received (Inward)
        </button>
        <button
          onClick={() => handleTableChange("disbursed")}
          className={`px-4 text-[#123962] w-[200px] h-[50px] bg-none font-semibold py-1 text-[12px] ${selectedTable === "disbursed" ? "border-[#123962] border-b-2" : "border-b-none"}`}
        >
          Disbursed (Outward)
        </button>
        <button
          onClick={() => handleTableChange("requests")}
          className={`px-4 text-[#123962] w-[200px] h-[50px] bg-none font-semibold py-1 text-[12px] ${selectedTable === "requests" ? "border-[#123962] border-b-2" : "border-b-none"}`}
        >
          View Requests
        </button>
        
      </div>
        </div>        
        {/* Render the corresponding table */}
      {selectedTable === "inventory" && <InventoryData  />}
      {selectedTable === "received" && <DynamicTable  />}
      {selectedTable === "disbursed" && <AllDisbursed />}
      {selectedTable === "requests" && <ViewRequest />}
     
    </section>
  );
}
