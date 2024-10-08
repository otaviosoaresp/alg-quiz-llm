from sqlalchemy.orm import Session
from app.repositories import algorithm_repository
from app.models.algorithm import Algorithm
from app.schemas.algorithm import AlgorithmCreate
from datetime import datetime

def get_algorithms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Algorithm).offset(skip).limit(limit).all()

def create_algorithm(db: Session, algorithm: AlgorithmCreate):
    db_algorithm = Algorithm(**algorithm.dict(), created_at=datetime.utcnow(), updated_at=datetime.utcnow())
    db.add(db_algorithm)
    db.commit()
    db.refresh(db_algorithm)
    return db_algorithm

def update_algorithm(db: Session, algorithm_id: int, algorithm: AlgorithmCreate):
    db_algorithm = algorithm_repository.get_algorithm_by_id(db, algorithm_id)
    if db_algorithm is None:
        return None
    db_algorithm.name = algorithm.name
    db_algorithm.description = algorithm.description
    db_algorithm.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_algorithm)
    return db_algorithm

def get_algorithm(db: Session, algorithm_id: int):
    return algorithm_repository.get_algorithm_by_id(db, algorithm_id)