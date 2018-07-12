import logging

import psycopg2
import daiquiri
from psycopg2.extras import DictCursor

from repo.app import REVIEW_DB_SETTINGS
from review.database import query_all_rows, update_modality

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


def get_modality(unters_art):
    unters_art = unters_art[1:2]
    if unters_art == 'M':
        return 'MRI'

    elif unters_art == 'C':
        return 'CT'

    elif unters_art == 'U':
        return 'US'

    elif unters_art == 'S' or unters_art == 'R':
        return 'RX'

    else:
        return 'OTHER'


def update_modalities():
    review_db = get_review_db()
    review_cursor = review_db.cursor(cursor_factory=DictCursor)
    rows = query_all_rows(review_cursor)
    count = len(rows)
    logging.debug('Iterate over total of {} rows with modality description'.format(count))
    for i, row in enumerate(rows, start=1):
        logging.debug('Iterating over row {}/{} rows'.format(i, count))
        modality = get_modality(row['unters_art'])
        logging.debug('Modality {} generated'.format(modality))
        update_modality(review_cursor, row['unters_schluessel'], modality)
    logging.info('Inserting modality done')
    review_db.commit()
    review_cursor.close()


if __name__ == '__main__':
    update_modalities()

