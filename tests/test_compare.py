import unittest

from review.compare import _diff, _total_length


class TestCompare(unittest.TestCase):
    def test_compare(self):
        l1 = "Hello Mary Sue from Johnny"
        l2 = "Hello John Doe from Jakob"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 3)
        self.assertEqual(r['additions'], 3)
        self.assertEqual(r['jaccard'], 0.25)

    def test_compare1(self):
        l1 = "Hello Mary"
        l2 = "Hello John"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 1)
        self.assertEqual(r['additions'], 1)
        self.assertEqual(r['jaccard'], 0.333)

    def test_compare2(self):
        l1 = "Hello Mary Sue"
        l2 = "Hello John Sue"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 1)
        self.assertEqual(r['additions'], 1)
        self.assertEqual(r['jaccard'], 0.5)

    def test_compare3(self):
        l1 = "Hello John Doe"
        l2 = "Hello Sue"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 2)
        self.assertEqual(r['additions'], 1)
        self.assertEqual(r['jaccard'], 0.25)

    def test_compare4(self):
        l1 = "Hello John Doe"
        l2 = "Hello John Doe"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 0)
        self.assertEqual(r['additions'], 0)
        self.assertEqual(r['jaccard'], 1.0)

    def test_compare5(self):
        l1 = "John Doe"
        l2 = "Mary Sue"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 2)
        self.assertEqual(r['additions'], 2)
        self.assertEqual(r['jaccard'], 0.0)

    def test_compare6(self):
        l1 = "John Doe"
        l2 = "John Doe Silver"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 0)
        self.assertEqual(r['additions'], 1)
        self.assertEqual(r['jaccard'], 0.667)

    def test_compare7(self):
        l1 = ""
        l2 = "Mary Sue"
        r = _diff(l1, l2)
        self.assertEqual(r['deletions'], 0)
        self.assertEqual(r['additions'], 2)
        self.assertEqual(r['jaccard'], 0.0)


class TestLength(unittest.TestCase):
    def test_length(self):
        l1 = "Hello Mary Sue from Johnny"
        length = _total_length(l1)
        self.assertEqual(length, 5)

    def test_length1(self):
        l1 = """
             Hello Mary Sue from Johnny
             3 mm
             """
        length = _total_length(l1)
        self.assertEqual(length, 7)

    def test_length2(self):
        l1 = None
        length = _total_length(l1)
        self.assertEqual(length, 0)

    def test_length3(self):
        l1 = "  foooooo "
        length = _total_length(l1)
        self.assertEqual(length, 1)
