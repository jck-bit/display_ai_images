/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bookmark, Trash2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ImagePromptCardProps {
  image_url: string;
  promptText: string;
  aspectRatio?: string;
  onImageDeleted: (imageUrl: string) => void;
  isLikedInitially: boolean; 
}

const ImagePromptCard: React.FC<ImagePromptCardProps> = ({
  image_url,
  promptText,
  aspectRatio = "128.636%",
  onImageDeleted,
  isLikedInitially, 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setIsLiked(isLikedInitially); 
  }, [isLikedInitially]);

  const handleDeleteImage = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch('https://replicate-images.vercel.app/images', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: image_url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete image: ${response.status} - ${errorData?.message || 'Unknown error'}`);
      }

      onImageDeleted(image_url);
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setDeleteError(error.message || 'Failed to delete image.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLikeImage = async () => {
    try {
      const response = await fetch('https://replicate-images.vercel.app/liked_images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: image_url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to like image: ${response.status} - ${errorData?.message || 'Unknown error'}`);
      }

      setIsLiked(true);
      console.log("Image liked successfully");
    } catch (error: any) {
      console.error('Error liking image:', error);
      // Optional: Handle error
    }
  };

  return (
    <figure className="relative" style={{ paddingBottom: aspectRatio }}>
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-2">

        <button
          className="rounded-full p-1 bg-red-200/50 hover:bg-red-300/70 text-red-700 hover:text-red-800 cursor-pointer"
          aria-label="Delete image"
          onClick={handleDeleteImage}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <svg className="animate-spin h-5 w-5 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Trash2 size={23} color="#c01c28" />
          )}
        </button>

        <button
          className="rounded-full p-1 bg-gray-200/50 hover:bg-gray-300/70 text-gray-700 hover:text-gray-800 cursor-pointer"
          aria-label="Star image"
          onClick={handleLikeImage}
        >
          <Bookmark size={23} color={isLiked ? "white" : "currentColor"} />
        </button>

      </div>

      <a
        className="group block rounded overflow-hidden absolute top-0 left-0 w-full h-full"
        href="#"
      >
        <img
          alt={promptText}
          loading="lazy"
          decoding="async"
          className="object-cover rounded-lg"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            color: "transparent",
          }}
          src={image_url}
        />

        {/* <figcaption
          className="_12jn0ku0 absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 text-white pointer-events-none rounded-lg bg-gradient-to-t from-black/60 via-black/40 to-transparent"
        >
          <div className="absolute bottom-0 left-0 w-full p-4 space-y-4">
            <p className="text-white text-base leading-normal _12jn0ku1 overflow-hidden text-ellipsis nika-negative">
              {promptText}
            </p>
            <div className="w-full">
              <button
                className="h-10 px-4 py-0 text-white flex items-center justify-center gap-2 cursor-pointer bg-transparent hover:bg-white/10 focus:bg-white/20 transition-all border border-solid rounded-full text-base font-semibold border-grayHeather pointer-events-auto"
              > Use this prompt
              </button>
            </div>
          </div>
        </figcaption> */}
        {deleteError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
            <div className="bg-white p-4 rounded-md text-red-700">
              <p>{deleteError}</p>
            </div>
          </div>
        )}
      </a>
    </figure>
  );
};

export default ImagePromptCard;