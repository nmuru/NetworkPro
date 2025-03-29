import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/ui/file-uploader';
import ProfileCard from '@/components/ui/profile-card';
import { useLinkedInProfile } from '@/hooks/useLinkedInProfile';
import { Loader2 } from 'lucide-react';

interface HomeTabProps {
  onProceed: () => void;
}

export default function HomeTab({ onProceed }: HomeTabProps) {
  const { 
    profile, 
    isLoading, 
    handleFileUpload,
    updateProfile
  } = useLinkedInProfile();
  
  const [showEditForm, setShowEditForm] = useState(false);
  
  const handleEditProfile = () => {
    setShowEditForm(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-[#0077B5] animate-spin mb-4" />
        <p className="text-lg font-medium">Processing your LinkedIn profile...</p>
        <p className="text-gray-500 dark:text-gray-400">This may take a few moments</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Welcome to NetworkPro</h2>
      </div>
      
      {!profile ? (
        // Profile Upload Section (Initial State)
        <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
      ) : (
        // Profile Display Section (After Upload)
        <>
          <ProfileCard profile={profile} onEdit={handleEditProfile} />
          
          <div className="flex justify-center mt-8">
            <Button 
              className="bg-[#0A66C2] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-md transition"
              onClick={onProceed}
            >
              Proceed to Career Interests
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
