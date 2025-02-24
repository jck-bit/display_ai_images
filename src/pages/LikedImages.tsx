import { useEffect, useRef } from 'react';
import ImagePromptCard from '../components/ImagePromptCard';
import SkeletonImageCard from '../components/SkeletonImageCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageData } from '../hooks/useImageData'; 



const LikedImagesPage = () => {
  const { likedImages, loadingLiked, errorLiked, fetchLikedImages, handleImageDeleted, handleLikeUnlikeImage  } = useImageData(); 
  const scrollPositionRef = useRef(0); 

const handleCardDelete = async (imageUuid: string) => {
  scrollPositionRef.current = window.scrollY; 
  try {
    await handleImageDeleted(imageUuid, 'homeImages');
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};


const handleCardLikeToggle = async (imageUuid: string, currentLikedStatus: boolean) => {
  scrollPositionRef.current = window.scrollY;
  try {
    await handleLikeUnlikeImage(imageUuid, currentLikedStatus);
  } catch (error) {
    console.error("Error toggling like status:", error);
  }
};

  useEffect(() => {
    if (!likedImages) { 
      fetchLikedImages(''); 
    }
  }, [fetchLikedImages, likedImages]);


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


  if (loadingLiked) {
    return (
      <section className='py-6 pl-3 pr-3'>
        {renderSkeletonLoaders()}
      </section>
    );
  }

  if (errorLiked) {
    return <p>Error: {errorLiked}</p>;
  }

  console.log("LikedImages Data:", likedImages);
    
  return (
    <section className='py-6 pl-3 pr-3'>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
        <AnimatePresence mode="wait">
          {likedImages && likedImages.map((image) => ( 
            <motion.div
              key={image.image_uuid}
              className="break-inside-avoid"
              layout
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <ImagePromptCard
                key={image.image_uuid}
                image_uuid={image.image_uuid}
                image_url={image.image_url}
                promptText={image.prompt}
                aspectRatio={`${Math.floor(Math.random() * 60 + 100)}%`}
                isLikedInitially={true}
                onDelete={handleCardDelete}
                onLikeToggle={handleCardLikeToggle}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LikedImagesPage;