from typing import Optional
from pydantic import BaseModel, ConfigDict

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    id: Optional[int] = None

class Tag(TagBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
