import { render } from '@testing-library/react';
import App from './App';

test('renders App without crashing', () => {
  render(<App />);
});

test('simple test that always passes', () => {
  expect(2 + 2).toBe(4);
}); 