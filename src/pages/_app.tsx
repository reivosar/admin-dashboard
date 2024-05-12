import "../styles/globals.css";
import App, { AppContext } from "next/app";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import {
  shouldRedirectToLogin,
  checkAuthStatus,
  forceLogout,
} from "./appSupport";
import DashboardHeader from "../components/DashboardHeader";
import DashboardNavigation from "../components/DashboardNavigation";
import DashboardSidebar from "../components/DashboardSidebar";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  const noLayout = pageProps.noLayout || false;
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      if (shouldRedirectToLogin(router.pathname)) {
        router.push("/login");
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
      setInterval(async () => {
        if (!(await checkAuthStatus())) {
          forceLogout();
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
        <div className="flex justify-between items-center bg-gray-900 text-white w-full fixed top-0 left-0 right-0 z-10">
          <DashboardHeader />
          <DashboardNavigation />
        </div>
      )}
      <div className="flex flex-1">
        {!noLayout && <DashboardSidebar />}
        <main
          className="flex-1 pt-4 pl-4 overflow-auto"
          style={{ paddingTop: "85px" }}
        >
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
