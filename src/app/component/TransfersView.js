"use client";
import React, { useState, useEffect } from "react";
import { getTransfer, recieveMat } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Pagination from "./Pagination"; // Assuming correct file name
import jsPDF from "jspdf";

const TransferView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;
  const [currentOpenId, setCurrentOpenId] = useState(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await getTransfer();
      setReports(data);
    } catch (err) {
      console.error("Error fetching transfers:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    if (!user) dispatch(loadUser());
  }, [user, dispatch]);

  const userRole = user?.role || "guest";
  const userName = user?.name || "guest";

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleAccept = async () => {
    if (!selectedRequest) {
      console.error("No selected transfer request found.");
      return;
    }

    try {
      await recieveMat({ transferId: selectedRequest._id, approvedBy: userName });
      setIsModalOpen(false);
      loadReports();
    } catch (err) {
      console.error("Error accepting transfer:", err.message);
    }
  };

  const getFormattedFileName = (request) => {
    const date = new Date(request.date).toISOString().split('T')[0]; // Format date as YYYY-MM-DD
    return `MtkRe-${request.createdBy}-${request.fromSite}-${request.toSite}-${date}`;
  };

  const exportToCSV = (request) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date,Purpose,From Site,To Site,Status,Created By,Approved By\n";
    csvContent += `${new Date(request.date).toLocaleDateString()},${request.purpose},${request.fromSite},${request.toSite},${request.status},${request.createdBy},${request.approvedBy || "Not yet approved"}\n`;
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
    doc.text("Transfer Request Information", 10, y);
    y += 10;
    doc.text(`Purpose: ${request.purpose}`, 10, y);
    y += 10;
    doc.text(`From Site: ${request.fromSite}`, 10, y);
    y += 10;
    doc.text(`To Site: ${request.toSite}`, 10, y);
    y += 10;
    doc.text(`Created By: ${request.createdBy}`, 10, y);
    y += 10;
    doc.text(`Approved By: ${request.approvedBy || "Not yet approved"}`, 10, y);
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
        <h1 className="text-2xl font-bold mb-6 text-[#123962]">All Transfer Requests</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading transfers...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-600">No transfers found.</p>
        ) : (
          <>
            <div className="mt-6 flex justify-center mb-4">
              <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
            </div>
            <div className="space-y-4">
              {/* Desktop List */}
              <div className="hidden sm:grid sm:gap-4">
                {paginatedReports.map((req) => (console.log("transferdata", req),
                  <div
                    key={req._id}
                    className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white"
                  >
                    <div className="grid grid-cols-5 gap-4 w-full text-base">
                      <p>{new Date(req.date).toLocaleDateString()}</p>
                      <p>From: {req.fromSite}</p>
                      <p>To: {req.toSite}</p>
                      <p>
                        Status: <span className="font-medium">{req.status}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 relative">
                      <button
                        onClick={() => handleViewClick(req)}
                        className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                      >
                        View
                      </button>

                      {userRole === "admin" && (
                        <>
                          <button
                            onClick={() => handleDownloadClick(req._id)}
                            className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                          >
                            Download
                          </button>
                          {currentOpenId === req._id && (
                            <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                              <button
                                onClick={() => handleFormatSelect("pdf", req)}
                                className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                              >
                                PDF
                              </button>
                              <button
                                onClick={() => handleFormatSelect("csv", req)}
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
                ))}
              </div>
              {/* Mobile Card Layout */}
              <div className="sm:hidden space-y-4">
                {paginatedReports.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white p-4 rounded-md shadow-md border border-gray-200"
                  >
                    <div className="space-y-2 text-base">
                      <p>
                        <span className="font-medium">Date:</span> {new Date(req.date).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">From:</span> {req.fromSite}
                      </p>
                      <p>
                        <span className="font-medium">To:</span> {req.toSite}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> {req.status}
                      </p>
                      <div className="flex justify-end gap-2 relative">
                        <button
                          onClick={() => handleViewClick(req)}
                          className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        >
                          View
                        </button>
                        {userRole === "admin" && (
                          <>
                            <button
                              onClick={() => handleDownloadClick(req._id)}
                              className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                            >
                              Download
                            </button>
                            {currentOpenId === req._id && (
                              <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-md border border-gray-200 z-10">
                                <button
                                  onClick={() => handleFormatSelect("pdf", req)}
                                  className="block w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                                >
                                  PDF
                                </button>
                                <button
                                  onClick={() => handleFormatSelect("csv", req)}
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

        {/* MODAL */}
        {isModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 shadow-lg">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="text-xl font-bold mb-4 text-[#123962]">Transfer Details</h2>

              <div className="mb-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 text-base">
                <div>
                  <p>
                    <span className="font-medium">From:</span> {selectedRequest.fromSite}
                  </p>
                  <p>
                    <span className="font-medium">To:</span> {selectedRequest.toSite}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Sent By:</span> {selectedRequest.createdBy}
                  </p>
                  <p>
                    <span className="font-medium">Received By:</span> {selectedRequest.approvedBy || "Not yet approved"}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {selectedRequest.status}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {new Date(selectedRequest.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4 mb-2">Materials</h3>
              {/* Desktop Materials Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-base">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-2 border-b">Material Name</th>
                      <th className="px-4 py-2 border-b">Quantity</th>
                      <th className="px-4 py-2 border-b">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.materials?.map((mat, i) => (
                      <tr key={i} className="border-b border-gray-200">
                        <td className="px-4 py-2">{mat.materialName}</td>
                        <td className="px-4 py-2">{mat.quantity}</td>
                        <td className="px-4 py-2">{mat.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Materials Card Layout */}
              <div className="sm:hidden space-y-4">
                {selectedRequest.materials?.map((mat, i) => (
                  <div key={i} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
                    <div className="space-y-2 text-base">
                      <p>
                        <span className="font-medium">Material Name:</span> {mat.materialName}
                      </p>
                      <p>
                        <span className="font-medium">Quantity:</span> {mat.quantity}
                      </p>
                      <p>
                        <span className="font-medium">Unit:</span> {mat.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                {(userRole === "storekeepers" || userRole === "admin") && selectedRequest.status === "pending" && (
                  <button
                    onClick={handleAccept}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Accept Transfer
                  </button>
                )}
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

export default TransferView;