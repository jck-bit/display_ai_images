// api.ts

//const API_BASE_URL = 'https://replicate-images.vercel.app'; // Define your base URL
const API_BASE_URL = 'https://replicate-images.vercel.app'; // Define your base URL


export const fetchImages = async () => {
  const response = await fetch(`${API_BASE_URL}/images`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
};

export const deleteImage = async (imageUrl: string) => {
  const response = await fetch(`${API_BASE_URL}/images`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image_url: imageUrl }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to delete image: ${response.status} - ${errorData?.message || 'Unknown error'}`);
  }
  return response; // Or return response.json() if you expect JSON response on success
};