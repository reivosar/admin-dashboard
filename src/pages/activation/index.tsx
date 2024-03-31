import React from "react";
import Activation from "@/components/activation/Activation";
import { useRouter } from "next/router";

const ActivationPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const activationCode = Array.isArray(code) ? code[0] : code;

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
