import React from "react";
import DebugOptionsPanel from "@/components/debug/DebugOptionsPanel";

const DebugPage: React.FC = () => {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">Debug</h1>
      </div>
      <div className="max-w-4xl mx-auto mt-10">
        <DebugOptionsPanel />
      </div>
    </div>
  );
};

export default DebugPage;
