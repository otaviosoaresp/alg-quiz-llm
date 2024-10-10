from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.repositories.tag_repository import TagRepository
from app.models.tag import Tag
from app.schemas.tag import TagCreate


class TagService:

    @staticmethod
    def get_all_tags(db: Session, search: str = ""):
        return TagRepository.get_all(db, search)

    @staticmethod
    def get_tag_by_id(db: Session, tag_id: int):
        return db.query(Tag).filter(Tag.id == tag_id).first()

    @staticmethod
    def get_or_create_tag(db: Session, tag: TagCreate):
        db_tag = db.query(Tag).filter(Tag.name == tag.name).first()
        if db_tag:
            return db_tag
        
        db_tag = Tag(name=tag.name)
        db.add(db_tag)
        try:
            db.commit()
            db.refresh(db_tag)
        except IntegrityError:
            db.rollback()
            db_tag = db.query(Tag).filter(Tag.name == tag.name).first()
            if not db_tag:
                raise
        return db_tag
