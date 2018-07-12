import logging
import psycopg2
import daiquiri
from psycopg2.extras import DictCursor

from repo.app import REVIEW_DB_SETTINGS
from review.compare import diffs
from review.database import query_review_reports_old_metrics, update_metrics

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


def _update_metrics():
    before = {}
    before_list = []
    after = {}
    after_list = []
    review_db = get_review_db()
    review_cursor = review_db.cursor(cursor_factory=DictCursor)
    rows = query_review_reports_old_metrics(review_cursor)
    count = len(rows)
    logging.debug('Iterate over total of {} rows'.format(count))
    for i, row in enumerate(rows, start=0):
        logging.debug('Iterating over row {}/{}'.format(i, count))
        logging.debug('Current jaccard_s_f: {} / jaccard_g_f: {}'.format(row['jaccard_s_f'], row['jaccard_g_f']))
        before["jaccard_s_f"] = row['jaccard_s_f']
        before["jaccard_g_f"] = row['jaccard_g_f']
        before_list.append(before)
        calculations = diffs(row)
        after["jaccard_g_f"] = calculations[1]['jaccard']
        after["jaccard_s_f"] = calculations[0]['jaccard']
        after_list.append(after)
        logging.debug('Row {} with new calculations: {}'.format(i,after_list[i]))
        update_metrics(review_cursor, row['unters_schluessel'], calculations)
        logging.debug('Updated row %s of %s', i, count)
    review_db.commit()
    review_cursor.close()
    logging.debug('Updating metrics done')


if __name__ == '__main__':
    _update_metrics()

