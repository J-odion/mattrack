"use client";
import React, { useState, useEffect } from "react";
import { getTransfer, recieveMat } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";

const TransferView = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
  

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">All Transfer Requests</h1>
      {loading ? (
        <p>Loading transfers...</p>
      ) : reports.length === 0 ? (
        <p>No transfers found.</p>
      ) : (
        <div className="grid gap-4">
          {reports.map((req) => (
            <div
              key={req._id}
              className="flex justify-between items-center p-4 border rounded shadow-sm bg-white"
            >
              <div className="grid grid-cols-5 gap-4 w-[80%] text-sm">
                <p>{new Date(req.date).toLocaleDateString()}</p>
                <p>{req.purpose}</p>
                <p>From: {req.fromSite}</p>
                <p>To: {req.toSite}</p>
                <p>Status: <span className="font-medium">{req.status}</span></p>
              </div>
              <button
                onClick={() => handleViewClick(req)}
                className="bg-blue-950 text-white px-4 py-2 rounded"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          {console.log("Selected request:", selectedRequest)}
          <div className="bg-white rounded-lg w-full max-w-2xl shadow-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Transfer Details</h2>

            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>
                <p><strong>From:</strong> {selectedRequest.fromSite}</p>
                <p><strong>To:</strong> {selectedRequest.toSite}</p>
              </div>
              <div>
                <p><strong>Sent By:</strong> {selectedRequest.name}</p>
                <p><strong>Status:</strong> {selectedRequest.status}</p>
                <p><strong>Date:</strong> {new Date(selectedRequest.date).toLocaleDateString()}</p>
              </div>
            </div>

            <h3 className="text-md font-semibold mt-4 mb-2">Materials</h3>
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Material Name</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Unit</th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.materials?.map((mat, i) => (
                  <tr key={i} className="text-center">
                    <td className="px-4 py-2 border">{mat.materialName}</td>
                    <td className="px-4 py-2 border">{mat.quantity}</td>
                    <td className="px-4 py-2 border">{mat.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {userRole === "storekeepers" && selectedRequest.status === "pending" && (
              <button
                onClick={handleAccept}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept Transfer
              </button>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferView;
