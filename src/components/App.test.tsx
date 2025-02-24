import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App.ui';
jest.mock('../api/authorizedFetch', () => require('../api/authorizedFetch.mock'));

import { getCuratedPhotos } from '../api/Pexels.api';

// Mock the API call
jest.mock('../api/Pexels.api');
const mockGetCuratedPhotos = getCuratedPhotos as jest.MockedFunction<typeof getCuratedPhotos>;

const mockPhotos = {
  data: {
    photos: [
      {
        id: 12345,
        width: 800,
        height: 600,
        url: 'https://example.com/photo1',
        photographer: 'John Doe',
        photographer_url: 'https://example.com/photographer1',
        photographer_id: 123,
        avg_color: '#FF0000',
        src: {
          original: 'https://example.com/original1.jpg',
          large2x: 'https://example.com/large2x1.jpg',
          large: 'https://example.com/large1.jpg',
          medium: 'https://example.com/medium1.jpg',
          small: 'https://example.com/small1.jpg',
          portrait: 'https://example.com/portrait1.jpg',
          landscape: 'https://example.com/landscape1.jpg',
          tiny: 'https://example.com/tiny1.jpg',
        },
        liked: false,
        alt: 'Test photo 1'
      }
    ]
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
    mockGetCuratedPhotos.mockResolvedValue(mockPhotos);
  });

  it('fetches and displays photos on initial load', async () => {
    mockGetCuratedPhotos.mockResolvedValueOnce(mockPhotos);
    
    render(<App />);
    
    // Wait for loading indicator
    await waitFor(() => {
      expect(screen.getByText('Hold on... Getting more photos...')).toBeInTheDocument();
    });
    
    // Wait for API call
    await waitFor(() => {
      expect(mockGetCuratedPhotos).toHaveBeenCalledWith(1);
    });

    // Wait for photo to appear in the grid
    await waitFor(() => {
      const images = screen.getAllByAltText('Test photo 1');
      const gridImage = images.find(img => !img.className);
      expect(gridImage).toBeInTheDocument();
    }, { timeout: 3000 });
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
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(mockGetCuratedPhotos).toHaveBeenCalledWith(1);
    });

    // Wait for the initial render to complete
    await waitFor(() => {
      expect(screen.getByTestId('scroll-bottom')).toBeInTheDocument();
    });

    const bottomElement = screen.getByTestId('scroll-bottom');

    // Simulate intersection
    await act(async () => {
      intersectionObserverCallback([{
        isIntersecting: true,
        target: bottomElement
      }]);
    });

    await waitFor(() => {
      expect(mockGetCuratedPhotos).toHaveBeenCalledWith(2);
    });
  });
});
