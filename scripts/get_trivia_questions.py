import os
import time

try:
    from .trivia_data import (
        DEFAULT_TRIVIA_QUESTIONS_PATH,
        get_question_key,
        load_questions,
        normalize_questions,
        save_questions,
    )
except ImportError:
    from trivia_data import (
        DEFAULT_TRIVIA_QUESTIONS_PATH,
        get_question_key,
        load_questions,
        normalize_questions,
        save_questions,
    )


OPEN_TRIVIA_DB_URL = "https://opentdb.com/api.php"
REQUEST_DELAY_SECONDS = 5


def fetch_question(open_trivia_db_token):
    import requests

    params = {"amount": 1}
    if open_trivia_db_token:
        params["token"] = open_trivia_db_token

    response = requests.get(OPEN_TRIVIA_DB_URL, params=params, timeout=10)
    response.raise_for_status()
    return response.json()


def main():
    open_trivia_db_token = os.getenv("OPEN_TRIVIA_DB_TOKEN")
    save_path = DEFAULT_TRIVIA_QUESTIONS_PATH
    all_questions, duplicate_questions = normalize_questions(load_questions(save_path))
    seen_question_keys = {get_question_key(question) for question in all_questions}

    if duplicate_questions:
        save_questions(all_questions, save_path)
        print(f"Removed existing duplicate questions: {len(duplicate_questions)}")

    while True:
        response_json = fetch_question(open_trivia_db_token)
        response_code = response_json["response_code"]
        if response_code == 5:
            print(f"Rate limit reached. Waiting {REQUEST_DELAY_SECONDS} seconds...")
            time.sleep(REQUEST_DELAY_SECONDS)
            continue
        if response_code != 0:
            print("Stopped")
            print(f"response_code: {response_code}")
            break

        response_results = response_json["results"]
        if not response_results:
            print("No results")
            break

        new_questions, _ = normalize_questions(response_results)
        added_questions = 0
        for question in new_questions:
            question_key = get_question_key(question)
            if question_key in seen_question_keys:
                print(f"Skipped duplicate question: {question_key}")
                continue

            seen_question_keys.add(question_key)
            all_questions.append(question)
            added_questions += 1

        if added_questions:
            save_questions(all_questions, save_path)
            print(f"len(all_questions): {len(all_questions)}")
        else:
            print("No new unique questions")


if __name__ == "__main__":
    main()

# Code 0: Success Returned results successfully.
# Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
# Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
# Code 3: Token Not Found Session Token does not exist.
# Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
# Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.
