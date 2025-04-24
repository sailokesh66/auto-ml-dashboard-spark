
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAutoML } from "../../context/AutoMLContext";
import CorrelationHeatmap from "../visualizations/CorrelationHeatmap";
import ValueDistribution from "../visualizations/ValueDistribution";
import { generateCorrelationData, prepareDataForVisualization } from "../../utils/dataUtils";
import { toast } from "../ui/sonner";
import { Skeleton } from "../ui/skeleton";

const DataAnalysis = () => {
  const { data, columns, targetColumn, setCurrentStep } = useAutoML();
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [distributionData, setDistributionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Generate sample data for visualizations
  useEffect(() => {
    // Simulate loading delay for analysis
    const timer = setTimeout(() => {
      try {
        // Generate correlation heatmap data
        const corrData = generateCorrelationData(columns);
        setCorrelationData(corrData);
        
        // Generate distribution data for target column
        if (targetColumn) {
          const distData = prepareDataForVisualization(data, targetColumn.name);
          setDistributionData(distData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error generating analysis data:", error);
        toast.error("Failed to analyze data");
        setLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [data, columns, targetColumn]);
  
  const handleContinue = () => {
    setCurrentStep(5);
  };
  
  if (!targetColumn) {
    return (
      <div className="text-center p-8">
        <p>No target column selected. Please go back and select a target column.</p>
        <Button className="mt-4" onClick={() => setCurrentStep(3)}>
          Go to Target Selection
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Analysis</CardTitle>
          <CardDescription>
            Explore your data before training models. Understanding your data is key to successful machine learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="distribution">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="distribution">Target Distribution</TabsTrigger>
              <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
              <TabsTrigger value="summary">Data Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="distribution" className="pt-4">
              <h3 className="text-lg font-medium mb-4">
                Distribution of {targetColumn.name}
              </h3>
              
              {loading ? (
                <div className="chart-container">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <ValueDistribution data={distributionData} />
              )}
              
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  This chart shows the distribution of values in your target column. 
                  {targetColumn.type === "number" 
                    ? " For regression tasks, understanding the range and distribution helps with model selection."
                    : " For classification tasks, checking class balance is important for model training."}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="correlation" className="pt-4">
              <h3 className="text-lg font-medium mb-4">Feature Correlation</h3>
              
              {loading ? (
                <div className="chart-container">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <CorrelationHeatmap data={correlationData} />
              )}
              
              <div className="mt-4 text-sm text-gray-600">
                <p>
                  The heatmap shows correlations between numerical features. Strong correlations (near 1 or -1) 
                  indicate relationships between features that may affect model training.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="summary" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Dataset Overview</h4>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      <li><strong>Total rows:</strong> {data.length}</li>
                      <li><strong>Total columns:</strong> {columns.length}</li>
                      <li>
                        <strong>Column types:</strong> {' '}
                        {columns.filter(c => c.type === "number").length} numeric, {' '}
                        {columns.filter(c => c.type === "string").length} categorical, {' '}
                        {columns.filter(c => c.type === "boolean").length} boolean
                      </li>
                      <li><strong>Task type:</strong> {targetColumn.type === "number" ? "Regression" : "Classification"}</li>
                    </ul>
                  )}
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2">Target Column</h4>
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  ) : (
                    <ul className="space-y-1 text-sm">
                      <li><strong>Name:</strong> {targetColumn.name}</li>
                      <li><strong>Type:</strong> {targetColumn.type}</li>
                      <li>
                        <strong>Unique values:</strong> {' '}
                        {new Set(data.map(row => String(row[targetColumn.name]))).size}
                      </li>
                      {targetColumn.type === "number" && (
                        <li>
                          <strong>Range:</strong> {' '}
                          {Math.min(...data.map(row => Number(row[targetColumn.name])))} - {' '}
                          {Math.max(...data.map(row => Number(row[targetColumn.name])))}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-center">
            <Button onClick={handleContinue}>
              Continue to Model Training
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataAnalysis;
