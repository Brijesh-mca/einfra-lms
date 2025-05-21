import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ViewTicket() {
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);
  const [resolvedTickets, setResolvedTickets] = useState(0);
  const [totalTicketsGrowth, setTotalTicketsGrowth] = useState(null);
  const [resolvedTicketsGrowth, setResolvedTicketsGrowth] = useState(null);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadError, setDownloadError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const axiosInstance = axios.create({
          baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const today = new Date("2025-05-21");
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        const formatDate = (date) => date.toISOString().split("T")[0];

        const currentResponse = await axiosInstance.get(
          `/tickets?page=${page}&limit=${limit}&startDate=${formatDate(currentMonthStart)}&endDate=${formatDate(today)}`
        );
        const currentData = currentResponse.data;

        // Map tickets, using ticket._id for both download and display
        const mappedTickets = currentData.data.map((ticket) => ({
          ticketId: ticket._id, // Use ticket._id for download and display
          name: `${ticket.user.firstName} ${ticket.user.lastName}`,
          category: ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1),
          status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
          _id: ticket._id,
        }));

        const currentTotal = currentData.total || mappedTickets.length;
        const currentResolved = mappedTickets.filter((t) => t.status.toLowerCase() === "resolved").length;

        const previousResponse = await axiosInstance.get(
          `/tickets?startDate=${formatDate(previousMonthStart)}&endDate=${formatDate(previousMonthEnd)}`
        );
        const previousData = previousResponse.data;

        const previousTotal = previousData.data.length;
        const previousResolved = previousData.data.filter(
          (t) => t.status.toLowerCase() === "resolved"
        ).length;

        const calculateGrowth = (current, previous) => {
          if (previous === 0) return "N/A";
          const change = ((current - previous) / previous) * 100;
          return change.toFixed(1);
        };

        setTickets(mappedTickets);
        setTotalTickets(currentTotal);
        setResolvedTickets(currentResolved);
        setTotalTicketsGrowth(calculateGrowth(currentTotal, previousTotal));
        setResolvedTicketsGrowth(calculateGrowth(currentResolved, previousResolved));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        const errorMessage =
          error.response?.data?.message ||
          (error.response?.status === 401
            ? "Unauthorized: Please check your token or log in again."
            : "Failed to fetch tickets. Please try again later.");
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (token) {
      fetchTickets();
    } else {
      setError("No authentication token found. Please log in.");
      setLoading(false);
    }
  }, [token, page, limit]);

  const handleDownload = async (ticketId) => {
    try {
      setDownloadError(null);
      const axiosInstance = axios.create({
        baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      });

      const response = await axiosInstance.get(`/tickets/${ticketId}/download`);
      const contentType = response.headers["content-type"];
      const extension = contentType.includes("pdf") ? "pdf" : "json";
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${ticketId}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      const errorMessage =
        error.response?.status === 401
          ? "Unauthorized: Please check your token or log in again."
          : "Failed to download ticket. Please try again later.";
      setDownloadError(errorMessage);
    }
  };

  const getStatusColor = (status) =>
    status.toLowerCase() === "resolved"
      ? "bg-green-100 border-green-500 text-green-700"
      : "bg-red-100 border-red-500 text-red-700";

  const getGrowthColor = (growth) =>
    growth === "N/A" || growth == 0
      ? "bg-gray-100 text-gray-700 border-gray-500"
      : growth > 0
      ? "bg-green-100 text-green-700 border-green-500"
      : "bg-red-100 text-red-700 border-red-500";

  const getGrowthText = (growth) =>
    growth === "N/A"
      ? "N/A"
      : growth == 0
      ? "No Change"
      : growth > 0
      ? `↑ ${growth}% More`
      : `↓ ${Math.abs(growth)}% Less`;

  const filteredTickets = tickets.filter(
    (t) =>
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) || // Use ticketId for search
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    const totalPages = Math.ceil(totalTickets / limit);
    const pages = [];
    const maxPagesToShow = 4;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-7 h-7 rounded text-sm ${
            i === page
              ? "bg-cyan-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      pages.push(<span key="ellipsis" className="px-2">...</span>);
      pages.push(
        <button
          key={totalPages}
          onClick={() => setPage(totalPages)}
          className="w-7 h-7 rounded text-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return <div className="p-4 sm:p-6 text-gray-800">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 sm:p-6 text-gray-800 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Tickets</h1>

      {downloadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {downloadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { label: "Total Tickets", value: totalTickets, growth: totalTicketsGrowth },
          { label: "Tickets Resolved", value: resolvedTickets, growth: resolvedTicketsGrowth },
        ].map((item, i) => (
          <div
            key={i}
            className="card-bg rounded-xl p-6 sm:p-8 shadow relative w-full min-h-[220px]"
          >
            <div className="absolute top-5 left-5 bg-white p-3 rounded-md">
              <FontAwesomeIcon
                icon={faChartBar}
                className="text-cyan-700 text-2xl"
              />
            </div>
            <div className="flex flex-col justify-end h-full pt-12 mt-4">
              <div className="text-gray-700 text-lg mb-1">{item.label}</div>
              <div className="text-4xl font-bold text-black">{item.value}</div>
            </div>
            <div className="absolute bottom-5 right-5">
              <span
                className={`inline-flex items-center text-sm px-4 py-2 rounded-full border ${getGrowthColor(
                  item.growth
                )}`}
              >
                {getGrowthText(item.growth)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-medium mb-1">
            Tickets ( {totalTickets} )
          </h2>
          <p className="text-sm text-gray-500">View list of Complaints Below</p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by name, ID, category, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-cyan-500 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      <div className="md:hidden grid gap-4 mb-4">
        {filteredTickets.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium text-gray-800">{t.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded border ${getStatusColor(
                  t.status
                )}`}
              >
                {t.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Ticket ID:</span> {t.ticketId}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Nature of Ticket:</span> {t.category}
            </p>
            <div className="mt-2">
              <button
                onClick={() => handleDownload(t.ticketId)}
                className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faDownload} /> Download
              </button>
            </div>
          </div>
        ))}
        {filteredTickets.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No tickets match your search.
          </div>
        )}
      </div>

      <div className="hidden md:block bg-white rounded shadow p-4 text-black overflow-x-auto">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="text-black">
            <tr>
              <th className="py-2 px-4">Complainant's Name</th>
              <th className="py-2 px-4">Ticket ID</th>
              <th className="py-2 px-4">Nature of Ticket</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((t) => (
              <tr key={t._id} className="hover:bg-cyan-100">
                <td className="py-2 px-4">{t.name}</td>
                <td className="py-2 px-4">{t.ticketId}</td> {/* Display ticketId */}
                <td className="py-2 px-4">{t.category}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 text-xs rounded border ${getStatusColor(
                      t.status
                    )}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDownload(t.ticketId)}
                    className="border border-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
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
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <span>
          Showing data {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalTickets)} of {totalTickets} entries
        </span>
        <div className="flex flex-wrap gap-1">{renderPagination()}</div>
      </div>
    </div>
  );
}