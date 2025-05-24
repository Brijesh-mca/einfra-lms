import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../Loading";

export default function ViewAllTickets() {
  const [tickets, setTickets] = useState([]);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [totalTickets, setTotalTickets] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [resolutionText, setResolutionText] = useState("");
  const [resolveError, setResolveError] = useState(null);

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
        const formatDate = (date) => date.toISOString().split("T")[0];

        const response = await axiosInstance.get(
          `/tickets?startDate=${formatDate(currentMonthStart)}&endDate=${formatDate(today)}`
        );
        const currentData = response.data;

        const mappedTickets = currentData.data.map((ticket) => ({
          ticketId: ticket._id,
          name: `${ticket.user.firstName} ${ticket.user.lastName}`,
          category: ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1),
          status: ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1),
          _id: ticket._id,
        }));

        setTickets(mappedTickets);
        setTotalTickets(currentData.total || mappedTickets.length);
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
  }, [token]);

  const handleDownload = async (ticketId) => {
    try {
      setDownloadError(null);
      const axiosInstance = axios.create({
        baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/pdf",
        },
        responseType: "blob",
        timeout: 10000,
      });

      const response = await axiosInstance.get(`/tickets/${ticketId}/download`);
      const contentType = response.headers["content-type"];
      if (!contentType.includes("application/pdf")) {
        throw new Error("Server did not return a PDF file");
      }
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${ticketId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading ticket:", error);
      let errorMessage;
      if (error.response?.status === 401) {
        errorMessage = "Unauthorized: Please check your token or log in again.";
      } else if (error.message === "Server did not return a PDF file") {
        errorMessage = "Failed to download ticket: Server did not return a PDF file.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please check your connection or try again later.";
      } else {
        errorMessage = `Failed to download ticket as PDF: ${error.message || "Unknown error"}. Please try again later.`;
      }
      setDownloadError(errorMessage);
    }
  };

  const handleResolve = async () => {
    try {
      setResolveError(null);
      const axiosInstance = axios.create({
        baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      await axiosInstance.patch(`/tickets/${selectedTicketId}/resolve`, {
        resolution: resolutionText,
      });

      setTickets(tickets.map((ticket) =>
        ticket.ticketId === selectedTicketId
          ? { ...ticket, status: "Resolved" }
          : ticket
      ));
      setShowResolveModal(false);
      setResolutionText("");
    } catch (error) {
      console.error("Error resolving ticket:", error);
      const errorMessage =
        error.response?.status === 401
          ? "Unauthorized: Please check your token or log in again."
          : "Failed to resolve ticket. Please try again later.";
      setResolveError(errorMessage);
    }
  };

  const getStatusColor = (status) =>
    status.toLowerCase() === "resolved"
      ? "bg-green-100 border-green-500 text-green-700"
      : "bg-red-100 border-red-500 text-red-700";

  const filteredTickets = tickets.filter(
    (t) =>
      t.name.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      t.ticketId.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(ticketSearchTerm.toLowerCase()) ||
      t.status.toLowerCase().includes(ticketSearchTerm.toLowerCase())
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-4 sm:p-6 text-gray-800 text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6 text-gray-800">
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/ticket-contact"
          className="flex items-center px-3 py-2 card-bg text-white rounded hover:bg-cyan-600 text-sm"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>
        <h1 className="text-3xl font-semibold text-center md:text-left">All Tickets</h1>
      </div>

      {downloadError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {downloadError}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-medium mb-1">
            Tickets ( {totalTickets} )
          </h2>
          <p className="text-sm text-gray-500">View list of All Complaints Below</p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search tickets by name, ID, category, or status..."
            value={ticketSearchTerm}
            onChange={(e) => setTicketSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-cyan-500 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      {showResolveModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Resolve Ticket</h3>
            {resolveError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {resolveError}
              </div>
            )}
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              rows="4"
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Enter resolution details..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setResolutionText("");
                  setResolveError(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleResolve}
                className="px-4 py-2 card-bg text-white rounded hover:bg-cyan-600"
                disabled={!resolutionText.trim()}
              >
                Resolve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile View (below md) */}
      <div className="md:hidden grid gap-4 mb-4">
        {filteredTickets.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium text-gray-800">{t.name}</h3>
              {t.status.toLowerCase() === "resolved" ? (
                <span
                  className={`px-2 py-1 text-xs rounded border ${getStatusColor(t.status)}`}
                >
                  {t.status}
                </span>
              ) : (
                <button
                  onClick={() => {
                    setSelectedTicketId(t.ticketId);
                    setShowResolveModal(true);
                  }}
                  className="px-2 py-1 text-xs rounded card-bg text-white hover:bg-cyan-600"
                >
                  Resolve
                </button>
              )}
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

      {/* Tablet View (md to lg) */}
      <div className="hidden md:block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {filteredTickets.map((t) => (
          <div
            key={t._id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <p className="font-semibold">Ticket ID:</p>
                <p className="truncate">{t.ticketId}</p>
              </div>
              <div>
                <p className="font-semibold">Category:</p>
                <p className="truncate">{t.category}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p className={getStatusColor(t.status)}>{t.status}</p>
              </div>
              <div>
                <p className="font-semibold">Action:</p>
                {t.status.toLowerCase() === "resolved" ? (
                  <span className="text-gray-500">N/A</span>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedTicketId(t.ticketId);
                      setShowResolveModal(true);
                    }}
                    className="px-2 py-1 text-xs rounded card-bg text-white hover:bg-cyan-600"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
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
          <div className="text-center text-gray-500 py-4 col-span-2">
            No tickets match your search.
          </div>
        )}
      </div>

      {/* Desktop View (lg and above) */}
      <div className="hidden lg:block bg-white rounded shadow p-4 text-black overflow-x-auto mb-4">
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
                <td className="py-2 px-4">{t.ticketId}</td>
                <td className="py-2 px-4">{t.category}</td>
                <td className="py-2 px-4">
                  {t.status.toLowerCase() === "resolved" ? (
                    <span
                      className={`px-2 py-1 text-xs rounded border ${getStatusColor(t.status)}`}
                    >
                      {t.status}
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedTicketId(t.ticketId);
                        setShowResolveModal(true);
                      }}
                      className="px-2 py-1 text-xs rounded card-bg text-white hover:bg-cyan-600"
                    >
                      Resolve
                    </button>
                  )}
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
    </div>
  );
}