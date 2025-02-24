/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import ImagePromptCard from './components/ImagePromptCard';
import SkeletonImageCard from './components/SkeletonImageCard';
import { motion, AnimatePresence } from 'framer-motion'; 

interface ImageData {
  id: number;
  image_url: string;
  prompt: string;
  is_liked: boolean;
}

const App = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
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
        setImages(flattenedImages);
      } else {
        throw new Error('Invalid API response format: "images" array not found.');
      }


    } catch (error: any) {
      console.error('Error fetching data from API:', error);
      setError('Failed to load images. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageDeleted = useCallback((deletedImageUrl: string) => {
    const currentScrollY = window.scrollY;
    setImages(currentImages => currentImages.filter(image => image.image_url !== deletedImageUrl));

    window.scrollTo({ top: currentScrollY, behavior: 'smooth' });

  }, []);


  const columnCount = 4;
  const columns = Array.from({ length: columnCount }, (_, i) =>
    images.filter((_, index) => index % columnCount === i)
  );

  const renderSkeletonLoaders = () => {
    const skeletonCount = 12;
    const skeletonImages = Array.from({ length: skeletonCount }, (_, i) => ({ id: `skeleton-${i}` }));

    const skeletonColumns = Array.from({ length: columnCount }, (_, i) =>
      skeletonImages.filter((_, index) => index % columnCount === i)
    );

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
        {skeletonColumns.map((column, colIndex) => (
          <div key={`skeleton-col-${colIndex}`} className="grid gap-4">
            {column.map((skeleton) => (
              <div key={skeleton.id} className="break-inside-avoid">
                <SkeletonImageCard aspectRatio={`${Math.floor(Math.random() * 60 + 100)}%`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };


  if (loading) {
    return (
      <section className='py-6 pl-3 pr-3'>
        {renderSkeletonLoaders()}
      </section>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className='py-6 pl-3 pr-3'>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
        <AnimatePresence 
           mode='wait' 
        >
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="grid gap-4">
              {column.map((image) => (
                <motion.div
                  key={image.id}
                  className="break-inside-avoid"
                  layout 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  <ImagePromptCard
                    image_url={image.image_url}
                    promptText={image.prompt}
                    aspectRatio={`${Math.floor(Math.random() * 60 + 100)}%`}
                    onImageDeleted={handleImageDeleted}
                    isLikedInitially={image.is_liked}
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default App;