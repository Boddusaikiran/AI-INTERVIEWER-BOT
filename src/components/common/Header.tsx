import React from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../../routes";

const Header: React.FC = () => {
  const location = useLocation();
  const navigation = routes.filter((route) => route.visible !== false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M12 16v5" />
                  <path d="M16 16v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4" />
                  <path d="M4 16v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4" />
                  <path d="M12 2a6 6 0 0 0-6 6v3a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6Z" />
                  <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                AI Interviewer
              </span>
            </Link>
          </div>

          {/* When there's only one page, you can remove the entire navigation section */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 text-base font-medium rounded-md ${location.pathname === item.path
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  } transition duration-300`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
