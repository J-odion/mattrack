"use client";
import React, { useState, useEffect } from "react";
import { getMaterialRequest, reviewMaterialRequest } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";


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
              className="flex gap-4 items-center border rounded-md py-2 px-4 justify-between"
            >
              <div className="flex gap-4">
                <p>{request.name}</p>
                <p>{request.purpose}</p>
                <p>{request.siteLocation}</p>
                <p>{request.houseType}</p>
              </div>

              <button
                onClick={() => handleViewClick(request)}
                className="bg-blue-950 text-white p-2 rounded-md"
              >
                View
              </button>
            </div>
          ))}
        </section>
      </div>

      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-[400px]">
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            <p><strong>Engineer:</strong> {selectedRequest.name}</p>
            <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
            <p><strong>Site:</strong> {selectedRequest.siteLocation}</p>
            <p><strong>House Type:</strong> {selectedRequest.houseType}</p>
            <p><strong>Status:</strong> <span className="text-lg uppercase ">{selectedRequest.status}</span></p>

            <div>
              {reports.map((material, index) => (
                <div key={index}>
                  <p>{material.materialCategory}</p>
                  <p>{material.materialName}</p>
                  <p>{material.quantity}</p>
                  <p>{material.materialCategory}</p>
                </div>
              ))}
            </div>

            {userRole === "admin" || userRole === "projectmanager" ? (
              selectedRequest?.status === "pending" ? (
                <>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="border p-2 w-full mt-4"
                  />
                  <div className="flex gap-2 mt-4">
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


            {/* Close button always available for all users */}
            <div className="mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white p-2 rounded"
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
