import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './Card.ui';
import { Photo } from '../../api/Pexels.types';

const mockPhoto: Photo = {
  id: 1,
  width: 800,
  height: 600,
  url: 'https://example.com/photo',
  photographer: 'John Doe',
  photographer_url: 'https://example.com/photographer',
  photographer_id: 123,
  avg_color: '#FF0000',
  src: {
    original: 'https://example.com/original.jpg',
    large2x: 'https://example.com/large2x.jpg',
    large: 'https://example.com/large.jpg',
    medium: 'https://example.com/medium.jpg',
    small: 'https://example.com/small.jpg',
    portrait: 'https://example.com/portrait.jpg',
    landscape: 'https://example.com/landscape.jpg',
    tiny: 'https://example.com/tiny.jpg',
  },
  liked: false,
  alt: 'Test photo'
};

describe('Card', () => {
  beforeAll(() => {
    // Mock HTMLDialogElement
    class MockDialog {
      showModal() {}
      close() {}
    }
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      value: function() {},
      configurable: true
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      value: function() {},
      configurable: true
    });
  });
  const mockSetFavourites = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders photo with correct attributes', () => {
    render(
      <Card
        photo={mockPhoto}
        idx={0}
        isFavourite={false}
        setFavourites={mockSetFavourites}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockPhoto.src.large);
    expect(img).toHaveAttribute('alt', mockPhoto.alt);
    expect(img).toHaveAttribute('srcSet', `${mockPhoto.src.large2x} 2x`);
  });

  it('applies favourite class when isFavourite is true', () => {
    const { container } = render(
      <Card
        photo={mockPhoto}
        idx={0}
        isFavourite={true}
        setFavourites={mockSetFavourites}
      />
    );

    expect(container.firstChild).toHaveClass('favourite');
  });

  it('displays photo description', () => {
    render(
      <Card
        photo={mockPhoto}
        idx={0}
        isFavourite={false}
        setFavourites={mockSetFavourites}
      />
    );

    expect(screen.getByText(mockPhoto.alt)).toBeInTheDocument();
  });

  it('applies animation delay based on index', () => {
    const { container } = render(
      <Card
        photo={mockPhoto}
        idx={2}
        isFavourite={false}
        setFavourites={mockSetFavourites}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.animationDelay).toBe('160ms');
  });

  it('applies background color from photo.avg_color', () => {
    const { container } = render(
      <Card
        photo={mockPhoto}
        idx={0}
        isFavourite={false}
        setFavourites={mockSetFavourites}
      />
    );

    const card = container.firstChild as HTMLElement;
    expect(card.style.getPropertyValue('--card-bg-color')).toBe(mockPhoto.avg_color);
  });
});
