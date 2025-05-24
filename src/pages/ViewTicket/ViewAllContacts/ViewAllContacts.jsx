import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../Loading";

export default function ViewAllContacts() {
  const [contacts, setContacts] = useState([]);
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get("https://lms-backend-flwq.onrender.com/api/v1/contacts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const mappedContacts = response.data.map((contact) => ({
          _id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          query: contact.query,
          type: contact.type.charAt(0).toUpperCase() + contact.type.slice(1),
        }));
        setContacts(mappedContacts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contacts:", error);
        const errorMessage =
          error.response?.status === 401
            ? "Unauthorized: Please check your token or log in again."
            : "Failed to fetch contacts. Please try again later.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (token) {
      fetchContacts();
    } else {
      setError("No authentication token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      c.query.toLowerCase().includes(contactSearchTerm.toLowerCase()) ||
      c.type.toLowerCase().includes(contactSearchTerm.toLowerCase())
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
          className="flex items-center px-3 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 text-sm"
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
        <h1 className="text-3xl font-semibold text-center md:text-left">All Contacts</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-xl font-medium mb-1">
            Contacts ( {contacts.length} )
          </h2>
          <p className="text-sm text-gray-500">View list of All Contact Queries Below</p>
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search contacts by name, email, subject, query, or type..."
            value={contactSearchTerm}
            onChange={(e) => setContactSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-cyan-500 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
      </div>

      {/* Mobile View (below md) */}
      <div className="md:hidden grid gap-4 mb-4">
        {filteredContacts.map((c) => (
          <div
            key={c._id}
            className="bg-white p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-base font-medium text-gray-800 mb-2">{c.name}</h3>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Email:</span> {c.email}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Subject:</span> {c.subject}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">Type:</span> {c.type}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Query:</span>{" "}
              <span className="relative group">
                {c.query.length > 50 ? `${c.query.substring(0, 50)}...` : c.query}
                <span className="absolute left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {c.query}
                </span>
              </span>
            </p>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No contacts match your search.
          </div>
        )}
      </div>

      {/* Tablet View (md to lg) */}
      <div className="hidden md:block lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {filteredContacts.map((c) => (
          <div
            key={c._id}
            className="bg-white p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{c.name}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <p className="font-semibold">Email:</p>
                <p className="truncate">{c.email}</p>
              </div>
              <div>
                <p className="font-semibold">Subject:</p>
                <p className="truncate">{c.subject}</p>
              </div>
              <div>
                <p className="font-semibold">Type:</p>
                <p className="truncate">{c.type}</p>
              </div>
              <div>
                <p className="font-semibold">Query:</p>
                <p className="truncate">{c.query.length > 50 ? `${c.query.substring(0, 50)}...` : c.query}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="text-center text-gray-500 py-4 col-span-2">
            No contacts match your search.
          </div>
        )}
      </div>

      {/* Desktop View (lg and above) */}
      <div className="hidden lg:block bg-white rounded shadow p-4 text-black overflow-x-auto">
        <table className="min-w-full text-sm text-left whitespace-nowrap">
          <thead className="text-black">
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Query</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => (
              <tr key={c._id} className="hover:bg-cyan-100">
                <td className="py-2 px-4">{c.name}</td>
                <td className="py-2 px-4">{c.email}</td>
                <td className="py-2 px-4">{c.subject}</td>
                <td className="py-2 px-4">{c.type}</td>
                <td className="py-2 px-4">
                  <span className="relative group">
                    {c.query.length > 50 ? `${c.query.substring(0, 50)}...` : c.query}
                    <span className="absolute left-0 mt-1 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {c.query}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No contacts match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}