
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useAutoML } from "../../context/AutoMLContext";
import FeatureImportanceChart from "../visualizations/FeatureImportance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";

const ResultsVisualization = () => {
  const { 
    modelType, 
    modelResults, 
    featureImportance,
    selectedModel,
    setCurrentStep 
  } = useAutoML();
  
  if (modelResults.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No model results available. Please go back and train the models first.</p>
        <Button className="mt-4" onClick={() => setCurrentStep(5)}>
          Go to Model Training
        </Button>
      </div>
    );
  }
  
  // Filter to only show the selected model if one is selected
  const displayResults = selectedModel 
    ? modelResults.filter(model => model.modelName === selectedModel) 
    : modelResults;
  
  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Model Results & Visualization</CardTitle>
          <CardDescription>
            Explore the performance of your trained models and understand feature importance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metrics">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="metrics">Model Metrics</TabsTrigger>
              <TabsTrigger value="importance">Feature Importance</TabsTrigger>
              <TabsTrigger value="comparison">Model Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="metrics">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Model</TableHead>
                      {modelType === "classification" ? (
                        <>
                          <TableHead className="text-right">Accuracy</TableHead>
                          <TableHead className="text-right">Precision</TableHead>
                          <TableHead className="text-right">Recall</TableHead>
                          <TableHead className="text-right">F1 Score</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead className="text-right">RMSE</TableHead>
                          <TableHead className="text-right">MAE</TableHead>
                          <TableHead className="text-right">R²</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayResults.map((model, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {model.modelName}
                          {selectedModel === model.modelName && (
                            <span className="ml-2 text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Best model
                            </span>
                          )}
                        </TableCell>
                        {modelType === "classification" ? (
                          <>
                            <TableCell className="text-right">{(model.accuracy! * 100).toFixed(1)}%</TableCell>
                            <TableCell className="text-right">{(model.precision! * 100).toFixed(1)}%</TableCell>
                            <TableCell className="text-right">{(model.recall! * 100).toFixed(1)}%</TableCell>
                            <TableCell className="text-right">{(model.f1Score! * 100).toFixed(1)}%</TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-right">{model.rmse!.toFixed(3)}</TableCell>
                            <TableCell className="text-right">{model.mae!.toFixed(3)}</TableCell>
                            <TableCell className="text-right">{model.r2!.toFixed(3)}</TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2">Understanding the metrics</h3>
                {modelType === "classification" ? (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>Accuracy:</strong> Percentage of correct predictions (higher is better)</li>
                    <li><strong>Precision:</strong> Ratio of correct positive predictions to all positive predictions</li>
                    <li><strong>Recall:</strong> Ratio of correct positive predictions to all actual positives</li>
                    <li><strong>F1 Score:</strong> Harmonic mean of precision and recall</li>
                  </ul>
                ) : (
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><strong>RMSE:</strong> Root Mean Squared Error - measures average magnitude of errors (lower is better)</li>
                    <li><strong>MAE:</strong> Mean Absolute Error - average absolute difference between predicted and actual values</li>
                    <li><strong>R²:</strong> Coefficient of determination - proportion of variance explained by the model (higher is better)</li>
                  </ul>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="importance">
              <h3 className="text-lg font-medium mb-4">Feature Importance</h3>
              <FeatureImportanceChart data={featureImportance} />
              
              <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  Feature importance shows which variables have the most impact on the model's predictions.
                  Higher values indicate more influential features.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="comparison">
              <h3 className="text-lg font-medium mb-4">Model Comparison</h3>
              
              <div className="chart-container">
                {modelType === "classification" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">Accuracy Comparison</h4>
                      <div className="space-y-4">
                        {modelResults.map((model, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{model.modelName}</span>
                              <span>{(model.accuracy! * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-automl-500 h-2 rounded-full" 
                                style={{ width: `${model.accuracy! * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">F1 Score Comparison</h4>
                      <div className="space-y-4">
                        {modelResults.map((model, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{model.modelName}</span>
                              <span>{(model.f1Score! * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${model.f1Score! * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">R² Comparison</h4>
                      <div className="space-y-4">
                        {modelResults.map((model, index) => (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{model.modelName}</span>
                              <span>{model.r2!.toFixed(3)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-automl-500 h-2 rounded-full" 
                                style={{ width: `${model.r2! * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3">RMSE Comparison (lower is better)</h4>
                      <div className="space-y-4">
                        {modelResults.map((model, index) => {
                          // Find max RMSE for scaling
                          const maxRmse = Math.max(...modelResults.map(m => m.rmse || 0));
                          const percentage = model.rmse! / maxRmse * 100;
                          
                          return (
                            <div key={index}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{model.modelName}</span>
                                <span>{model.rmse!.toFixed(3)}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Button variant="outline" onClick={() => setCurrentStep(4)}>
              Back to Data Analysis
            </Button>
            <Button variant="outline" onClick={() => setCurrentStep(1)}>
              Start New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultsVisualization;
