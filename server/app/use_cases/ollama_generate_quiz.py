import requests
from app.repositories.algorithm_repository import get_algorithm_by_id
from app.db.session import SessionLocal
from app.core.config import settings

class OllamaGenerateQuizUseCase:

    def execute(self, algorithm_id: int):
        db = SessionLocal()
        try:
            algorithm = get_algorithm_by_id(db, algorithm_id)
            if not algorithm:
                return {"error": "Algorithm not found"}

            prompt = f"""
                Based on the following algorithm:
                Name: {algorithm.name}
                Description: {algorithm.description}
                Solution Code:
                {algorithm.solution_code}

                Generate 5 quiz questions with their respective answers to test a deep understanding of this algorithm.
                The questions must be multiple choice with 4 options each, and the correct answer must be indicated.
                Ensure the questions evaluate the understanding of the algorithm's logic, flow, and edge cases, rather than just syntax memorization.
                Include questions that prompt the user to consider alternative implementations, time complexity, or possible optimizations.

                Format the output as a JSON array of objects, each containing 'question', 'options' (as an array), and 'correct_answer' keys.
                Answer only with the JSON object without any additional comments or text.
                
                return in portuguese brazil
            """

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
                import json
                quiz = json.loads(generated_text)
                return quiz
            else:
                return {"error": "Failed to generate quiz"}
        finally:
            db.close()

