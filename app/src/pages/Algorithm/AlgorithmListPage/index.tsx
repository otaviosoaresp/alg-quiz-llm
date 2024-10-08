import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Algorithm } from '@/types/Algorithm';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2 } from 'lucide-react';
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
        setAlgorithms(data);
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

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="algorithm-list-page">
      <h1>Algorithms</h1>
      <Link to="/algoritmos/novo">
        <Button>New Algorithm</Button>
      </Link>
      <motion.div 
        className="algorithm-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {algorithms.map((algorithm) => (
          <motion.div 
            key={algorithm.id} 
            whileTap={{ scale: 0.95 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{algorithm.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Created at: {formatDate(algorithm.created_at)}</p>
              </CardContent>
              <CardFooter className="justify-end space-x-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(algorithm.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setAlgorithmToDelete(algorithm)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

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