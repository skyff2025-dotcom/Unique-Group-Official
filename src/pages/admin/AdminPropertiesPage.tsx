import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Building2,
  CheckCircle,
  MapPin,
  RefreshCw,
  Star,
  Calendar,
} from 'lucide-react';
import { getAdminProperties, deleteProperty, AdminPropertyWithImages } from '../../services/admin';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export const AdminPropertiesPage: React.FC = () => {
  const location = useLocation();
  const [properties, setProperties] = useState<AdminPropertyWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [listingFilter, setListingFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not_featured'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'featured'>('newest');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<AdminPropertyWithImages | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Check if routed with a success notification message in state
  useEffect(() => {
    if (location.state && (location.state as any).message) {
      setToastMessage((location.state as any).message);
      window.history.replaceState({}, document.title);
      const timer = setTimeout(() => setToastMessage(''), 4500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const data = await getAdminProperties({
        search,
        status: statusFilter,
        propertyType: typeFilter,
        listingType: listingFilter,
        featured: featuredFilter,
        sortBy,
      });
      setProperties(data);
    } catch (err) {
      console.warn('Properties load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [search, statusFilter, typeFilter, listingFilter, featuredFilter, sortBy]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return;
    setIsDeleting(true);
    const result = await deleteProperty(propertyToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id));
      showToast('Property deleted successfully.');
      setDeleteModalOpen(false);
      setPropertyToDelete(null);
    } else {
      alert(result.error || 'Failed to delete property.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-[#E2C98D] px-4 py-3 rounded-lg shadow-xl border border-[#C5A059]/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4D8] pb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A192F]">
            Properties
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your real estate listings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadProperties}
            disabled={loading}
            className="min-h-[42px] px-3.5 py-2 rounded-lg bg-white border border-[#E8E4D8] text-xs font-semibold text-slate-700 hover:bg-[#FAF9F5] shadow-xs flex items-center gap-1.5"
            title="Refresh listings"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#8C6E2E] ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            to="/admin/properties/new"
            className="min-h-[42px] px-4 py-2 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#C5A059]" />
            <span>+ Add Property</span>
          </Link>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E8E4D8] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search properties..."
              className="w-full min-h-[40px] pl-9 pr-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* Status filter */}
          <div className="lg:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Status: All</option>
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Listing type */}
          <div className="lg:col-span-2">
            <select
              value={listingFilter}
              onChange={(e) => setListingFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Listing: All</option>
              <option value="For Sale">For Sale</option>
              <option value="For Rent">For Rent</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          {/* Property type */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Type: All</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
              <option value="na_land">NA Land</option>
              <option value="agricultural">Agricultural</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Featured filter */}
          <div className="lg:col-span-2">
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as any)}
              className="w-full min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-[#FAF9F5] text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="all">Featured: All</option>
              <option value="featured">Featured</option>
              <option value="not_featured">Not Featured</option>
            </select>
          </div>
        </div>

        {/* Secondary sort and active filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F4F2EA] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Showing <strong className="text-[#0A192F]">{properties.length}</strong> listings
            </span>
            {(statusFilter !== 'all' || typeFilter !== 'all' || listingFilter !== 'all' || featuredFilter !== 'all' || search) && (
              <button
                type="button"
                onClick={() => {
                  setStatusFilter('all');
                  setTypeFilter('all');
                  setListingFilter('all');
                  setFeaturedFilter('all');
                  setSearch('');
                }}
                className="text-[#8C6E2E] font-semibold hover:underline ml-2"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="min-h-[34px] px-2.5 py-1 rounded-md border border-[#D5CEBF] bg-white text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>
      </div>

      {/* PROPERTY LIST / CARDS */}
      {loading ? (
        <div className="bg-white p-16 rounded-xl border border-[#E8E4D8] text-center text-xs text-slate-500 shadow-xs">
          <div className="w-6 h-6 border-2 border-[#0A192F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading properties from Supabase...
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white p-16 rounded-xl border border-[#E8E4D8] text-center space-y-4 shadow-xs">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#0A192F]">
              No properties found
            </h3>
            <p className="text-xs text-slate-500">
              No real estate listings match your search and filter criteria.
            </p>
          </div>
          <div>
            <Link
              to="/admin/properties/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4 text-[#C5A059]" />
              <span>+ Add Property</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E8E4D8] shadow-xs overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] text-slate-600 font-semibold uppercase tracking-wider border-b border-[#E8E4D8]">
                <tr>
                  <th className="py-3.5 px-4">Cover</th>
                  <th className="py-3.5 px-4">Property Title</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Area</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Listing Status</th>
                  <th className="py-3.5 px-4 text-center">Featured</th>
                  <th className="py-3.5 px-4">Created Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EA]">
                {properties.map((prop) => {
                  const cover = prop.primary_image_url || prop.property_images?.[0]?.image_url;
                  return (
                    <tr key={prop.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                      {/* Cover Image */}
                      <td className="py-3.5 px-4">
                        <div className="w-14 h-11 rounded overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          {cover ? (
                            <img
                              src={cover}
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 text-[9px] font-bold">
                              NO IMG
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Property Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className="font-serif font-bold text-[#0A192F] text-sm block truncate">
                          {prop.title}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block truncate">
                          /{prop.slug}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <span className="font-medium block">{prop.location}</span>
                        <span className="text-[11px] text-slate-400 block">{prop.city}, {prop.district}</span>
                      </td>

                      {/* Property Type */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700 text-[11px]">
                          {prop.property_type.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {prop.listing_type}
                        </span>
                      </td>

                      {/* Area */}
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {prop.area} {prop.area_unit}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-[#0A192F] whitespace-nowrap">
                        {prop.price_display || (prop.price ? `₹${(prop.price / 10000000).toFixed(2)} Cr` : 'On Request')}
                      </td>

                      {/* Listing Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold border whitespace-nowrap ${
                            prop.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : prop.status === 'Sold'
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3.5 px-4 text-center">
                        {prop.featured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C6E2E] bg-[#FAF4E5] px-2 py-0.5 rounded border border-[#C5A059]/40">
                            <Star className="w-3 h-3 fill-[#C5A059] text-[#C5A059]" />
                            <span>Featured</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">No</span>
                        )}
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(prop.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/properties/${prop.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-[#0A192F] transition-colors"
                            title="View Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/admin/properties/${prop.id}/edit`}
                            className="p-1.5 rounded-md hover:bg-[#FAF4E5] text-[#8C6E2E] transition-colors"
                            title="Edit Property"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              setPropertyToDelete(prop);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* TABLET & MOBILE CARDS */}
          <div className="xl:hidden divide-y divide-[#F4F2EA]">
            {properties.map((prop) => {
              const cover = prop.primary_image_url || prop.property_images?.[0]?.image_url;
              return (
                <div key={prop.id} className="p-4 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {cover ? (
                        <img
                          src={cover}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                          NO IMG
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-serif font-bold text-sm text-[#0A192F] truncate">
                          {prop.title}
                        </span>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            prop.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#C5A059] shrink-0" />
                        <span>{prop.location}, {prop.city}</span>
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] uppercase font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                          {prop.property_type}
                        </span>
                        {prop.featured && (
                          <span className="text-[10px] font-bold text-[#8C6E2E] bg-[#FAF4E5] px-1.5 py-0.5 rounded border border-[#C5A059]/40 inline-flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-[#C5A059]" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs pt-1 border-t border-[#F4F2EA]">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Price</span>
                      <span className="font-bold text-[#0A192F] truncate block">
                        {prop.price_display || `₹${(prop.price || 0).toLocaleString()}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Area</span>
                      <span className="font-medium text-slate-700 truncate block">
                        {prop.area} {prop.area_unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Created</span>
                      <span className="font-medium text-slate-600 text-[11px] truncate block">
                        {formatDate(prop.created_at)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F4F2EA]">
                    <Link
                      to={`/properties/${prop.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[36px] px-3 py-1.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 hover:bg-slate-200"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <Link
                      to={`/admin/properties/${prop.id}/edit`}
                      className="min-h-[36px] px-3.5 py-1.5 rounded bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase inline-flex items-center gap-1 hover:bg-[#112240]"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Edit</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setPropertyToDelete(prop);
                        setDeleteModalOpen(true);
                      }}
                      className="min-h-[36px] px-3 py-1.5 rounded bg-red-50 text-red-600 text-xs font-semibold inline-flex items-center gap-1 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Property"
        itemName={propertyToDelete?.title}
        message="Are you sure you want to delete this property? This action cannot be undone."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalOpen(false);
          setPropertyToDelete(null);
        }}
      />
    </div>
  );
};
