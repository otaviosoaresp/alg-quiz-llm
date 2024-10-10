import requests
import json
import logging
import re

from app.db.session import SessionLocal
from app.core.config import settings
from app.repositories.algorithm_repository import AlgorithmRepository

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MOCK_RETURN = [
    {
        "id": 1,
        "text": "What is the purpose of using an auxiliary map (aux_map) in the algorithm?",
        "options": [
            {
                "id": "A",
                "text": "To store the result indices of the two numbers that sum up to the target"
            },
            {
                "id": "B",
                "text": "To avoid checking if a number is already used by storing its index"
            },
            {
                "id": "C",
                "text": "To quickly find the complement of the current number to reach the target"
            },
            {
                "id": "D",
                "text": "To store all numbers and their indices for easy access"
            }
        ],
        "correctAnswerId": "C"
    },
    {
        "id": 2,
        "text": "In which scenario would this algorithm fail to return the correct result?",
        "options": [
            {
                "id": "A",
                "text": "When there are no two numbers in the array that sum up to the target"
            },
            {
                "id": "B",
                "text": "When the array contains more than one solution"
            },
            {
                "id": "C",
                "text": "When the array has negative numbers but the target is positive"
            },
            {
                "id": "D",
                "text": "When the array elements are all zeros"
            }
        ],
        "correctAnswerId": "A"
    },
    {
        "id": 3,
        "text": "If you were to implement this algorithm without using a map for auxiliary storage, what would be one of the challenges?",
        "options": [
            {
                "id": "A",
                "text": "Finding the complement number in linear time"
            },
            {
                "id": "B",
                "text": "Ensuring no duplicates are used"
            },
            {
                "id": "C",
                "text": "Handling large arrays efficiently"
            },
            {
                "id": "D",
                "text": "Avoiding nested loops"
            }
        ],
        "correctAnswerId": "A"
    },
    {
        "id": 4,
        "text": "What is a potential optimization or improvement to the algorithm that could make it faster for very large arrays?",
        "options": [
            {
                "id": "A",
                "text": "Use a hash table instead of an array"
            },
            {
                "id": "B",
                "text": "Implement a binary search approach"
            },
            {
                "id": "C",
                "text": "Use dynamic programming to store intermediate results"
            },
            {
                "id": "D",
                "text": "Convert the array into a linked list"
            }
        ],
        "correctAnswerId": "A"
    },
    {
        "id": 5,
        "text": "Given that this algorithm is designed for efficiency, which of the following actions would not help in improving its runtime performance?",
        "options": [
            {
                "id": "A",
                "text": "Using a language with built-in hash table support"
            },
            {
                "id": "B",
                "text": "Ensuring that the array is sorted and using two pointers from both ends"
            },
            {
                "id": "C",
                "text": "Implementing memoization to store previously computed results"
            },
            {
                "id": "D",
                "text": "Using a programming paradigm not suited for this problem"
            }
        ],
        "correctAnswerId": "C"
    }
]

class OllamaGenerateQuizUseCase:

    def execute(self, algorithm_id: int):
        db = SessionLocal()
        try:
            algorithm = AlgorithmRepository.get_by_id(db, algorithm_id)
            if not algorithm:
                return {"error": "Algorithm not found"}

            prompt_part1 = f"""
                Based on the following algorithm:
                Name: {algorithm.name}
                Description: {algorithm.description}
                Solution Code:
                    {algorithm.solution_code}

                Generate 5 quiz questions with their respective answers to test a deep understanding of this algorithm.
                The questions must be multiple choice with 4 options each, and the correct answer must be indicated.
                Ensure the questions evaluate the understanding of the algorithm's logic, flow, and edge cases, rather than just syntax memorization.
                Include questions that prompt the user to consider alternative implementations, time complexity, or possible optimizations.
            """

            prompt_part2 = """
                Format the output as a JSON array of objects, each containing 'text', 'options' (as an array of objects with 'id' and 'text'), and 'correctAnswerId' keys.
                Answer only with the JSON object without any additional comments or text.

                The JSON returned must match the following example without any \n or \t:
                [
                    {
                        "id": 1,
                        "text": "What is the time complexity of the algorithm?",
                        "options": [
                            {"id": "A", "text": "O(n)"},
                            {"id": "B", "text": "O(n log n)"},
                            {"id": "C", "text": "O(log n)"},
                            {"id": "D", "text": "O(1)"}
                        ],
                        "correctAnswerId": "A"
                    }
                ]
            """

            prompt = prompt_part1 + prompt_part2

            return MOCK_RETURN

            response = requests.post(
                f"{settings.OLLAMA_API_URL}/generate",
                json={
                    "model": settings.OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False
                }
            )

        

            if response.status_code == 200:
                generated_text = response.json()["response"]
                logger.info(f"Generated text: {generated_text}")
                
                try:
                    quiz = self.extract_and_fix_json(generated_text)
                except json.JSONDecodeError as e:
                    logger.error(f"JSON decode error: {e}")
                    logger.error(f"Problematic JSON: {generated_text}")
                    return {"error": "Failed to parse generated quiz"}
                
                formatted_quiz = self.validate_and_format_quiz(quiz)
                
                return formatted_quiz
            else:
                logger.error(f"API request failed with status code: {response.status_code}")
                logger.error(f"Response content: {response.text}")
                return {"error": "Failed to generate quiz"}
        except Exception as e:
            logger.exception("An unexpected error occurred")
            return {"error": f"An unexpected error occurred: {str(e)}"}
        finally:
            db.close()

    def extract_and_fix_json(self, text):
        json_match = re.search(r'\[.*\]', text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            json_str = self.balance_brackets(json_str)
            return json.loads(json_str)
        else:
            raise ValueError("No JSON found in the response")

    def balance_brackets(self, s):
        stack = []
        opening = "{["
        closing = "}]"
        pairs = {"}": "{", "]": "["}
        for char in s:
            if char in opening:
                stack.append(char)
            elif char in closing:
                if not stack or stack[-1] != pairs[char]:
                    stack.append(pairs[char])
                else:
                    stack.pop()
        
        result = s
        for char in reversed(stack):
            result += closing[opening.index(char)]
        
        return result

    def validate_and_format_quiz(self, quiz):
        formatted_quiz = []
        for i, question in enumerate(quiz, start=1):
            formatted_question = {
                "id": i,
                "text": question.get("text", ""),
                "options": [
                    {"id": option["id"], "text": option["text"]}
                    for option in question.get("options", [])
                ],
                "correctAnswerId": question.get("correctAnswerId", "")
            }
            formatted_quiz.append(formatted_question)
        return formatted_quiz

