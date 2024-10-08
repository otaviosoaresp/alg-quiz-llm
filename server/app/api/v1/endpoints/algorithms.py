from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.services import algorithm_service
from app.schemas.algorithm import AlgorithmResponse, AlgorithmCreate
from app.use_cases.ollama_generate_quiz import OllamaGenerateQuizUseCase

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/algorithms", response_model=list[AlgorithmResponse], tags=["algorithms"])
async def get_algorithms(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    """
    Recupera uma lista de algoritmos.

    - **skip**: Número de registros para pular (para paginação)
    - **limit**: Número máximo de registros para retornar
    """
    algorithms = algorithm_service.get_algorithms(db, skip=skip, limit=limit)
    return [AlgorithmResponse.from_orm(algo) for algo in algorithms]

@router.post("/algorithms", response_model=AlgorithmResponse, tags=["algorithms"])
async def create_algorithm(
    algorithm: AlgorithmCreate = Body(..., example={
        "name": "Two Sum",
        "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        "solution_code": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        aux_map = {}\n        for idx, num in enumerate(nums):\n            obj = target - num\n            if obj in aux_map:\n                return [aux_map[obj], idx]\n            aux_map[num] = idx"
    }),
    db: Session = Depends(get_db)
):
    """
    Cria um novo algoritmo.

    - **algorithm**: Dados do algoritmo a ser criado
    """
    created_algorithm = algorithm_service.create_algorithm(db, algorithm)
    return AlgorithmResponse.from_orm(created_algorithm)

@router.get("/algorithms/{algorithm_id}", response_model=AlgorithmResponse, tags=["algorithms"])
async def get_algorithm(algorithm_id: int, db: Session = Depends(get_db)):
    """
    Recupera um algoritmo específico pelo ID.

    - **algorithm_id**: ID do algoritmo a ser recuperado
    """
    algorithm = algorithm_service.get_algorithm(db, algorithm_id)
    if algorithm is None:
        raise HTTPException(status_code=404, detail="Algorithm not found")
    return AlgorithmResponse.from_orm(algorithm)

@router.get("/algorithms/{algorithm_id}/generate-quiz", tags=["algorithms"])
async def generate_quiz(algorithm_id: int):
    """
    Gera um quiz para um algoritmo específico.

    - **algorithm_id**: ID do algoritmo para o qual gerar o quiz
    """
    use_case = OllamaGenerateQuizUseCase()
    result = use_case.execute(algorithm_id)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result