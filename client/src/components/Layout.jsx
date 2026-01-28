import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { FiHome, FiCreditCard, FiUsers, FiLogOut, FiUser } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import { useState, useRef, useEffect } from 'react';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navbar */}
  <nav className="bg-white shadow-md dark:bg-gray-800 dark:shadow-none border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-200">
                Subscription Manager
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-300"
                >
                  <FiHome />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/plans"
                  className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-300"
                >
                  <FiCreditCard />
                  <span>Plans</span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/subscriptions"
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <FiUsers />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition"
                >
                  <FiUser className="text-gray-500 dark:text-gray-200" />
                  <span className="text-sm font-medium dark:text-white">{user?.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  }`}>
                    {user?.role}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-none dark:border dark:border-gray-700 z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;