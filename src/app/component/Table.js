"use client";
import React, { useState, useEffect } from "react";
import { fetchTableData } from "../utils/Apis";

const DynamicTable = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [material, setMaterial] = useState("");

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchTableData();
        setReports(data);
        setFilteredReports(data); // Initialize filtered reports
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadReports();
  }, []);

  // Filtering Function
  useEffect(() => {
    let filtered = reports;

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.siteLocation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (siteLocation) {
      filtered = filtered.filter(report => report.siteLocation === siteLocation);
    }

    if (purpose) {
      filtered = filtered.filter(report => report.purpose === purpose);
    }

    if (material) {
      filtered = filtered.filter(report =>
        report.materials.some(m => m.materialName === material)
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, siteLocation, purpose, material, reports]);

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
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Site Location..."
          className="border px-3 py-2 rounded w-1/4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={siteLocation}
          onChange={(e) => setSiteLocation(e.target.value)}
        >
          <option value="">Filter by Site Location</option>
          {[...new Set(reports.map(report => report.siteLocation))].map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">Filter by Purpose</option>
          {[...new Set(reports.map(report => report.purpose))].map((purp, idx) => (
            <option key={idx} value={purp}>{purp}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          <option value="">Filter by Material</option>
          {[...new Set(reports.flatMap(report => report.materials.map(m => m.materialName)))].map((mat, idx) => (
            <option key={idx} value={mat}>{mat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
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
            {filteredReports.map((report, index) => (
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
