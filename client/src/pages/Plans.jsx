import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiCheck, FiStar, FiZap } from 'react-icons/fi';
import api from '../services/api';
import { fetchMySubscription, changeSubscription } from '../store/slices/subscriptionSlice';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const currentSubscription = useSelector((state) => state.subscription.currentSubscription);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchPlans();
  if (user) dispatch(fetchMySubscription());
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data);
    } catch (error) {
      toast.error('Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    // Require authentication before attempting to subscribe
    const token = localStorage.getItem('accessToken');
    if (!token && !user) {
      toast.error('Please sign in to subscribe');
      navigate('/login');
      return;
    }

    // if user already has active subscription, confirm change
    if (currentSubscription) {
      const ok = window.confirm('You already have an active subscription. Do you want to change to this plan now?');
      if (!ok) return;
    }

    setSubscribing(planId);
    try {
      // if user already has active subscription, change it instead
      if (currentSubscription) {
        await dispatch(changeSubscription(planId)).unwrap();
        toast.success('Subscription changed successfully!');
        navigate('/dashboard');
      } else {
        const response = await api.post(`/subscriptions/subscribe/${planId}`);
        toast.success('Subscription successful!');
        navigate('/dashboard');
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401 || status === 403) {
        toast.error('You must be signed in to subscribe. Please sign in again.');
        // clear tokens and redirect to login to re-authenticate
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } else {
        const msg = error.response?.data?.error || error.message || 'Subscription failed';
        toast.error(msg);
      }
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getPlanIcon = (planName) => {
    if (planName.includes('Basic')) return <FiStar className="text-blue-500" />;
    if (planName.includes('Pro')) return <FiZap className="text-yellow-500" />;
    return <FiCheck className="text-green-500" />;
  };

  const getPlanFeatures = (features) => {
    if (Array.isArray(features)) return features;
    if (!features) return [];

    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your needs. All plans include our core features
          with varying levels of access and support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`card hover:shadow-lg transition-shadow duration-300 ${
              plan.name.includes('Pro') ? 'ring-2 ring-primary-500 transform scale-105' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">
                  {getPlanIcon(plan.name)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              </div>
              {plan.name.includes('Pro') && (
                <span className="badge-active">Popular</span>
              )}
            </div>

            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900">
                ${plan.price}
                <span className="text-sm text-gray-500 font-normal">/month</span>
              </div>
              <p className="text-gray-600 mt-2">
                Billed every {plan.duration} days
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {getPlanFeatures(plan.features).map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <FiCheck className="text-green-500" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={subscribing === plan.id}
                className={`btn-primary w-full py-3 ${
                  plan.name.includes('Pro') 
                    ? 'bg-gradient-to-r from-primary-600 to-purple-600' 
                    : ''
                }`}
              >
                {subscribing === plan.id ? 'Processing...' : (currentSubscription ? 'Change Plan' : 'Subscribe Now')}
              </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Plans;