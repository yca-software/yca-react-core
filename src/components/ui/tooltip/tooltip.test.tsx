import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip, TooltipProvider } from '.';

function renderTooltip() {
  return render(
    <TooltipProvider>
      <Tooltip content="Helpful hint" delayDuration={0} closeDelay={0}>
        <button type="button">Info</button>
      </Tooltip>
    </TooltipProvider>,
  );
}

function visibleTooltip() {
  return document.querySelector(
    '[data-radix-popper-content-wrapper] [data-state="instant-open"], [data-radix-popper-content-wrapper] [data-state="delayed-open"]',
  );
}

describe('Tooltip', () => {
  it('does not open from programmatic focus', () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Info' });
    act(() => {
      trigger.focus();
    });
    expect(visibleTooltip()).toBeNull();
  });

  it('does not open from focus after incidental pointerenter under the cursor', () => {
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Info' });
    fireEvent.pointerEnter(trigger);
    act(() => {
      trigger.focus();
    });
    expect(visibleTooltip()).toBeNull();
  });

  it('opens on pointer enter after the pointer has left once', () => {
    vi.useFakeTimers();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Info' });
    fireEvent.pointerEnter(trigger);
    fireEvent.pointerLeave(trigger);
    fireEvent.pointerEnter(trigger);
    act(() => {
      vi.runAllTimers();
    });
    expect(visibleTooltip()).not.toBeNull();
    expect(visibleTooltip()?.textContent).toContain('Helpful hint');
    vi.useRealTimers();
  });

  it('opens on pointer enter after a move outside the trigger', () => {
    vi.useFakeTimers();
    renderTooltip();
    const trigger = screen.getByRole('button', { name: 'Info' });
    act(() => {
      vi.runAllTimers();
    });
    // elementFromPoint returns null in jsdom → treated as outside → arms.
    fireEvent.pointerMove(window, { clientX: 1, clientY: 1 });
    fireEvent.pointerEnter(trigger);
    act(() => {
      vi.runAllTimers();
    });
    expect(visibleTooltip()).not.toBeNull();
    vi.useRealTimers();
  });
});
