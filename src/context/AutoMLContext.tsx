
import React, { createContext, useState, useContext } from "react";
import { toast } from "../components/ui/sonner";

export type DataPoint = Record<string, string | number>;
export type Column = {
  name: string;
  type: "number" | "string" | "boolean" | "unknown";
  isTarget?: boolean;
};

export type ModelType = "classification" | "regression";

export type ModelResult = {
  modelName: string;
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1Score?: number;
  rmse?: number;
  mae?: number;
  r2?: number;
};

export type FeatureImportance = {
  feature: string;
  importance: number;
};

type AutoMLContextType = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  data: DataPoint[];
  setData: (data: DataPoint[]) => void;
  columns: Column[];
  setColumns: (columns: Column[]) => void;
  targetColumn: Column | null;
  setTargetColumn: (column: Column | null) => void;
  modelType: ModelType | null;
  setModelType: (type: ModelType | null) => void;
  modelResults: ModelResult[];
  setModelResults: (results: ModelResult[]) => void;
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
  featureImportance: FeatureImportance[];
  setFeatureImportance: (data: FeatureImportance[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  fileName: string;
  setFileName: (name: string) => void;
};

const AutoMLContext = createContext<AutoMLContextType | undefined>(undefined);

export const AutoMLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<DataPoint[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [targetColumn, setTargetColumn] = useState<Column | null>(null);
  const [modelType, setModelType] = useState<ModelType | null>(null);
  const [modelResults, setModelResults] = useState<ModelResult[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const value = {
    currentStep,
    setCurrentStep,
    data,
    setData,
    columns,
    setColumns,
    targetColumn,
    setTargetColumn,
    modelType,
    setModelType,
    modelResults,
    setModelResults,
    selectedModel,
    setSelectedModel,
    featureImportance,
    setFeatureImportance,
    isLoading,
    setIsLoading,
    fileName,
    setFileName,
  };

  return <AutoMLContext.Provider value={value}>{children}</AutoMLContext.Provider>;
};

export const useAutoML = () => {
  const context = useContext(AutoMLContext);
  if (context === undefined) {
    throw new Error("useAutoML must be used within an AutoMLProvider");
  }
  return context;
};
