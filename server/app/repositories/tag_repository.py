from app.models.tag import Tag
from sqlalchemy.orm import Session


class TagRepository:
    @staticmethod
    def get_all(db: Session, search: str = ""):
        return db.query(Tag).filter(Tag.name.contains(search)).all()

    @staticmethod
    def get_by_id(db: Session, tag_id: int):
        return db.query(Tag).filter(Tag.id == tag_id).first()


    @staticmethod
    def create(db: Session, tag_data: dict):
        db_tag = Tag(**tag_data)
        db.add(db_tag)
        db.commit()
        db.refresh(db_tag)
        return db_tag

    @staticmethod
    def update(db: Session, tag_id: int, tag_data: dict):
        db_tag = TagRepository.get_by_id(db, tag_id)
        if db_tag:
            for key, value in tag_data.items():
                setattr(db_tag, key, value)
            db.commit()
            db.refresh(db_tag)
        return db_tag

    @staticmethod
    def delete(db: Session, tag_id: int):
        db_tag = TagRepository.get_by_id(db, tag_id)
        if db_tag:
            db.delete(db_tag)
            db.commit()
        return db_tag

    @staticmethod
    def remove_unused_tags(db: Session):
        unused_tags = db.query(Tag).filter(~Tag.algorithms.any()).all()
        for tag in unused_tags:
            db.delete(tag)
        db.commit()
        return len(unused_tags)

