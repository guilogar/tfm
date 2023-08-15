from sqlalchemy import create_engine, select, DateTime
from sqlalchemy.orm import Mapped, mapped_column, DeclarativeBase, Session
from sqlalchemy.sql import func

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import SGDRegressor
from sklearn.neural_network import MLPRegressor

import datetime
import pandas
import random

engine = create_engine(
    "postgresql://smartrural:smartrural@localhost/smartrural",
    isolation_level="REPEATABLE READ",
)

session = Session(engine)


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


stmt = select(Irrigate)
irrigates = session.scalars(stmt).all()

dataX = []
dataY = []

for irrigate in irrigates:
    dataX.append(
        [
            irrigate.lengthMinutes,
            irrigate.createdAt.isocalendar().week,
            irrigate.FarmableLandId
        ]
    )
    dataY.append(
        irrigate.amountWater,
    )

X = pandas.DataFrame(
    dataX,
    columns=[
        'lengthMinutes', 'numberWeek', 'FarmableLandId'
    ]
)

y = pandas.Series(
    dataY
)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, random_state=42, test_size=0.20
)

linear_estimator = Pipeline(
    [
        ('std', StandardScaler()),
        ('linear_rgr', SGDRegressor())
    ]
)
linear_estimator.fit(X_train, y_train)
print("Score of linear predictors => ", linear_estimator.score(X_test, y_test))

mplregr = MLPRegressor(
    hidden_layer_sizes=[50, 20],
    learning_rate='adaptive',
    alpha=0.1,
    max_iter=3000,
)
neural_estimator = Pipeline(
    [
        ('std', StandardScaler()),
        ('mplregr', mplregr)
    ]
)
neural_estimator.fit(X_train, y_train)
print(
    'Score of neural network predictors => ',
    neural_estimator.score(X_test, y_test)
)

estimators = [
    {'name': 'linear', 'pipeline_estimator': linear_estimator},
    {'name': 'neural', 'pipeline_estimator': neural_estimator}
]


for estimator in estimators:
    for week in range(1, 52):
        predictX = pandas.DataFrame(
            [
                [
                    random.randint(50, 60), week, random.randint(1, 2)
                ]
            ],
            columns=[
                'lengthMinutes', 'numberWeek', 'FarmableLandId'
            ]
        )
        print(
            "Estimation of a single record with",
            estimator['name'],
            "estimator (week:",
            str(week),
            ") => ",
            estimator['pipeline_estimator'].predict(
                predictX
            )
        )
