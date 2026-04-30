import { render, screen } from '@testing-library/react';
import App from './App';

test('renders trivia home page', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /trivia game/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
});
