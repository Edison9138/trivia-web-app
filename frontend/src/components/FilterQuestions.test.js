import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import apiClient from "../apiClient";
import FilterQuestions from "./FilterQuestions";

jest.mock("../apiClient", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

function fillRequiredFilters() {
  fireEvent.change(screen.getByRole("combobox"), {
    target: { value: "Animals" },
  });
  fireEvent.click(screen.getByLabelText("Easy"));
  fireEvent.click(screen.getByLabelText("True/False"));
  fireEvent.change(screen.getByRole("spinbutton"), {
    target: { value: "1" },
  });
}

function renderFilterQuestions(updateQuestions = jest.fn()) {
  render(
    <MemoryRouter>
      <FilterQuestions updateQuestions={updateQuestions} />
    </MemoryRouter>
  );
}

test("submits boolean for true false questions", async () => {
  const updateQuestions = jest.fn();
  apiClient.post.mockResolvedValueOnce({
    data: {
      status: "success",
      data: {
        questions: ["Question?"],
        answers: [["True", "False"]],
        question_ids: [1],
      },
    },
  });

  renderFilterQuestions(updateQuestions);
  fillRequiredFilters();
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  await waitFor(() => expect(updateQuestions).toHaveBeenCalledTimes(1));
  expect(apiClient.post).toHaveBeenCalledWith(
    "/get-questions",
    {
      question_types: ["boolean"],
      category: "Animals",
      difficulties: ["Easy"],
      count: "1",
    }
  );
});

test("shows structured backend errors returned with non-2xx responses", async () => {
  apiClient.post.mockRejectedValueOnce({
    response: {
      data: {
        status: "fail",
        data: "Not enough questions available. Found: 2, Requested: 5",
      },
    },
  });

  renderFilterQuestions();
  fillRequiredFilters();
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  expect(
    await screen.findByText("Not enough questions available. Max questions: 2")
  ).toBeInTheDocument();
});
