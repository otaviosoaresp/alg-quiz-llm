import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Algorithm } from '@/types/algorithm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CodeEditor } from '../components/CodeEditor';
import './styles.scss';
import { createAlgorithmUseCase } from '@/usecases/Algorithm/createAlgorithm.usecase';

export const AlgorithmCreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const algorithm = await createAlgorithmUseCase({ name, description, solution_code: solutionCode } as Algorithm);
    navigate(`/algoritmos/${algorithm.id}`);
  };

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
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="solutionCode">Solution code</label>
              <CodeEditor
                value={solutionCode}
                onChange={setSolutionCode}
              />
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