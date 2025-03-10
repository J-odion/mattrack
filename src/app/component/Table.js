"use client";
import React, { useState, useEffect } from "react";
import { fetchTableData } from "../utils/Apis";

const DynamicTable = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchTableData();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  const openModal = (materials) => {
    setSelectedMaterials(materials);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterials([]);
  };

  return (
    <div className="w-full mx-auto p-4">
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-[50%]">
          <thead>
            <tr className="bg-gray-100 font-normal text-left">
              <th className="py-2 px-4 border-b text-[12px]">Date</th>
              <th className="py-2 px-4 border-b text-[12px]">Site Location</th>
              <th className="py-2 px-4 border-b text-[12px]">Materials</th>
              <th className="py-2 px-4 border-b text-[12px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b text-[12px]">
                  {new Date(report.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="py-2 px-4 border-b text-[12px]">{report.siteLocation}</td>
                <td className="py-2 px-4 border-b text-[12px]">{report.materials.length} items</td>
                <td className="py-2 px-4 border-b text-[12px]">
                  <button
                    onClick={() => openModal(report.materials)}
                    className="bg-[#123962] text-white px-3 py-1 rounded text-sm hover:bg-[#123979]"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg w-3/5 h-[60%] overflow-y-scroll">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Material Details</h3>
              <button onClick={closeModal} className="text-red-500 hover:text-red-700">
                ✖ Close
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 font-normal text-left">
                  <th className="py-2 px-4 border-b text-[12px]">Material Name</th>
                  <th className="py-2 px-4 border-b text-[12px]">Quantity</th>
                  <th className="py-2 px-4 border-b text-[12px]">Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedMaterials.map((material, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-4 border-b text-[12px]">{material.materialName}</td>
                    <td className="py-2 px-4 border-b text-[12px]">{material.quantity}</td>
                    <td className="py-2 px-4 border-b text-[12px]">{material.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTable;
