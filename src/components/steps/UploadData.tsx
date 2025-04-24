
import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useAutoML } from "../../context/AutoMLContext";
import { parseCSV } from "../../utils/dataUtils";
import { toast } from "../ui/sonner";

const UploadData = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { setData, setColumns, setCurrentStep, setFileName } = useAutoML();

  const processFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { data, columns } = parseCSV(text);
        
        if (data.length === 0) {
          toast.error("No valid data found in the CSV file");
          return;
        }
        
        setData(data);
        setColumns(columns);
        setFileName(file.name);
        toast.success("Data loaded successfully");
        setCurrentStep(2);
      } catch (error) {
        toast.error("Failed to parse CSV file. Please check the format.");
        console.error("CSV parsing error:", error);
      }
    };
    
    reader.onerror = () => {
      toast.error("Failed to read the file");
    };
    
    reader.readAsText(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      processFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleLoadDemo = () => {
    // Load demo dataset CSV
    const demoData = `age,gender,income,education,purchased
22,Male,45000,Bachelor,No
35,Female,70000,Master,Yes
45,Male,65000,Bachelor,Yes
28,Female,55000,Master,No
42,Male,80000,PhD,Yes
31,Female,60000,Bachelor,No
25,Male,48000,Bachelor,No
52,Female,95000,Master,Yes
38,Male,72000,PhD,Yes
29,Female,54000,Master,No
33,Male,63000,Bachelor,Yes
47,Female,85000,Master,Yes
41,Male,76000,Bachelor,Yes
24,Female,49000,Bachelor,No
36,Male,68000,Master,Yes`;
    
    const { data, columns } = parseCSV(demoData);
    setData(data);
    setColumns(columns);
    setFileName("demo_customer_data.csv");
    toast.success("Demo data loaded successfully");
    setCurrentStep(2);
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Upload Your Dataset</CardTitle>
          <CardDescription>
            Upload a CSV file to start your AutoML journey. The file should contain the data you want to analyze and build models with.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all ${
              dragActive ? "border-automl-500 bg-automl-50" : "border-gray-300 hover:border-automl-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <h3 className="text-lg font-medium mb-1">
              Drag and drop your CSV file here
            </h3>
            <p className="text-sm text-gray-500">or click to browse files</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleLoadDemo}>
            Load Demo Dataset
          </Button>
          
          <div className="text-sm text-gray-500">
            Max file size: 10MB
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadData;
