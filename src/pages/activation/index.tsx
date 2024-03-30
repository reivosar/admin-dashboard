import React from "react";
import Activation from "@/components/activation/Activation";
import { useRouter } from "next/router";

const ActivationPage = () => {
  const router = useRouter();
  const { param } = router.query;

  const activationCode = Array.isArray(param) ? param[0] : param;

  const activationProps = {
    activationCode,
  };

  return <Activation {...activationProps} />;
};

ActivationPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default ActivationPage;
