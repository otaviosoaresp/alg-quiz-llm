from app.repositories.algorithm_repository import AlgorithmRepository
from app.repositories.tag_repository import TagRepository
from app.schemas.algorithm import AlgorithmCreate, AlgorithmUpdate
from sqlalchemy.orm import Session
from typing import List

class AlgorithmService:
    @staticmethod
    def get_all_algorithms(db: Session, search: str = None):
        algorithms = AlgorithmRepository.get_all(db, search)
        return algorithms

    @staticmethod
    def get_algorithm_by_id(db: Session, algorithm_id: int):
        return AlgorithmRepository.get_by_id(db, algorithm_id)

    @staticmethod
    def create_algorithm(db: Session, algorithm: AlgorithmCreate):
        algorithm_data = algorithm.dict()
        tags_data = algorithm_data.pop('tags', [])
        
        db_algorithm = AlgorithmRepository.create(db, algorithm_data)
        
        for tag_data in tags_data:
            tag_name = tag_data['name']
            AlgorithmRepository.add_tag(db, db_algorithm.id, tag_name)
        
        return AlgorithmRepository.get_by_id(db, db_algorithm.id)

    @staticmethod
    def update_algorithm(db: Session, algorithm_id: int, algorithm_data: dict, tags: List[str]):
        updated_algorithm = AlgorithmRepository.update(db, algorithm_id, algorithm_data)
        if updated_algorithm:
            for tag in updated_algorithm.tags:
                AlgorithmRepository.remove_tag(db, algorithm_id, tag.name)
            
            for tag_name in tags:
                AlgorithmRepository.add_tag(db, algorithm_id, tag_name)
            
            TagRepository.remove_unused_tags(db)
        
        return AlgorithmRepository.get_by_id(db, algorithm_id)

    @staticmethod
    def delete_algorithm(db: Session, algorithm_id: int):
        algorithm = AlgorithmRepository.delete(db, algorithm_id)
        if algorithm:
            TagRepository.remove_unused_tags(db)
        return algorithm

    @staticmethod
    def add_tag_to_algorithm(db: Session, algorithm_id: int, tag_name: str):
        return AlgorithmRepository.add_tag(db, algorithm_id, tag_name)

    @staticmethod
    def remove_tag_from_algorithm(db: Session, algorithm_id: int, tag_name: str):
        result = AlgorithmRepository.remove_tag(db, algorithm_id, tag_name)
        TagRepository.remove_unused_tags(db)
        return result