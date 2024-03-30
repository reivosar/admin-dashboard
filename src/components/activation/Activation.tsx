import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils/api";

type ActivationProps = {
  activationCode: string | undefined;
};

const Activation: React.FC<ActivationProps> = ({ activationCode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!activationCode) {
      router.push({
        pathname: "/error",
        query: {
          message:
            "Activation code is missing. Please check your email for the activation link.",
        },
      });
      return;
    }
  }, [activationCode, router]);

  const handleActivation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await post("/api/activation", {
        activationCode,
        email,
        password,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      router.push("/activation/password-change");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gray-50 pt-20">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Admin Dashboard
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You're just one step away from activating your account. Please
            complete your activation below.
          </p>
        </div>
        {error && (
          <p className="mt-2 text-center text-sm text-red-600">{error}</p>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleActivation}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Activating..." : "Activate Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Activation;
