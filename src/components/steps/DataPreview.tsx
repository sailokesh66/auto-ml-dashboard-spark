
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAutoML } from "../../context/AutoMLContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const DataPreview = () => {
  const { data, columns, setCurrentStep } = useAutoML();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  
  if (data.length === 0) {
    return (
      <div className="text-center p-8">
        <p>No data available. Please upload a dataset first.</p>
        <Button className="mt-4" onClick={() => setCurrentStep(1)}>
          Go to Upload
        </Button>
      </div>
    );
  }

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const displayData = data.slice(startIndex, startIndex + rowsPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleContinue = () => {
    setCurrentStep(3);
  };
  
  return (
    <div className="container mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>Data Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead key={index} className="whitespace-nowrap">
                      {column.name}
                      <span className="ml-1 text-xs text-gray-500">
                        ({column.type})
                      </span>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <TableCell key={colIndex} className="whitespace-nowrap">
                        {String(row[column.name] || "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, data.length)} of {data.length} rows
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="mb-2 text-gray-600">
              Review your data to ensure it's correct, then proceed to select your target column.
            </p>
            <Button onClick={handleContinue}>Continue to Target Selection</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPreview;
