import React from 'react';

const TestProfile = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-green-600">✅ Profile Route Working!</h1>
      <p className="mt-4">If you can see this message, the Profile route is working correctly.</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p><strong>Current URL:</strong> {window.location.pathname}</p>
        <p><strong>Expected URL:</strong> /profile</p>
      </div>
    </div>
  );
};

export default TestProfile;
