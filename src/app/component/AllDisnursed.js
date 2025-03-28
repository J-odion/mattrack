"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDisbursedData } from "../utils/Apis";
import { FaSortDown, FaSortUp } from "react-icons/fa";

const ITEMS_PER_PAGE = 14; // Items per page

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
      filtered = filtered.filter(report => report.materialName === material
      );
    }

    if (recipientName) {
      filtered = filtered.filter(report => report.recipientName === recipientName
      );
    }

    if (houseType) {
      filtered = filtered.filter(report => report.houseType === houseType
      );
    }

    
    if (constructionNumber) {
      filtered = filtered.filter(report => report.constructionNumber === constructionNumber
      );
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
    <div className="container mx-auto p-4">
      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by Site Location..."
          className="border text-2xs px-3 py rounded w-1/4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border text-2xs px-3 py rounded w-1/4"
          value={siteLocation}
          onChange={(e) => setSiteLocation(e.target.value)}
        >
          <option value="">Filter by Site Location</option>
          {(Array.isArray(reports) ? [...new Set(reports.map(report => report.siteLocation))] : []).map((loc, idx) => (
            <option key={idx} value={loc}>{loc}</option>
          ))}
        </select>

        {/* Date Pickers */}
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
          {[...new Set(reports.flatMap(report => report.materialName))].map((mat, idx) => (
            <option key={idx} value={mat}>{mat}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        >
          <option value="">Filter by Recipient</option>
          {[...new Set(reports.flatMap(report => report.recipientName))].map((mat, idx) => (
            <option key={idx} value={mat}>{mat}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
          value={houseType}
          onChange={(e) => sethouseType(e.target.value)}
        >
          <option value="">Filter by House Types</option>
          {[...new Set(reports.flatMap(report => report.houseType))].map((mat, idx) => (
            <option key={idx} value={mat}>{mat}</option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded w-1/4"
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
            sethouseType("")
            setconstructionNumber("")
          }}
          className="px-4 py-2 border rounded bg-red-500 text-white hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {loading && <p>Fetching All Disbursed data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          <table className="min-w-full h-[60%] border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border">Date
                  <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                  </button>
                </th>
                <th className="py-2 px-4 border">Site Location</th>
                <th className="py-2 px-4 border">House Type</th>
                <th className="py-2 px-4 border">Construction No.</th>
                <th className="py-2 px-4 border">Material Name</th>
                <th className="py-2 px-4 border">Quantity</th>
                <th className="py-2 px-4 border">Unit</th>
                <th className="py-2 px-4 border">Recipient</th>
                <th className="py-2 px-4 border">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((report, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2 px-4">{new Date(report.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{report.siteLocation}</td>
                  <td className="py-2 px-4">{report.houseType}</td>
                  <td className="py-2 px-4">{report.constructionNumber || "N/A"}</td>
                  <td className="py-2 px-4">{report.materialName}</td>
                  {/* <td className="py-2 px-4">{(report.materials || []).map(m => m.materialName).join(", ")}</td> */}
                  <td className="py-2 px-4">{report.quantity}</td>
                  <td className="py-2 px-4">{report.unit}</td>
                  <td className="py-2 px-4">{report.recipientName}</td>
                  <td className="py-2 px-4">{report.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>


          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllDisbursed;
