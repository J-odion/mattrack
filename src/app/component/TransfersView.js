"use client";
import React, { useState, useEffect } from "react";
import { getMaterialRequest, reviewMaterialRequest } from "../utils/Apis";
import { loadUser } from "../libs/features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";


const TransferView = () => {
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
        <p className="font-bold text-2xl mb-6">View All Transfer Requests</p>
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
                <p className="text-sm font-medium">{request.houseType}</p>
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
        <div className="w-[40%] h-[40%] z-50 mx-auto p-6  absolute  bg-opacity flex items-center justify-center">
          <div className="bg-white p-6 overflow-scroll h-full  rounded-md shadow-slate-400 shadow-md w-full">
            <div className="w-full mb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold ">Material Request Information</h2>
              <button
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes size={20} fontWeight={400} />
              </button>
            </div>

            <div>
              <div className="flex gap-4 items-center py-2 px-4 justify-between">
                <div className="flex w-full justify-between gap-4">
                  <div>
                    <p className="text-sm ">{selectedRequest.purpose}</p>
                    <p className="text-sm ">Name: {selectedRequest.name}</p>
                  </div>
                  <div>
                    <p className="text-sm ">House Type: {selectedRequest.houseType}</p>
                    <p className="text-sm ">Status: {selectedRequest.status}</p>
                  </div>
                </div>
              </div>

              <table className="w-full h-[60%] border-collapse border-b border-b-gray-200">
                <thead>
                  <tr className="bg-gray-100 font-normal text-left">
                    <th className="py-2 px-4 border">Material Name</th>
                    <th className="py-2 px-4 border">Quantity</th>
                    <th className="py-2 px-4 border">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRequest.materials && selectedRequest.materials.map((material, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border">{material.materialName}</td>
                      <td className="py-2 px-4 border">{material.quantity}</td>
                      <td className="py-2 px-4 border">{material.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userRole  === "storekeeper" && (
              <>
                
                <button className="bg-blue-600 text-white p-2 rounded mt-4">
                  Accept Transfer
                </button>
              </>
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

export default TransferView;
