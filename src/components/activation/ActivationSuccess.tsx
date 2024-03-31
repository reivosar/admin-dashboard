import React from "react";
import { useRouter } from "next/router";

const ActivationSuccess: React.FC = () => {
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Activation Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been successfully activated. You can now log in to
            your account.
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={goToLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivationSuccess;
