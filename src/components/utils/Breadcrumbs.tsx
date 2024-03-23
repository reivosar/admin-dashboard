import Link from "next/link";
import React from "react";
import { HomeIcon, ChevronRightIcon } from "@heroicons/react/solid"; // heroiconsを使用

const Breadcrumbs: React.FC<{ paths: { label: string; href?: string }[] }> = ({
  paths,
}) => {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-1">
          {paths[paths.length - 1]?.label}
        </h1>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
        <nav
          className="flex items-center text-gray-500 text-sm"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/" legacyBehavior>
                <a className="text-gray-500 hover:text-gray-700">
                  <HomeIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              </Link>
            </li>
            {paths.map((path, index) => (
              <React.Fragment key={index}>
                <li>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </li>
                <li
                  className={`${
                    index === paths.length - 1
                      ? "font-medium text-gray-900"
                      : ""
                  }`}
                >
                  {path.href ? (
                    <Link href={path.href} legacyBehavior>
                      <a className="hover:text-gray-700">{path.label}</a>
                    </Link>
                  ) : (
                    <span className="text-gray-500">{path.label}</span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumbs;
