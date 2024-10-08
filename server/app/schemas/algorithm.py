from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AlgorithmBase(BaseModel):
    name: str
    description: str
    solution_code: str

class AlgorithmCreate(AlgorithmBase):
    pass

class AlgorithmUpdate(AlgorithmBase):
    pass

class AlgorithmInDB(AlgorithmBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AlgorithmResponse(AlgorithmInDB):
    created_at: str = Field(..., example="2023-04-20T12:34:56.789Z")
    updated_at: str = Field(..., example="2023-04-20T12:34:56.789Z")

    @classmethod
    def from_orm(cls, obj):
        # Convertir datetime a string ISO 8601
        return cls(
            id=obj.id,
            name=obj.name,
            description=obj.description,
            solution_code=obj.solution_code,
            created_at=obj.created_at.isoformat() if obj.created_at else None,
            updated_at=obj.updated_at.isoformat() if obj.updated_at else None
        )

    class Config:
        from_attributes = True