import pandas
import sys

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor

from sqlalchemy import select

from models.irrigate import Irrigate
from models.irrigate_predictions import IrrigatePredictions

from utils.get_arguments import get_arguments
from utils.get_session_engine import get_session_engine
from constants.constants import MIN_SCORE_ESTIMATOR

arguments = get_arguments()

engine, session = get_session_engine(
    user=arguments["--user"], password=arguments["--password"],
    host=arguments["--host"], database=arguments["--database"]
)

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
neural_estimator_score = neural_estimator.score(X_test, y_test)

print(
    'The Score of the neural estimator is =>',
    neural_estimator_score
)

if neural_estimator_score < MIN_SCORE_ESTIMATOR:
    sys.exit(
        "The score of estimaor is under " + MIN_SCORE_ESTIMATOR + ". Aborting!"
    )

estimators = [
    {'name': 'neural', 'pipeline_estimator': neural_estimator}
]

for estimator in estimators:
    for week in range(1, 52):
        lengthMinutes = arguments["--lengthMinutes"]
        farmableLandId = arguments["--farmId"]
        predictX = pandas.DataFrame(
            [
                [
                    lengthMinutes, week, farmableLandId
                ]
            ],
            columns=[
                'lengthMinutes', 'numberWeek', 'FarmableLandId'
            ]
        )
        prediction = estimator['pipeline_estimator'].predict(
            predictX
        )

        irrigatePrediction = IrrigatePredictions(
            year=arguments["--year"],
            week=week,
            lengthMinutes=lengthMinutes,
            amountWater=round(prediction[0], 2),
            FarmableLandId=farmableLandId
        )
        session.add(irrigatePrediction)

session.flush()
session.commit()
