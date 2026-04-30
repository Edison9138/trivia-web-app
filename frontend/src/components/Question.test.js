import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Question from "./Question";

jest.mock("axios");

test("submits question ids and user answers without correct answers", async () => {
  axios.post.mockResolvedValueOnce({
    data: {
      status: "success",
      data: {
        user_score: 100,
      },
    },
  });

  const questionsData = {
    questions: ["Question?"],
    answers: [["Wrong answer", "Correct answer"]],
    question_ids: [42],
    correct_answers: ["Wrong answer"],
  };

  render(
    <MemoryRouter>
      <Question questionsData={questionsData} />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByLabelText("Correct answer"));
  fireEvent.click(screen.getByRole("button", { name: /submit/i }));

  await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  expect(axios.post).toHaveBeenCalledWith(
    "http://localhost:5001/calculate-score",
    {
      user_answers: ["Correct answer"],
      question_ids: [42],
    }
  );
});
