import { vi } from 'vitest';

export default function () {
  const tokenizeReturn = {
    status: 'OK',
    token: 'abcd'
  };
  const cardMockReturn = {
    tokenize: vi.fn(() => tokenizeReturn),
    attach: vi.fn()
  };

  const gPayMockReturn = {
    tokenize: vi.fn(() => tokenizeReturn),
    attach: vi.fn()
  };

  const applePayMockReturn = {
    tokenize: vi.fn(() => tokenizeReturn),
    attach: vi.fn()
  };

  const paymentsMockReturn = {
    paymentRequest: vi.fn(),
    verifyBuyer: vi.fn(() => 'verify-token'),
    card: vi.fn(() => cardMockReturn),
    googlePay: vi.fn(() => gPayMockReturn),
    applePay: vi.fn(() => applePayMockReturn)
  };

  return {
    payments: vi.fn(() => paymentsMockReturn)
  };
}
