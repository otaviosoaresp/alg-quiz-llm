from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base

algorithm_tag = Table('algorithm_tag', Base.metadata,
    Column('algorithm_id', Integer, ForeignKey('algorithms.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class Algorithm(Base):
    __tablename__ = "algorithms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    solution_code = Column(String)

    created_at = Column(DateTime, default=lambda: datetime.utcnow())
    updated_at = Column(DateTime, default=lambda: datetime.utcnow(), onupdate=lambda: datetime.utcnow())

    tags = relationship("Tag", secondary=algorithm_tag, back_populates="algorithms")

    def __repr__(self):
        return f"<Algorithm(id={self.id}, name='{self.name}', created_at='{self.created_at}', updated_at='{self.updated_at}')>"
