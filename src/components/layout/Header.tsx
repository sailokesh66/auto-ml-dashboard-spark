
import React from "react";
import { useAutoML } from "../../context/AutoMLContext";

const Header = () => {
  const { fileName } = useAutoML();
  
  return (
    <header className="bg-automl-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <svg 
            className="h-8 w-8 mr-2" 
            viewBox="0 0 24 24"
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <h1 className="text-2xl font-bold">AutoML Dashboard</h1>
        </div>
        
        {fileName && (
          <div className="text-sm md:text-base bg-white/10 py-1 px-3 rounded-md">
            File: {fileName}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
