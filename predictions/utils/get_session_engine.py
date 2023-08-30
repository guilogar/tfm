from sqlalchemy import create_engine
from sqlalchemy.orm import Session


def get_session_engine(user="", password="", host="", database=""):
    engine = create_engine(
        "postgresql://"+user+":"+password+"@"+host+"/"+database,
        isolation_level="REPEATABLE READ",
    )
    session = Session(engine)
    return engine, session
