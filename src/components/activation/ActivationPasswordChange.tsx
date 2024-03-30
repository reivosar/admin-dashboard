import React, { useState } from "react";
import { useRouter } from "next/router";
import { toastSuccess } from "../utils/ToastifyAlerts";
import { post } from "@/utils/api";

type ActivationProps = {
  activatonCode: string | undefined;
};

const ActivationPasswordChange: React.FC<ActivationProps> = ({
  activatonCode,
}) => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleActivation = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await post("/api/activation/password-change", {
        activatonCode,
        password,
        passwordConfirm,
      });
      if (response.error) {
        throw new Error(response.error.message);
      }
      toastSuccess("Password change success.");
      router.push("/login");
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
            Admin Dashboard Activation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter your activaton details to proceed
          </p>
        </div>
        {error && (
          <div className="mb-4 text-center text-sm text-red-600">{error}</div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleActivation}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                minLength={8}
                maxLength={20}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                autoComplete="current-passwordConfirm"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="passwordConfirm"
                value={passwordConfirm}
                minLength={8}
                maxLength={20}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Logging in..." : "Activation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivationPasswordChange;
