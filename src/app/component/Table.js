'use client';
import React, { useState } from 'react';


const DynamicTable = () => {
  const [reports, setReports] = useState([]);

  const addReport = (newReport) => {
    setReports([...reports, newReport]);
  };

  return (
    <div className="container mx-auto p-4">
      <table className="min-w-full border border-gray-300">
        <thead>
        <tr>
          <th className="py-2 px-4 border-b">Date</th>
          <th className="py-2 px-4 border-b">Material Name</th>
          <th className="py-2 px-4 border-b">Category</th>
          <th className="py-2 px-4 border-b">Quantity</th>
          <th className="py-2 px-4 border-b">Unit</th>
          <th className="py-2 px-4 border-b">Site Location</th>
          <th className="py-2 px-4 border-b">Management</th>
          <th className="py-2 px-4 border-b">House Type</th>
          <th className="py-2 px-4 border-b">Purpose</th>
        </tr>
        </thead>
        <tbody>
          {reports.map((report, index) => (
            <tr key={index}>
            <td className="py-2 px-4 border-b">{report.date}</td>
            <td className="py-2 px-4 border-b">{report.materialName}</td>
            <td className="py-2 px-4 border-b">{report.materialCategory}</td>
            <td className="py-2 px-4 border-b">{report.quantity}</td>
            <td className="py-2 px-4 border-b">{report.unit}</td>
            <td className="py-2 px-4 border-b">{report.materialManagement}</td>
            <td className="py-2 px-4 border-b">{report.siteLocation}</td>
            <td className="py-2 px-4 border-b">{report.houseType}</td>
            <td className="py-2 px-4 border-b">{report.purpose}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
