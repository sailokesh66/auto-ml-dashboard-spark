
import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useAutoML } from "../../context/AutoMLContext";
import { determineModelType } from "../../utils/dataUtils";
import { toast } from "../ui/sonner";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const TargetSelection = () => {
  const { columns, setTargetColumn, setCurrentStep, setModelType } = useAutoML();
  
  const handleTargetSelection = (columnName: string) => {
    const selectedColumn = columns.find(col => col.name === columnName);
    
    if (selectedColumn) {
      const updatedColumn = { ...selectedColumn, isTarget: true };
      setTargetColumn(updatedColumn);
      
      // Determine model type based on target column
      const modelType = determineModelType(updatedColumn);
      setModelType(modelType);
      
      toast.success(`Selected "${columnName}" as target column`);
      toast.success(`Detected task: ${modelType.toUpperCase()}`);
      
      setCurrentStep(4);
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Select Target Column</CardTitle>
          <CardDescription>
            Choose the column you want to predict. This will be your target variable for model training.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup className="space-y-3">
            {columns.map((column, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 border rounded-md p-3 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTargetSelection(column.name)}
              >
                <RadioGroupItem value={column.name} id={column.name} />
                <Label htmlFor={column.name} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{column.name}</span>
                      <span className="ml-2 text-sm text-gray-500">{column.type}</span>
                    </div>
                    <div>
                      {column.type === "number" ? (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Regression</span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">Classification</span>
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">What does this mean?</h4>
            <p className="text-sm text-gray-600">
              <strong>Classification:</strong> Predicting categorical outcomes (e.g., yes/no, categories)
              <br />
              <strong>Regression:</strong> Predicting numerical values (e.g., price, temperature)
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => setCurrentStep(2)}>
              Back to Data Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TargetSelection;
