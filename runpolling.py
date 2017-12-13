import time
import logging
from datetime import datetime, timedelta
from threading import Thread
import psycopg2
import daiquiri
import daiquiri.formatter
import schedule

from repo.app import RIS_DB_SETTINGS, REVIEW_DB_SETTINGS
from repo.database.connection import open_connection
from repo.database.report import query_report_by_befund_status

from review.compare import diffs
from review.database import insert, update, query_review_reports, update_metrics

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


def query_ris(befund_status='s', hours=3):
    logging.info("Querying ris for befund_status {}".format(befund_status))
    con =  get_ris_db()
    start_date = datetime.now() - timedelta(hours)
    end_date = datetime.now()
    logging.debug("Query param: start date: '{}', end date: '{}', befund_status: '{}'"
        .format(start_date, end_date, befund_status))
    rows = query_report_by_befund_status(con.cursor(), start_date, end_date, befund_status)
    logging.info("Querying ris for befund_status {} returned #rows {}"
        .format(befund_status, len(rows)))
    con.close()
    return rows


def insert_reviews(review_cursor, hours=1):
    rows = query_ris('s', hours)
    count = len(rows)
    for i, row in enumerate(rows, start=1):
        logging.debug('Inserting row {}/{} rows'.format(i, count))
        insert(review_cursor, row)
    logging.info('Inserting done')


def update_reviews(review_cursor, befund_status='l', hours=2):
    rows = query_ris(befund_status, hours)
    count = len(rows)
    logging.debug('Updating total of {} rows with befund_status {}'
        .format(count, befund_status))
    for i, row in enumerate(rows, start=1):
        logging.debug('Updating row {}/{} rows'.format(i, count))
        update(review_cursor, row, befund_status)
    logging.info('Updating befund_status {} done'.format(befund_status))


def calculate_comparison(review_cursor):
    rows = query_review_reports(review_cursor)
    for r in rows:
        d = diffs(r)
        update_metrics(review_cursor, r['unters_schluessel'], d)




def job():
    review_db = get_review_db()
    review_cursor = review_db.cursor()
    insert_reviews(review_cursor, hours=2)
    update_reviews(review_cursor, 'l', hours=2)
    update_reviews(review_cursor, 'g', hours=2)
    update_reviews(review_cursor, 'f', hours=2)
    review_db.commit()
    review_cursor.close()
    cursor = review_db.cursor(cursor_factory=psycopg2.extras.DictCursor)
    calculate_comparison(cursor)


def run_schedule():
    while 1:
        schedule.run_pending()
        time.sleep(1)


if __name__ == '__main__':
    schedule.every(30).minutes.do(job)
    t = Thread(target=run_schedule)
    t.start()
    logging.info('Polling is up and running')