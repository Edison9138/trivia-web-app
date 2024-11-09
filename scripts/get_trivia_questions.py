import requests
from pathlib import Path
import json
import time
import os

open_trivia_db_token = os.getenv("OPEN_TRIVIA_DB_TOKEN")

url = f"https://opentdb.com/api.php?amount=1&token={open_trivia_db_token}"
save_path = Path("../data/trivia_questions.json")

if save_path.exists() and save_path.stat().st_size != 0: # also check for existed empty file
    with open(save_path, "r") as file:
        all_questions = json.load(file)
else:
    all_questions = []

while True:
    response = requests.get(url)
    response_json = response.json()
    response_code = response_json["response_code"]
    if response_code == 5:
        print("Rate limit reached. Waiting 5 seconds...")
        time.sleep(5)
        continue
    if response_code != 0:
        print("Stopped")
        print(f"response_code: {response_code}")
        break
    response_results = response_json["results"]
    if response_results:
        all_questions.extend(response_results)
        with open(save_path, "w") as file:
            json.dump(all_questions, file, indent=4)
        print(f"len(all_questions): {len(all_questions)}")
    else:
        print("No results")
        break

# Code 0: Success Returned results successfully.
# Code 1: No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)
# Code 2: Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)
# Code 3: Token Not Found Session Token does not exist.
# Code 4: Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.
# Code 5: Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.
