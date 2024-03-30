import React from "react";
import Login from "@/components/login/Login";

const LoginPage = () => {
  return <Login />;
};

LoginPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default LoginPage;
