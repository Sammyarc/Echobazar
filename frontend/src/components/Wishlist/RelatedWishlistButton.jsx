import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import useWishlistStore from '../../store/useWishlistStore';
import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : 'https://echobazar-fn59.vercel.app/api';

axios.defaults.withCredentials = true;

const RelatedWishlistButton = ({ relatedProduct }) => {
  const { addToWishlist, initializeWishlist } = useWishlistStore();
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch wishlist status from the database on initial load
  useEffect(() => {
    const checkProductInWishlist = async () => {
      try {
        // Check if the product is in the wishlist by making an API request
        const response = await axios.get(`${API_URL}/wishlist/${relatedProduct._id}`);
        
        if (response.data && response.data.isInWishlist) {
          setIsInWishlist(true);
        } else {
          setIsInWishlist(false);
        }
      } catch (error) {
        console.error("Error fetching wishlist status:", error);
      }
    };
    
    checkProductInWishlist(); // Check on component mount

  }, [relatedProduct]);

  // Handle the add/remove wishlist toggle
  const handleWishlistToggle = async () => {
    try {
      // Add or remove the product from the wishlist by calling the store action
      await addToWishlist(relatedProduct); 

      // After toggling, check the status again and update state
      setIsInWishlist((prev) => !prev);

      // Show appropriate toast message
      if (!isInWishlist) {
        toast.success(`${relatedProduct.name} has been added to your wishlist!`);
      } else {
        toast.error(`${relatedProduct.name} has been removed from your wishlist!`);
      }

      // Optionally, re-fetch the updated wishlist from the server if needed
      initializeWishlist();

    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("An error occurred while updating the wishlist.");
    }
  };

  return (
    <div
      className={`absolute top-2 right-2 z-10 p-[2vw] md:p-[0.5vw] bg-Gray50 rounded-full cursor-pointer
        ${isInWishlist ? 'text-Primary' : 'text-white'} transition-colors`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={handleWishlistToggle}
    >
      {isInWishlist ? (
        <IoIosHeart
          className="w-[5vw] h-[5vw] md:w-[1.3vw] md:h-[1.3vw]"
        />
      ) : (
        <IoIosHeartEmpty
          className="w-[5vw] h-[5vw] md:w-[1.3vw] md:h-[1.3vw] text-Primary hover:text-Primary"
        />
      )}
    </div>
  );
};

export default RelatedWishlistButton