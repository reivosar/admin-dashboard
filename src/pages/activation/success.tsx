import React from "react";
import ActivationConfirmation from "@/components/activation/ActivationConfirmation";

const ActivationConfirmationPage = () => {
  return <ActivationConfirmation />;
};

ActivationConfirmationPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default ActivationConfirmationPage;
