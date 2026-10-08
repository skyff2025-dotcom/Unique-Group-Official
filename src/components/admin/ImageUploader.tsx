import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  Star,
  CheckCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  Link as LinkIcon,
} from 'lucide-react';
import { PropertyImageRow } from '../../types/database';
import {
  uploadPropertyImage,
  deletePropertyImage,
  updateImageOrder,
  addPropertyImageByUrl,
} from '../../services/admin';

export interface StagedImage {
  id: string;
  file?: File;
  previewUrl: string;
  isStaged: boolean;
  altText?: string;
  isCover: boolean;
}

interface ImageUploaderProps {
  propertyId?: string;
  images: PropertyImageRow[];
  onImagesChange: (updatedImages: PropertyImageRow[]) => void;
  stagedFiles?: File[];
  onStagedFilesChange?: (files: File[]) => void;
  stagedUrls?: string[];
  onStagedUrlsChange?: (urls: string[]) => void;
  disabled?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  propertyId,
  images,
  onImagesChange,
  stagedFiles = [],
  onStagedFilesChange,
  stagedUrls = [],
  onStagedUrlsChange,
  disabled = false,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local files selected
  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage('');

    const fileList = Array.from(files);

    // If property exists in DB, upload immediately to Supabase
    if (propertyId) {
      setUploading(true);
      const updated = [...images];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadProgress(`Uploading ${i + 1} of ${fileList.length}: ${file.name}...`);

        const nextOrder = updated.length > 0 ? Math.max(...updated.map((m) => m.display_order)) + 1 : 0;
        const res = await uploadPropertyImage(propertyId, file, nextOrder, file.name);

        if (res.data) {
          updated.push(res.data);
        } else if (res.error) {
          setErrorMessage(res.error);
          break;
        }
      }

