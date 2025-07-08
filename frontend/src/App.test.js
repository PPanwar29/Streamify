import React from 'react';
import { MemoryRouter } from 'react-router';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock useAuthUser to control auth state
jest.mock('./hooks/useAuthUser', () => () => ({ isLoading: false, authUser: null }));

// Helper to update mock
const mockUseAuthUser = (user) => {
  jest.doMock('./hooks/useAuthUser', () => () => ({ isLoading: false, authUser: user }));
};

describe('App Routing & Auth', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('redirects unauthenticated user to login from /', () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
  });

  it('shows home page for authenticated and onboarded user', () => {
    mockUseAuthUser({ fullname: 'Test User', isOnboarded: true });
    const AppWithAuth = require('./App').default;
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithAuth />
      </MemoryRouter>
    );
    expect(screen.getByText(/your friends/i)).toBeInTheDocument();
  });

  it('redirects authenticated but not onboarded user to onboarding', () => {
    mockUseAuthUser({ fullname: 'Test User', isOnboarded: false });
    const AppWithAuth = require('./App').default;
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppWithAuth />
      </MemoryRouter>
    );
    expect(screen.getByText(/onboarding/i)).toBeInTheDocument();
  });

  it('redirects unauthenticated user from /notifications to login', () => {
    render(
      <MemoryRouter initialEntries={["/notifications"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
  });

  it('shows onboarding page for authenticated user at /onboarding', () => {
    mockUseAuthUser({ fullname: 'Test User', isOnboarded: false });
    const AppWithAuth = require('./App').default;
    render(
      <MemoryRouter initialEntries={["/onboarding"]}>
        <AppWithAuth />
      </MemoryRouter>
    );
    expect(screen.getByText(/onboarding/i)).toBeInTheDocument();
  });
}); 