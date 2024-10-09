import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Question } from '@/types/question';
import { Algorithm } from '@/types/algorithm';
import { fetchAlgorithmByIdUseCase } from '@/usecases/Algorithm/fetchAlgorithmsById.usecase';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './styles.scss';

interface QuizState {
  quiz: Question[];
}

export const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [algorithm, setAlgorithm] = useState<Algorithm | null>(null);
  const [loading, setLoading] = useState(true);

  const quizState = location.state as QuizState;
  const questions = quizState?.quiz || [];

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [algorithmInfoExpanded, setAlgorithmInfoExpanded] = useState(true);

  useEffect(() => {
    const loadAlgorithm = async () => {
      if (id) {
        try {
          const fetchedAlgorithm = await fetchAlgorithmByIdUseCase(parseInt(id));
          setAlgorithm(fetchedAlgorithm);
        } catch (error) {
          console.error("Error fetching algorithm:", error);
        }
      }
      setLoading(false);
    };

    loadAlgorithm();
  }, [id]);

  useEffect(() => {
    if (!loading && (!quizState || questions.length === 0)) {
      navigate('/algoritmos');
    }
  }, [loading, quizState, questions, navigate]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswerId(answerId);
  };

  const handleNextQuestion = () => {
    if (selectedAnswerId === questions[currentQuestionIndex].correctAnswerId) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerId(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerId(null);
    setScore(0);
    setQuizFinished(false);
    setQuizStarted(false);
    setAlgorithmInfoExpanded(true);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const toggleAlgorithmInfo = () => {
    setAlgorithmInfoExpanded(!algorithmInfoExpanded);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (quizFinished) {
    return (
      <div className="quiz-page container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl mb-4">Your score: {score} out of {questions.length}</p>
            <Button onClick={handleRestartQuiz}>Restart Quiz</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="quiz-page container mx-auto py-6">
      {!quizStarted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="algorithm-info">
            {algorithm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{algorithm.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="text-xl font-semibold mb-2">Description:</h3>
                  <div className="mb-4 whitespace-pre-wrap">{algorithm.description}</div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="code-solution">
            {algorithm && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Code Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                    {algorithm.solution_code}
                  </SyntaxHighlighter>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <div className={`algorithm-info transition-all duration-300 ${algorithmInfoExpanded ? 'w-1/2' : 'w-0'} relative`}>
            <AnimatePresence initial={false}>
              {algorithmInfoExpanded && (
                <motion.div
                  className="w-full h-full"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {algorithm && (
                    <Card className="h-full overflow-auto">
                      <CardHeader className="relative">
                        <Button
                          className="absolute left-2 top-2 z-10"
                          variant="outline"
                          size="icon"
                          onClick={toggleAlgorithmInfo}
                        >
                          <ChevronLeft />
                        </Button>
                        <CardTitle className="ml-10">{algorithm.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-xl font-semibold mb-2">Description:</h3>
                        <div className="mb-4 whitespace-pre-wrap">{algorithm.description}</div>
                        <h3 className="text-xl font-semibold mb-2">Code Solution:</h3>
                        <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                          {algorithm.solution_code}
                        </SyntaxHighlighter>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className={`quiz-questions transition-all duration-300 ${algorithmInfoExpanded ? 'w-1/2' : 'w-full'}`}>
            <Card className="h-full relative">
              {!algorithmInfoExpanded && (
                <Button
                  className="absolute left-2 top-2 z-10"
                  variant="outline"
                  size="icon"
                  onClick={toggleAlgorithmInfo}
                >
                  <ChevronRight />
                </Button>
              )}
              <CardHeader>
                <CardTitle className={!algorithmInfoExpanded ? "ml-10" : ""}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xl mb-4">{questions[currentQuestionIndex].text}</p>
                    <RadioGroup value={selectedAnswerId || ''} onValueChange={handleAnswerSelect}>
                      {questions[currentQuestionIndex].options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2 mb-2">
                          <RadioGroupItem value={option.id} id={`answer-${option.id}`} />
                          <Label htmlFor={`answer-${option.id}`}>{option.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleNextQuestion} 
                  disabled={!selectedAnswerId}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
      {!quizStarted && (
        <Button onClick={handleStartQuiz} className="w-full mt-6">Start Quiz</Button>
      )}
    </div>
  );
};