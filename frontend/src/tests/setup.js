import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

describe('Network Dashboard', () => {
    beforeEach(() => {
      cy.login('admin@example.com', 'password');
      cy.visit('/network/dashboard');
    });
  
    it('displays network metrics', () => {
      cy.get('[data-testid="cpu-usage"]').should('exist');
      cy.get('[data-testid="memory-usage"]').should('exist');
      cy.get('[data-testid="network-latency"]').should('exist');
    });
  });