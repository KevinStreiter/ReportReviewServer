import glob
import logging
from typing import Optional

from repo.converter import html, text, jjson, rtf_to_text
from repo.database import select_report, query_report
from repo.parse import parse
from repo.writer import write



def q(cursor, day):
    rows = query_report(cursor, day)
    for row in rows:
        text = rtf_to_text(row['rtf'])
        row.pop('rtf', None)
        parsed = parse(text.splitlines())
        row.update(parsed)
    return rows


def get_as_txt(cursor, accession_number):
    # cursor, string -> Optional[str]
    report_file, meta_data_file = _load_write(cursor, accession_number)
    return text(report_file), jjson(meta_data_file)


def _load_write(cursor, accession_number):
    # cursor, string -> Optional[str]
    report_file_ref, meta_data_file_ref = _lookup(accession_number)
    if report_file_ref is None or meta_data_file_ref is None:
        report, meta_data = select_report(cursor, accession_number)
        report_file_ref, meta_data_file_ref = write(accession_number, report, meta_data)
    return report_file_ref, meta_data_file_ref


def _lookup(accession_number):
    # cursor, string -> Tuple[Optional[str], Optional[str]]
    logging.info('Looking accession number %s locally', accession_number)
    rtf = glob.glob('reports/*' + accession_number + '.rtf')
    meta_data = glob.glob('reports/*' + accession_number + '.json')
    if len(rtf) > 0 and len(meta_data) > 0:
        logging.info('Found accession number %s and meta data %s locally',
                     accession_number, meta_data)
        return rtf[0], meta_data[0]
    else:
        return None, None
