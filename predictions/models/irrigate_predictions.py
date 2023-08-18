import datetime

from sqlalchemy import Date
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class IrrigatePredictions(Base):
    __tablename__ = "IrrigatePredictions"

    date: Mapped[datetime.date] = mapped_column(
        Date(),
        server_default=func.now(),
        primary_key=True
    )
    lengthMinutes: Mapped[float]
    amountWater: Mapped[float]
    FarmableLandId: Mapped[int]
