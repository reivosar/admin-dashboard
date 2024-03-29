import React from "react";
import LoginComponent from "@/components/login/LoginComponent";

const LoginPage = () => {
  return <LoginComponent />;
};

LoginPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default LoginPage;
