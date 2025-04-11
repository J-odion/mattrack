"use client";
import React, { useState, useEffect } from "react";
import { fetchTableData } from "../utils/Apis";
import DatePicker from "react-datepicker";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "./Pgination";

const ITEMS_PER_PAGE = 12; // Items per page

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
          setReports([]); // Ensure reports is an array
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
    setCurrentPage(1); // Reset to first page when filters change
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

        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
          className="border text-xs px-3 py-2 rounded w-full"
        />
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
          className="border text-xs px-3 py-2 rounded w-full"
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
          className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="w-full">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 font-normal text-left">
                <th className="py-2 px-4 border">
                  Date
                  <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                  </button>
                </th>
                <th className="py-2 px-4 border">Site Location</th>
                <th className="py-2 px-4 border">Materials</th>
                <th className="py-2 px-4 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((report, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border">{report.siteLocation}</td>
                    <td className="py-2 px-4 border">{report.materials?.length || 0} items</td>
                    <td className="py-2 px-4 border">
                      <button
                        onClick={() => openModal(report.materials)}
                        className="bg-[#123962] text-white px-3 py-1 rounded text-sm hover:bg-[#123979]"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">No data available</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className=" w-full mt-6 flex justify-between">
            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          </div>
        </div>
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
