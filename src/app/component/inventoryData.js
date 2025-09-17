"use client";
import React, { useState, useEffect } from "react";
import { fetchAllInventory } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import jsPDF from "jspdf";

const InventoryData = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    siteLocation: "",
    unit: "",
    materialName: "",
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20; // Increased

  useEffect(() => {
    if (!user) dispatch(loadUser());
  }, [user, dispatch]);

  const userRole = user?.role || "guest";

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchAllInventory();
        if (Array.isArray(data)) {
          setReports(data);
          setFilteredReports(data);
        } else {
          console.error("Invalid API response: Expected an array", data);
          setReports([]);
          setFilteredReports([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    let filteredData = Array.isArray(reports) ? [...reports] : [];

    if (searchTerm) {
      filteredData = filteredData.filter((report) =>
        report.materialName?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({
      siteLocation: "",
      unit: "",
      materialName: "",
    });
  };

  // Download Handling
  const getFormattedFileName = () => {
    const date = new Date().toISOString().split('T')[0]; // Current date as YYYY-MM-DD
    return `MatTrack-Inventory-${date}`;
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Material Name,Total Quantity,Unit,Site Location\n";
    filteredReports.forEach((report) => {
      csvContent += `${report.materialName || ""},${report.totalQuantity || "0"},${report.unit || ""},${report.siteLocation || ""}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${getFormattedFileName()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsDownloadOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.text("All Inventory Materials", 10, y);
    y += 10;
    filteredReports.forEach((report, index) => {
      if (y > 280) { // Start new page if near bottom
        doc.addPage();
        y = 10;
      }
      doc.text(`Record ${index + 1}`, 10, y);
      y += 10;
      doc.text(`Material Name: ${report.materialName || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Total Quantity: ${report.totalQuantity || "0"}`, 10, y);
      y += 10;
      doc.text(`Unit: ${report.unit || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Site Location: ${report.siteLocation || "N/A"}`, 10, y);
      y += 10;
    });
    doc.save(`${getFormattedFileName()}.pdf`);
    setIsDownloadOpen(false);
  };

  const handleDownloadClick = () => {
    setIsDownloadOpen(!isDownloadOpen);
  };

  const handleFormatSelect = (format) => {
    if (format === "csv") {
      exportToCSV();
    } else if (format === "pdf") {
      exportToPDF();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search by material name..."
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            name="siteLocation"
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
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
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
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
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={filters.materialName}
            onChange={(e) => setFilters({ ...filters, materialName: e.target.value })}
          >
            <option value="">All Materials</option>
            {[...new Set(reports.map((item) => item.materialName))].map((material) => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>

          {userRole === "admin" && (
            <div className="relative">
              <button
                onClick={handleDownloadClick}
                className="px-4 py-2 border rounded-md bg-[#123962] text-white hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962] w-full text-sm"
              >
                Download All
              </button>
              {isDownloadOpen && (
                <div className="absolute z-10 mt-2 bg-white shadow-lg rounded-md border border-gray-200 w-full">
                  <button
                    onClick={() => handleFormatSelect("pdf")}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleFormatSelect("csv")}
                    className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    CSV
                  </button>
                </div>
              )}
            </div>
          )}
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 sm:col-span-2 lg:col-span-4"
          >
            Clear Filters
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Fetching Inventory data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="w-full">
            <div className="mt-6 flex justify-center mb-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left text-base">
                    <th className="py-3 px-4">Material Name</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Site Location</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.length > 0 ? (
                    currentRecords.map((report, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-4">{report.materialName || "N/A"}</td>
                        <td className="py-3 px-4">{report.totalQuantity || "0"}</td>
                        <td className="py-3 px-4">{report.unit || "N/A"}</td>
                        <td className="py-3 px-4">{report.siteLocation || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center p-4 text-base">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {currentRecords.length > 0 ? (
                currentRecords.map((report, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                    <div className="space-y-2 text-base">
                      <p>
                        <span className="font-medium">Material Name:</span> {report.materialName || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Quantity:</span> {report.totalQuantity || "0"}
                      </p>
                      <p>
                        <span className="font-medium">Unit:</span> {report.unit || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Site Location:</span> {report.siteLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-base text-gray-500">No data available</p>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryData;