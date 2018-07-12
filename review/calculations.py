from math import floor


def relative(df):
    if df.shape[0] > 0:
        df['words_added_relative_g_f'] = df.apply(
            lambda row: _relative(row['total_words_f'], row['words_added_g_f']), axis=1)
        df['words_added_relative_s_f'] = df.apply(
            lambda row: _relative(row['total_words_f'], row['words_added_s_f']), axis=1)
        df['words_deleted_relative_g_f'] = df.apply(
            lambda row: _relative(row['total_words_f'], row['words_deleted_g_f']), axis=1)
        df['words_deleted_relative_s_f'] = df.apply(
            lambda row: _relative(row['total_words_f'], row['words_deleted_s_f']), axis=1)
    return df


def _relative(total, changes):
    t = total or 1.0
    return changes / t


def calculate_median_by_writer(df):
    rows = {}
    median = {}
    if df.shape[0] > 0:
        writer_list = df['schreiber'].drop_duplicates()
        for writer in writer_list:
            rows[writer] = df.loc[df['schreiber'] == writer].to_dict('records')
            median['median_' + writer] = calculate_median(rows[writer])
    return median


def calculate_median_by_reviewer(df):
    rows = {}
    median = {}
    if df.shape[0] > 0:
        reviewer_list = df['freigeber'].drop_duplicates()
        for reviewer in reviewer_list:
            rows[reviewer] = df.loc[df['freigeber'] == reviewer].to_dict('records')
            median['median_' + reviewer] = calculate_median(rows[reviewer])
    return median


def calculate_median(rows):
    keys = ["jaccard_s_f", "jaccard_g_f", "words_added_relative_s_f",
            "words_added_relative_g_f", "words_deleted_relative_s_f", "words_deleted_relative_g_f"]
    median_values = {}

    for key in keys:
        temp_array = [x[key] for x in rows]
        median_values[key] = _calculate_median(temp_array)

    return median_values


def _calculate_median(values):
    if len(values) == 0:
        return 0

    values = sorted(values)
    half = int(floor(len(values) / 2))

    if len(values) % 2:
        return values[half]
    else:
        return (values[half - 1] + values[half]) / 2.0
