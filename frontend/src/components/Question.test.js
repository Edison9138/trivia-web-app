import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../apiClient";
import Question from "./Question";

jest.mock("../apiClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

test("submits question ids and user answers without correct answers", async () => {
  apiClient.post.mockResolvedValueOnce({
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

  await waitFor(() => expect(apiClient.post).toHaveBeenCalledTimes(1));
  expect(apiClient.post).toHaveBeenCalledWith(
    "/calculate-score",
    {
      user_answers: ["Correct answer"],
      question_ids: [42],
    }
  );
});
