import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../search/SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default placeholder', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText(/search for movies and tv shows/i)).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <SearchBar 
        value="" 
        onChange={mockOnChange} 
        placeholder="Custom placeholder" 
      />
    );
    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('displays the current value', () => {
    render(<SearchBar value="test query" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('calls onChange with debounced input', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    
    // Should not call immediately due to debouncing
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Wait for debounce delay
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
    }, { timeout: 500 });
  });

  it('calls onSubmit when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="test query" onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    const form = screen.getByRole('textbox').closest('form');
    await user.click(screen.getByRole('button', { name: /search/i }));
    
    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('calls onSubmit when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="test query" onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '{enter}');
    
    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('shows clear button when there is a value', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    expect(screen.getByLabelText(/clear search/i)).toBeInTheDocument();
  });

  it('hides clear button when value is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.queryByLabelText(/clear search/i)).not.toBeInTheDocument();
  });

  it('clears input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    const clearButton = screen.getByLabelText(/clear search/i);
    await user.click(clearButton);
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('clears input when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="test" onChange={mockOnChange} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, '{escape}');
    
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('disables search button when input is empty', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });

  it('disables search button when only whitespace', () => {
    render(<SearchBar value="   " onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });

  it('enables search button when there is valid input', () => {
    render(<SearchBar value="test" onChange={mockOnChange} />);
    expect(screen.getByRole('button', { name: /search/i })).not.toBeDisabled();
  });

  it('shows loading state', () => {
    render(<SearchBar value="test" onChange={mockOnChange} isLoading={true} />);
    
    // Should show spinning search icon
    const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg');
    expect(searchIcon?.parentElement).toHaveClass('animate-spin');
  });

  it('disables search button when loading', () => {
    render(<SearchBar value="test" onChange={mockOnChange} isLoading={true} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });

  it('shows search suggestions text', () => {
    render(<SearchBar value="" onChange={mockOnChange} />);
    expect(screen.getByText(/try searching for "inception"/i)).toBeInTheDocument();
  });

  it('prevents form submission with empty input', async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockOnChange} onSubmit={mockOnSubmit} />);
    
    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form!);
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<SearchBar value="" onChange={mockOnChange} className="custom-class" />);
    expect(screen.getByRole('textbox').closest('form')).toHaveClass('custom-class');
  });
});
