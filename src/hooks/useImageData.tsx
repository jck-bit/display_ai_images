import { useContext } from 'react';
import { ImageDataContext, ImageDataContextType } from '../context/ImageData'; 

export const useImageData = (): ImageDataContextType => {
  const context = useContext(ImageDataContext);
  if (!context) {
    throw new Error('useImageData must be used within an ImageDataProvider');
  }
  return context;
};