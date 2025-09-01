"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDisbursedData } from "../utils/Apis";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "./Pgination";

const ITEMS_PER_PAGE = 12; // Items per page

const AllDisbursed = () => {
  const [reports, setReports] = useState([]); // Ensure it's an array
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [siteLocation, setSiteLocation] = useState("");
  const [houseType, sethouseType] = useState("");
  const [constructionNumber, setconstructionNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [levelofwork, setLevelOfWork] = useState("");
  const [material, setMaterial] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data on mount
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchDisbursedData();
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
    let filtered = Array.isArray(reports) ? [...reports] : [];

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
      filtered = filtered.filter(report => report.materialName === material);
    }

    if (recipientName) {
      filtered = filtered.filter(report => report.recipientName === recipientName);
    }

    if (houseType) {
      filtered = filtered.filter(report => report.houseType === houseType);
    }

    if (constructionNumber) {
      filtered = filtered.filter(report => report.constructionNumber === constructionNumber);
    }

    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, siteLocation, purpose, material, startDate, endDate, recipientName, reports, houseType, constructionNumber]);

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

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Search & Filters */}
        <div className="flex flex-col gap-4 mb-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            placeholder="Search by Site Location..."
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={siteLocation}
            onChange={(e) => setSiteLocation(e.target.value)}
          >
            <option value="">Filter by Site Location</option>
            {(Array.isArray(reports) ? [...new Set(reports.map(report => report.siteLocation))] : []).map((loc, idx) => (
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
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
          />

          <select
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="">Filter by Purpose</option>
            {[...new Set(reports.map(report => report.purpose))].map((purp, idx) => (
              <option key={idx} value={purp}>{purp}</option>
            ))}
          </select>

          <select
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="">Filter by Material</option>
            {[...new Set(reports.flatMap(report => report.materialName))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>

          <select
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          >
            <option value="">Filter by Recipient</option>
            {[...new Set(reports.flatMap(report => report.recipientName))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>

          <select
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={houseType}
            onChange={(e) => sethouseType(e.target.value)}
          >
            <option value="">Filter by House Types</option>
            {[...new Set(reports.flatMap(report => report.houseType))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>

          <select
            className="border text-sm px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={constructionNumber}
            onChange={(e) => setconstructionNumber(e.target.value)}
          >
            <option value="">Filter by Construction Number</option>
            {[...new Set(reports.flatMap(report => report.constructionNumber))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchQuery("");
              setSiteLocation("");
              setPurpose("");
              setMaterial("");
              setRecipientName("");
              setStartDate(null);
              setEndDate(null);
              sethouseType("");
              setconstructionNumber("");
            }}
            className="px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 sm:col-span-2 lg:col-span-3"
          >
            Clear Filters
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Fetching All Disbursed data...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && (
          <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left text-sm">
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
                    <th className="py-3 px-4">House Type</th>
                    <th className="py-3 px-4">Construction No.</th>
                    <th className="py-3 px-4">Material Name</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Recipient</th>
                    <th className="py-3 px-4">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((report, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 px-4">{new Date(report.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{report.siteLocation}</td>
                      <td className="py-3 px-4">{report.houseType}</td>
                      <td className="py-3 px-4">{report.constructionNumber || "N/A"}</td>
                      <td className="py-3 px-4">{report.materialName}</td>
                      <td className="py-3 px-4">{report.quantity}</td>
                      <td className="py-3 px-4">{report.unit}</td>
                      <td className="py-3 px-4">{report.recipientName}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm">{report.purpose}</p>
                          <p className="text-xs font-semibold">{report.levelofwork}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {paginatedData.map((report, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="text-[#123962]"
                    >
                      {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                    </button>
                  </div>
                  <div className="mt-2 space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Site Location:</span> {report.siteLocation}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">House Type:</span> {report.houseType}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Construction No.:</span>{" "}
                      {report.constructionNumber || "N/A"}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Material:</span> {report.materialName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Quantity:</span> {report.quantity}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Unit:</span> {report.unit}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Recipient:</span> {report.recipientName}
                    </p>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">Purpose:</span> {report.purpose}
                      </p>
                      <p className="text-xs font-semibold">{report.levelofwork}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDisbursed;