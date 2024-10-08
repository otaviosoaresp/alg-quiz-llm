from sqlalchemy.orm import Session
from app.models.algorithm import Algorithm

def get_algorithms(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Algorithm).offset(skip).limit(limit).all()

def get_algorithm_by_id(db: Session, algorithm_id: int):
    return db.query(Algorithm).filter(Algorithm.id == algorithm_id).first()