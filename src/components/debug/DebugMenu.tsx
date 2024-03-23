import Link from "next/link";
import React from "react";

const DebugMenu: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-semibold">Options</h2>
      </div>
      <div className="p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Option
              </th>
              <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link href="/debug/db/" legacyBehavior>
                  <a className="text-blue-600 hover:text-blue-900">
                    Database Debugging
                  </a>
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Tools and options for debugging database issues.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DebugMenu;
