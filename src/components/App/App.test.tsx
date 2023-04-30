import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {

  test('renders Header Title', () => {
    render(<App />);
    const headerTitle = screen.getByText(/To Do List/i);
    expect(headerTitle).toBeInTheDocument();
  });

})
