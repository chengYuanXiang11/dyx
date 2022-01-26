import { render, screen } from '@testing-library/react';
import App from './App';
//用于测试app.js 测试文件
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
