import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import './styles.scss';

export const AlgorithmCreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, description, solutionCode });
    navigate('/algoritmos');
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
              <Textarea
                id="solutionCode"
                value={solutionCode}
                onChange={(e) => setSolutionCode(e.target.value)}
                required
              />
            </div>
          </motion.form>
        </CardContent>
        <CardFooter>
          <Button type="submit">Crate Algorithm</Button>
        </CardFooter>
      </Card>
    </div>
  );
};