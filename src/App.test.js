import React from 'react';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import Checkout from './Mycomponents/Checkout';
import PartnerRegistration from './Mycomponents/PartnerRegistration';
import ProtectedRoute from './Mycomponents/ProtectedRoute';

let container;
let root;
let mockAuthState;
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
  useLocation: () => ({ pathname: '/checkout', state: null }),
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock('./api', () => ({
  apiUrl: (path) => path,
  authHeaders: () => ({}),
  fetchJson: jest.fn(),
  getAuthState: () => mockAuthState,
  extractApiError: (_data, fallbackMessage) => fallbackMessage,
}));

beforeEach(() => {
  localStorage.clear();
  mockNavigate.mockReset();
  mockAuthState = { role: null, token: '', email: '', username: '' };
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
});

test('protected route redirects unauthenticated users', async () => {
  await act(async () => {
    root.render(
      <ProtectedRoute allow="user" redirectTo="/login">
        <div>Allowed content</div>
      </ProtectedRoute>
    );
  });

  expect(container.textContent).toContain('/login');
});

test('checkout shows validation errors before booking submission', async () => {
  mockAuthState = { role: 'user', token: 'token-123', email: 'user@example.com', username: 'user' };

  await act(async () => {
    root.render(
      <Checkout
        cartItems={[{ id: 1, name: 'AC Deep Cleaning', price: '599' }]}
        clearCart={() => {}}
        showToast={() => {}}
      />
    );
  });

  const form = container.querySelector('#checkout-form');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(container.textContent).toMatch(/please enter your full name/i);
  expect(container.textContent).toMatch(/phone number must be exactly 10 digits/i);
  expect(container.textContent).toMatch(/pincode must be exactly 6 digits/i);
});

test('partner registration validates phone number locally', async () => {
  await act(async () => {
    root.render(<PartnerRegistration />);
  });

  const form = container.querySelector('form');
  await act(async () => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });

  expect(container.textContent).toMatch(/mobile number must be exactly 10 digits/i);
});
