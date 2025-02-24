/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useCallback } from 'react';

interface ImageData {
  id: number;
  image_url: string;
  prompt: string;
  is_liked: boolean;
}

export interface ImageDataContextType {
  homeImages: ImageData[] | null;
  likedImages: ImageData[] | null;
  loadingHome: boolean;
  loadingLiked: boolean;
  errorHome: string | null;
  errorLiked: string | null;
  fetchHomeImages: () => Promise<void>;
  fetchLikedImages: (query?: string) => Promise<void>;
  handleImageDeletedFromHome: (deletedImageUrl: string) => void;
  handleImageDeletedFromLiked: (deletedImageUrl: string) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ImageDataContext = createContext<ImageDataContextType | undefined>(undefined);

interface ImageDataProviderProps {
  children: React.ReactNode;
}

export const ImageDataProvider: React.FC<ImageDataProviderProps> = ({ children }) => {
  const [homeImages, setHomeImages] = useState<ImageData[] | null>(null);
  const [likedImages, setLikedImages] = useState<ImageData[] | null>(null);
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const [errorHome, setErrorHome] = useState<string | null>(null);
  const [errorLiked, setErrorLiked] = useState<string | null>(null);

  const fetchHomeImages = useCallback(async () => {
    if (homeImages) {
      return;
    }
    setLoadingHome(true);
    setErrorHome(null);
    try {
      const response = await fetch('https://replicate-images.vercel.app/images');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} (Images)`);
      }
      const data = await response.json();
      if (data && data.images) {
        const flattenedImages: ImageData[] = [];
        data.images.forEach((promptData: any) => {
          promptData.image_urls_data.forEach((imageUrlData: any) => {
            flattenedImages.push({
              id: promptData.id,
              prompt: promptData.prompt,
              image_url: imageUrlData.url,
              is_liked: imageUrlData.is_liked || false,
            });
          });
        });
        setHomeImages(flattenedImages);
      } else {
        throw new Error('Invalid API response format: "images" array not found.');
      }
    } catch (error: any) {
      console.error('Error fetching home images:', error);
      setErrorHome('Failed to load images. Please try again later.');
    } finally {
      setLoadingHome(false);
    }
  }, [homeImages]);

  const fetchLikedImages = useCallback(async (query: string = '') => {
    setLoadingLiked(true);
    setErrorLiked(null);
    try {
      const url = new URL('https://replicate-images.vercel.app/liked_images_list');
      if (query) {
        url.searchParams.append('search', query);
      }
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} (Liked Images Search)`);
      }
      const data = await response.json();
      if (data && data.liked_images) {
        setLikedImages(data.liked_images);
      } else {
        throw new Error('Invalid API response format: "liked_images" array not found in search response.');
      }
    } catch (error: any) {
      console.error('Error fetching liked images with search:', error);
      setErrorLiked('Failed to load liked images. Please try again later.');
    } finally {
      setLoadingLiked(false);
    }
  }, []);

  const handleImageDeletedFromHome = useCallback((deletedImageUrl: string) => {
    setHomeImages(currentImages => currentImages ? currentImages.filter(image => image.image_url !== deletedImageUrl) : []);
  }, []);

  const handleImageDeletedFromLiked = useCallback((deletedImageUrl: string) => {
    setLikedImages(currentLikedImages => currentLikedImages ? currentLikedImages.filter(image => image.image_url !== deletedImageUrl) : []);
  }, []);


  const value: ImageDataContextType = {
    homeImages,
    likedImages,
    loadingHome,
    loadingLiked,
    errorHome,
    errorLiked,
    fetchHomeImages,
    fetchLikedImages,
    handleImageDeletedFromHome,
    handleImageDeletedFromLiked,
  };

  return (
    <ImageDataContext.Provider value={value}>
      {children}
    </ImageDataContext.Provider>
  );
};