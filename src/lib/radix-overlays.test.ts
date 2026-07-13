import { describe, expect, it } from 'vitest';
import { isRadixPortaledOverlay } from './radix-overlays';

describe('isRadixPortaledOverlay', () => {
  it('returns false for null and non-element targets', () => {
    expect(isRadixPortaledOverlay(null)).toBe(false);
    expect(isRadixPortaledOverlay(document.createTextNode('x'))).toBe(false);
  });

  it('returns false for plain elements outside overlays', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(isRadixPortaledOverlay(div)).toBe(false);
    div.remove();
  });

  it('detects radix popper wrapper descendants', () => {
    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-radix-popper-content-wrapper', '');
    const child = document.createElement('button');
    wrapper.appendChild(child);
    document.body.appendChild(wrapper);
    expect(isRadixPortaledOverlay(child)).toBe(true);
    wrapper.remove();
  });

  it('detects dropdown menu, popover, calendar, listbox, and menu slots', () => {
    const cases: Array<[string, string]> = [
      ['data-slot', 'dropdown-menu'],
      ['data-slot', 'dropdown-menu-content'],
      ['data-slot', 'dropdown-menu-item'],
      ['data-slot', 'popover'],
      ['data-slot', 'popover-content'],
      ['data-slot', 'calendar'],
      ['role', 'listbox'],
      ['role', 'menu'],
    ];

    for (const [attr, value] of cases) {
      const overlay = document.createElement('div');
      overlay.setAttribute(attr, value);
      const target = document.createElement('span');
      overlay.appendChild(target);
      document.body.appendChild(overlay);
      expect(isRadixPortaledOverlay(target)).toBe(true);
      overlay.remove();
    }
  });
});
