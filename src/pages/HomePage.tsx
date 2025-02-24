import  { useEffect, useCallback } from 'react';
import ImagePromptCard from '../components/ImagePromptCard';
import SkeletonImageCard from '../components/SkeletonImageCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageData } from '../hooks/useImageData'; 


const HomePage = () => {
  const { homeImages, loadingHome, errorHome, fetchHomeImages, handleImageDeletedFromHome } = useImageData(); 

  useEffect(() => {
    if (!homeImages) { 
      fetchHomeImages();
    }
  }, [fetchHomeImages, homeImages]);


  const handleImageDeleted = useCallback((deletedImageUrl: string) => {
    handleImageDeletedFromHome(deletedImageUrl);
  }, [handleImageDeletedFromHome]);


  const renderSkeletonLoaders = () => {
    const skeletonCount = 12;
    const skeletonImages = Array.from({ length: skeletonCount }, (_, i) => ({ id: `skeleton-${i}` }));

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
        {skeletonImages.map((skeleton) => (
          <div key={skeleton.id} className="break-inside-avoid">
            <SkeletonImageCard aspectRatio={`${Math.floor(Math.random() * 60 + 100)}%`}
            />
          </div>
        ))}
      </div>
    );
  };

  if (loadingHome) {
    return (
      <section className='py-6 pl-3 pr-3'>
        {renderSkeletonLoaders()}
      </section>
    );
  }

  if (errorHome) {
    return <p>Error: {errorHome}</p>;
  }

  return (
    <section className='py-6 pl-3 pr-3'>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
        <AnimatePresence mode="wait">
          {homeImages && homeImages.map((image) => (
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
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HomePage;