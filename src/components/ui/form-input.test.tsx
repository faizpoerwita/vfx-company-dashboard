import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormInput from './form-input';

describe('FormInput', () => {
  test('renders input with label', () => {
    render(<FormInput label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeDefined();
  });

  test('shows error message when touched and has error', () => {
    render(
      <FormInput
        label="Email"
        name="email"
        error="Email is required"
        touched={true}
      />
    );
    expect(screen.getByText('Email is required')).toBeDefined();
  });

  test('does not show error message when not touched', () => {
    render(
      <FormInput
        label="Email"
        name="email"
        error="Email is required"
        touched={false}
      />
    );
    expect(screen.queryByText('Email is required')).toBeNull();
  });

  test('applies error styles when has error and touched', () => {
    render(
      <FormInput
        label="Email"
        name="email"
        error="Email is required"
        touched={true}
      />
    );
    const input = screen.getByLabelText('Email');
    expect(input.className).toContain('border-red-500');
  });

  test('handles user input', async () => {
    const user = userEvent.setup();
    render(<FormInput label="Email" name="email" />);
    
    const input = screen.getByLabelText('Email') as HTMLInputElement;
    await user.type(input, 'test@example.com');
    expect(input.value).toBe('test@example.com');
  });
});
