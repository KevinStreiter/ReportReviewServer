from jinja2 import Template
def query_review_report(cursor, id):
    sql = """
          SELECT
            *
          FROM
            reports a
          WHERE
              a.befund_schluessel = %s
          """
    cursor.execute(sql, (id,))
    desc = [d[0].lower() for d in cursor.description]
    result = [dict(zip(desc, row)) for row in cursor]
    return result[0]


def query_review_reports(cursor, day, writer):
    """
    Query all reports in the review db by day and writer (optional).
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
            a.untart_name
          FROM
            reports a
          WHERE
              a.unters_beginn
                BETWEEN
                  %s
                    AND
                  %s
            {{ writer_clause }}
          ORDER BY
              a.unters_beginn
          """
    start = day.strftime('%Y-%m-%d 00:00:00')
    end = day.strftime('%Y-%m-%d 23:59:59')
    template = Template(sql)
    if writer:
      sql = template.render(writer_clause=' AND a.schreiber = %s')
      print(sql)
      cursor.execute(sql, (start, end, writer.upper()))
    else:
      sql = template.render()
      cursor.execute(sql, (start, end))
    desc = [d[0].lower() for d in cursor.description]
    result = [dict(zip(desc, row)) for row in cursor]
    return result

