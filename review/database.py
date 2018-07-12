import logging
import psycopg2
from psycopg2.extras import execute_values
import datetime


def query_review_reports(cursor):
    """
    Returns the rows where the reports are finalized and metrics are not yet
    calculated.
    """
    sql = """
          SELECT
            unters_schluessel,
            befund_s,
            befund_g,
            befund_f,
            unters_beginn
          FROM
            reports
          WHERE
            befund_f is not null
          AND
            jaccard_s_f is null
          OR
            (jaccard_s_f = 0 AND jaccard_g_f = 0)
          ORDER BY
            unters_beginn desc
          LIMIT 1000
          """
    cursor.execute(sql)
    results = cursor.fetchall()
    return results


def query_review_reports_old_metrics(cursor):
    """
    Returns the rows where the reports are finalized, temporary method to update old metrics
    """
    sql = """
          SELECT
            unters_schluessel,
            befund_s,
            befund_g,
            befund_f,
            jaccard_s_f,
            jaccard_g_f,
            words_added_s_f,
            words_added_g_f,
            words_deleted_s_f,
            words_deleted_g_f,
            total_words_s,
            total_words_g,
            total_words_f,
            unters_beginn
          FROM
            reports
          WHERE
            befund_f is not null
          ORDER BY
            unters_beginn desc
          """
    cursor.execute(sql)
    results = cursor.fetchall()
    return results


def update_metrics(cursor, unters_schluessel, diffs):
    sql = """
          UPDATE reports SET
            jaccard_s_f = %s,
            words_added_s_f = %s,
            words_deleted_s_f = %s,
            jaccard_g_f = %s,
            words_added_g_f = %s,
            words_deleted_g_f = %s,
            total_words_s = %s,
            total_words_g = %s,
            total_words_f = %s
          WHERE
            unters_schluessel = %s
          """
    try:

        cursor.execute(sql,
                       (diffs[0]['jaccard'],
                        diffs[0]['additions'],
                        diffs[0]['deletions'],
                        diffs[1]['jaccard'],
                        diffs[1]['additions'],
                        diffs[1]['deletions'],
                        diffs[2]['total_words_s'],
                        diffs[2]['total_words_g'],
                        diffs[2]['total_words_f'],
                        unters_schluessel))
    except psycopg2.Error as e:
        logging.error('Error %s', e)


def insert(cursor, row):
    sql = """
          INSERT INTO reports
            (patient_schluessel,
            unters_schluessel,
            unters_art,
            befund_schluessel,
            unters_beginn,
            schreiber,
            freigeber,
            befund_freigabe,
            befund_status,
            befund_s,
            untart_name,
            pat_name,
            pat_vorname,
            pp_misc_mfd_1_kuerzel,
            pp_misc_mfd_1_bezeichnung)
          VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
          ON CONFLICT
            (unters_schluessel)
          DO NOTHING
          """
    cursor.execute(sql,
                   (row['patient_schluessel'],
                    row['unters_schluessel'],
                    row['unters_art'],
                    row['befund_schluessel'],
                    row['unters_beginn'],
                    row['schreiber'],
                    row['freigeber'],
                    row['befund_freigabe'],
                    row['befund_status'],
                    row['befund_s'],
                    row['untart_name'],
                    row['pat_name'],
                    row['pat_vorname'],
                    row['pp_misc_mfd_1_kuerzel'],
                    row['pp_misc_mfd_1_bezeichnung']))


def update(cursor, row, befund_status):
    field = 'befund_' + befund_status
    sql = """
          UPDATE reports
          SET
            {} = %s,
            lese_datum = %s,
            leser = %s,
            gegenlese_datum = %s,
            gegenleser = %s,
            freigeber = %s,
            befund_status = %s,
            befund_freigabe = %s,
            unters_beginn = %s,
            pat_vorname = %s,
            pat_name = %s,
            untart_name = %s
          WHERE
            unters_schluessel = %s
          """.format(field)
    cursor.execute(sql,
                   (row[field],
                    row['lese_datum'],
                    row['leser'],
                    row['gegenlese_datum'],
                    row['gegenleser'],
                    row['freigeber'],
                    row['befund_status'],
                    row['befund_freigabe'],
                    row['unters_beginn'],
                    row['pat_vorname'],
                    row['pat_name'],
                    row['untart_name'],
                    row['unters_schluessel']))


