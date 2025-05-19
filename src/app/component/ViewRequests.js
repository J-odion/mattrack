"use client";
import React, { useState, useEffect } from "react";
import { getMaterialRequest, reviewMaterialRequest } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";


const ViewRequest = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await getMaterialRequest();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [user, dispatch]);

  // Fallback role if user is null
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
      console.log("Submitting review for ID:", selectedRequest._id); // Debugging log
      await reviewMaterialRequest(selectedRequest._id, { status, comment });
      setIsModalOpen(false);
      setComment(""); // Reset comment
      // Optionally refresh the list
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };


  return (
    <div className="container mx-auto p-4">
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <p>There are no requests available at this time.</p>
      )}

      <div className="w-[90%]">
        <p className="font-bold text-2xl mb-6">View All Engineers' Requests</p>
        <section className="flex flex-col gap-4">
          {reports.map((request) => (
            <div
              key={request._id}
              className="flex gap-4 w-full items-center border-b rounded-md py-2 px-4 justify-between"
            >
              <div className="w-[80%] grid grid-cols-6 align-middle justify-center items-center">
                <p className="text-sm font-medium">{new Date(request.date).toLocaleDateString()}</p>
                <p className="text-sm font-medium">{request.name}</p>
                <p className="text-sm font-medium">{request.purpose}</p>
                <p className="text-sm font-medium">{request.siteLocation}</p>
                <p className="text-sm font-medium">{request.status}</p>
                <p className="text-sm font-medium">{request.houseType} / {request.constructionNo}</p>
              </div>

              <button
                onClick={() => handleViewClick(request)}
                className="bg-blue-950 text-white py-2 px-4 rounded-full"
              >
                View details
              </button>
            </div>
          ))}
        </section>
      </div>

      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Material Request Information</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p><strong>Name:</strong> {selectedRequest.name}</p>
                <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
                <p><strong>House Type:</strong> {selectedRequest.houseType}</p>
                <p><strong>Construction No:</strong> {selectedRequest.constructionNo}</p>
              </div>
              <div>
                <p><strong>Site Location:</strong> {selectedRequest.siteLocation}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}</p>
              </div>
            </div>

            <table className="w-full border border-gray-200 mb-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border">Material Name</th>
                  <th className="py-2 px-4 border">Quantity</th>
                  <th className="py-2 px-4 border">Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.materials?.map((material, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{material.materialName}</td>
                    <td className="py-2 px-4 border">{material.quantity}</td>
                    <td className="py-2 px-4 border">{material.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>


            {userRole === "admin" || userRole === "projectManager" || userRole === "projectEngineer" ? (
              selectedRequest.status === "pending" ? (
                <>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border p-2 w-full mb-4"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReviewAction("approved")}
                      className="bg-green-600 text-white p-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewAction("rejected")}
                      className="bg-red-600 text-white p-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </>
              ) : (
                <p className="mt-4"><strong>Admin/PM Comment:</strong> {selectedRequest.comments || "No comment yet"}</p>
              )
            ) : userRole === "storekeeper" ? (
              <>
                <p className="mt-4"><strong>Admin/PM Comment:</strong> {selectedRequest.comments || "No comment yet"}</p>
                <button className="bg-blue-600 text-white p-2 rounded mt-4">
                  Disburse
                </button>
              </>
            ) : (
              <p className="mt-4"><strong>Admin/PM Comment:</strong> {selectedRequest.comments || "No comment yet"}</p>
            )}

            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewRequest;
