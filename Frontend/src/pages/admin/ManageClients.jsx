import React, { useEffect, useState } from "react";
import config from "../../config";
import Loader from "../../components/Loader";

const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: ""
  });

  const fetchClients = async () => {
    setLoader(true);
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/clients`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      const data = await res.json();
      setClients(data.clients);
    } catch (err) {
      console.error(err.message);
      setAlert({ type: "error", message: "Failed to load clients." });
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const method = editClient ? "PUT" : "POST";
    const url = editClient
      ? `${config.BACKEND_URL}/api/clients/${editClient._id}`
      : `${config.BACKEND_URL}/api/clients`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ type: "success", message: data.message || "Client saved!" });
        setFormData({ name: "", email: "", phone: "", company: "" });
        setEditClient(null);
        setShowForm(false);
        fetchClients();
      } else {
        setAlert({ type: "error", message: data.message || "Failed to save client." });
      }
    } catch (err) {
      setAlert({ type: "error", message: "Error occurred while saving client." });
    } finally {
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    setLoader(true);
    try {
      const res = await fetch(`${config.BACKEND_URL}/api/clients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", message: data.message || "Client deleted!" });
        fetchClients();
      } else {
        setAlert({ type: "error", message: data.message || "Failed to delete client." });
      }
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoader(false);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setFormData(client);
    setShowForm(true);
  };

  return (
    <div className="p-6">
      {loader && <Loader />}
      {alert.message && (
        <div
          className={`mb-4 p-3 rounded ${
            alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {alert.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">Manage Clients</h1>

      <button
        onClick={() => {
          setShowForm(!showForm);
          setFormData({ name: "", email: "", phone: "", company: "" });
          setEditClient(null);
        }}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "+ Add New Client"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow mb-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Client Name"
            className="input"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Client Email"
            className="input"
            required
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="input"
          />
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder="Company"
            className="input"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {editClient ? "Update Client" : "Add Client"}
          </button>
        </form>
      )}

      <table className="min-w-full bg-white shadow-md rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3">Name</th>
            <th className="text-left p-3">Email</th>
            <th className="text-left p-3">Phone</th>
            <th className="text-left p-3">Company</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id} className="border-t hover:bg-gray-50">
              <td className="p-3">{client.name}</td>
              <td className="p-3">{client.email}</td>
              <td className="p-3">{client.phone}</td>
              <td className="p-3">{client.company}</td>
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageClients;
