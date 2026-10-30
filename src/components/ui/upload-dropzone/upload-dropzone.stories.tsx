import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { UploadDropzone } from '.';

const meta = {
  title: 'UI/UploadDropzone',
  component: UploadDropzone,
  parameters: {
    docs: {
      description: {
        component:
          'Theme-aware UploadDropzone primitive. See `index.tsx` for API; customize via `className` or CSS variables from `styles.css`.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof UploadDropzone>;

export default meta;
type Story = StoryObj<typeof UploadDropzone>;

export const Default: Story = {
  render: () => {
    const [file, setFile] = useState<File | null>(null);
    return (
      <UploadDropzone
        value={file}
        onChange={setFile}
        variant="file"
        accept=".png,.jpg,.jpeg"
        className="w-96"
      />
    );
  },
};

export const MultiplePdfs: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <UploadDropzone
        variant="file"
        multiple
        value={files}
        onChange={setFiles}
        accept="application/pdf,.pdf"
        className="w-96"
        translations={{
          dropHintText: 'Drag and drop PDF invoices here, or choose files.',
          chooseFileText: 'Choose PDFs',
          removeText: 'Clear all',
        }}
      />
    );
  },
};
