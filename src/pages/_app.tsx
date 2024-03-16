import "../styles/globals.css";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import NavigationHeader from "../components/NavigationHeader";
import App from "next/app";

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center bg-gray-900 text-white w-full">
        <AdminHeader />
        <NavigationHeader />
      </div>
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-4 pl-4 ">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
