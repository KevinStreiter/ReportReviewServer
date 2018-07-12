import logging
import pandas as pd

import psycopg2
import daiquiri.formatter
import daiquiri
from psycopg2.extras import RealDictCursor
from repo.app import REVIEW_DB_SETTINGS
from review.calculations import relative, calculate_median
from review.compare import diffs
from review.database import query_all_by_departments

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


def _check_median():
    values = []
    median_values = []
    review_db = get_review_db()
    review_cursor = review_db.cursor(cursor_factory=RealDictCursor)
    rows = query_all_by_departments(review_cursor, ['AOD', 'CTD', 'MSK', 'NUK', 'IR', 'FPS'])
    df = pd.DataFrame(rows)
    rows = relative(df).to_dict('records')
    count = len(rows)
    logging.debug('Iterate over total of {} rows'.format(count))
    for i, row in enumerate(rows, start=0):
        logging.debug('Iterating over row {}/{}'.format(i, count))
        values.append(row)
        median_values.append(calculate_median(values))
        logging.debug('Current median-value{}'.format(median_values[i]))

    logging.debug("Median-Value by row 1000: {}".format(median_values[1000]))
    logging.debug("Median-Value by row 10000: {}".format(median_values[10000]))
    logging.debug("Median-Value by row 20000: {}".format(median_values[20000]))


if __name__ == '__main__':
    _check_median()

