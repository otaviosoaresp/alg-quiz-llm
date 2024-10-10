from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.session import Base
from app.models.algorithm import algorithm_tag

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    
    algorithms = relationship("Algorithm", secondary=algorithm_tag, back_populates="tags")
