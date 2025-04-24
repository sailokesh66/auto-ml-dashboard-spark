
import React from "react";
import { AutoMLProvider } from "../context/AutoMLContext";
import AutoMLDashboard from "../components/AutoMLDashboard";

const Index = () => {
  return (
    <AutoMLProvider>
      <AutoMLDashboard />
    </AutoMLProvider>
  );
};

export default Index;
