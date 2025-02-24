import  { useEffect, useRef } from 'react';
import ImagePromptCard from '../components/ImagePromptCard';
import SkeletonImageCard from '../components/SkeletonImageCard';
import { useImageData } from '../hooks/useImageData';

const HomePage = () => {
  const { homeImages, loadingHome, errorHome, fetchHomeImages, handleImageDeleted, handleLikeUnlikeImage } = useImageData();
  const scrollPositionRef = useRef(0); 

  useEffect(() => {
    if (!homeImages && !loadingHome && !errorHome) {
      fetchHomeImages();
    }
  }, [fetchHomeImages, homeImages, loadingHome, errorHome]);

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
    if (homeImages) {
        // console.log("HomePage - useEffect: homeImages updated. Restoring scroll position to =", scrollPositionRef.current, "Current window.scrollY =", window.scrollY); // Enhanced log
        window.scrollTo(0, scrollPositionRef.current);
        // console.log("HomePage - useEffect: window.scrollTo called. New window.scrollY =", window.scrollY); // Log after scrollTo
    } else {
        // console.log("HomePage - useEffect: homeImages is null or undefined, not restoring scroll."); // Log when homeImages is not truthy
    }
}, [homeImages]);


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
              {homeImages && homeImages.map((image) => ( 
                  <div key={image.image_uuid} className="break-inside-avoid">
                      <ImagePromptCard
                          key={image.image_uuid}
                          image_url={image.image_url}
                          promptText={image.prompt}
                          aspectRatio="128.636%" 
                          isLikedInitially={image.is_liked}
                          image_uuid={image.image_uuid}
                          onDelete={handleCardDelete}
                          onLikeToggle={handleCardLikeToggle}
                      />
                  </div>
              ))}
          </div>
      </section>
  );
};

export default HomePage;