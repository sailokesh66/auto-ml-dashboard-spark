
import React from "react";
import { useAutoML } from "../context/AutoMLContext";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import StepNavigation from "./navigation/StepNavigation";
import UploadData from "./steps/UploadData";
import DataPreview from "./steps/DataPreview";
import TargetSelection from "./steps/TargetSelection";
import DataAnalysis from "./steps/DataAnalysis";
import ModelTraining from "./steps/ModelTraining";
import ResultsVisualization from "./steps/ResultsVisualization";

const AutoMLDashboard = () => {
  const { currentStep } = useAutoML();
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadData />;
      case 2:
        return <DataPreview />;
      case 3:
        return <TargetSelection />;
      case 4:
        return <DataAnalysis />;
      case 5:
        return <ModelTraining />;
      case 6:
        return <ResultsVisualization />;
      default:
        return <UploadData />;
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <StepNavigation />
      <main className="flex-1 pb-10">
        {renderCurrentStep()}
      </main>
      <Footer />
    </div>
  );
};

export default AutoMLDashboard;