def query_by_writer_and_department_and_modality(cursor, writer, last_exams, departments, modalities):
    """
    Query all reports in the review db by writer.
    """
    sql = """
          SELECT
            a.patient_schluessel,
            a.unters_schluessel,
            a.unters_art,
            a.unters_beginn,
            a.befund_schluessel,
            a.schreiber,
            a.signierer,
            a.freigeber,
            a.befund_freigabe,
            a.befund_status,
            a.lese_datum,
            a.leser,
            a.gegenlese_datum,
            a.gegenleser,
            a.pat_name,
            a.pat_vorname,
            a.untart_name,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f,
            a.pp_misc_mfd_1_kuerzel,
            a.pp_misc_mfd_1_bezeichnung,
            a.modality
          FROM
            reports a
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.schreiber = %s
          AND
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          AND 
              a.pp_misc_mfd_1_kuerzel = ANY(%s)
          AND 
              a.modality = ANY(%s)
          ORDER BY
              a.unters_beginn desc
          LIMIT %s
          """
    cursor.execute(sql, (writer.upper(), departments, modalities, last_exams))
    return cursor.fetchall()


def query_by_writer_and_date_and_department_and_modality(cursor, writer, start_date, end_date, departments, modalities):
    """
    Query all reports in the review db by writer.
    """
    sql = """
          SELECT
            a.patient_schluessel,
            a.unters_schluessel,
            a.unters_art,
            a.unters_beginn,
            a.befund_schluessel,
            a.schreiber,
            a.signierer,
            a.freigeber,
            a.befund_freigabe,
            a.befund_status,
            a.lese_datum,
            a.leser,
            a.gegenlese_datum,
            a.gegenleser,
            a.pat_name,
            a.pat_vorname,
            a.untart_name,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f,
            a.pp_misc_mfd_1_kuerzel,
            a.pp_misc_mfd_1_bezeichnung,
            a.modality
          FROM
            reports a 
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.schreiber = %s
          AND
              a.unters_beginn between %s and %s
          AND
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          AND
              a.pp_misc_mfd_1_kuerzel = ANY(%s)
          AND
              a.modality = ANY(%s)
          ORDER BY
              a.unters_beginn desc
          """
    cursor.execute(sql, (writer.upper(), start_date, end_date, departments, modalities))
    return cursor.fetchall()


def query_by_reviewer_and_department_and_modality(cursor, reviewer, last_exams, departments, modalities):
    """
    Query all reports in the review db by reviewer.
    """
    sql = """
          SELECT
            a.patient_schluessel,
            a.unters_schluessel,
            a.unters_art,
            a.unters_beginn,
            a.befund_schluessel,
            a.schreiber,
            a.signierer,
            a.freigeber,
            a.befund_freigabe,
            a.befund_status,
            a.lese_datum,
            a.leser,
            a.gegenlese_datum,
            a.gegenleser,
            a.pat_name,
            a.pat_vorname,
            a.untart_name,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f,
            a.pp_misc_mfd_1_kuerzel,
            a.pp_misc_mfd_1_bezeichnung,
            a.modality
          FROM
            reports a
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.freigeber = %s
          AND
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          AND 
              a.pp_misc_mfd_1_kuerzel = ANY(%s)
          AND 
              a.modality= ANY(%s)
          ORDER BY
              a.unters_beginn desc
          LIMIT %s
          """
    cursor.execute(sql, (reviewer.upper(), departments, modalities, last_exams))
    return cursor.fetchall()


def query_by_reviewer_and_date_and_department_and_modality(cursor, reviewer, start_date, end_date, departments, modalities):
    """
    Query all reports in the review db by reviewer, date and department.
    """
    sql = """
          SELECT
            a.patient_schluessel,
            a.unters_schluessel,
            a.unters_art,
            a.unters_beginn,
            a.befund_schluessel,
            a.schreiber,
            a.signierer,
            a.freigeber,
            a.befund_freigabe,
            a.befund_status,
            a.lese_datum,
            a.leser,
            a.gegenlese_datum,
            a.gegenleser,
            a.pat_name,
            a.pat_vorname,
            a.untart_name,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f,
            a.pp_misc_mfd_1_kuerzel,
            a.pp_misc_mfd_1_bezeichnung,
            a.modality
          FROM
            reports a 
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.freigeber = %s
          AND
              a.unters_beginn between %s and %s
          AND
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          AND
              a.pp_misc_mfd_1_kuerzel = ANY(%s)
          AND
              a.modality = ANY(%s)
          ORDER BY
              a.unters_beginn desc
          """
    cursor.execute(sql, (reviewer.upper(), start_date, end_date, departments, modalities))
    return cursor.fetchall()


