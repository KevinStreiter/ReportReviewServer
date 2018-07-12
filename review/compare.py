import logging
import re
import time
from typing import Dict, Tuple

import pydiff

from repo.converter import rtf_to_text

_word_split_re = re.compile(r'(\s+|[^\w\s]+)', re.UNICODE)


def _words_deleted_filter(change: Dict[str, str]) -> Dict[str, str]:
    return change if 'removed' in change and change['removed'] == True else None


def _words_added_filter(change: Dict[str, str]) -> Dict[str, str]:
    return change if 'added' in change and change['added'] == True else None


def _flatten(l):
    return [item for sublist in l for item in sublist]


def _tokenize(string):
    return [token for token in _word_split_re.split(string) if token]


def _total_length(report) -> int:
    if report is None:
        return 0
    return len(list(filter(str.strip, report.split(' '))))


def _all_deletions(changes):
    deletions = [x for x in [_words_deleted_filter(y) for y in changes]
                 if x is not None]
    values = [_tokenize(entry['value']) for entry in deletions]
    v = list(filter(str.strip, _flatten(values)))
    return len(v)


def _all_additions(changes):
    additions = [x for x in [_words_added_filter(y) for y in changes]
                 if x is not None]
    values = [_tokenize(entry['value']) for entry in additions]
    v = list(filter(str.strip, _flatten(values)))
    return len(v)


def _jaccard(before, after):
    before = before.split()
    after = after.split()
    union = list(set(after + before))
    intersection = list(set(before) - (set(before) - set(after)))
    jaccard = round(float(len(intersection)) / len(union), 3)
    return jaccard


def _diff(before, after):
    j = _jaccard(before, after)
    changes = pydiff.diff_words(before, after)
    deletions = _all_deletions(changes)
    additions = _all_additions(changes)
    return {'jaccard': j, 'additions': additions, 'deletions': deletions}


def _extract_section(befund):
    keyword = 'Befund'
    if keyword in befund:
        parts = befund.partition(keyword)
        befund = ''.join([parts[1], parts[2]])
    return befund


def diffs(row) -> Tuple[Dict[str, str], Dict[str, str], Dict[str, int], str]:
    s = time.time()
    befund_s = rtf_to_text(row['befund_s']) \
        if row['befund_s'] is not None else ''
    befund_g = rtf_to_text(row['befund_g']) \
        if row['befund_g'] is not None else ''
    befund_f = rtf_to_text(row['befund_f']) \
        if row['befund_f'] is not None else ''
    befund_s = _extract_section(befund_s)
    befund_g = _extract_section(befund_g)
    befund_f = _extract_section(befund_f)
    compare_s_f = _diff(befund_s, befund_f)
    compare_g_f = _diff(befund_g, befund_f)
    total_lengths = {'total_words_s': _total_length(befund_s),
                     'total_words_g': _total_length(befund_g),
                     'total_words_f': _total_length(befund_f)}
    e = time.time()
    logging.debug('Single row diff calculation took %s', e - s)
    return compare_s_f, compare_g_f, total_lengths, row['unters_schluessel']
