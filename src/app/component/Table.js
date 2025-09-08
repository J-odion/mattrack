"use client";
import React, { useState, useEffect } from "react";
import { fetchTableData } from "../utils/Apis";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "./Pagination"; // Corrected import

const ITEMS_PER_PAGE = 50; // Increased

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
              {/* <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} /> */}
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