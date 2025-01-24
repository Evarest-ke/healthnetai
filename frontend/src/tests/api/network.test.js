import { networkService } from '../../services/network';

describe('Network Service', () => {
  test('fetches metrics successfully', async () => {
    const metrics = await networkService.getMetrics();
    expect(metrics).toHaveProperty('cpu_usage');
    expect(metrics).toHaveProperty('memory_usage');
    expect(metrics).toHaveProperty('network_latency');
  });
});
import NetworkStatus from '../../dashboard/network/pages/NetworkStatus';

describe('NetworkStatus Component', () => {
  test('renders network metrics correctly', () => {
    const mockMetrics = {
      cpu_usage: 45,
      memory_usage: 60,
      network_latency: 80
    };
    
    render(<NetworkStatus initialMetrics={mockMetrics} />);
    
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('80ms')).toBeInTheDocument();
  });
});