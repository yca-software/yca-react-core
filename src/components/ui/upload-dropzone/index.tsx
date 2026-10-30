import { FileText, ImagePlus, UploadCloud, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '../../../lib/utils';
import { Button } from '../button';
import { Checkbox } from '../checkbox';

export interface UploadDropzoneTranslations {
  imageAlt?: string;
  dropHintText?: string;
  chooseImageText?: string;
  /** Used when `variant="file"` for the primary picker button label */
  chooseFileText?: string;
  removeText?: string;
  removeExistingImageText?: string;
  /** Accessible label for removing one file in multi-file mode */
  removeFileAriaLabel?: string;
}

const DEFAULT_TRANSLATIONS: Required<UploadDropzoneTranslations> = {
  imageAlt: 'Image',
  dropHintText: 'Drag and drop an image here, or click to choose a file.',
  chooseImageText: 'Choose image',
  chooseFileText: 'Choose file',
  removeText: 'Remove',
  removeExistingImageText: 'Remove existing image',
  removeFileAriaLabel: 'Remove file',
};

interface UploadDropzoneSharedProps {
  translations?: UploadDropzoneTranslations;
  /** Reject files larger than this size (bytes). Invokes `onFileTooLarge` when set. */
  maxSizeBytes?: number;
  onFileTooLarge?: () => void;
  /** Rejected because the file does not match `accept`. */
  onInvalidFile?: () => void;
}

export interface UploadDropzoneImageProps extends UploadDropzoneSharedProps {
  variant?: 'image';
  value: File | null;
  onChange: (file: File | null) => void;
  existingImageUrl?: string;
  removeExistingImage?: boolean;
  onRemoveExistingImageChange?: (value: boolean) => void;
}

interface UploadDropzoneFileBaseProps extends UploadDropzoneSharedProps {
  variant: 'file';
  /** Passed to the native file input, e.g. `.pdf,.docx` or `application/pdf` */
  accept?: string;
  disabled?: boolean;
  className?: string;
}

export interface UploadDropzoneFileProps extends UploadDropzoneFileBaseProps {
  multiple?: false;
  value: File | null;
  onChange: (file: File | null) => void;
}

export interface UploadDropzoneMultiFileProps extends UploadDropzoneFileBaseProps {
  multiple: true;
  value: File[];
  onChange: (files: File[]) => void;
}

export type UploadDropzoneProps =
  | UploadDropzoneImageProps
  | UploadDropzoneFileProps
  | UploadDropzoneMultiFileProps;

function fileMatchesAccept(file: File, accept?: string): boolean {
  if (!accept?.trim()) return true;
  const tokens = accept
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!tokens.length) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

function fileKey(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

function isFileLike(value: unknown): value is File {
  return (
    typeof value === 'object' &&
    value != null &&
    typeof (value as File).name === 'string' &&
    typeof (value as File).size === 'number'
  );
}

function UploadDropzone(props: UploadDropzoneProps) {
  const isFile = props.variant === 'file';
  // Also treat File[] values as multi even if `multiple` was omitted (avoids .type crash).
  const isMultiple = isFile && (props.multiple === true || Array.isArray(props.value));
  const inputId = useId();
  const removeExistingLabelId = useId();
  const pickerDisabled = isFile && props.disabled;
  const t = { ...DEFAULT_TRANSLATIONS, ...props.translations };
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const singleFile =
    isFile && !isMultiple && isFileLike(props.value) ? (props.value as File) : null;
  const multiFiles =
    isMultiple && Array.isArray(props.value) ? (props.value as File[]).filter(isFileLike) : [];
  const accept = isFile ? props.accept : 'image/*';
  const setSingleFile = (file: File | null) => {
    if (isFile && !isMultiple) {
      (props as UploadDropzoneFileProps).onChange(file);
      return;
    }
    if (!isFile) {
      (props as UploadDropzoneImageProps).onChange(file);
      (props as UploadDropzoneImageProps).onRemoveExistingImageChange?.(false);
    }
  };
  const setMultiFiles = (next: File[]) => {
    if (isMultiple) (props as UploadDropzoneMultiFileProps).onChange(next);
  };

  const imageFile = !isFile && isFileLike(props.value) ? (props.value as File) : null;

  useEffect(() => {
    if (isFile) {
      const mime = singleFile?.type || '';
      if (!singleFile || !mime.startsWith('video/')) {
        setPreviewUrl(null);
        return;
      }
      const nextUrl = URL.createObjectURL(singleFile);
      setPreviewUrl(nextUrl);
      return () => URL.revokeObjectURL(nextUrl);
    }
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const nextUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [imageFile, isFile, singleFile]);

  const acceptFiles = (incoming: FileList | File[] | null) => {
    if (!incoming || pickerDisabled) return;
    const list = Array.from(incoming).filter(isFileLike);
    if (!list.length) return;

    const accepted: File[] = [];
    for (const file of list) {
      if (props.maxSizeBytes != null && file.size > props.maxSizeBytes) {
        props.onFileTooLarge?.();
        continue;
      }
      if (isFile) {
        if (!fileMatchesAccept(file, accept)) {
          props.onInvalidFile?.();
          continue;
        }
        accepted.push(file);
        continue;
      }
      if (!(file.type || '').startsWith('image/')) {
        props.onInvalidFile?.();
        continue;
      }
      accepted.push(file);
    }
    if (!accepted.length) return;

    if (isMultiple) {
      const seen = new Set(multiFiles.map(fileKey));
      const next = [...multiFiles];
      for (const file of accepted) {
        const key = fileKey(file);
        if (seen.has(key)) continue;
        seen.add(key);
        next.push(file);
      }
      setMultiFiles(next);
      return;
    }

    setSingleFile(accepted[0] ?? null);
  };

  const imageProps = !isFile ? (props as UploadDropzoneImageProps) : null;
  const displayedImage =
    imageProps &&
    (previewUrl ?? (!imageProps.removeExistingImage ? imageProps.existingImageUrl : undefined));

  const dashedClasses = cn(
    'block rounded-xl border-2 border-dashed border-border/55 p-4 transition-colors',
    pickerDisabled && 'pointer-events-none opacity-50',
    !pickerDisabled && 'cursor-pointer hover:border-primary/50 hover:bg-muted/15',
    isDragging ? 'border-primary/70 bg-primary/5' : undefined,
  );

  const chooseLabel = isFile ? t.chooseFileText : t.chooseImageText;

  return (
    <div className={cn('space-y-3', isFile ? props.className : undefined)}>
      <label
        htmlFor={pickerDisabled ? undefined : inputId}
        className={dashedClasses}
        onDragOver={(event) => {
          event.preventDefault();
          if (pickerDisabled) return;
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (pickerDisabled) return;
          acceptFiles(event.dataTransfer.files);
        }}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={isMultiple || undefined}
          disabled={pickerDisabled || undefined}
          className="sr-only"
          onChange={(event) => {
            acceptFiles(event.target.files);
            event.target.value = '';
          }}
        />
        {isFile ? (
          <div className="mb-3 flex min-h-28 flex-col items-center justify-center gap-2 rounded-lg border border-border/45 bg-muted/20 px-3 py-4 text-center">
            {previewUrl ? (
              <video
                src={previewUrl}
                controls
                className="max-h-44 w-full rounded-lg border border-border/45 bg-foreground"
              />
            ) : (
              <FileText className="h-8 w-8 shrink-0 text-muted-foreground" aria-hidden />
            )}
            {isMultiple ? (
              multiFiles.length > 0 ? (
                <ul className="w-full space-y-1.5 text-left">
                  {multiFiles.map((file) => (
                    <li
                      key={fileKey(file)}
                      className="flex items-center gap-2 rounded-md border border-border/40 bg-background/60 px-2 py-1.5"
                    >
                      <FileText
                        className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 shrink-0 p-0"
                        disabled={pickerDisabled || undefined}
                        aria-label={`${t.removeFileAriaLabel} ${file.name}`}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setMultiFiles(multiFiles.filter((f) => fileKey(f) !== fileKey(file)));
                        }}
                      >
                        <X className="h-3.5 w-3.5" aria-hidden />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : null
            ) : singleFile ? (
              <p className="line-clamp-2 w-full break-all text-sm font-medium">{singleFile.name}</p>
            ) : null}
          </div>
        ) : displayedImage ? (
          <img
            src={displayedImage}
            alt={t.imageAlt}
            className="mb-3 h-44 w-full rounded-lg border border-border/45 object-cover"
          />
        ) : (
          <div className="mb-3 flex h-32 items-center justify-center rounded-lg border border-border/45 bg-muted/20">
            <ImagePlus className="h-8 w-8 text-muted-foreground" aria-hidden />
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{t.dropHintText}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              disabled={pickerDisabled || undefined}
              onClick={(event) => {
                event.preventDefault();
                inputRef.current?.click();
              }}
            >
              <UploadCloud className="mr-2 h-4 w-4" aria-hidden />
              {chooseLabel}
            </Button>
            {!isMultiple && isFile && singleFile ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pickerDisabled || undefined}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setSingleFile(null);
                }}
              >
                {t.removeText}
              </Button>
            ) : null}
            {isMultiple && multiFiles.length > 0 ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pickerDisabled || undefined}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setMultiFiles([]);
                }}
              >
                {t.removeText}
              </Button>
            ) : null}
          </div>
        </div>
      </label>

      {imageProps?.existingImageUrl &&
      imageProps.onRemoveExistingImageChange &&
      t.removeExistingImageText ? (
        <div className="flex items-center justify-between rounded-lg border border-border/45 bg-muted/15 px-3 py-2">
          <span className="text-xs text-muted-foreground" id={removeExistingLabelId}>
            {t.removeExistingImageText}
          </span>
          <Checkbox
            aria-labelledby={removeExistingLabelId}
            checked={imageProps.removeExistingImage}
            onCheckedChange={(checked) =>
              imageProps.onRemoveExistingImageChange?.(checked === true)
            }
          />
        </div>
      ) : null}
    </div>
  );
}

export { fileMatchesAccept, UploadDropzone };
