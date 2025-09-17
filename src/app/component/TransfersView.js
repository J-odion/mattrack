"use client";
import React, { useState, useEffect } from "react";
import { getMaterialRequest, reviewMaterialRequest } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Pagination from "./Pagination"; // Assuming correct file name
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const ViewRequest = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [currentOpenId, setCurrentOpenId] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getMaterialRequest();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  const userRole = user ? user.role : "guest";
  const userName = user ? user.name : "guest";

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleReviewAction = async (status) => {
    if (!selectedRequest || !selectedRequest._id) {
      console.error("Selected request or ID is undefined");
      return;
    }

    try {
      await reviewMaterialRequest(selectedRequest._id, { status, comment });
      setIsModalOpen(false);
      setComment("");
      loadReports();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    }
  };

  const getFormattedFileName = (request) => {
    const date = new Date(request.date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return `MatTrack-${request.name}-${request.houseType}-${request.constructionNo}-${date}`;
  };

  const exportToCSV = (request) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Name,Purpose,Site Location,Status,House Type,Construction No\n";
    csvContent += `${new Date(request.date).toLocaleDateString()},${request.name},${request.purpose},${request.siteLocation},${request.status},${request.houseType},${request.constructionNo}\n`;
    csvContent += "\nMaterials\n";
    csvContent += "Material Name,Quantity,Unit\n";
    request.materials.forEach((material) => {
      csvContent += `${material.materialName},${material.quantity},${material.unit}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${getFormattedFileName(request)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = (request) => {
    const doc = new jsPDF();
    let y = 10;
    doc.text("Material Request Information", 10, y);
    y += 10;
    doc.text(`Name: ${request.name}`, 10, y);
    y += 10;
    doc.text(`Purpose: ${request.purpose}`, 10, y);
    y += 10;
    doc.text(`House Type: ${request.houseType}`, 10, y);
    y += 10;
    doc.text(`Construction No: ${request.constructionNo}`, 10, y);
    y += 10;
    doc.text(`Site Location: ${request.siteLocation}`, 10, y);
    y += 10;
    doc.text(`Status: ${request.status}`, 10, y);
    y += 10;
    doc.text(`Date: ${new Date(request.date).toLocaleDateString()}`, 10, y);
    y += 20;
    doc.text("Materials:", 10, y);
    y += 10;
    request.materials.forEach((material, index) => {
      doc.text(`${index + 1}. ${material.materialName} - ${material.quantity} ${material.unit}`, 10, y);
      y += 10;
    });
    doc.save(`${getFormattedFileName(request)}.pdf`);
  };

  const exportAllToExcel = () => {
    const workbook = XLSX.utils.book_new();

    reports.forEach((request) => {
      // Create a worksheet for each request
      const wsData = [
        ["Date", "Name", "Purpose", "Site Location", "Status", "House Type", "Construction No"],
        [
          new Date(request.date).toLocaleDateString(),
          request.name,
          request.purpose,
          request.siteLocation,
          request.status,
          request.houseType,
          request.constructionNo,
        ],
        [], // Empty row for spacing
        ["Materials"],
        ["Material Name", "Quantity", "Unit"],
      ];

      // Add materials data
      request.materials.forEach((material) => {
        wsData.push([material.materialName, material.quantity, material.unit]);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Auto-size columns (approximation)
      const colWidths = [
        { wch: 15 }, // Date
        { wch: 20 }, // Name
        { wch: 30 }, // Purpose
        { wch: 25 }, // Site Location
        { wch: 15 }, // Status
        { wch: 15 }, // House Type
        { wch: 15 }, // Construction No
      ];
      ws['!cols'] = colWidths;

      // Use engineer's name for sheet name, ensuring it's valid and unique
      let sheetName = request.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31);
      let suffix = 1;
      let baseSheetName = sheetName;
      while (workbook.SheetNames.includes(sheetName)) {
        sheetName = `${baseSheetName}_${suffix}`;
        suffix++;
      }

      XLSX.utils.book_append_sheet(workbook, ws, sheetName);
    });

    // Generate and download the Excel file
    XLSX.writeFile(workbook, `MatTrack-AllRequests-Booklet-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportAllToPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    let page = 1;

    // Add title
    doc.text("Material Requests Booklet", 14, y);
    y += 20;
    doc.text(`Generated by: ${userName} on ${new Date().toLocaleDateString()}`, 14, y);
    y += 30;

    // Add page numbers footer
    const addPageNumber = () => {
      doc.text(`Page ${page}`, 180, 290);
    };
    addPageNumber();

    reports.forEach((request, requestIndex) => {
      // Check if new page needed for request header
      if (y > 250) {
        doc.addPage();
        page += 1;
        y = 20;
        addPageNumber();
      }

      // Request header
      const header = `${requestIndex + 1}. ${request.name} - ${new Date(request.date).toLocaleDateString()}`;
      doc.text(header, 14, y);
      y += 10;

      // Request details
      const details = [
        `Purpose: ${request.purpose}`,
        `House Type: ${request.houseType}`,
        `Construction No: ${request.constructionNo}`,
        `Site Location: ${request.siteLocation}`,
        `Status: ${request.status}`,
      ];
      details.forEach((detail) => {
        if (y > 250) {
          doc.addPage();
          page += 1;
          y = 20;
          addPageNumber();
        }
        doc.text(detail, 14, y);
        y += 8;
      });

      y += 5; // Small gap before materials

      // Materials section
      doc.text("Materials:", 14, y);
      y += 10;

      request.materials.forEach((material, matIndex) => {
        if (y > 250) {
          doc.addPage();
          page += 1;
          y = 20;
          addPageNumber();
        }
        const matText = `${matIndex + 1}. ${material.materialName}: ${material.quantity} ${material.unit}`;
        const splitText = doc.splitTextToSize(matText, 180);
        splitText.forEach((line) => {
          if (y > 250) {
            doc.addPage();
            page += 1;
            y = 20;
            addPageNumber();
          }
          doc.text(line, 14, y);
          y += 7;
        });
      });

      // Gap between requests
      y += 10;

      // Ensure new page for next request if near bottom
      if (y > 240 && requestIndex < reports.length - 1) {
        doc.addPage();
        page += 1;
        y = 20;
        addPageNumber();
      }
    });

    const bookletName = `MatTrack-AllRequests-Booklet-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(bookletName);
  };

  const handleDownloadClick = (id) => {
    setCurrentOpenId(currentOpenId === id ? null : id);
  };

  const handleFormatSelect = (format, request) => {
    if (format === "csv") {
      exportToCSV(request);
    } else if (format === "pdf") {
      exportToPDF(request);
    }
    setCurrentOpenId(null);
  };

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#123962]">View All Engineers' Requests</h1>

        {userRole === "admin" && !loading && !error && reports.length > 0 && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={exportAllToExcel}
              className="bg-[#123962] text-white px-6 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
            >
              Download All as Excel Booklet
            </button>
          </div>
        )}

        {loading && <p className="text-center text-gray-600">Loading requests...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && reports.length === 0 && (
          <p className="text-center text-gray-600">There are no requests available at this time.</p>
        )}

        {!loading && !error && reports.length > 0 && (
          <>
            <div className="mt-6 flex justify-center mb-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
            <div className="space-y-4">
              {userRole === "admin" && !loading && !error && reports.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={exportAllToPDF}
              className="bg-[#123962] text-white px-6 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
            >
              Download All as Booklet (PDF)
            </button>
          </div>
        )}
              {/* Desktop List */}
              <div className="hidden sm:block">
                {paginatedReports.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 border-b rounded-md bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-6 gap-4 w-full text-base">
                      <p className="text-xs">{new Date(request.date).toLocaleDateString()}</p>
                      <p className="text-xs">{request.name}</p>
                      <p className="text-xs">{request.purpose}</p>
                      <p className="text-xs">{request.siteLocation}</p>
                      <p className="text-xs">
                        <span className="font-medium">{request.status}</span>
                      </p>
                      <p className="text-xs">{request.houseType} / {request.constructionNo}</p>
                    </div>
                    <div className="flex gap-2 relative">
                      <button
                        onClick={() => handleViewClick(request)}
                        className="bg-[#123962] text-white px-[17px] py-[2px] h-8 rounded-md text-xs hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                      >
                        View
                      </button>
                      {userRole === "admin" && (
                        <>
                          <button
                            onClick={() => handleDownloadClick(request._id)}
                            className="bg-[#123962] text-white px-[6px] py-[2px] h-8 rounded-md text-xs hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          >
                            Download
                          </button>
                          {currentOpenId === request._id && (
                            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                              <button
                                onClick={() => handleFormatSelect("pdf", request)}
                                className="block w-full px-4 py-2 text-xs text-left hover:bg-gray-100"
                              >
                                PDF
                              </button>
                              <button
                                onClick={() => handleFormatSelect("csv", request)}
                                className="block w-full px-4 py-2 text-xs text-left hover:bg-gray-100"
                              >
                                CSV
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-4">
                {paginatedReports.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white p-4 rounded-md shadow-md border border-gray-200"
                  >
                    <div className="space-y-2">
                      <p className="text-xs">
                        <span className="font-medium">Date:</span> {new Date(request.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Name:</span> {request.name}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Purpose:</span> {request.purpose}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Site Location:</span> {request.siteLocation}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">Status:</span> {request.status}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium">House Type / Construction No:</span>{" "}
                        {request.houseType} / {request.constructionNo}
                      </p>
                      <div className="flex justify-end gap-2 relative">
                        <button
                          onClick={() => handleViewClick(request)}
                          className="bg-[#123962] text-white px-[6px] py-[4px] rounded-md text-[10px] hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        >
                          View Details
                        </button>
                        {userRole === "admin" && (
                          <>
                            <button
                              onClick={() => handleDownloadClick(request._id)}
                              className="bg-[#123962] text-white px-[6px] py-[2px] rounded-md text-[10px] hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                            >
                              Download
                            </button>
                            {currentOpenId === request._id && (
                              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                                <button
                                  onClick={() => handleFormatSelect("pdf", request)}
                                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                >
                                  PDF
                                </button>
                                <button
                                  onClick={() => handleFormatSelect("csv", request)}
                                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                >
                                  CSV
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
          </>
        )}

        {/* Modal */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#123962]">Material Request Information</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 text-base mb-4">
                <div>
                  <p className="text-xs font-medium">
                    <span>Name:</span> {selectedRequest.name}
                  </p>
                  <p className="text-xs font-medium">
                    <span>Purpose:</span> {selectedRequest.purpose}
                  </p>
                  <p className="text-xs font-medium">
                    <span>House Type:</span> {selectedRequest.houseType}
                  </p>
                  <p className="text-xs font-medium">
                    <span>Construction No:</span> {selectedRequest.constructionNo}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium">
                    <span>Site Location:</span> {selectedRequest.siteLocation}
                  </p>
                  <p className="text-xs font-medium">
                    <span>Status:</span> {selectedRequest.status}
                  </p>
                  <p className="text-xs font-medium">
                    <span>Date:</span> {new Date(selectedRequest.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">Materials</h3>
              {/* Desktop Materials Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-base">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-2 px-4 border-b text-xs">Material Name</th>
                      <th className="py-2 px-4 border-b text-xs">Quantity</th>
                      <th className="py-2 px-4 border-b text-xs">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.materials?.map((material, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 px-4 text-xs">{material.materialName}</td>
                        <td className="py-2 px-4 text-xs">{material.quantity}</td>
                        <td className="py-2 px-4 text-xs">{material.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Materials Card Layout */}
              <div className="sm:hidden space-y-4">
                {selectedRequest.materials?.map((material, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
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

              {(userRole === "admin" || userRole === "projectManager" || userRole === "projectEngineer") &&
                selectedRequest.status === "pending" ? (
                <div className="mt-4">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border border-gray-300 p-2 w-full rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#123962] mb-4"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReviewAction("approved")}
                      className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction("rejected")}
                      className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-base">
                  <span className="font-medium">Admin/PM Comment:</span>{" "}
                  {selectedRequest.comments || "No comment yet"}
                </p>
              )}

              {userRole === "storekeepers" && (
                <button
                  className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962] mt-4"
                >
                  Disburse
                </button>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequest;