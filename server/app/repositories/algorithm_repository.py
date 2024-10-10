from datetime import datetime

from app.models.algorithm import Algorithm
from app.models.tag import Tag
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload, selectinload


class AlgorithmRepository:
    @staticmethod
    def get_all(db: Session, search: str = None):
        query = db.query(Algorithm).options(selectinload(Algorithm.tags))
        
        if search:
            query = query.filter(or_(
                Algorithm.name.ilike(f"%{search}%"),
                Algorithm.description.ilike(f"%{search}%")
            ))
        
        results = query.all()
        return results

    @staticmethod
    def get_by_id(db: Session, algorithm_id: int):
        return db.query(Algorithm).options(selectinload(Algorithm.tags)).filter(Algorithm.id == algorithm_id).first()

    @staticmethod
    def create(db: Session, algorithm_data: dict):
        current_time = datetime.utcnow()
        algorithm_data['created_at'] = current_time
        algorithm_data['updated_at'] = current_time
        db_algorithm = Algorithm(**algorithm_data)
        db.add(db_algorithm)
        db.commit()
        db.refresh(db_algorithm)
        return db_algorithm

    @staticmethod
    def update(db: Session, algorithm_id: int, algorithm_data: dict):
        db_algorithm = AlgorithmRepository.get_by_id(db, algorithm_id)
        if db_algorithm:
            algorithm_data['updated_at'] = datetime.utcnow()
            for key, value in algorithm_data.items():
                setattr(db_algorithm, key, value)
            db.commit()
            db.refresh(db_algorithm)
        return db_algorithm

    @staticmethod
    def delete(db: Session, algorithm_id: int):
        db_algorithm = AlgorithmRepository.get_by_id(db, algorithm_id)
        if db_algorithm:
            db.delete(db_algorithm)
            db.commit()
        return db_algorithm

    @staticmethod
    def add_tag(db: Session, algorithm_id: int, tag_name: str):
        algorithm = AlgorithmRepository.get_by_id(db, algorithm_id)
        if algorithm:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if not tag:
                tag = Tag(name=tag_name)
                db.add(tag)
                db.commit()
            if tag not in algorithm.tags:
                algorithm.tags.append(tag)
                db.commit()
                db.refresh(algorithm)
        return algorithm

    @staticmethod
    def remove_tag(db: Session, algorithm_id: int, tag_name: str):
        algorithm = AlgorithmRepository.get_by_id(db, algorithm_id)
        if algorithm:
            tag = db.query(Tag).filter(Tag.name == tag_name).first()
            if tag and tag in algorithm.tags:
                algorithm.tags.remove(tag)
                db.commit()
                db.refresh(algorithm)
        return algorithm

    @staticmethod
    def debug_tags(db: Session):
        algorithms = db.query(Algorithm).options(joinedload(Algorithm.tags)).all()
        for algorithm in algorithms:
            print(f"Algorithm ID: {algorithm.id}, Name: {algorithm.name}")
            print(f"Tags: {[tag.name for tag in algorithm.tags]}")
            print("---")