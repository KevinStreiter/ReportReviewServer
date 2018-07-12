import logging
import random

import psycopg2
import daiquiri.formatter
import daiquiri
from psycopg2.extras import DictCursor

from repo.app import REVIEW_DB_SETTINGS
from review.database import query_all_rows, update_department_development

daiquiri.setup(level=logging.DEBUG,
    outputs=(
        daiquiri.output.File('poll-errors.log', level=logging.ERROR),
        daiquiri.output.RotatingFile(
            'poll-debug.log',
            level=logging.DEBUG,
            # 10 MB
            max_size_bytes=10000000)
    ))


def get_review_db():
    db = psycopg2.connect(**REVIEW_DB_SETTINGS)
    return db


def generate_department():
    departments = ['AOD', 'CTD', 'MSK', 'NUK', 'IR', 'FPS']
    return random.choice(departments)


def update_departments():
    review_db = get_review_db()
    review_cursor = review_db.cursor(cursor_factory=DictCursor)
    rows = query_all_rows(review_cursor)
    count = len(rows)
    logging.debug('Iterate over total of {} rows with department description'.format(count))
    for i, row in enumerate(rows, start=1):
        logging.debug('Iterating over row {}/{} rows'.format(i, count))
        department = generate_department()
        logging.debug('Department {} generated'.format((department)))
        update_department_development(review_cursor, row['unters_schluessel'], department)
    logging.info('Inserting departments done')
    review_db.commit()
    review_cursor.close()


if __name__ == '__main__':
    update_departments()

