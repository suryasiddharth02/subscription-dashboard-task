import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchMySubscription } from '../store/slices/subscriptionSlice';
import { format } from 'date-fns';
import { FiCalendar, FiCreditCard, FiClock, FiAlertCircle, FiCheck } from 'react-icons/fi';
import api from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/subscriptions/my-subscription');
      setSubscription(response.data.subscription);
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        // Invalid/expired token - clear and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const dispatch = useDispatch();

  const handleCancel = async () => {
    const ok = window.confirm('Are you sure you want to cancel your active subscription?');
    if (!ok) return;

    try {
      const res = await api.post('/subscriptions/cancel');
      toast.success(res.data.message || 'Subscription cancelled');
      // refresh local subscription and global store
      await fetchSubscription();
      try { dispatch(fetchMySubscription()); } catch {}
      // redirect to plans so user can choose a new plan
      navigate('/plans');
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to cancel subscription';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const hasActiveSubscription = subscription && subscription.status === 'active';

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        {!hasActiveSubscription && (
          <Link
            to="/plans"
            className="btn-primary"
          >
            Browse Plans
          </Link>
        )}
      </div>

      {hasActiveSubscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Card */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Subscription
              </h2>
              <span className="badge-active">{subscription.status}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Plan</h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {subscription.plan_name}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Price</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    ${subscription.price}/month
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    <FiCalendar className="inline mr-2" />
                    Start Date
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(new Date(subscription.start_date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">
                    <FiClock className="inline mr-2" />
                    End Date
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {format(new Date(subscription.end_date), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Plan Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(() => {
                  // Safely parse features which may be stored as JSON string or array
                  const parseFeatures = (f) => {
                    if (!f) return [];
                    if (Array.isArray(f)) return f;
                    try {
                      const parsed = JSON.parse(f);
                      return Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                      return [];
                    }
                  };

                  return parseFeatures(subscription.features).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <FiCheck className="text-green-500" />
                    <span className="text-gray-700 dark:text-white">{feature}</span>
                  </div>
                  ));
                })()}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to="/plans"
                className="text-primary-600 hover:text-primary-800 font-medium"
              >
                View other plans →
              </Link>
              {hasActiveSubscription && (
                <button
                  onClick={handleCancel}
                  className="ml-6 inline-flex items-center px-4 py-2 border border-red-600 text-red-600 dark:text-white rounded-md hover:bg-red-50 dark:hover:bg-red-700"
                >
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Subscription Stats
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Days Remaining</h3>
                <p className="text-3xl font-bold text-primary-600">
                  {Math.ceil(
                    (new Date(subscription.end_date) - new Date()) / 
                    (1000 * 60 * 60 * 24)
                  )}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Billing Cycle</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Every {subscription.duration} days
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Next Billing</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {format(new Date(subscription.end_date), 'MMM dd, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center py-12">
          <FiAlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Active Subscription
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You don't have an active subscription. Choose a plan to unlock all features.
          </p>
          <Link
            to="/plans"
            className="btn-primary inline-block px-8 py-3"
          >
            View Available Plans
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;