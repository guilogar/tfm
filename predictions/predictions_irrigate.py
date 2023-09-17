import pandas
import sys
import datetime

from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPRegressor
from sklearn import metrics

from statsmodels.tsa.arima.model import ARIMA, ARIMAResultsWrapper

from sqlalchemy import select
from sqlalchemy.sql import func

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

stmt = select(Irrigate).where(Irrigate.createdAt < func.now())
irrigates = session.scalars(stmt).all()

dataX = []
dataY = []

for irrigate in irrigates:
    dataX.append(
        [
            irrigate.lengthMinutes,
            irrigate.createdAt.year,
            irrigate.createdAt.month,
            irrigate.createdAt.day,
            irrigate.FarmableLandId
        ]
    )
    dataY.append(
        irrigate.amountWater,
    )

X = pandas.DataFrame(
    dataX,
    columns=[
        'lengthMinutes', 'year', 'month', 'day', 'FarmableLandId'
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

time_series_arima = ARIMA(y_train)
time_series_arima_fit = time_series_arima.fit()
time_series_arima_predictions = time_series_arima_fit.predict(
    start=len(X_train),
    end=len(X_train) + len(X_test) - 1
)
time_series_arima_score = metrics.r2_score(
    y_test,
    time_series_arima_predictions
)

print(
    'The R^2 Score of the Neural Network estimator is =>',
    neural_estimator_score
)

print(
    'The R^2 Score of the ARIMA estimator is =>',
    time_series_arima_score
)

neural_condition = neural_estimator_score < 0 or neural_estimator_score < MIN_SCORE_ESTIMATOR
arima_condition = time_series_arima_score < 0 or time_series_arima_score < MIN_SCORE_ESTIMATOR
if neural_condition and arima_condition:
    sys.exit(
        "The score of estimator is under " +
        str(MIN_SCORE_ESTIMATOR) + ". Aborting!"
    )

estimators = [
    {'name': 'neural', 'pipeline_estimator': neural_estimator}
]

if time_series_arima_score > neural_estimator_score:
    estimators = [
        {'name': 'neural', 'pipeline_estimator': time_series_arima_fit}
    ]
    print('Using time series arima estimator...')
else:
    estimators = [
        {'name': 'neural', 'pipeline_estimator': neural_estimator}
    ]
    print('Using neural network estimator...')

days = int(arguments["--days"])

for estimator in estimators:
    for day in range(1, days + 1):
        lengthMinutes = arguments["--lengthMinutes"]
        farmableLandId = arguments["--farmId"]

        today = datetime.date.today()
        targetDate = today + datetime.timedelta(days=day)

        predictX = pandas.DataFrame(
            [
                [
                    lengthMinutes,
                    targetDate.year,
                    targetDate.month,
                    targetDate.day,
                    farmableLandId
                ]
            ],
            columns=[
                'lengthMinutes', 'year', 'month', 'day', 'FarmableLandId'
            ]
        )

        try:
            prediction = [0]
            if isinstance(estimator['pipeline_estimator'], Pipeline):
                prediction = estimator['pipeline_estimator'].predict(
                    predictX
                )
            elif isinstance(estimator['pipeline_estimator'], ARIMAResultsWrapper):
                prediction = estimator['pipeline_estimator'].predict(
                    start=0,
                    end=0
                )
            prediction = prediction.to_numpy()
        except:
            pass

        irrigatePrediction = IrrigatePredictions(
            date=targetDate,
            lengthMinutes=lengthMinutes,
            amountWater=round(prediction[0], 2),
            FarmableLandId=farmableLandId
        )

        stmtIrrigatePrediction = select(IrrigatePredictions).where(
            IrrigatePredictions.date == targetDate,
            IrrigatePredictions.FarmableLandId == farmableLandId
        )
        ip = session.scalars(stmtIrrigatePrediction).first()

        if not ip:
            session.add(irrigatePrediction)
        else:
            pass

session.flush()
session.commit()
