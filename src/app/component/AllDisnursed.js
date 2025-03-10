"use client";
import React, { useState, useEffect } from "react";
import { fetchDisbursedData } from "../utils/Apis";

const AllDisbursed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports using the utility function
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchDisbursedData();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <div className="container mx-auto p-4">
      {loading && <p>Fetching All Disbursed data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 font-normal text-left">
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Date</th> {/* { 1 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Material Name</th>{/* { 2 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Quantity</th>{/* { 4 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Unit</th>{/* { 5 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Recipient Name</th>{/* { 7 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Site Location</th>{/* { 6 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">House Type / Number</th>{/* { 8 } */}
              <th className="py-2 font-normal text-left text-[12px] px-4 border-b">Purpose</th>{/* { 9 } */}
            </tr>
          </thead>
          <tbody>
            {reports.map((report, index) => (
              <tr key={index}>
                <td className="py-2 px-4 text-[12px] border-b"> 
                  {new Date(report.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })} </td>{/* { 1 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.material || report.materialName}</td>{/* { 2 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.quantity}</td>{/* { 4 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.unit}</td>{/* { 5 } */}
                  <td className="py-2 px-4 text-[12px] border-b">
                    {report.recipientName}
                  </td>{/* { 6 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.siteLocation}</td>{/* { 7 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.houseType}{ report.houseNumber}</td>{/* { 8 } */}
                  <td className="py-2 px-4 text-[12px] border-b">{report.purpose}</td>{/* { 9 } */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllDisbursed;
