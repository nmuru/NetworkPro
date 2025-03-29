import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useLinkedInProfile } from "@/hooks/useLinkedInProfile";
import { useInterests } from "@/hooks/useInterests";
import { useInterestSuggestions } from "@/hooks/useRecommendations";
import { Topic, Skill } from "@/types";
import { useToast } from "@/hooks/use-toast";
import InterestCheckbox from "@/components/ui/interest-checkbox";

interface InterestsTabProps {
  onBack: () => void;
  onNext: () => void;
}

export default function InterestsTab({ onBack, onNext }: InterestsTabProps) {
  const { profile } = useLinkedInProfile();
  const { suggestions, isLoading: isLoadingSuggestions } = useInterestSuggestions();
  const { interests, saveInterests, isLoading: isSavingInterests } = useInterests();
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const { toast } = useToast();

  // Initialize topics and skills from suggestions
  useEffect(() => {
    if (suggestions.suggestedTopics.length > 0) {
      setTopics(suggestions.suggestedTopics);
    }
    
    if (suggestions.suggestedSkills.length > 0) {
      setSkills(suggestions.suggestedSkills);
    }
  }, [suggestions]);

  // Set topics and skills from existing interests if available
  useEffect(() => {
    if (interests?.topics?.length > 0) {
      // Map existing interests to selected topics
      const updatedTopics = topics.map(topic => ({
        ...topic,
        selected: interests.topics.includes(topic.name)
      }));
      setTopics(updatedTopics);
      
      // Add custom interests that weren't in the suggestions
      const customFromSaved = interests.topics.filter(
        topic => !topics.some(t => t.name === topic)
      );
      setCustomInterests(customFromSaved);
    }
    
    if (interests?.skills?.length > 0) {
      // Map existing interests to selected skills
      const updatedSkills = skills.map(skill => ({
        ...skill,
        selected: interests.skills.includes(skill.name)
      }));
      setSkills(updatedSkills);
    }
  }, [interests, topics, skills]);

  const handleTopicChange = (id: string, checked: boolean) => {
    setTopics(
      topics.map(topic => {
        if (topic.id === id) {
          return { ...topic, selected: checked };
        }
        return topic;
      })
    );
  };

  const handleSkillChange = (id: string, checked: boolean) => {
    setSkills(
      skills.map(skill => {
        if (skill.id === id) {
          return { ...skill, selected: checked };
        }
        return skill;
      })
    );
  };

  const addCustomInterest = () => {
    if (!customInterest.trim()) return;
    
    if (customInterests.includes(customInterest.trim())) {
      toast({
        title: "Interest already exists",
        description: "This interest has already been added",
        variant: "destructive",
      });
      return;
    }
    
    setCustomInterests([...customInterests, customInterest.trim()]);
    setCustomInterest("");
  };

  const removeCustomInterest = (interest: string) => {
    setCustomInterests(customInterests.filter(i => i !== interest));
  };

  const handleSaveAndContinue = async () => {
    const selectedTopics = [
      ...topics.filter(topic => topic.selected).map(topic => topic.name),
      ...customInterests
    ];
    
    const selectedSkills = skills
      .filter(skill => skill.selected)
      .map(skill => skill.name);
    
    await saveInterests({
      topics: selectedTopics,
      skills: selectedSkills
    });
    
    onNext();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomInterest();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6">Career Interests</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Based on your profile, we've identified these interest areas. Select or add areas that interest you professionally.
        </p>
        
        {/* Suggested Interest Areas */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Suggested Interest Areas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Selections */}
            <div className="space-y-3">
              {topics.map(topic => (
                <InterestCheckbox
                  key={topic.id}
                  id={topic.id}
                  label={topic.name}
                  checked={topic.selected}
                  onChange={(checked) => handleTopicChange(topic.id, checked)}
                />
              ))}
            </div>
            
            {/* Skills to Learn */}
            <div className="space-y-3">
              {skills.map(skill => (
                <InterestCheckbox
                  key={skill.id}
                  id={skill.id}
                  label={skill.name}
                  checked={skill.selected}
                  onChange={(checked) => handleSkillChange(skill.id, checked)}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Custom Interests */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Custom Interests</h3>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Add an interest area..."
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] dark:bg-gray-700"
            />
            <Button 
              onClick={addCustomInterest}
              className="bg-[#0A66C2] text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition"
            >
              <span className="sr-only md:not-sr-only md:inline-block">Add</span>
              <span className="md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </span>
            </Button>
          </div>
          
          {/* Custom tags display */}
          {customInterests.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {customInterests.map((interest, index) => (
                <div 
                  key={index} 
                  className="bg-[#0A66C2] text-white rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {interest}
                  <button 
                    className="ml-2 focus:outline-none" 
                    onClick={() => removeCustomInterest(interest)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline"
            onClick={onBack}
            className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
          >
            Back
          </Button>
          <Button 
            onClick={handleSaveAndContinue}
            disabled={isSavingInterests}
            className="bg-[#0A66C2] hover:bg-blue-700 text-white font-medium"
          >
            {isSavingInterests ? 'Saving...' : 'Save and Continue'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