def query_by_last_exams(cursor, last_exams):
    """
    Query all reports in the review db by last exams.
    """
    sql = """
          SELECT
            a.patient_schluessel,
            a.unters_schluessel,
            a.unters_art,
            a.unters_beginn,
            a.befund_schluessel,
            a.schreiber,
            a.signierer,
            a.freigeber,
            a.befund_freigabe,
            a.befund_status,
            a.lese_datum,
            a.leser,
            a.gegenlese_datum,
            a.gegenleser,
            a.pat_name,
            a.pat_vorname,
            a.untart_name,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f,
            a.pp_misc_mfd_1_kuerzel,
            a.pp_misc_mfd_1_bezeichnung,
            a.modality
          FROM
            reports a
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          ORDER BY
              a.unters_beginn desc
          LIMIT %s
          """
    cursor.execute(sql, [last_exams])
    return cursor.fetchall()


def query_by_date(cursor, start_date, end_date):
    """
    Query all reports in the review by date.
    """
    sql = """
          SELECT
            a.patient_schluessel,
            a.unters_schluessel,
            a.unters_art,
            a.unters_beginn,
            a.befund_schluessel,
            a.schreiber,
            a.signierer,
            a.freigeber,
            a.befund_freigabe,
            a.befund_status,
            a.lese_datum,
            a.leser,
            a.gegenlese_datum,
            a.gegenleser,
            a.pat_name,
            a.pat_vorname,
            a.untart_name,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f,
            a.pp_misc_mfd_1_kuerzel,
            a.pp_misc_mfd_1_bezeichnung,
            a.modality
          FROM
            reports a 
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.unters_beginn between %s and %s
          AND
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          ORDER BY
              a.unters_beginn desc
          """
    cursor.execute(sql, (start_date, end_date))
    return cursor.fetchall()


def query_all_by_departments(cursor, departments):
    """
    Query all reports in the review db which have status final
    """
    sql = """
          SELECT
            a.pp_misc_mfd_1_kuerzel,
            a.jaccard_s_f,
            a.jaccard_g_f,
            a.words_added_s_f,
            a.words_added_g_f,
            a.words_deleted_s_f,
            a.words_deleted_g_f,
            a.total_words_s,
            a.total_words_g,
            a.total_words_f
          FROM
            reports a
          INNER JOIN 
            reports b 
          ON 
            a.unters_schluessel = b.unters_schluessel
          WHERE
              a.befund_status = 'f'
          AND
              a.schreiber != b.freigeber
          AND
              a.pp_misc_mfd_1_kuerzel = ANY(%s)
          ORDER BY
              a.unters_beginn desc
          LIMIT 20000
          """
    cursor.execute(sql, [departments])
    return cursor.fetchall()


def _update_department(cursor, row):
    """
       Temporary Method to fill existing rows with the department description
    """
    sql = """
          UPDATE reports SET
            pp_misc_mfd_1_kuerzel = %s,
            pp_misc_mfd_1_bezeichnung = %s
          WHERE
            unters_schluessel = %s AND pp_misc_mfd_1_kuerzel IS NULL
          """
    cursor.execute(sql,
                   (row['pp_misc_mfd_1_kuerzel'],
                    row['pp_misc_mfd_1_bezeichnung'],
                    row['unters_schluessel']))


def update_department_development(cursor, row, item):
    """
       Temporary Method to fill existing rows with the department description (development)
    """
    sql = """
              UPDATE reports SET 
                pp_misc_mfd_1_kuerzel = %s
              WHERE
                unters_schluessel = %s
              """
    cursor.execute(sql, (item, row))


def update_modality(cursor, row, item):
    """
       Temporary Method to fill existing rows with the modality description
    """
    sql = """
              UPDATE reports SET 
                modality = %s
              WHERE
                unters_schluessel = %s
              """
    cursor.execute(sql, (item, row))


def query_all_rows(cursor):
    """
    Temporary Method: query all rows (development)
    """
    sql = """
              SELECT
                 unters_schluessel,
                 unters_art
              FROM reports
            
               """
    cursor.execute(sql)
    return cursor.fetchall()