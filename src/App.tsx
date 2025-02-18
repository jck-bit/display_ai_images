
import  { useEffect, useState } from 'react';
import ImagePromptCard from './components/ImagePromptCard';

interface ImageData {
  id: number;
  imageFile: string;
  prompt: string;
  detailsPath: string;
}

const App = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        const result = await response.json();
        setImages(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const columnCount = 4;
  const columns = Array.from({ length: columnCount }, (_, i) => 
    images.filter((_, index) => index % columnCount === i)
  );

  return (
    <section className='py-6 pl-3 pr-3'>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ">
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="grid gap-4">
          {column.map((image) => (
            <div key={image.id} className="break-inside-avoid">
              <ImagePromptCard
                imageFile={image.imageFile}
                promptText={image.prompt}
                detailsPath={image.detailsPath}
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