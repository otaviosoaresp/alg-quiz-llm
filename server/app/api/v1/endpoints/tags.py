

from typing import List
from fastapi import APIRouter, Depends
from requests import Session

from app.db.session import get_db
from app.schemas.tag import Tag
from app.services.tag_service import TagService


router = APIRouter()


@router.get("/", response_model=List[Tag])
def get_tags(search: str = "", db: Session = Depends(get_db)):
    return TagService.get_all_tags(db, search)

@router.get("/{tag_id}", response_model=Tag)
def get_tag(tag_id: int, db: Session = Depends(get_db)):
    return TagService.get_tag_by_id(db, tag_id)

