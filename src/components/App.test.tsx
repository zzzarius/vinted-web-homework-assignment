import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App.ui';
jest.mock('../api/authorizedFetch', () => require('../api/authorizedFetch.mock'));

import { getCuratedPhotos } from '../api/Pexels.api';

// Mock the API call
jest.mock('../api/Pexels.api');
const mockGetCuratedPhotos = getCuratedPhotos as jest.MockedFunction<typeof getCuratedPhotos>;

const createMockPhoto = (id: number) => ({
  id: id * 1000, // Use larger numbers for IDs to avoid conflicts
  width: 800,
  height: 600,
  url: `https://example.com/photo${id}`,
  photographer: 'John Doe',
  photographer_url: `https://example.com/photographer${id}`,
  photographer_id: id,
  avg_color: '#FF0000',
  src: {
    original: `https://example.com/original${id}.jpg`,
    large2x: `https://example.com/large2x${id}.jpg`,
    large: `https://example.com/large${id}.jpg`,
    medium: `https://example.com/medium${id}.jpg`,
    small: `https://example.com/small${id}.jpg`,
    portrait: `https://example.com/portrait${id}.jpg`,
    landscape: `https://example.com/landscape${id}.jpg`,
    tiny: `https://example.com/tiny${id}.jpg`,
  },
  liked: false,
  alt: `Test photo ${id * 1000}` // Use the same ID in alt text
});

const mockPhotosPage1 = {
  data: {
    photos: [createMockPhoto(1), createMockPhoto(2)]
  },
  errors: [],
  hasErrors: false
};

const mockPhotosPage2 = {
  data: {
    photos: [createMockPhoto(3), createMockPhoto(4)]
  },
  errors: [],
  hasErrors: false
};

describe('App', () => {
  let intersectionObserverCallback: (entries: any[]) => void;

  beforeAll(() => {
    // Mock IntersectionObserver
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionObserverCallback = callback;
      return {
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      };
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  beforeEach(() => {
    mockGetCuratedPhotos.mockClear();
    window.localStorage.clear();
  });

  it('fetches and displays photos on initial load', async () => {
    mockGetCuratedPhotos.mockResolvedValueOnce(mockPhotosPage1);

    await act(async () => {
      render(<App />);
    });

    // Wait for loading indicator
    expect(screen.getByText('Hold on... Getting more photos...')).toBeInTheDocument();

    // Wait for API call
    expect(mockGetCuratedPhotos).toHaveBeenCalledWith(1);

    // Wait for photos to appear in the grid
    await act(async () => {
      await mockGetCuratedPhotos.mock.results[0].value;
    });

    const gridImage1 = screen.getAllByAltText('Test photo 1000')[0];
    const gridImage2 = screen.getAllByAltText('Test photo 2000')[0];
    expect(gridImage1).toBeInTheDocument();
    expect(gridImage2).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    const errorResponse = {
      data: null,
      errors: ['API Error'],
      hasErrors: true
    };
    mockGetCuratedPhotos.mockResolvedValueOnce(errorResponse);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await act(async () => {
      render(<App />);
    });

    await act(async () => {
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(['API Error']);
      });
    });

    consoleSpy.mockRestore();
  });

  it('loads more photos when scrolling to bottom', async () => {
    // Mock the responses for both pages
    mockGetCuratedPhotos
      .mockResolvedValueOnce(mockPhotosPage1)
      .mockResolvedValueOnce(mockPhotosPage2);

    await act(async () => {
      render(<App />);
    });

    // Wait for the first API call to resolve
    await act(async () => {
      await mockGetCuratedPhotos.mock.results[0].value;
    });

    // Verify initial photos are loaded
    const gridImage1 = screen.getAllByAltText('Test photo 1000')[0];
    const gridImage2 = screen.getAllByAltText('Test photo 2000')[0];
    expect(gridImage1).toBeInTheDocument();
    expect(gridImage2).toBeInTheDocument();

    const bottomElement = screen.getByTestId('scroll-bottom');

    // Trigger intersection observer
    await act(async () => {
      intersectionObserverCallback([{
        isIntersecting: true,
        target: bottomElement
      }]);
    });

    // Wait for the second API call
    expect(mockGetCuratedPhotos).toHaveBeenCalledWith(2);

    // Wait for the second API call to resolve
    await act(async () => {
      await mockGetCuratedPhotos.mock.results[1].value;
    });

    // Verify new photos are loaded
    const gridImage3 = screen.getAllByAltText('Test photo 3000')[0];
    const gridImage4 = screen.getAllByAltText('Test photo 4000')[0];
    expect(gridImage3).toBeInTheDocument();
    expect(gridImage4).toBeInTheDocument();
  });
});
