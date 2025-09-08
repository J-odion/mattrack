"use client";
import React, { useState, useEffect } from "react";
import { getMaterialRequest, reviewMaterialRequest } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Pagination from "./Pagination"; // Assuming correct file name

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

  const totalPages = Math.ceil(reports.length / ITEMS_PER_PAGE);
  const paginatedReports = reports.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-[#123962]">View All Engineers' Requests</h1>

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
              {/* Desktop List */}
              <div className="hidden sm:block">
                {paginatedReports.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 border-b rounded-md bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-6 gap-4 w-full text-base">
                      <p>{new Date(request.date).toLocaleDateString()}</p>
                      <p>{request.name}</p>
                      <p>{request.purpose}</p>
                      <p>{request.siteLocation}</p>
                      <p>
                        <span className="font-medium">{request.status}</span>
                      </p>
                      <p>{request.houseType} / {request.constructionNo}</p>
                    </div>
                    <button
                      onClick={() => handleViewClick(request)}
                      className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                    >
                      View Details
                    </button>
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
                    <div className="space-y-2 text-base">
                      <p>
                        <span className="font-medium">Date:</span> {new Date(request.date).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-medium">Name:</span> {request.name}
                      </p>
                      <p>
                        <span className="font-medium">Purpose:</span> {request.purpose}
                      </p>
                      <p>
                        <span className="font-medium">Site Location:</span> {request.siteLocation}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> {request.status}
                      </p>
                      <p>
                        <span className="font-medium">House Type / Construction No:</span>{" "}
                        {request.houseType} / {request.constructionNo}
                      </p>
                      <div className="text-right">
                        <button
                          onClick={() => handleViewClick(request)}
                          className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              {/* <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} /> */}
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
                  <p>
                    <span className="font-medium">Name:</span> {selectedRequest.name}
                  </p>
                  <p>
                    <span className="font-medium">Purpose:</span> {selectedRequest.purpose}
                  </p>
                  <p>
                    <span className="font-medium">House Type:</span> {selectedRequest.houseType}
                  </p>
                  <p>
                    <span className="font-medium">Construction No:</span> {selectedRequest.constructionNo}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Site Location:</span> {selectedRequest.siteLocation}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {selectedRequest.status}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {new Date(selectedRequest.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2">Materials</h3>
              {/* Desktop Materials Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-base">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="py-2 px-4 border-b">Material Name</th>
                      <th className="py-2 px-4 border-b">Quantity</th>
                      <th className="py-2 px-4 border-b">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.materials?.map((material, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="py-2 px-4">{material.materialName}</td>
                        <td className="py-2 px-4">{material.quantity}</td>
                        <td className="py-2 px-4">{material.unit}</td>
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