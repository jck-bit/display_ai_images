// HomePage.tsx
import  { useEffect, useRef, useState } from 'react';
import ImagePromptCard from '../components/ImagePromptCard';
import SkeletonImageCard from '../components/SkeletonImageCard';
import { useImageData } from '../hooks/useImageData';
import ImageModal from '../components/ImageModal'; 

interface ImageData {
  image_uuid: string;
  image_url: string;
  prompt: string;
  is_liked: boolean;
}

const HomePage = () => {
  const { homeImages, loadingHome, errorHome, fetchHomeImages, handleImageDeleted, handleLikeUnlikeImage } = useImageData();
  const scrollPositionRef = useRef(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  useEffect(() => {
    if (!homeImages && !loadingHome && !errorHome) { fetchHomeImages(); }
  }, [fetchHomeImages, homeImages, loadingHome, errorHome]);

  const handleCardDelete = async (imageUuid: string) => {
    scrollPositionRef.current = window.scrollY;
    try {
      await handleImageDeleted(imageUuid, 'homeImages');
      if (selectedImage?.image_uuid === imageUuid) { 
        setIsModalOpen(false); 
      }
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleCardLikeToggle = async (imageUuid: string, currentLikedStatus: boolean) => {
    scrollPositionRef.current = window.scrollY;
    try {
      await handleLikeUnlikeImage(imageUuid, currentLikedStatus);
      if (selectedImage?.image_uuid === imageUuid) { 
        setSelectedImage(prevImage => prevImage ? {...prevImage, is_liked: !currentLikedStatus} : null);
      }
    } catch (error) {
      console.error("Error toggling like status:", error);
    }
  };

  const handleImageCardClick = (image: ImageData) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (homeImages) {
        window.scrollTo(0, scrollPositionRef.current);
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
      <section className='py-6 pl-3 pr-3 relative'>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
              {homeImages && homeImages.map((image) => (
                  <div key={image.image_uuid} className="break-inside-avoid" onClick={() => handleImageCardClick(image)}> 
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
          {selectedImage && (
            <ImageModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              image_url={selectedImage.image_url}
              image_uuid={selectedImage.image_uuid}
              promptText={selectedImage.prompt}
              isLikedInitially={selectedImage.is_liked}
              onDelete={handleCardDelete}
              onLikeToggle={handleCardLikeToggle}
              imageListName={'homeImages'}
            />
          )}
      </section>
  );
};

export default HomePage;