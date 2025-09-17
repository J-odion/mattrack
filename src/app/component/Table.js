"use client";
import React, { useState, useEffect } from "react";
import { fetchTableData } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "./Pagination"; // Corrected import
import jsPDF from "jspdf";

const ITEMS_PER_PAGE = 50; // Increased

const DynamicTable = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [material, setMaterial] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchTableData();
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
    if (!user) dispatch(loadUser());
  }, [user, dispatch]);

  const userRole = user?.role || "guest";
  const userName = user?.name || "guest";

  // Filtering Function
  useEffect(() => {
    let filtered = reports ? [...reports] : [];

    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.siteLocation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (siteLocation) {
      filtered = filtered.filter(report => report.siteLocation === siteLocation);
    }

    if (startDate && endDate) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate >= startDate && reportDate <= endDate;
      });
    }

    if (purpose) {
      filtered = filtered.filter(report => report.purpose === purpose);
    }

    if (material) {
      filtered = filtered.filter(report => report.materials?.some(m => m.materialName === material));
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [searchQuery, siteLocation, purpose, material, startDate, endDate, reports]);

  // Sorting Function
  const sortedReports = [...filteredReports].sort((a, b) => {
    return sortOrder === "asc"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedReports.length / ITEMS_PER_PAGE);
  const paginatedData = sortedReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Modal Handling
  const openModal = (materials) => {
    setSelectedMaterials(materials);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMaterials([]);
  };

  // Download Handling
  const getFormattedFileName = () => {
    const date = new Date().toISOString().split('T')[0]; // Current date as YYYY-MM-DD
    return `MatTrack-InventoryRecords-${date}`;
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Site Location,Purpose,House Type,Construction No,Status,Materials\n";
    sortedReports.forEach((report) => {
      const materialsSummary = report.materials?.map(m => `${m.materialName}: ${m.quantity} ${m.unit}`).join("; ") || "None";
      csvContent += `${new Date(report.date).toLocaleDateString()},${report.siteLocation || ""},${report.purpose || ""},${report.houseType || ""},${report.constructionNo || ""},${report.status || ""},${materialsSummary}\n`;
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
    doc.text("All Material Requests", 10, y);
    y += 10;
    sortedReports.forEach((report, index) => {
      if (y > 280) { // Start new page if near bottom
        doc.addPage();
        y = 10;
      }
      doc.text(`Request ${index + 1}`, 10, y);
      y += 10;
      doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 10, y);
      y += 10;
      doc.text(`Site Location: ${report.siteLocation || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Purpose: ${report.purpose || "N/A"}`, 10, y);
      y += 10;
      doc.text(`House Type: ${report.houseType || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Construction No: ${report.constructionNo || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Status: ${report.status || "N/A"}`, 10, y);
      y += 10;
      doc.text("Materials:", 10, y);
      y += 10;
      report.materials?.forEach((material, i) => {
        if (y > 280) { // Start new page if near bottom
          doc.addPage();
          y = 10;
        }
        doc.text(`${i + 1}. ${material.materialName} - ${material.quantity} ${material.unit}`, 10, y);
        y += 10;
      });
      y += 10; // Extra spacing between reports
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
        <div className="flex flex-col gap-4 mb-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            placeholder="Search by Site Location..."
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={siteLocation}
            onChange={(e) => setSiteLocation(e.target.value)}
          >
            <option value="">Filter by Site Location</option>
            {[...new Set(reports.map(report => report.siteLocation))].map((loc, idx) => (
              <option key={idx} value={loc}>{loc}</option>
            ))}
          </select>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
          />
          {userRole === "admin" && (
            <>
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
            </>
          )}
          <button
            onClick={() => {
              setSearchQuery("");
              setSiteLocation("");
              setPurpose("");
              setMaterial("");
              setStartDate(null);
              setEndDate(null);
            }}
            className="px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 sm:col-span-2 lg:col-span-3"
          >
            Clear Filters
          </button>
        </div>

        {/* Table */}
        {loading && <p className="text-center text-gray-600">Loading data...</p>}
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
                    <th className="py-3 px-4">
                      Date
                      <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="ml-2"
                      >
                        {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                      </button>
                    </th>
                    <th className="py-3 px-4">Site Location</th>
                    <th className="py-3 px-4">Materials</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((report, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-base">{new Date(report.date).toLocaleDateString()}</td>
                        <td className="py-3 px-4 text-base">{report.siteLocation}</td>
                        <td className="py-3 px-4 text-base">{report.materials?.length || 0} items</td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => openModal(report.materials)}
                            className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          >
                            View
                          </button>
                        </td>
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
              {paginatedData.length > 0 ? (
                paginatedData.map((report, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                    <div className="space-y-2 text-base">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold">
                          {new Date(report.date).toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                          className="text-[#123962]"
                        >
                          {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                        </button>
                      </div>
                      <p>
                        <span className="font-medium">Site Location:</span> {report.siteLocation}
                      </p>
                      <p>
                        <span className="font-medium">Materials:</span> {report.materials?.length || 0} items
                      </p>
                      <div className="text-right">
                        <button
                          onClick={() => openModal(report.materials)}
                          className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-base text-gray-500">No data available</p>
              )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#123962]">Material Details</h3>
                <button
                  onClick={closeModal}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  ✖ Close
                </button>
              </div>
              {/* Desktop Modal Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-left text-base">
                      <th className="py-3 px-4 border-b">Material Name</th>
                      <th className="py-3 px-4 border-b">Quantity</th>
                      <th className="py-3 px-4 border-b">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedMaterials.map((material, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-base">{material.materialName}</td>
                        <td className="py-3 px-4 text-base">{material.quantity}</td>
                        <td className="py-3 px-4 text-base">{material.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Modal Card Layout */}
              <div className="sm:hidden space-y-4">
                {selectedMaterials.map((material, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                    <div className="space-y-2 text-base">
                      <p>
                        <span className="font-medium">Material Name:</span> {material.materialName}
                      </p>
                      <p>
                        <span className="font-medium">Quantity:</span> {material.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Unit:</span> {material.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;