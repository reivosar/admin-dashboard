import React from "react";
import UserActivationForm from "@/components/activation/UserActivationForm";
import { useRouter } from "next/router";

const ActivationPage = () => {
  const router = useRouter();
  const { code } = router.query;

  const activationCode = Array.isArray(code) ? code[0] : code;

  const activationProps = {
    activationCode,
  };

  return <UserActivationForm {...activationProps} />;
};

ActivationPage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default ActivationPage;
