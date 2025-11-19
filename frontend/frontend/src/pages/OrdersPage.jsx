import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI } from '../utils/api';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../utils/helpers';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Package, 
  Clock,
  Eye,
  X
} from 'lucide-react';

const OrdersPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings(user?._id);
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const viewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  if (loading) {
    return <Loading message="Loading your bookings..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">View and manage your bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start your journey by making your first booking!</p>
            <a href="/" className="btn-primary inline-block">
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card p-6 hover:shadow-lg transition">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Booking Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl font-bold text-primary-600">
                        #{booking.bookingNumber}
                      </span>
                      <span className={`badge ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{booking.numberOfGuests} Guest(s)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Package className="w-4 h-4" />
                        <span>{booking.items.length} Item(s)</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Booked {formatDateTime(booking.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount and Actions */}
                  <div className="flex flex-col items-start lg:items-end space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(booking.totalAmount)}
                      </span>
                    </div>
                    <button
                      onClick={() => viewDetails(booking)}
                      className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Booking #{selectedBooking.bookingNumber}
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
                <span className={`badge ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">Name:</span> {selectedBooking.customerInfo.name}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Email:</span> {selectedBooking.customerInfo.email}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Phone:</span> {selectedBooking.customerInfo.phone}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-900">
                    <span className="font-medium">Check-in:</span> {formatDate(selectedBooking.checkInDate)}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Check-out:</span> {formatDate(selectedBooking.checkOutDate)}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Guests:</span> {selectedBooking.numberOfGuests}
                  </p>
                  <p className="text-gray-900">
                    <span className="font-medium">Booked on:</span> {formatDateTime(selectedBooking.createdAt)}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Ordered Items ({selectedBooking.items.length})
                </h3>
                <div className="space-y-2">
                  {selectedBooking.items.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <span className="capitalize">{item.itemType}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>{formatCurrency(item.price)} each</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="bg-primary-50 rounded-lg p-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(selectedBooking.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Special Requests</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Notes</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-900">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;