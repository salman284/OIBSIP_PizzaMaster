import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { authAPI } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'expired' | 'invalid' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage(response.message || 'Email verified successfully.');
        } else {
          classifyError(response.error || 'Verification failed.');
        }
      } catch (err) {
        classifyError(err.message || 'Invalid or expired verification link.');
      }
    };

    const classifyError = (errorMsg) => {
      setMessage(errorMsg);
      const lower = errorMsg.toLowerCase();
      if (lower.includes('expired')) {
        setStatus('expired');
      } else if (lower.includes('invalid') || lower.includes('already used')) {
        setStatus('invalid');
      } else {
        setStatus('error');
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('invalid');
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
              <p className="text-gray-600 text-center">{message}</p>
              <p className="text-gray-500 text-center text-sm">
                Your account is now active. You can sign in and start ordering delicious pizzas!
              </p>
              <Link to="/login" className="w-full mt-2">
                <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg border-0">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'expired' && (
            <div className="flex flex-col items-center gap-4 py-4">
              <XCircle className="w-14 h-14 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-800">Link Expired</h2>
              <p className="text-gray-600 text-center">{message}</p>
              <p className="text-gray-500 text-center text-sm">
                Verification links expire after 24 hours. You can easily request a new link from the login page.
              </p>
              <div className="flex flex-col gap-3 w-full mt-2">
                <Link to="/login" className="w-full">
                  <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg border-0">
                    Go to Login & Resend Link
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50">
                    Register a New Account
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {(status === 'invalid' || status === 'error') && (
            <div className="flex flex-col items-center gap-4 py-4">
              <XCircle className="w-14 h-14 text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {status === 'invalid' ? 'Invalid or Used Link' : 'Verification Failed'}
              </h2>
              <p className="text-gray-600 text-center">{message}</p>
              <p className="text-gray-500 text-center text-sm">
                This link may have already been used, or the token is incorrect. If you already verified, try signing in.
              </p>
              <div className="flex flex-col gap-3 w-full mt-2">
                <Link to="/login" className="w-full">
                  <Button className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg border-0">
                    Go to Login
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50">
                    Register again
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
