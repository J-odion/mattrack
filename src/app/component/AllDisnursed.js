"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fetchDisbursedData } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import Pagination from "./Pagination"; // Corrected import
import jsPDF from "jspdf";

const ITEMS_PER_PAGE = 50; // Increased

const AllDisbursed = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
      filtered = filtered.filter(report => {
        const combined = `${report.purpose} | ${report.levelofwork}`;
        return combined === purpose;
      });
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
    setCurrentPage(1);
  }, [searchQuery, siteLocation, purpose, material, recipientName, houseType, constructionNumber, startDate, endDate, reports]);

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

  // Download Handling
  const getFormattedFileName = () => {
    const date = new Date().toISOString().split('T')[0]; // Current date as YYYY-MM-DD
    return `MatTrack-AllDisbursed-${date}`;
  };

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Site Location,House Type,Construction No,Material Name,Quantity,Unit,Recipient,Purpose,Level of Work\n";
    sortedReports.forEach((report) => {
      csvContent += `${new Date(report.date).toLocaleDateString()},${report.siteLocation || ""},${report.houseType || ""},${report.constructionNumber || "N/A"},${report.materialName || ""},${report.quantity || ""},${report.unit || ""},${report.recipientName || ""},${report.purpose || ""},${report.levelofwork || ""}\n`;
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
    doc.text("All Disbursed Materials", 10, y);
    y += 10;
    sortedReports.forEach((report, index) => {
      if (y > 280) { // Start new page if near bottom
        doc.addPage();
        y = 10;
      }
      doc.text(`Record ${index + 1}`, 10, y);
      y += 10;
      doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 10, y);
      y += 10;
      doc.text(`Site Location: ${report.siteLocation || "N/A"}`, 10, y);
      y += 10;
      doc.text(`House Type: ${report.houseType || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Construction No: ${report.constructionNumber || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Material Name: ${report.materialName || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Quantity: ${report.quantity || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Unit: ${report.unit || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Recipient: ${report.recipientName || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Purpose: ${report.purpose || "N/A"}`, 10, y);
      y += 10;
      doc.text(`Level of Work: ${report.levelofwork || "N/A"}`, 10, y);
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
          <select
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          >
            <option value="">Filter by Purpose / Level of Work</option>
            {[...new Set(reports.map(report => `${report.purpose} | ${report.levelofwork}`))]
              .map((combo, idx) => (
                <option key={idx} value={combo}>{combo}</option>
              ))}
          </select>
          <select
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="">Filter by Material</option>
            {[...new Set(reports.flatMap(report => report.materialName))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>
          <select
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          >
            <option value="">Filter by Recipient</option>
            {[...new Set(reports.flatMap(report => report.recipientName))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>
          <select
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={houseType}
            onChange={(e) => sethouseType(e.target.value)}
          >
            <option value="">Filter by House Types</option>
            {[...new Set(reports.flatMap(report => report.houseType))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>
          <select
            className="border text-base px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#123962]"
            value={constructionNumber}
            onChange={(e) => setconstructionNumber(e.target.value)}
          >
            <option value="">Filter by Construction Number</option>
            {[...new Set(reports.flatMap(report => report.constructionNumber))].map((mat, idx) => (
              <option key={idx} value={mat}>{mat}</option>
            ))}
          </select>

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
                          <p className="text-base">{report.purpose}</p>
                          <p className="text-sm font-semibold">{report.levelofwork}</p>
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
                    <p className="text-base font-semibold">
                      {new Date(report.date).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="text-[#123962]"
                    >
                      {sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />}
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 text-base">
                    <p>
                      <span className="font-medium">Site Location:</span> {report.siteLocation}
                    </p>
                    <p>
                      <span className="font-medium">House Type:</span> {report.houseType}
                    </p>
                    <p>
                      <span className="font-medium">Construction No.:</span>{" "}
                      {report.constructionNumber || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Material:</span> {report.materialName}
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span> {report.quantity}
                    </p>
                    <p>
                      <span className="font-medium">Unit:</span> {report.unit}
                    </p>
                    <p>
                      <span className="font-medium">Recipient:</span> {report.recipientName}
                    </p>
                    <div>
                      <p>
                        <span className="font-medium">Purpose:</span> {report.purpose}
                      </p>
                      <p className="text-sm font-semibold">{report.levelofwork}</p>
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