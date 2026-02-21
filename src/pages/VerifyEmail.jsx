import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { authAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email verified successfully.');
        } else {
          setStatus('error');
          setMessage(response.error || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Invalid or expired verification link.');
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('No verification token provided.');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-orange-200 to-red-200 opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-pink-200 to-red-200 opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-white text-4xl">🍕</span>
          </div>
          <h1 className="mt-6 text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            PizzaMaster
          </h1>
        </div>

        <Card className="p-8 shadow-2xl border-0 backdrop-blur-sm bg-white/80 rounded-2xl">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader className="w-12 h-12 text-red-500 animate-spin" />
              <p className="text-gray-600 text-lg font-medium">Verifying your email...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <CheckCircle className="w-14 h-14 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">Email Verified!</h2>
              <p className="text-gray-500 text-center">{message}</p>
              <p className="text-gray-500 text-center text-sm">
                Your account is now active. You can sign in and start ordering.
              </p>
              <Link to="/login" className="w-full mt-2">
                <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg border-0">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <XCircle className="w-14 h-14 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
              <p className="text-gray-500 text-center">{message}</p>
              <p className="text-gray-500 text-center text-sm">
                The link may have expired (links are valid for 24 hours). Try registering again.
              </p>
              <div className="flex flex-col gap-2 w-full mt-2">
                <Link to="/register" className="w-full">
                  <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg border-0">
                    Register again
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
