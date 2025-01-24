import { render, screen } from '@testing-library/react';
import NetworkStatus from '../../dashboard/network/pages/NetworkStatus';
import { BrowserRouter } from 'react-router-dom';

// Mock the network service
jest.mock('../../services/network', () => ({
  networkService: {
    getMetrics: jest.fn(() => Promise.resolve({
      cpu_usage: 45,
      memory_usage: 60,
      network_latency: 80
    }))
  }
}));

describe('NetworkStatus', () => {
  test('renders network metrics', async () => {
    render(
      <BrowserRouter>
        <NetworkStatus />
      </BrowserRouter>
    );
    
    // Wait for metrics to load
    expect(await screen.findByText(/CPU Usage/i)).toBeInTheDocument();
  });
});