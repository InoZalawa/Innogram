import { render, screen } from '@testing-library/react';
import RegisterForm from './Components/Forms/registerForm'


test('renders learn react link', () => {
  render(<RegisterForm />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
