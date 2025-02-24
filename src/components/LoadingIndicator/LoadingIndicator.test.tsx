import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from './LoadingIndicator.ui';

describe('LoadingIndicator', () => {
  it('renders loading message', () => {
    render(<LoadingIndicator />);
    
    const loadingMessage = screen.getByText('Hold on... Getting more photos...');
    expect(loadingMessage).toBeInTheDocument();
  });

  it('has loading class with animation', () => {
    const { container } = render(<LoadingIndicator />);
    
    const loadingElement = container.firstChild as HTMLElement;
    expect(loadingElement).toHaveClass('loading');
  });
});
