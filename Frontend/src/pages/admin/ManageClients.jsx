import React, { useEffect, useState } from "react";
import { Users, DollarSign, Briefcase, Calendar, Search, Plus, Edit, Trash2, X, MapPin, Mail, Phone, Building } from "lucide-react";

// Mock config for demo - replace with your actual config
const config = {
  BACKEND_URL: "https://your-backend-url.com"
};

// Mock localStorage for demo - replace with actual implementation
const mockLocalStorage = {
  getItem: (key) => "mock-token",
  setItem: (key, value) => {},
  removeItem: (key) => {}
};

const ManageClients = () => {
  const [clients, setClients] = useState([
    {
      _id: "1",
      name: "Acme Corporation",
      email: "john@acme.com",
      phone: "+1 (555) 123-4567",
      company: "Acme Corporation",
      type: "Enterprise",
      status: "Active",
      revenue: 250000,
      projects: 5,
      location: "New York"
    },
    {
      _id: "2",
      name: "TechStart Inc",
      email: "sarah@techstart.com",
      phone: "+1 (555) 987-6543",
      company: "TechStart Inc",
      type: "Startup",
      status: "Active",
      revenue: 75000,
      projects: 2,
      location: "San Francisco"
    },
    {
      _id: "3",
      name: "Global Solutions",
      email: "michael@globalsolutions.com",
      phone: "+1 (555) 456-7890",
      company: "Global Solutions",
      type: "SMB",
      status: "Inactive",
      revenue: 125000,
      projects: 3,
      location: "Chicago"
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "",
    location: ""
  });

  // Calculate stats
  const totalClients = clients.length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const activeProjects = clients.reduce((sum, client) => sum + client.projects, 0);
  const newThisMonth = 2; // Mock data

  const fetchClients = async () => {
    setLoader(true);
    try {
      // Mock API call - replace with actual implementation
      // const res = await fetch(`${config.BACKEND_URL}/api/clients`, {
      //   headers: {
      //     Authorization: "Bearer " + mockLocalStorage.getItem("token")
      //   }
      // });
      // const data = await res.json();
      // setClients(data.clients);
      
      // For demo, we're using mock data
      setTimeout(() => {
        setLoader(false);
      }, 500);
    } catch (err) {
      console.error(err.message);
      setAlert({ type: "error", message: "Failed to load clients." });
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoader(true);
    
    try {
      // Mock API call - replace with actual implementation
      const newClient = {
        ...formData,
        _id: Date.now().toString(),
        status: "Active",
        revenue: 0,
        projects: 0
      };
      
      if (editClient) {
        setClients(clients.map(client => 
          client._id === editClient._id ? { ...client, ...formData } : client
        ));
        setAlert({ type: "success", message: "Client updated successfully!" });
      } else {
        setClients([...clients, newClient]);
        setAlert({ type: "success", message: "Client added successfully!" });
      }
      
      setFormData({ name: "", email: "", phone: "", company: "", type: "", location: "" });
      setEditClient(null);
      setShowForm(false);
      setLoader(false);
    } catch (err) {
      setAlert({ type: "error", message: "Error occurred while saving client." });
      setLoader(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    setLoader(true);
    
    try {
      // Mock API call - replace with actual implementation
      setClients(clients.filter(client => client._id !== id));
      setAlert({ type: "success", message: "Client deleted successfully!" });
      setLoader(false);
    } catch (err) {
      setAlert({ type: "error", message: "Failed to delete client." });
      setLoader(false);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      type: client.type || "",
      location: client.location || ""
    });
    setShowForm(true);
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || client.status === statusFilter;
    const matchesType = typeFilter === "All Types" || client.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600">Manage your business clients and relationships</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setFormData({ name: "", email: "", phone: "", company: "", type: "", location: "" });
              setEditClient(null);
            }}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Client
          </button>
        </div>
      </div>

      {/* Alert */}
      {alert.message && (
        <div className={`mb-6 p-4 rounded-lg ${
          alert.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {alert.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{totalClients}</p>
              <p className="text-gray-400 text-sm">3 active clients</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              <p className="text-gray-400 text-sm">From all clients</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
              <p className="text-gray-400 text-sm">Across all clients</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Briefcase className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">New This Month</p>
              <p className="text-3xl font-bold text-gray-900">{newThisMonth}</p>
              <p className="text-green-600 text-sm">+12% from last month</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Client Directory */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Client Directory</h2>
          <p className="text-gray-500">Search and filter your client database</p>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All Types</option>
              <option>Enterprise</option>
              <option>SMB</option>
              <option>Startup</option>
            </select>
          </div>
        </div>

        {/* Client Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-700">Client</th>
                <th className="text-left p-4 font-medium text-gray-700">Contact</th>
                <th className="text-left p-4 font-medium text-gray-700">Type</th>
                <th className="text-left p-4 font-medium text-gray-700">Status</th>
                <th className="text-left p-4 font-medium text-gray-700">Revenue</th>
                <th className="text-left p-4 font-medium text-gray-700">Projects</th>
                <th className="text-left p-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client, index) => (
                <tr key={client._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Building size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{client.company}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin size={14} />
                          {client.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <p className="text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={14} />
                        {client.email}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={14} />
                        {client.phone}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      client.type === 'Enterprise' ? 'bg-blue-100 text-blue-800' :
                      client.type === 'Startup' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {client.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      client.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    ${client.revenue.toLocaleString()}
                  </td>
                  <td className="p-4 font-medium text-gray-900">
                    {client.projects}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(client)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(client._id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Client Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editClient ? "Edit Client" : "Add New Client"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-500 mt-1">
                Enter the client and project information to add them to your system.
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* Client Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Client Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Contact person name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Type *</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select client type</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="SMB">SMB</option>
                      <option value="Startup">Startup</option>
                      <option value="Individual">Individual</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Location/Address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Project Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    placeholder="Describe the project objectives, scope, and goals..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Requirements</label>
                  <textarea
                    name="projectRequirements"
                    value={formData.projectRequirements}
                    onChange={handleInputChange}
                    placeholder="List specific requirements, technologies, features, or deliverables..."
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select project type</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App">Mobile App</option>
                      <option value="Desktop Application">Desktop Application</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="CMS/Website">CMS/Website</option>
                      <option value="API Development">API Development</option>
                      <option value="Database Design">Database Design</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                    <select
                      name="projectPriority"
                      value={formData.projectPriority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date</label>
                    <input
                      type="date"
                      name="projectStartDate"
                      value={formData.projectStartDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expected End Date</label>
                    <input
                      type="date"
                      name="projectEndDate"
                      value={formData.projectEndDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                    <select
                      name="projectBudget"
                      value={formData.projectBudget}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="Under ₹50,000">Under ₹50,000</option>
                      <option value="₹50,000 - ₹1,00,000">₹50,000 - ₹1,00,000</option>
                      <option value="₹1,00,000 - ₹2,50,000">₹1,00,000 - ₹2,50,000</option>
                      <option value="₹2,50,000 - ₹5,00,000">₹2,50,000 - ₹5,00,000</option>
                      <option value="₹5,00,000 - ₹10,00,000">₹5,00,000 - ₹10,00,000</option>
                      <option value="Above ₹10,00,000">Above ₹10,00,000</option>
                      <option value="To be discussed">To be discussed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Status</label>
                    <select
                      name="projectStatus"
                      value={formData.projectStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Inquiry">Inquiry</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Under Discussion">Under Discussion</option>
                      <option value="Approved">Approved</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="projectNotes"
                    value={formData.projectNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information, special requirements, or notes about the client/project..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={handleSubmit}
                  disabled={loader}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 font-medium"
                >
                  {loader ? "Saving..." : editClient ? "Update Client & Project" : "Add Client & Project"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClients;