import React from "react";
import DebugMenu from "@/components/debug/DebugMenu";

const DebugPage: React.FC = () => {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Debug</h1>
      </div>
      <div className="max-w-4xl mx-auto mt-10">
        <DebugMenu />
      </div>
    </div>
  );
};

export default DebugPage;
