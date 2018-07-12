import logging
import psycopg2
import daiquiri.formatter
import daiquiri

from repo.app import RIS_DB_SETTINGS, REVIEW_DB_SETTINGS
from repo.database.connection import open_connection
from repo.database.report import _query_departments
from review.database import _update_department

daiquiri.setup(level=logging.DEBUG,
    outputs=(
        daiquiri.output.File('poll-errors.log', level=logging.ERROR),
        daiquiri.output.RotatingFile(
            'poll-debug.log',
            level=logging.DEBUG,
            # 10 MB
            max_size_bytes=10000000)
    ))


def get_ris_db():
    db = open_connection(**RIS_DB_SETTINGS)
    return db


def get_review_db():
    db = psycopg2.connect(**REVIEW_DB_SETTINGS)
    return db


def query_departments():
    logging.info("Querying ris for departments")
    con = get_ris_db()
    rows = _query_departments(con.cursor())
    logging.info('Querying ris for departments, total of {} rows'.format(len(rows)))
    con.close()
    return rows


def update_departments():
    rows = query_departments()
    count = len(rows)
    logging.debug('Iterate over total of {} rows with department description'.format(count))
    review_db = get_review_db()
    review_cursor = review_db.cursor()
    for i, row in enumerate(rows, start=1):
        logging.debug('Iterating over row {}/{} rows'.format(i, count))
        _update_department(review_cursor, row)
    logging.info('Inserting departments done')
    review_db.commit()
    review_cursor.close()


if __name__ == '__main__':
    update_departments()

