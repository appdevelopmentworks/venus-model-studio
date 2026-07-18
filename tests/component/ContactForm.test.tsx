import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithIntl } from '../helpers/render';
import { ContactForm } from '@/components/forms/ContactForm';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows validation errors when submitting empty', async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(global, 'fetch');
    renderWithIntl(<ContactForm contactEmail="hello@example.com" />);

    await user.click(screen.getByRole('button', { name: /send/i }));

    // 検証エラーが表示され、fetchは呼ばれない
    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a message/i)).toBeInTheDocument();
    expect(screen.getByText(/consent to the privacy policy/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('submits and shows success (mailto mode)', async () => {
    const user = userEvent.setup();
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, mode: 'mailto' }), { status: 200 })
    );
    // mailtoナビゲーションを無害化
    const orig = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...orig, set href(_v: string) {} }
    });

    renderWithIntl(<ContactForm contactEmail="hello@example.com" />);

    await user.type(screen.getByLabelText(/name/i), 'Jane');
    await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
    await user.type(
      screen.getByLabelText(/message/i),
      'This is a sufficiently long message.'
    );
    await user.click(screen.getByLabelText(/i agree to the privacy policy/i));
    await user.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() =>
      expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    );
    Object.defineProperty(window, 'location', { configurable: true, value: orig });
  });
});
