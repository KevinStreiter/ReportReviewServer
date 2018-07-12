import unittest

from review.calculations import _calculate_median


class TestMedian(unittest.TestCase):

    def test_median1(self):
        values = [0, 0, 0, 0, 0]
        median = _calculate_median(values)
        self.assertEqual(median, 0)

    def test_median2(self):
        values = [1, 2, 3, 4, 5, 6]
        median = _calculate_median(values)
        self.assertEqual(median, 3.5)

    def test_median3(self):
        values = [0.5, 1.4, 3.32, 11, 23, 56.3, 65]
        median = _calculate_median(values)
        self.assertEqual(median, 11)
