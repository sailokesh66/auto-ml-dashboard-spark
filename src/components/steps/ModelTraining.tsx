
import React, { useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useAutoML } from "../../context/AutoMLContext";
import { mockTrainModels } from "../../utils/dataUtils";
import { toast } from "../ui/sonner";
import { Progress } from "../ui/progress";

const ModelTraining = () => {
  const { 
    modelType, 
    setModelResults, 
    setFeatureImportance, 
    setCurrentStep,
    isLoading,
    setIsLoading,
    setSelectedModel 
  } = useAutoML();
  
  useEffect(() => {
    // Auto-start training when component loads
    handleTrainModels();
  }, []);
  
  const handleTrainModels = async () => {
    if (!modelType) {
      toast.error("Model type not determined. Please go back and select a target column.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mock training models
      const result = await mockTrainModels(modelType);
      
      // Update state with results
      setModelResults(result.modelResults);
      setFeatureImportance(result.featureImportance);
      
      // Select the best model automatically
      const bestModel = getBestModel(result.modelResults, modelType);
      setSelectedModel(bestModel);
      
      toast.success("Models trained successfully");
      setCurrentStep(6);
    } catch (error) {
      console.error("Error training models:", error);
      toast.error("Failed to train models");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to get the best model name based on metrics
  const getBestModel = (results: any[], type: string): string => {
    if (results.length === 0) return "";
    
    if (type === "classification") {
      // Sort by accuracy for classification
      return results.sort((a, b) => b.accuracy - a.accuracy)[0].modelName;
    } else {
      // Sort by R2 for regression (higher is better)
      return results.sort((a, b) => b.r2 - a.r2)[0].modelName;
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Training Models</CardTitle>
          <CardDescription>
            {modelType === "classification" 
              ? "Training classification models to predict your target category." 
              : "Training regression models to predict your target value."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="my-8 space-y-4">
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-medium">Training in Progress</h3>
                <p className="text-sm text-gray-500">
                  The system is automatically training and comparing multiple models.
                </p>
              </div>
              
              <Progress value={65} className="w-full" />
              
              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preparing data</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Feature engineering</span>
                  <span className="text-green-600">✓ Complete</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Training models</span>
                  <span className="text-amber-600">In progress...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Evaluating performance</span>
                  <span className="text-gray-400">Pending</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Preparing visualizations</span>
                  <span className="text-gray-400">Pending</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="my-8 text-center">
              <p>Something went wrong. Please try training the models again.</p>
              <Button className="mt-4" onClick={handleTrainModels}>
                Train Models
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelTraining;
