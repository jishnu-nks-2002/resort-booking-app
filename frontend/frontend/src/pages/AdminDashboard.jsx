import { useState, useEffect } from 'react';
import { bookingAPI } from '../utils/api';
import { formatCurrency, formatDateTime, getTimeRemaining, getStatusColor } from '../utils/helpers';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import PackageManager from '../components/PackageManager';
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Eye,
  TrendingUp,
  Calendar,
  Users,
  X,
  PackageOpen,
} from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // new, preparing, history, packages
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (activeTab !== 'packages') {
      fetchBookings();
      const interval = setInterval(fetchBookings, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  useEffect(() => {
    // Update timers every second
    const interval = setInterval(() => {
      setTimers((prev) => {
        const newTimers = { ...prev };
        Object.keys(newTimers).forEach((id) => {
          if (newTimers[id].isActive) {
            const remaining = getTimeRemaining(newTimers[id].endTime);
            if (remaining.isExpired) {
              newTimers[id].isActive = false;
              toast.info('Cooking timer completed for booking #' + newTimers[id].bookingNumber);
            }
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll();
      setBookings(response.data.bookings);
      setStats(response.data.stats);

      // Initialize timers for preparing orders
      const newTimers = {};
      response.data.bookings.forEach((booking) => {
        if (booking.status === 'preparing' && booking.cookingEndTime) {
          const remaining = getTimeRemaining(booking.cookingEndTime);
          newTimers[booking._id] = {
            bookingNumber: booking.bookingNumber,
            endTime: booking.cookingEndTime,
            isActive: !remaining.isExpired,
          };
        }
      });
      setTimers(newTimers);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCooking = async (bookingId) => {
    try {
      const response = await bookingAPI.startCooking(bookingId);
      toast.success('Cooking timer started');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to start cooking');
    }
  };

  const handleUpdateStatus = async (bookingId, status, notes = '') => {
    try {
      await bookingAPI.updateStatus(bookingId, { status, notes });
      toast.success('Status updated successfully');
      fetchBookings();
      setShowDetailsModal(false);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const viewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const getFilteredBookings = () => {
    switch (activeTab) {
      case 'new':
        return bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
      case 'preparing':
        return bookings.filter((b) => b.status === 'preparing' || b.status === 'ready');
      case 'history':
        return bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');
      default:
        return bookings;
    }
  };

  const renderTimer = (booking) => {
    if (booking.status !== 'preparing' || !booking.cookingEndTime) return null;

    const remaining = getTimeRemaining(booking.cookingEndTime);
    
    if (remaining.isExpired) {
      return (
        <div className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span className="font-semibold">Ready!</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 text-orange-600">
        <Clock className="w-5 h-5 animate-pulse" />
        <span className="font-mono font-semibold">
          {String(remaining.hours).padStart(2, '0')}:
          {String(remaining.minutes).padStart(2, '0')}:
          {String(remaining.seconds).padStart(2, '0')}
        </span>
      </div>
    );
  };

  if (loading && activeTab !== 'packages') {
    return <Loading message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings, orders, and packages</p>
        </div>

        {/* Stats Grid - Only show when not on packages tab */}
        {activeTab !== 'packages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total || 0}</p>
                </div>
                <div className="bg-primary-100 p-3 rounded-full">
                  <Package className="w-8 h-8 text-primary-600" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Orders</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-2">
                    {(stats.pending || 0) + (stats.confirmed || 0)}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Preparing</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {(stats.preparing || 0) + (stats.ready || 0)}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatCurrency(stats.totalRevenue || 0)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('new')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition whitespace-nowrap ${
                activeTab === 'new'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              New Orders ({(stats.pending || 0) + (stats.confirmed || 0)})
            </button>
            <button
              onClick={() => setActiveTab('preparing')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition whitespace-nowrap ${
                activeTab === 'preparing'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Preparing ({(stats.preparing || 0) + (stats.ready || 0)})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              History ({(stats.completed || 0) + (stats.cancelled || 0)})
            </button>
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-4 px-6 font-semibold text-center transition whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'bg-primary-50 text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <PackageOpen className="w-5 h-5" />
                <span>Packages</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content - Conditional Rendering */}
        {activeTab === 'packages' ? (
          <PackageManager />
        ) : (
          <div className="space-y-4">
            {getFilteredBookings().length === 0 ? (
              <div className="card p-12 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">Orders will appear here when customers make bookings</p>
              </div>
            ) : (
              getFilteredBookings().map((booking) => (
                <div key={booking._id} className="card p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Order Info */}
                    <div className="flex-1 mb-4 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-xl font-bold text-primary-600">
                          #{booking.bookingNumber}
                        </span>
                        <span className={`badge ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        {booking.packageType && booking.packageType !== 'custom' && (
                          <span className={`badge ${
                            booking.packageType === 'luxury' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {booking.packageType === 'luxury' ? '🌟 Luxury' : '💚 Budget'}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{booking.customerInfo.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>{booking.items.length} Items</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Timer & Actions */}
                    <div className="flex flex-col items-start lg:items-end space-y-3">
                      {renderTimer(booking)}

                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                          >
                            Confirm
                          </button>
                        )}

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => handleStartCooking(booking._id)}
                            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start Cooking</span>
                          </button>
                        )}

                        {booking.status === 'preparing' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'ready')}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark Ready</span>
                          </button>
                        )}

                        {booking.status === 'ready' && (
                          <button
                            onClick={() => handleUpdateStatus(booking._id, 'completed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                          >
                            Complete
                          </button>
                        )}

                        <button
                          onClick={() => viewDetails(booking)}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Booking #{selectedBooking.bookingNumber}
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`badge ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  {selectedBooking.packageType && selectedBooking.packageType !== 'custom' && (
                    <span className={`badge ${
                      selectedBooking.packageType === 'luxury' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedBooking.packageName || selectedBooking.packageType}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedBooking.customerInfo.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedBooking.customerInfo.email}</p>
                  <p><span className="font-medium">Phone:</span> {selectedBooking.customerInfo.phone}</p>
                  <p><span className="font-medium">Guests:</span> {selectedBooking.numberOfGuests}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Order Items ({selectedBooking.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedBooking.items.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}
                        </div>
                        <span className="font-bold text-primary-600">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="capitalize badge badge-confirmed">{item.itemType}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>{formatCurrency(item.price)} each</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Requests</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-900">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Total */}
              <div className="bg-primary-50 rounded-lg p-4">
                {selectedBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-gray-700 mb-2">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedBooking.totalAmount + selectedBooking.discountAmount)}</span>
                  </div>
                )}
                {selectedBooking.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 mb-2">
                    <span>Discount:</span>
                    <span>-{formatCurrency(selectedBooking.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t pt-3">
                  <span className="text-xl font-bold text-gray-900">Total Amount</span>
                  <span className="text-3xl font-bold text-primary-600">
                    {formatCurrency(selectedBooking.finalAmount || selectedBooking.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                {selectedBooking.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'confirmed')}
                      className="btn-primary"
                    >
                      Confirm Order
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedBooking._id, 'cancelled', 'Cancelled by admin')}
                      className="btn-danger"
                    >
                      Cancel Order
                    </button>
                  </>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleStartCooking(selectedBooking._id);
                      setShowDetailsModal(false);
                    }}
                    className="btn-primary"
                  >
                    Start Cooking
                  </button>
                )}

                {selectedBooking.status === 'preparing' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, 'ready')}
                    className="btn-primary"
                  >
                    Mark as Ready
                  </button>
                )}

                {selectedBooking.status === 'ready' && (
                  <button
                    onClick={() => handleUpdateStatus(selectedBooking._id, 'completed')}
                    className="btn-primary"
                  >
                    Complete Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;