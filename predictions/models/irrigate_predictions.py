from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase


class Base(DeclarativeBase):
    pass


class IrrigatePredictions(Base):
    __tablename__ = "IrrigatePredictions"

    year: Mapped[int] = mapped_column(primary_key=True)
    week: Mapped[int] = mapped_column(primary_key=True)
    lengthMinutes: Mapped[float]
    amountWater: Mapped[float]
    FarmableLandId: Mapped[int]
