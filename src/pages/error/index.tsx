import React from "react";
import { useRouter } from "next/router";

const ErrorPage = () => {
  const router = useRouter();
  const { message } = router.query;

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-r from-gray-50 to-gray-200 pt-20">
      <div className="w-full max-w-4xl space-y-8 shadow-lg rounded-lg p-10 bg-white">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900">
            Admin Dashboard - Error
          </h2>
          <p className="mt-4 text-center text-lg text-gray-600">
            Unfortunately, we've encountered an issue.
          </p>
          <p className="mt-4 text-center text-md text-red-500 font-medium">
            {message || "Please try navigating back or retry the operation."}
          </p>
        </div>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default ErrorPage;
