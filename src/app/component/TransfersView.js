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
    <div className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 text-[#123962]">All Transfer Requests</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading transfers...</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-600">No transfers found.</p>
        ) : (
          <div className="space-y-4">
            {/* Desktop List */}
            <div className="hidden sm:grid sm:gap-4">
              {reports.map((req) => (
                <div
                  key={req._id}
                  className="flex justify-between items-center p-4 border rounded-md shadow-sm bg-white"
                >
                  <div className="grid grid-cols-5 gap-4 w-full text-sm">
                    <p>{new Date(req.date).toLocaleDateString()}</p>
                    <p>{req.purpose}</p>
                    <p>From: {req.fromSite}</p>
                    <p>To: {req.toSite}</p>
                    <p>
                      Status: <span className="font-medium">{req.status}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleViewClick(req)}
                    className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
            {/* Mobile Card Layout */}
            <div className="sm:hidden space-y-4">
              {reports.map((req) => (
                <div
                  key={req._id}
                  className="bg-white p-4 rounded-md shadow-md border border-gray-200"
                >
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {new Date(req.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Purpose:</span> {req.purpose}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">From:</span> {req.fromSite}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">To:</span> {req.toSite}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span> {req.status}
                    </p>
                    <div className="text-right">
                      <button
                        onClick={() => handleViewClick(req)}
                        className="bg-[#123962] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0e2c4f] focus:outline-none focus:ring-2 focus:ring-[#123962]"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

              <h2 className="text-lg sm:text-xl font-bold mb-4 text-[#123962]">Transfer Details</h2>

              <div className="mb-4 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 text-sm">
                <div>
                  <p>
                    <span className="font-medium">Purpose:</span> {selectedRequest.purpose}
                  </p>
                  <p>
                    <span className="font-medium">From:</span> {selectedRequest.fromSite}
                  </p>
                  <p>
                    <span className="font-medium">To:</span> {selectedRequest.toSite}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium">Sent By:</span> {selectedRequest.name}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {selectedRequest.status}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span> {new Date(selectedRequest.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-semibold mt-4 mb-2">Materials</h3>
              {/* Desktop Materials Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
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
                    <div className="space-y-2 text-sm">
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
                {userRole === "storekeepers" && selectedRequest.status === "pending" && (
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