import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadDropzone } from '.';

describe('UploadDropzone', () => {
  it('renders multi-file mode with an empty File[] without crashing', () => {
    const onChange = vi.fn();
    expect(() =>
      render(
        <UploadDropzone
          variant="file"
          multiple
          value={[]}
          onChange={onChange}
          accept="application/pdf,.pdf"
          translations={{
            dropHintText: 'Drop PDFs',
            chooseFileText: 'Choose PDFs',
          }}
        />,
      ),
    ).not.toThrow();
    expect(screen.getByText('Drop PDFs')).toBeTruthy();
    expect(screen.getByText('Choose PDFs')).toBeTruthy();
  });

  it('renders single-file mode with null value without crashing', () => {
    expect(() =>
      render(<UploadDropzone variant="file" value={null} onChange={vi.fn()} accept=".pdf" />),
    ).not.toThrow();
  });
});
