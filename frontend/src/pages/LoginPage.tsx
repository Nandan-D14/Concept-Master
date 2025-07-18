import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import { useAuth } from '../store';

interface LoginFormInputs {
  phone: string;
  otp: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<LoginFormInputs>();
  const [isOTPSent, setIsOTPSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const sendOTP = async (phone: string) => {
    try {
      setLoading(true);
      const response = await authAPI.sendOTP(phone);
      if (response.data.success) {
        setIsOTPSent(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error('Failed to send OTP.');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      toast.error('Error sending OTP.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async ({ phone, otp }: LoginFormInputs) => {
    try {
      setLoading(true);
      const response = await authAPI.verifyOTP({ phone, otp });
      if (response.data.success) {
        const { token, user } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid OTP or login failed.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Login</h2>

      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number (10 digits)
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone', { required: 'Phone number is required', pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid phone number' } })}
            className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            disabled={isOTPSent || loading}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {isOTPSent && (
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
              OTP
            </label>
            <input
              type="text"
              id="otp"
              {...register('otp', { required: 'OTP is required', minLength: { value: 6, message: 'OTP must be 6 digits' }, maxLength: { value: 6, message: 'OTP must be 6 digits' } })}
              className={`w-full px-3 py-2 border ${errors.otp ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              disabled={loading}
            />
            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>}
          </div>
        )}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={() => {
              const phone = getValues('phone');
              if (phone) {
                sendOTP(phone);
              }
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            disabled={loading || isOTPSent}
          >
            {loading ? 'Sending...' : isOTPSent ? 'Resend OTP' : 'Send OTP'}
          </button>
          {isOTPSent && (
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP and Login'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;

