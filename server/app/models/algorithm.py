from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class Algorithm(Base):
    __tablename__ = "algorithms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    solution_code = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())