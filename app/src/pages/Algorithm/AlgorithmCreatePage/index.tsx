import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CodeEditor } from '../components/CodeEditor';
import { TagInput } from '@/components/TagInput';
import { useAlgorithm } from '@/hooks/useAlgorithm';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/tag';
import './styles.scss';

export const AlgorithmCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createAlgorithm } = useAlgorithm();
  const { tags, isLoading: isLoadingTags, error: tagsError } = useTags();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleTagSelect = (tag: Tag) => {
    if (!selectedTags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagCreate = (tagName: string) => {
    const newTag: Tag = { id: null, name: tagName };
    setSelectedTags([...selectedTags, newTag]);
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    setSelectedTags(selectedTags.filter(tag => tag.name !== tagToRemove.name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAlgorithm = await createAlgorithm({ 
      name, 
      description, 
      solution_code: solutionCode,
      tags: selectedTags
    });
    if (newAlgorithm) {
      navigate(`/algoritmos/${newAlgorithm.id}`);
    }
  };

  if (isLoadingTags) return <div>Loading tags...</div>;
  if (tagsError) return <div>Error: {tagsError}</div>;

  return (
    <div className="algorithm-create-page">
      <Card>
        <CardHeader>
          <CardTitle>New algorithm</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.form 
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <AlgorithmFormField label="Name" id="name">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </AlgorithmFormField>
              <AlgorithmFormField label="Description" id="description">
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </AlgorithmFormField>
              <AlgorithmFormField label="Tags">
                <TagInput
                  tags={tags}
                  selectedTags={selectedTags}
                  onTagSelect={handleTagSelect}
                  onTagRemove={handleTagRemove}
                  onTagCreate={handleTagCreate}
                />
              </AlgorithmFormField>
              <AlgorithmFormField label="Solution code" id="solutionCode">
                <CodeEditor
                  value={solutionCode}
                  onChange={setSolutionCode}
                />
              </AlgorithmFormField>
            </div>
          </motion.form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={!name || !description || !solutionCode}
            onClick={handleSubmit}
          >
            Create Algorithm
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const AlgorithmFormField: React.FC<{label: string; id?: string; children: React.ReactNode}> = ({label, id, children}) => (
  <div className="space-y-2">
    <label htmlFor={id} className="text-sm font-medium">{label}</label>
    {children}
  </div>
);