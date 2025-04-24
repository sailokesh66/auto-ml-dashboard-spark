
import React from "react";
import { useAutoML } from "../../context/AutoMLContext";
import { Button } from "../ui/button";
import { toast } from "../ui/sonner";

const steps = [
  { id: 1, title: "Upload Data" },
  { id: 2, title: "Data Preview" },
  { id: 3, title: "Target Selection" },
  { id: 4, title: "Data Analysis" },
  { id: 5, title: "Model Training" },
  { id: 6, title: "Results & Visualization" }
];

const StepNavigation = () => {
  const { currentStep, setCurrentStep, data, targetColumn } = useAutoML();

  const handleStepChange = (step: number) => {
    // Validate step change based on conditions
    if (step > 1 && data.length === 0) {
      toast.error("Please upload data first");
      return;
    }

    if (step > 3 && !targetColumn) {
      toast.error("Please select a target column first");
      return;
    }

    // Allow going back to previous steps always
    if (step <= currentStep) {
      setCurrentStep(step);
      return;
    }

    // Only allow going to the next step sequentially
    if (step === currentStep + 1) {
      setCurrentStep(step);
      return;
    }

    toast.error("Please complete the current step first");
  };

  const getStepClasses = (stepId: number) => {
    if (stepId === currentStep) return "step-active";
    if (stepId < currentStep) return "step-completed";
    return "step-pending";
  };

  return (
    <div className="py-4 mb-6">
      <div className="container mx-auto">
        <div className="hidden md:flex justify-between mb-2">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="text-center cursor-pointer" 
              onClick={() => handleStepChange(step.id)}
            >
              <div 
                className={`h-10 w-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${getStepClasses(step.id)}`}
              >
                {step.id < currentStep ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <p className="text-sm font-medium">{step.title}</p>
            </div>
          ))}
        </div>
        
        {/* Mobile step indicator */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <Button
            variant="outline"
            onClick={() => handleStepChange(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <span className="text-sm font-medium">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </span>
          <Button
            variant="outline"
            onClick={() => handleStepChange(currentStep + 1)}
            disabled={currentStep === steps.length}
          >
            Next
          </Button>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-automl-500 h-2.5 rounded-full" 
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StepNavigation;
