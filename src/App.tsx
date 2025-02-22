/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useEffect, useState } from 'react';
import ImagePromptCard from './components/ImagePromptCard';

interface ImageData {
  id: number;
  image_url: string;
  prompt: string;
}

const App = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://replicate-images.vercel.app/images');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data && data.images) {
         
          const flattenedImages: ImageData[] = [];
          data.images.forEach((promptData: any) => { 
            promptData.image_urls.forEach((imageUrl: string) => { 
              flattenedImages.push({
                id: promptData.id, 
                prompt: promptData.prompt,
                image_url: imageUrl,
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
    };
    fetchData();
  }, []);

  const columnCount = 4;
  const columns = Array.from({ length: columnCount }, (_, i) =>
    images.filter((_, index) => index % columnCount === i)
  );

  if (loading) {
    return <p>Loading images from API...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className='py-6 pl-3 pr-3'>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="grid gap-4">
          {column.map((image) => (
            <div key={image.id} className="break-inside-avoid">
              <ImagePromptCard
                image_url={image.image_url} 
                promptText={image.prompt}
                aspectRatio={`${Math.floor(Math.random() * 60 + 100)}%`}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
    </section>
  );
};

export default App;