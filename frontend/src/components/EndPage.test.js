import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EndPage from "./EndPage";

function renderEndPage(initialEntry) {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/" element={<p>Home</p>} />
        <Route path="/endPage" element={<EndPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test("renders a zero percent score instead of redirecting home", () => {
  renderEndPage({
    pathname: "/endPage",
    state: { score: 0 },
  });

  expect(screen.getByText(/Your score: 0%/i)).toBeInTheDocument();
  expect(screen.queryByText("Home")).not.toBeInTheDocument();
});

test("redirects home when no score is available", async () => {
  renderEndPage("/endPage");

  expect(await screen.findByText("Home")).toBeInTheDocument();
});
