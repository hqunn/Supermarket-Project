import React from "react";
import { useAuth } from "./AuthProvider"; // adjust path if needed

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div className="text-center mt-10">You are not logged in.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20 p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-4">Customer Profile</h2>
        <div className="text-lg mb-2">
          <strong>Username:</strong> {user?.username}
        </div>
        <div className="text-gray-500 text-sm mt-6">
          Note: Passwords are not displayed for security reasons.
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
