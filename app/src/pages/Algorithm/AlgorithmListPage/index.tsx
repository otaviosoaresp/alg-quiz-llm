import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Algorithm } from '@/types/algorithm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2, Code } from 'lucide-react';
import './styles.scss';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchAlgorithmsUseCase } from '@/usecases/Algorithm/fetchAlgorithms.usecase';
import { generateQuizUseCase } from '@/usecases/Algorithm/generateQuiz.usecase';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const AlgorithmListPage = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [algorithmToDelete, setAlgorithmToDelete] = useState<Algorithm | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAlgorithms = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAlgorithmsUseCase();
        setAlgorithms(data as Algorithm[]);
        setError(null);
      } catch (err) {
        setError('Failed to load algorithms. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlgorithms();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/algoritmos/${id}`);
  };

  const handleDelete = async (id: number) => {
    console.log(`Deletar algoritmo ${id}`);
    setAlgorithms(algorithms.filter(algo => algo.id !== id));
    setAlgorithmToDelete(null);
  };

  const handleStartQuiz = async (algorithmId: number) => {
    try {
      console.log('Starting quiz for algorithm:', algorithmId);
      const quiz = await generateQuizUseCase(algorithmId);
      console.log('Quiz generated:', quiz);
      navigate(`/quiz/${algorithmId}`, { state: { quiz } });
      console.log('Navigation attempted');
    } catch (error) {
      console.error('Failed to generate quiz:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="algorithm-list-page p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Algorithms</h1>
        <Link to="/algoritmos/novo">
          <Button className="bg-blue-500 hover:bg-blue-600 transition-colors">
            New Algorithm
          </Button>
        </Link>
      </div>
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {algorithms.map((algorithm) => (
            <motion.div 
              key={algorithm.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              layout
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white flex items-center">
                    <Code className="mr-2 text-blue-500" />
                    {algorithm.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-2">{algorithm.description.substring(0, 100)}...</p>
                  <p className="text-sm text-gray-500">Created: {formatDate(algorithm.created_at)}</p>
                </CardContent>
                <CardFooter className="justify-end space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(algorithm.id)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setAlgorithmToDelete(algorithm)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                  <Button onClick={() => handleStartQuiz(algorithm.id)}>
                    Start Quiz
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <AlertDialog open={!!algorithmToDelete} onOpenChange={(open) => !open && setAlgorithmToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the algorithm "{algorithmToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAlgorithmToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => algorithmToDelete && handleDelete(algorithmToDelete.id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};