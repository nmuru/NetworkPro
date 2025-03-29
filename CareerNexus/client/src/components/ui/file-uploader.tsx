import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

export default function FileUploader({ onFileUpload, isLoading }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return false;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
    } else {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 text-center">
      <CardContent className="p-0">
        <div className="max-w-md mx-auto">
          <Upload className="w-12 h-12 text-[#0077B5] mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">Upload Your LinkedIn Profile</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Upload your LinkedIn profile PDF to get personalized career and networking recommendations.
          </p>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
              dragActive 
                ? "border-[#0077B5] bg-blue-50 dark:bg-blue-900/20" 
                : "border-gray-300 dark:border-gray-600 hover:border-[#0077B5]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input 
              ref={inputRef}
              type="file" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleChange}
            />
            <div className="flex flex-col items-center">
              {selectedFile ? (
                <>
                  <FileText className="h-12 w-12 text-[#0077B5] mb-3" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PDF files only (max. 5MB)
                  </span>
                </>
              )}
            </div>
          </div>
          
          <Button 
            className="mt-6 bg-[#0A66C2] hover:bg-blue-700 w-full sm:w-auto"
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Processing..." : "Continue with Upload"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
