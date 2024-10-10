from typing import List

from app.db.session import get_db
from app.schemas.algorithm import Algorithm, AlgorithmCreate, AlgorithmUpdate
from app.schemas.tag import TagCreate
from app.services.algorithm_service import AlgorithmService
from app.use_cases.ollama_generate_quiz import OllamaGenerateQuizUseCase
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

router = APIRouter()


@router.get("/", response_model=List[Algorithm])
def get_algorithms(
    db: Session = Depends(get_db),
    search: str = Query(None, description="Search algorithms by name")
):
    algorithms = AlgorithmService.get_all_algorithms(db, search)
    return algorithms 

@router.get("/{algorithm_id}", response_model=Algorithm)
def get_algorithm(algorithm_id: int, db: Session = Depends(get_db)):
    algorithm = AlgorithmService.get_algorithm_by_id(db, algorithm_id)
    if algorithm is None:
        raise HTTPException(status_code=404, detail="Algorithm not found")
    return algorithm

@router.post("/", response_model=Algorithm)
def create_algorithm(algorithm: AlgorithmCreate, db: Session = Depends(get_db)):
    return AlgorithmService.create_algorithm(db, algorithm)

@router.put("/{algorithm_id}", response_model=Algorithm)
def update_algorithm(algorithm_id: int, algorithm: AlgorithmUpdate, db: Session = Depends(get_db)):
    db_algorithm = AlgorithmService.get_algorithm_by_id(db, algorithm_id)
    if db_algorithm is None:
        raise HTTPException(status_code=404, detail="Algorithm not found")
    
    algorithm_data = algorithm.dict(exclude={"tags"})
    tags = [tag.name if isinstance(tag, TagCreate) else tag for tag in algorithm.tags]
    
    updated_algorithm = AlgorithmService.update_algorithm(db, algorithm_id, algorithm_data, tags)
    
    return updated_algorithm

@router.delete("/{algorithm_id}", response_model=Algorithm)
def delete_algorithm(algorithm_id: int, db: Session = Depends(get_db)):
    algorithm = AlgorithmService.delete_algorithm(db, algorithm_id)
    if algorithm is None:
        raise HTTPException(status_code=404, detail="Algorithm not found")
    return algorithm

@router.post("/test", response_model=Algorithm)
def create_test_algorithm(db: Session = Depends(get_db)):
    algorithm_data = {
        "name": "Test Algorithm",
        "description": "This is a test algorithm",
        "solution_code": "def test(): pass"
    }
    tags = ["test", "algorithm"]
    return AlgorithmService.create_algorithm(db, algorithm_data, tags)

@router.get("/{algorithm_id}/generate-quiz", tags=["algorithms"])
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