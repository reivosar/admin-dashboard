import React from "react";
import ActivationSuccess from "@/components/activation/ActivationSuccess";

const ActivationSuccessPage = () => {
  return <ActivationSuccess />;
};

ActivationSuccessPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default ActivationSuccessPage;
