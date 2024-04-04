import "../styles/globals.css";
import App, { AppContext } from "next/app";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  clearToken,
  getTokenData,
  refreshTokenExpiry,
  shouldRedirectToLogin,
} from "../utils/auth";
import AdminHeader from "../components/AdminHeader";
import NavigationHeader from "../components/NavigationHeader";
import Sidebar from "../components/Sidebar";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  const noLayout = pageProps.noLayout || false;
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (shouldRedirectToLogin(router.pathname)) {
        router.push("/login");
      } else {
        refreshTokenExpiry();
      }
    };
    handleRouteChange();
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    const onLoginSuccess = () => {
      setInterval(() => {
        if (!getTokenData()) {
          clearToken();
          router.push("/login");
        }
      }, 1 * 60 * 1000);
    };
    onLoginSuccess();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>Admin Dashboard</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {!noLayout && (
        <div className="flex justify-between items-center bg-gray-900 text-white w-full">
          <AdminHeader />
          <NavigationHeader />
        </div>
      )}
      <div className="flex flex-1">
        {!noLayout && <Sidebar />}
        <main className="flex-1 pt-4 pl-4 overflow-auto">
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <div style={{ width: "96%" }}>
              <Component {...pageProps} />
            </div>
          </div>
          {/* Default toast setting */}
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </div>
    </div>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
