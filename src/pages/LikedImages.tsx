import { useEffect, useCallback } from 'react';
import ImagePromptCard from '../components/ImagePromptCard';
import SkeletonImageCard from '../components/SkeletonImageCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useImageData } from '../hooks/useImageData'; 

const LikedImagesPage = () => {
  const { likedImages, loadingLiked, errorLiked, fetchLikedImages, handleImageDeletedFromLiked } = useImageData(); 
//   const { fetchHomeImages } = useImageData(); 

  useEffect(() => {
    if (!likedImages) { 
      fetchLikedImages(''); 
    }
  }, [fetchLikedImages, likedImages]);


  const handleImageDeleted = useCallback((deletedImageUrl: string) => {
    handleImageDeletedFromLiked(deletedImageUrl);
  }, [handleImageDeletedFromLiked]);


  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newSearchQuery = e.target.value;
  //   fetchLikedImages(newSearchQuery);
  // };


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


  return (
    <section className='py-6 pl-3 pr-3'>
      {/* <input
        type="text"
        placeholder="Search prompts..."
        value="" 
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded w-full"
      /> */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
        <AnimatePresence mode="wait">
          {likedImages && likedImages.map((image) => ( 
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
                isLikedInitially={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LikedImagesPage;