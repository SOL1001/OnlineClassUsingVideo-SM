import { useState } from "react";
import {
  FiHome,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiFilter,
} from "react-icons/fi";
import Header from "../../components/Header";
import AddHomeModal from "./AddHomeModal";

interface Property {
  id: number;
  title: string;
  type: string;
  address: string;
  price: number;
  status: "Active" | "Pending" | "Sold";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  image?: string;
}

interface PropertyCategory {
  id: number;
  name: string;
  description: string;
  count: number;
  color?: string;
}

const PropertyManagement = () => {
  const [activeTab, setActiveTab] = useState<"listings" | "add" | "categories">(
    "listings"
  );
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 1,
      title: "Luxury Villa",
      type: "Residential",
      address: "123 Beach Rd, Malibu",
      price: 3250000,
      status: "Active",
      bedrooms: 5,
      bathrooms: 4.5,
      squareFeet: 4200,
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Downtown Office",
      type: "Commercial",
      address: "456 Business Ave, NYC",
      price: 4500000,
      status: "Active",
      bedrooms: 0,
      bathrooms: 2,
      squareFeet: 7500,
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Suburban Home",
      type: "Residential",
      address: "789 Oak Lane, Austin",
      price: 750000,
      status: "Pending",
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2200,
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop",
    },
  ]);

  const [categories, setCategories] = useState<PropertyCategory[]>([
    {
      id: 1,
      name: "Residential",
      description: "Single family homes, apartments",
      count: 24,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      name: "Commercial",
      description: "Office spaces, retail stores",
      count: 12,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 3,
      name: "Land",
      description: "Vacant land, plots",
      count: 8,
      color: "bg-green-100 text-green-800",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(
    null
  );

  const handleDeleteProperty = (id: number) => {
    setProperties(properties.filter((p) => p.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id));
    setShowDeleteConfirm(null);
  };

  const filteredProperties = properties.filter(
    (property) =>
      (property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All Status" || property.status === statusFilter)
  );
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="sticky top-0 z-10">
        <Header title={"Properties"} />
      </div>

      <div className="p-5">
        <div className="">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Property Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === "listings"
                  ? "Manage your property listings"
                  : "Organize property categories"}
              </p>
            </div>
            <button
              className="flex items-center bg-[#00A16A] hover:bg-[#008055] text-white py-2 px-4 rounded-lg transition-all 
                        shadow-sm hover:shadow-md w-full md:w-auto justify-center"
              onClick={() => setOpen(true)}
            >
              <FiPlus className="mr-2" />
              Add Property
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-3 px-6 font-medium text-sm flex items-center ${
                activeTab === "listings"
                  ? "text-[#00A16A] border-b-2 border-[#00A16A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("listings")}
            >
              <FiHome className="mr-2" />
              Manage Listings
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm ${
                activeTab === "categories"
                  ? "text-[#00A16A] border-b-2 border-[#00A16A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("categories")}
            >
              Categories
            </button>
          </div>

          {/* Content */}
          {activeTab === "listings" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 pb-0 gap-4">
                <div className="relative w-full md:w-80">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search properties..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A16A]/50 focus:border-transparent transition"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      className="appearance-none bg-white border border-gray-200 rounded-lg pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#00A16A]/50 focus:border-transparent w-full"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Pending</option>
                      <option>Sold</option>
                    </select>
                    <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto p-6">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-400">
                      <FiHome className="w-full h-full" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No properties found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm
                        ? "Try a different search term"
                        : "Get started by adding a new property"}
                    </p>
                    <div className="mt-6"></div>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                          Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProperties.map((property) => (
                        <tr
                          key={property.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {property.image && (
                                <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden mr-4">
                                  <img
                                    className="h-full w-full object-cover"
                                    src={property.image}
                                    alt={property.title}
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900">
                                  {property.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {property.bedrooms} beds, {property.bathrooms}{" "}
                                  baths, {property.squareFeet} sqft
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                            {property.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                            {property.address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ${property.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 text-xs rounded-full font-medium ${
                                property.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : property.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {property.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                            <div className="flex justify-end items-center space-x-3">
                              <button
                                className="text-[#00A16A] hover:text-[#008055] p-1.5 rounded-full hover:bg-[#00A16A]/10 transition"
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </button>
                              <div className="relative">
                                <button
                                  className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-500/10 transition"
                                  onClick={() =>
                                    setShowDeleteConfirm(
                                      showDeleteConfirm === property.id
                                        ? null
                                        : property.id
                                    )
                                  }
                                  title="Delete"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                                {showDeleteConfirm === property.id && (
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                    <div className="p-3 text-sm text-gray-700">
                                      <p>Delete this property?</p>
                                      <div className="flex justify-end mt-2 space-x-2">
                                        <button
                                          onClick={() =>
                                            setShowDeleteConfirm(null)
                                          }
                                          className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleDeleteProperty(property.id)
                                          }
                                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === "categories" && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 pb-0 gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    Property Categories
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Organize your properties into categories
                  </p>
                </div>
                <button className="flex items-center bg-[#00A16A] hover:bg-[#008055] text-white py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md w-full md:w-auto justify-center">
                  <FiPlus className="mr-2" />
                  Add Category
                </button>
              </div>

              <div className="overflow-x-auto p-6">
                {categories.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 text-gray-400">
                      <FiPlus className="w-full h-full" />
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">
                      No categories created
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first category
                    </p>
                    <div className="mt-6">
                      <button className="inline-flex items-center bg-[#00A16A] hover:bg-[#008055] text-white py-2 px-4 rounded-lg transition">
                        <FiPlus className="mr-2" />
                        Add Category
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {category.description}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color}`}
                          >
                            {category.count} properties
                          </span>
                        </div>
                        <div className="flex justify-end mt-4 space-x-2">
                          <button className="text-[#00A16A] hover:text-[#008055] p-1.5 rounded-full hover:bg-[#00A16A]/10 transition">
                            <FiEdit size={16} />
                          </button>
                          <div className="relative">
                            <button
                              className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-500/10 transition"
                              onClick={() =>
                                setShowDeleteConfirm(
                                  showDeleteConfirm === category.id
                                    ? null
                                    : category.id
                                )
                              }
                            >
                              <FiTrash2 size={16} />
                            </button>
                            {showDeleteConfirm === category.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="p-3 text-sm text-gray-700">
                                  <p>Delete this category?</p>
                                  <div className="flex justify-end mt-2 space-x-2">
                                    <button
                                      onClick={() => setShowDeleteConfirm(null)}
                                      className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteCategory(category.id)
                                      }
                                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <AddHomeModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default PropertyManagement;
