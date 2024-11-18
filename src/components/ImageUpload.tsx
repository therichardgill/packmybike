import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X, Upload } from 'lucide-react';

interface ImageUploadProps {
  images: File[];
  onChange: (files: File[]) => void;
  maxImages?: number;
  maxSize?: number; // in bytes
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = maxImages - images.length;
    const newFiles = acceptedFiles.slice(0, remainingSlots);
    onChange([...images, ...newFiles]);
  }, [images, maxImages, onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize,
    disabled: images.length >= maxImages,
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {images.map((file, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-700"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <div
            {...getRootProps()}
            className={`aspect-square rounded-lg border-2 border-dashed ${
              isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-blue-500'
            } transition-colors duration-200 flex flex-col items-center justify-center cursor-pointer`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-400 text-center px-2">
              {isDragActive ? (
                "Drop the image here"
              ) : (
                <>
                  Drag & drop or click to upload
                  <br />
                  <span className="text-xs">
                    ({images.length}/{maxImages} images)
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-400">
        <p>Supported formats: JPEG, PNG, WebP</p>
        <p>Maximum size: {maxSize / (1024 * 1024)}MB per image</p>
      </div>
    </div>
  );
};

export default ImageUpload;