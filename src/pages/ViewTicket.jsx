import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faDownload } from "@fortawesome/free-solid-svg-icons";

const mockData = [
  { name: "Name 1", ticketId: "0000001", type: "Query", status: "Pending" },
  { name: "Name 2", ticketId: "0000002", type: "Query", status: "Resolved" },
  { name: "Name 3", ticketId: "0000003", type: "Query", status: "Resolved" },
  { name: "Name 4", ticketId: "0000004", type: "Query", status: "Pending" },
  { name: "Name 5", ticketId: "0000005", type: "Query", status: "Resolved" },
];

export default function ViewTicket() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTickets(mockData);
  }, []);

  const getStatusColor = (status) =>
    status === "Resolved" ? "text-green-600" : "text-red-500";

  const filteredTickets = tickets.filter((t) =>
    t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved").length;

  return (
    <div className="p-4 sm:p-6 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Tickets</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[{ label: "Total Tickets", value: totalTickets }, { label: "Tickets Resolved", value: resolvedTickets }].map(
          (item, i) => (
            <div key={i} className="card-bg rounded-xl p-6 sm:p-8 shadow relative w-full min-h-[220px]">
              <div className="absolute top-5 left-5 bg-white p-3 rounded-md">
                <FontAwesomeIcon icon={faChartBar} className="text-cyan-700 text-2xl" />
              </div>
              <div className="flex flex-col justify-end h-full pt-12 mt-4">
                <div className="text-gray-700 text-lg mb-1">{item.label}</div>
                <div className="text-4xl font-bold text-black">{item.value}</div>
              </div>
              <div className="absolute bottom-5 right-5">
                <span className="inline-flex items-center text-sm bg-white text-black px-4 py-2 rounded-full border border-black">
                  ↑ 20% More
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Search and Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-medium mb-1">Tickets ( {totalTickets} )</h2>
          <p className="text-sm text-gray-500">View list of Complaints Below</p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-cyan-500 rounded-md w-full focus:outline-none focus:ring focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow p-4 text-black overflow-x-auto">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="text-black">
            <tr>
              <th className="py-2 pr-4">Complainant's Name</th>
              <th className="py-2 pr-4">Ticket ID</th>
              <th className="py-2 pr-4">Nature of Ticket</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t, idx) => (
              <tr key={idx} className="hover:bg-cyan-100">
                <td className="py-2 pr-4">{t.name}</td>
                <td className="py-2 pr-4">{t.ticketId}</td>
                <td className="py-2 pr-4">{t.type}</td>
                <td className={`py-2 pr-4 font-semibold ${getStatusColor(t.status)}`}>{t.status}</td>
                <td className="py-2 pr-4">
                  <button className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 flex items-center gap-2">
                    <FontAwesomeIcon icon={faDownload} /> Download
                  </button>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No tickets match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <span>
            Showing data 1 to {filteredTickets.length} of {totalTickets} entries
          </span>
          <div className="flex flex-wrap gap-1">
            {[1, 2, 3, 4, "...", 40].map((p, i) => (
              <button key={i} className="w-7 h-7 rounded bg-gray-200 text-gray-800 text-center">
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
