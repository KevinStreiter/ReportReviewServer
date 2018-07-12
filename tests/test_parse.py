import unittest

from repo.parse import parse
from review.compare import _extract_section


class TestParse(unittest.TestCase):
    def test_a(self):
        a = """
            Anamnese\n
            A\n
            Technik\n
            B\n
            """
        t = [x.strip() for x in a.splitlines()]
        result = parse(t)
        self.assertEqual(result['anamnese'], 'A')
        self.assertEqual(result['technik'], 'B')

    def test_aa(self):
        a = """
            Anamnese\n
            A\n
            A\n
            Technik\n
            B\n
            """
        t = [x.strip() for x in a.splitlines()]
        result = parse(t)
        self.assertEqual(result['anamnese'], 'AA')
        self.assertEqual(result['technik'], 'B')

    def test_empty_lines(self):
        a = """
            Anamnese\n
            A\n
            \n
            A\n
            Technik\n
            B\n
            """
        t = [x.strip() for x in a.splitlines()]
        result = parse(t)
        self.assertEqual(result['anamnese'], 'AA')
        self.assertEqual(result['technik'], 'B')

    def test_empty_lines_1(self):
        a = """
            Anamnese\n
            A\n
            \n
            A\n
            Technik\n
            B\n
            \n
            \n
            """
        t = [x.strip() for x in a.splitlines()]
        result = parse(t)
        self.assertEqual(result['anamnese'], 'AA')
        self.assertEqual(result['technik'], 'B')

    def test_datenimport(self):
        a = """
            Bilder wurden auf Wunsch des Auftraggebers eingescannt\n
            """
        t = [x.strip() for x in a.splitlines()]
        result = parse(t)
        self.assertEqual(result['datenimport'],
                         'Bilder wurden auf Wunsch des Auftraggebers eingescannt')

    def test_exclude_anamnese(self):
        a = "Anamnese delete this part Befund this part should be here"
        result = _extract_section(a)
        self.assertEqual(result, "Befund this part should be here")

    def test_exclude_anamnese2(self):
        a = "Anamnese und Fragestellung " \
            "delete this part Befunde: this " \
            "part should be here Beurteilung is " \
            "still here as well"
        result = _extract_section(a)
        self.assertEqual(result, "Befunde: this part should be here Beurteilung is still here as well")
