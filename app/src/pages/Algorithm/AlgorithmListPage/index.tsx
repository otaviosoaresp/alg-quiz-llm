import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Algorithm } from '@/types/algorithm';
import { Tag } from '@/types/tag';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, Trash2, Code, Check, ChevronsUpDown, Search } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { fetchTagsUseCase } from '@/usecases/Tags/fetchTags.usecase';
import { cn } from "@/lib/utils";
import { deleteAlgorithmUseCase } from '@/usecases/Algorithm/deleteAlgorithm.usecase';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const AlgorithmListPage = () => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [filteredAlgorithms, setFilteredAlgorithms] = useState<Algorithm[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [algorithmToDelete, setAlgorithmToDelete] = useState<Algorithm | null>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadAlgorithmsAndTags = async () => {
      try {
        setIsLoading(true);
        const [algorithmsData, tagsData] = await Promise.all([
          fetchAlgorithmsUseCase(),
          fetchTagsUseCase()
        ]);
        setAlgorithms(algorithmsData as Algorithm[]);
        setFilteredAlgorithms(algorithmsData as Algorithm[]);
        setTags(tagsData as Tag[]);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlgorithmsAndTags();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    filterAlgorithms(term, selectedTags);
  };

  const handleTagSelect = (tagName: string) => {
    const existingTag = tags.find(t => t.name.toLowerCase() === tagName.toLowerCase());
    let newTag: Tag;

    if (existingTag) {
      newTag = existingTag;
    } else {
      newTag = { id: null, name: tagName };
    }

    if (!selectedTags.some(t => t.name.toLowerCase() === tagName.toLowerCase())) {
      const updatedSelectedTags = [...selectedTags, newTag];
      setSelectedTags(updatedSelectedTags);
      filterAlgorithms(searchTerm, updatedSelectedTags);
    }

    setValue("");
    setOpen(false);
  };

  const handleTagRemove = (tagToRemove: Tag) => {
    const updatedSelectedTags = selectedTags.filter(tag => tag.name !== tagToRemove.name);
    setSelectedTags(updatedSelectedTags);
    filterAlgorithms(searchTerm, updatedSelectedTags);
  };

  const filterAlgorithms = (term: string, selectedTags: Tag[]) => {
    const filtered = algorithms.filter(algo => 
      (algo.name.toLowerCase().includes(term) || algo.description.toLowerCase().includes(term)) &&
      (selectedTags.length === 0 || selectedTags.every(tag => 
        algo.tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())
      ))
    );
    setFilteredAlgorithms(filtered);
  };

  const handleEdit = (id: number) => {
    navigate(`/algoritmos/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAlgorithmUseCase(id); 
      setAlgorithms(algorithms.filter(algo => algo.id !== id));
      setFilteredAlgorithms(filteredAlgorithms.filter(algo => algo.id !== id));
      setAlgorithmToDelete(null);
    } catch (error) {
      console.error('Failed to delete algorithm:', error);
    }
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
      
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search algorithms..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 w-full bg-gray-700 text-white border-gray-600 focus:border-blue-500 rounded-md"
            />
          </div>
          
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between bg-gray-800 text-white border-gray-700"
              >
                {value ? tags.find((tag) => tag.name === value)?.name : "Select tag..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 bg-gray-800 border-gray-700">
              <Command>
                <CommandInput placeholder="Search tag..." className="text-white" />
                <CommandList>
                  <CommandEmpty>No tag found.</CommandEmpty>
                  <CommandGroup>
                    {tags.map((tag) => (
                      <CommandItem
                        key={tag.id}
                        value={tag.name}
                        onSelect={handleTagSelect}
                        className="text-white hover:bg-gray-700"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === tag.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {tag.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge 
              key={tag.name} 
              className="bg-blue-500 text-white cursor-pointer"
              onClick={() => handleTagRemove(tag)}
            >
              {tag.name} ×
            </Badge>
          ))}
        </div>
      </div>

      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredAlgorithms.map((algorithm) => (
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
                  {
                    algorithm.tags.map((tag) => (
                      <Badge key={tag.id} className="mr-2 bg-blue-500 text-white mb-4">
                        {tag.name}
                      </Badge>
                    ))
                  }
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