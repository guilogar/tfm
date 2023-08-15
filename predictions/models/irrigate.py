import datetime

from sqlalchemy import DateTime
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class Irrigate(Base):
    __tablename__ = "Irrigate"

    id: Mapped[int] = mapped_column(primary_key=True)
    amountWater: Mapped[float]
    lengthMinutes: Mapped[float]
    createdAt: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updatedAt: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    FarmableLandId: Mapped[int]
