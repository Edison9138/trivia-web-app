import html
import json
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_TRIVIA_QUESTIONS_PATH = PROJECT_ROOT / "data" / "trivia_questions.json"


def decode_html_entities(value):
    if isinstance(value, str):
        return html.unescape(value)
    if isinstance(value, list):
        return [decode_html_entities(item) for item in value]
    if isinstance(value, dict):
        return {key: decode_html_entities(item) for key, item in value.items()}
    return value


def get_question_key(question: Dict) -> str:
    return question["question"].strip()


def normalize_questions(
    questions: Iterable[Dict],
    *,
    dedupe: bool = True,
) -> Tuple[List[Dict], List[Dict]]:
    normalized_questions = []
    duplicate_questions = []
    seen_question_keys = set()

    for question in questions:
        normalized_question = decode_html_entities(question)
        question_key = get_question_key(normalized_question)
        if dedupe and question_key in seen_question_keys:
            duplicate_questions.append(normalized_question)
            continue

        seen_question_keys.add(question_key)
        normalized_questions.append(normalized_question)

    return normalized_questions, duplicate_questions


def load_questions(path: Path = DEFAULT_TRIVIA_QUESTIONS_PATH) -> List[Dict]:
    if not path.exists() or path.stat().st_size == 0:
        return []

    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def save_questions(questions: List[Dict], path: Path = DEFAULT_TRIVIA_QUESTIONS_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(questions, file, indent=4, ensure_ascii=True)
        file.write("\n")
