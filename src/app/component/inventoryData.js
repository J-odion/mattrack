"use client";
import React, { useState, useEffect } from "react";
import { fetchAllInventory } from "../utils/Apis";

const InventoryData = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports using the utility function
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchAllInventory();
        setReports(data);
        console.log(reports)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);
  console.log(reports)


  return (
    <div className="container mx-auto p-4">
      {loading && <p>Fetching Inventory data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 font-normal text-left">
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Material Name</th>{/* { 2 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Category</th>{/* { 3 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Quantity</th>{/* { 4 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Unit</th>{/* { 5 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Site Location</th>{/* { 6 } */}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                  <td className="py-2 px-4 text-[12px] border-b">{report.materialName}</td>{/* { 2 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.materialCategory}</td>{/* { 3 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.totalQuantity}</td>{/* { 4 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.unit}</td>{/* { 5 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.siteLocation}</td>{/* { 7 } */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryData;
