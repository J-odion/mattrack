"use client";
import React, { useState, useEffect } from "react";
import { fetchAllInventory } from "../utils/Apis";
import Pagination from "./Pgination";

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

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;


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
    setCurrentPage(1);
  }, [searchTerm, filters, reports]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredReports.length / recordsPerPage);

  return (
    <div className="w-full pt-4">
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by material name..."
          className="border p-2 rounded w-1/4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          name="siteLocation"
          className="border p-2 rounded"
          value={filters.siteLocation}
          onChange={(e) => setFilters({ ...filters, siteLocation: e.target.value })}
        >
          <option value="">All Locations</option>
          {[...new Set(reports.map((item) => item.siteLocation))].map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          name="unit"
          className="border p-2 rounded"
          value={filters.unit}
          onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
        >
          <option value="">All Units</option>
          {[...new Set(reports.map((item) => item.unit))].map((unit) => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>

        <select
          name="materialName"
          className="border p-2 rounded"
          value={filters.materialName}
          onChange={(e) => setFilters({ ...filters, materialName: e.target.value })}
        >
          <option value="">All Materials</option>
          {[...new Set(reports.map((item) => item.materialName))].map((material) => (
            <option key={material} value={material}>{material}</option>
          ))}
        </select>

        <button
          onClick={() => {
            setSearchTerm("");
            setSiteLocation("");
            setPurpose("");
            setMaterial("");
            setStartDate(null);
            setEndDate(null);
          }}
          className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {loading && <p>Fetching Inventory data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-full h-full ">
          <table className="w-full h-[60%] border-collapse border-b border-b-gray-200">
            <thead>
              <tr className="bg-gray-100 font-normal text-left">
                <th className="py-2 px-4 border">Material Name</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Unit</th>
                <th className="py-2 px-4 border">Site Location</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((report, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border">{report.materialName}</td>
                  <td className="py-2 px-4 border">{report.totalQuantity}</td>
                  <td className="py-2 px-4 border">{report.unit}</td>
                  <td className="py-2 px-4 border">{report.siteLocation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className=" w-[100%] flex justify-between mt-4">
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryData;
