from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional, Union
from datetime import datetime
from app.schemas.tag import TagCreate, Tag

class AlgorithmBase(BaseModel):
    name: str
    description: str
    solution_code: str

class AlgorithmCreate(AlgorithmBase):
    tags: List[TagCreate] = []

class AlgorithmUpdate(AlgorithmBase):
    tags: List[Union[str, TagCreate]] = []

class Algorithm(AlgorithmBase):
    id: int
    tags: List[Tag] = []
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def model_validate(cls, obj):
        if isinstance(obj, dict):
            for field in ['created_at', 'updated_at']:
                if field in obj and isinstance(obj[field], str):
                    obj[field] = datetime.strptime(obj[field], '%Y-%m-%d %H:%M:%S.%f')
        return super().model_validate(obj)