      onImagesChange(updated);
      setUploading(false);
      setUploadProgress('');
    } else {
      // In New Property mode: stage local files for upload upon form submission
      if (onStagedFilesChange) {
        onStagedFilesChange([...stagedFiles, ...fileList]);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Add image by direct URL
  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setErrorMessage('');

    if (propertyId) {
      setUploading(true);
      const nextOrder = images.length > 0 ? Math.max(...images.map((m) => m.display_order)) + 1 : 0;
      const res = await addPropertyImageByUrl(propertyId, urlInput.trim(), nextOrder);
      setUploading(false);

      if (res.data) {
        onImagesChange([...images, res.data]);
        setUrlInput('');
        setShowUrlInput(false);
      } else {
        setErrorMessage(res.error || 'Failed to add image URL.');
      }
    } else {
      // Stage URL for new property
      if (onStagedUrlsChange) {
        onStagedUrlsChange([...stagedUrls, urlInput.trim()]);
        setUrlInput('');
        setShowUrlInput(false);
      }
    }
  };

  // Delete saved image from Supabase
  const handleDeleteSavedImage = async (img: PropertyImageRow) => {
    if (!confirm('Are you sure you want to remove this photo?')) return;
    const res = await deletePropertyImage(img.id, img.storage_path);
    if (res.success) {
      const updated = images.filter((i) => i.id !== img.id);
      onImagesChange(updated);
    } else {
      setErrorMessage(res.error || 'Failed to delete image');
    }
  };

  // Remove staged file
  const handleRemoveStagedFile = (index: number) => {
    if (onStagedFilesChange) {
      const updated = [...stagedFiles];
      updated.splice(index, 1);
      onStagedFilesChange(updated);
    }
  };

  // Remove staged URL
  const handleRemoveStagedUrl = (index: number) => {
    if (onStagedUrlsChange) {
      const updated = [...stagedUrls];
      updated.splice(index, 1);
      onStagedUrlsChange(updated);
    }
  };

  // Set as Cover Image (Display Order = 0)
  const handleSetCover = async (index: number) => {
    if (index === 0) return;
    const reordered = [...images];
    const [target] = reordered.splice(index, 1);
    reordered.unshift(target);

    // Update orders
    const updated = reordered.map((img, idx) => ({ ...img, display_order: idx }));
    onImagesChange(updated);

    if (propertyId) {
      await updateImageOrder(updated.map((r) => ({ id: r.id, display_order: r.display_order })));
    }
  };

  // Move left / right
  const handleMove = async (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const updated = reordered.map((img, idx) => ({ ...img, display_order: idx }));
    onImagesChange(updated);

    if (propertyId) {
      await updateImageOrder(updated.map((r) => ({ id: r.id, display_order: r.display_order })));
    }
  };

  const totalImageCount = images.length + stagedFiles.length + stagedUrls.length;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F4F2EA] pb-3">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#0A192F] flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#8C6E2E]" />
            <span>Property Photos &amp; Gallery</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            The first image acts as the primary cover photo. Upload multiple images or add direct image URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            disabled={uploading || disabled}
            className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#D5CEBF] bg-white hover:bg-[#FAF9F5] text-xs font-semibold text-slate-700 inline-flex items-center gap-1.5 transition-colors"
          >
            <LinkIcon className="w-3.5 h-3.5 text-[#8C6E2E]" />
            <span>{showUrlInput ? 'Hide URL' : 'Add Image URL'}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#0A192F] hover:bg-[#112240] text-[#E2C98D] text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Select Photos</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled || uploading}
      />

      {/* Direct URL input bar */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="p-3 bg-[#FAF9F5] rounded-lg border border-[#E8E4D8] flex gap-2 items-center">
          <LinkIcon className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste public image URL (e.g. https://images.unsplash.com/...)"
            className="flex-1 min-h-[38px] px-3 rounded-md border border-[#D5CEBF] bg-white text-xs text-[#0A192F] focus:outline-none focus:border-[#C5A059]"
          />
          <button
            type="submit"
            disabled={!urlInput.trim() || uploading}
            className="min-h-[38px] px-4 rounded-md bg-[#0A192F] text-[#E2C98D] text-xs font-bold uppercase tracking-wider disabled:opacity-50"
          >
            Add Photo
          </button>
        </form>
      )}

      {/* Uploading progress indicator */}
      {uploading && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>{uploadProgress || 'Processing image uploads...'}</span>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Drag & Drop / Empty placeholder */}
      {totalImageCount === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#C5A059] bg-[#FAF9F5] hover:bg-[#FAF4E5]/40 transition-colors text-center cursor-pointer space-y-2"
        >
          <UploadCloud className="w-9 h-9 text-[#8C6E2E] mx-auto" />
          <p className="text-xs font-semibold text-[#0A192F]">
            Click to select property photos or drag and drop images here
          </p>
          <p className="text-[11px] text-slate-400">
            Supports high resolution JPG, PNG, WEBP files or external image URLs
          </p>
        </div>
      )}

      {/* STAGED FILES (in New Property mode) */}
      {stagedFiles.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6E2E]">
            Photos staged for upload on save ({stagedFiles.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stagedFiles.map((file, idx) => {
              const preview = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="group relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed border-[#C5A059] bg-slate-100 shadow-xs"
                >
                  <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                    Staged #{idx + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveStagedFile(idx)}
                    className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-sm"
                    title="Remove staged photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STAGED URLS (in New Property mode) */}
      {stagedUrls.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C6E2E]">
            Image URLs staged ({stagedUrls.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stagedUrls.map((url, idx) => (
              <div
                key={idx}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden border-2 border-dashed border-[#C5A059] bg-slate-100 shadow-xs"
              >
                <img src={url} alt={`Staged URL ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                  URL #{idx + 1}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveStagedUrl(idx)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white hover:bg-red-700 shadow-sm"
                  title="Remove staged URL"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVED GALLERY GRID */}
      {images.length > 0 && (
        <div className="space-y-2">
          {stagedFiles.length > 0 && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              Active Database Photos ({images.length})
            </span>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img, idx) => {
              const isCover = idx === 0;
              return (
                <div
                  key={img.id}
                  className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 bg-slate-100 shadow-xs transition-all ${
                    isCover ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40' : 'border-slate-200'
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={img.alt_text || `Property Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Primary Cover Badge */}
                  {isCover && (
                    <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#0A192F]/90 text-[#E2C98D] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm backdrop-blur-xs">
                      <Star className="w-3 h-3 fill-[#E2C98D] text-[#E2C98D]" />
                      <span>Primary Cover</span>
                    </div>
                  )}

                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    {/* Top bar actions: preview & delete */}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPreviewModalUrl(img.image_url)}
                        title="Preview Large Image"
                        className="p-1 rounded bg-white/80 hover:bg-white text-slate-800 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSavedImage(img)}
                        title="Delete image"
                        className="p-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom bar actions: reorder & set cover */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'left')}
                          title="Move left"
                          className="p-1 rounded bg-white/80 hover:bg-white text-slate-800 transition-colors disabled:opacity-30"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === images.length - 1}
                          onClick={() => handleMove(idx, 'right')}
                          title="Move right"
                          className="p-1 rounded bg-white/80 hover:bg-white text-slate-800 transition-colors disabled:opacity-30"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {!isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(idx)}
                          title="Set as Primary Cover Image"
                          className="px-2 py-0.5 rounded bg-[#C5A059] text-[#0A192F] text-[10px] font-bold uppercase tracking-wider hover:bg-[#d8b56d] transition-colors"
                        >
                          Set Cover
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <img src={previewModalUrl} alt="Preview" className="max-h-[85vh] w-auto object-contain mx-auto" />
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
