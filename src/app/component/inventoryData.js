"use client";
import React, { useState, useEffect } from "react";
import { fetchAllInventory } from "../utils/Apis";

const InventoryData = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    siteLocation: "",
    unit: "",
    materialName: "",
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchAllInventory();
        setReports(data);
        setFilteredReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Filter function
  useEffect(() => {
    let filteredData = reports;

    if (searchTerm) {
      filteredData = filteredData.filter((report) =>
        report.materialName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.siteLocation) {
      filteredData = filteredData.filter((report) => report.siteLocation === filters.siteLocation);
    }

    if (filters.unit) {
      filteredData = filteredData.filter((report) => report.unit === filters.unit);
    }

    if (filters.materialName) {
      filteredData = filteredData.filter((report) => report.materialName === filters.materialName);
    }

    setFilteredReports(filteredData);
  }, [searchTerm, filters, reports]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by material name..."
          className="border p-2 rounded w-1/4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Dropdown Filters */}
        <select
          name="siteLocation"
          className="border p-2 rounded"
          value={filters.siteLocation}
          onChange={handleFilterChange}
        >
          <option value="">All Locations</option>
          {[...new Set(reports.map((item) => item.siteLocation))].map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>

        <select
          name="unit"
          className="border p-2 rounded"
          value={filters.unit}
          onChange={handleFilterChange}
        >
          <option value="">All Units</option>
          {[...new Set(reports.map((item) => item.unit))].map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>

        <select
          name="materialName"
          className="border p-2 rounded"
          value={filters.materialName}
          onChange={handleFilterChange}
        >
          <option value="">All Materials</option>
          {[...new Set(reports.map((item) => item.materialName))].map((material) => (
            <option key={material} value={material}>
              {material}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Fetching Inventory data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-[60%] h-[70%] border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 font-normal text-left">
              <th className="py-2 px-4 border">Material Name</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Unit</th>
              <th className="py-2 px-4 border">Site Location</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((report, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border">{report.materialName}</td>
                <td className="py-2 px-4 border">{report.totalQuantity}</td>
                <td className="py-2 px-4 border">{report.unit}</td>
                <td className="py-2 px-4 border">{report.siteLocation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InventoryData;
