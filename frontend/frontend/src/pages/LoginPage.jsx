import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';
import { LogIn, UserCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Attempting login...', { isAdmin, email: formData.email });
      
      // Choose the correct API call
      const apiCall = isAdmin ? authAPI.adminLogin : authAPI.login;
      const response = await apiCall(formData);
      
      console.log('✅ Login response:', response.data);
      
      // Extract data - backend returns it directly, not nested in data.data
      const userData = response.data;
      const { token, ...userInfo } = userData;
      
      // Store in context and localStorage
      login(userInfo, token);
      
      toast.success(`Welcome back, ${userInfo.name}!`);
      
      // Navigate based on role
      if (isAdmin || userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('❌ Login error:', error.response || error);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Login Type Toggle */}
        <div className="bg-white rounded-t-xl p-2 flex space-x-2">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              !isAdmin
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            User Login
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
              isAdmin
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Admin Login
          </button>
        </div>

        <div className="bg-white rounded-b-xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              {isAdmin ? (
                <UserCircle className="w-8 h-8 text-primary-600" />
              ) : (
                <LogIn className="w-8 h-8 text-primary-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isAdmin ? 'Admin Login' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isAdmin
                ? 'Access the admin dashboard'
                : 'Sign in to continue your booking'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {!isAdmin && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          )}

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
            {isAdmin ? (
              <div className="text-sm text-gray-600 space-y-1">
                <p>Email: admin@resort.com</p>
                <p>Password: admin123</p>
              </div>
            ) : (
              <div className="text-sm text-gray-600 space-y-1">
                <p>Email: user@test.com</p>
                <p>Password: user123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;