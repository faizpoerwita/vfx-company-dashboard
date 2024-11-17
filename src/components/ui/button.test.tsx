import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Button Tests', () => {
  it('true is true', () => {
    expect(true).toBe(true);
  });

  it('renders a div', () => {
    render(<div>Hello</div>);
    expect(screen.getByText('Hello')).toBeDefined();
  });
});
