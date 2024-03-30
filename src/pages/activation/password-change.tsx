import React from "react";
import ActivationPasswordChange from "@/components/activation/ActivationPasswordChange";
import { useRouter } from "next/router";

const ActivationPasswordChangePage = () => {
  const router = useRouter();
  const { param } = router.query;

  const activatonCode = Array.isArray(param) ? param[0] : param;

  const props = {
    activatonCode,
  };

  return <ActivationPasswordChange {...props} />;
};

ActivationPasswordChangePage.getInitialProps = async () => {
  return {
    noLayout: true,
  };
};

export default ActivationPasswordChangePage;
