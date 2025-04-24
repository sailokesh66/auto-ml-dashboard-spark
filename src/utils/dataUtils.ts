
import { Column, DataPoint, ModelType } from "../context/AutoMLContext";

// CSV parsing function
export const parseCSV = (csvText: string): { data: DataPoint[]; columns: Column[] } => {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map(header => header.trim());
  
  const data: DataPoint[] = [];
  const rowsToCheck = Math.min(lines.length - 1, 10); // Check first 10 rows or all rows if less
  
  // Initialize columns with type unknown
  const columns: Column[] = headers.map(name => ({ name, type: "unknown" }));
  
  // Process each data row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = line.split(",").map(val => val.trim());
    if (values.length !== headers.length) continue; // Skip invalid rows
    
    const rowData: DataPoint = {};
    
    // Process each value in the row
    values.forEach((value, j) => {
      const header = headers[j];
      rowData[header] = value;
      
      // Determine column type if still within rows to check
      if (i <= rowsToCheck) {
        const numValue = Number(value);
        
        if (!isNaN(numValue)) {
          // If previously unknown or already number, set as number
          if (columns[j].type === "unknown" || columns[j].type === "number") {
            columns[j].type = "number";
          }
        } else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
          // If boolean value
          if (columns[j].type === "unknown" || columns[j].type === "boolean") {
            columns[j].type = "boolean";
          }
        } else {
          // String value
          columns[j].type = "string";
        }
      }
    });
    
    data.push(rowData);
  }
  
  return { data, columns };
};

// Function to determine model type based on target column
export const determineModelType = (column: Column): ModelType => {
  if (column.type === "number") {
    return "regression";
  }
  return "classification";
};

// Function to convert data for visualization
export const prepareDataForVisualization = (
  data: DataPoint[], 
  column: string
): { value: string | number; count: number }[] => {
  const valueMap: Record<string, number> = {};
  
  // Count occurrences of each unique value
  data.forEach(row => {
    const value = String(row[column]);
    valueMap[value] = (valueMap[value] || 0) + 1;
  });
  
  // Convert to array format for charts
  return Object.entries(valueMap).map(([value, count]) => ({
    value: isNaN(Number(value)) ? value : Number(value),
    count
  }));
};

// Mock function to simulate model training
export const mockTrainModels = (modelType: ModelType): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (modelType === "classification") {
        resolve({
          modelResults: [
            { modelName: "Random Forest", accuracy: 0.92, precision: 0.91, recall: 0.89, f1Score: 0.90 },
            { modelName: "XGBoost", accuracy: 0.95, precision: 0.94, recall: 0.93, f1Score: 0.93 },
            { modelName: "Logistic Regression", accuracy: 0.87, precision: 0.85, recall: 0.84, f1Score: 0.84 },
            { modelName: "Decision Tree", accuracy: 0.83, precision: 0.82, recall: 0.81, f1Score: 0.81 },
            { modelName: "Support Vector Machine", accuracy: 0.89, precision: 0.88, recall: 0.87, f1Score: 0.87 }
          ],
          featureImportance: [
            { feature: "Age", importance: 0.25 },
            { feature: "Income", importance: 0.18 },
            { feature: "Education", importance: 0.15 },
            { feature: "Occupation", importance: 0.12 },
            { feature: "MaritalStatus", importance: 0.10 },
            { feature: "Gender", importance: 0.08 },
            { feature: "Location", importance: 0.07 },
            { feature: "Children", importance: 0.05 }
          ]
        });
      } else {
        resolve({
          modelResults: [
            { modelName: "Linear Regression", rmse: 2.3, mae: 1.8, r2: 0.82 },
            { modelName: "Random Forest", rmse: 1.8, mae: 1.5, r2: 0.88 },
            { modelName: "XGBoost", rmse: 1.5, mae: 1.2, r2: 0.91 },
            { modelName: "Ridge Regression", rmse: 2.1, mae: 1.7, r2: 0.85 },
            { modelName: "Lasso", rmse: 2.2, mae: 1.9, r2: 0.84 }
          ],
          featureImportance: [
            { feature: "Square Footage", importance: 0.35 },
            { feature: "Location", importance: 0.25 },
            { feature: "Bedrooms", importance: 0.15 },
            { feature: "Age", importance: 0.10 },
            { feature: "Bathrooms", importance: 0.08 },
            { feature: "Schools", importance: 0.04 },
            { feature: "Crime Rate", importance: 0.03 }
          ]
        });
      }
    }, 2000);
  });
};

// Generate mock correlation data
export const generateCorrelationData = (columns: Column[]): { x: string; y: string; correlation: number }[] => {
  const numericColumns = columns.filter(col => col.type === "number").map(col => col.name);
  const correlationData = [];
  
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = 0; j < numericColumns.length; j++) {
      const x = numericColumns[i];
      const y = numericColumns[j];
      
      // Generate random correlation coefficient between -1 and 1
      // For the diagonal, ensure correlation is 1
      const correlation = i === j ? 1 : Math.random() * 2 - 1;
      
      correlationData.push({
        x,
        y,
        correlation
      });
    }
  }
  
  return correlationData;
};
