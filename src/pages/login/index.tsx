import React from "react";
import UserLoginForm from "@/components/login/UserLoginForm";

const LoginPage = () => {
  return <UserLoginForm />;
};

LoginPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default LoginPage;
