import {IoIosClose} from 'react-icons/io';
import useWishlistStore from '../../store/useWishlistStore';
import NoProduct from '../Animations/NoProduct';
import {Link} from 'react-router-dom';
import {useEffect} from 'react';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const {wishlist, loading, removeFromWishlist, initializeWishlist} = useWishlistStore(); // Added loading state

    useEffect(() => {
        initializeWishlist(); // Initialize wishlist data from the backend
    }, [initializeWishlist]);

    const handleRemove = async (product) => {
        // First, remove the product from the wishlist
        await removeFromWishlist(product);
    
        // Then, refresh the wishlist data (if needed, adjust based on your store logic)
        initializeWishlist();
    
        // Show a toast notification after the product is removed
        toast.error(`${product.name} has been removed from your wishlist!`);
    };
    


    return (
        <div className="md:w-full border rounded-lg h-full">
            {
                loading
                    ? (
                        <div className="flex flex-col p-[5vw] justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                            <h3
                                className="text-[4vw] md:text-[1.3vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                Loading products, please wait...
                            </h3>
                        </div>
                    )
                    : wishlist.length > 0
                        ? (
                            <table className="w-full mt-[0.5vw] rounded-lg">
                                <thead className="border-b border-Gray200">
                                    <tr>
                                        <th
                                            className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Product</th>
                                        <th
                                            className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Categories</th>
                                        <th
                                            className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Regular Price</th>
                                        <th
                                            className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Sale Price</th>
                                        <th
                                            className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        wishlist.map((product) => (
                                            <tr key={product.id}>
                                                <td className="p-3 flex items-center">
                                                    {
                                                        product.images && product.images.length > 0
                                                            ? (
                                                                <img
                                                                    src={product.images[1]}
                                                                    alt={product.name}
                                                                    className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[2.5vw] mr-3 rounded-lg object-cover"/>
                                                            )
                                                            : ''
                                                    }
                                                    <Link
                                                        to={`/product/${encodeURIComponent(product.name)}`}
                                                        onClick={() => window.scrollTo(0, 0)}
                                                        className="font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{product.name}</Link>
                                                </td>
                                                <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                    {
                                                        product.categories && Array.isArray(product.categories)
                                                            ? product
                                                                .categories
                                                                .join(', ')
                                                            : ''
                                                    }

                                                </td>

                                                <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                    {
                                                        product.regularPrice !== undefined && product.regularPrice !== null
                                                            ? `$${product
                                                                .regularPrice
                                                                .toFixed(2)}`
                                                            : ''
                                                    }

                                                </td>
                                                <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                    {
                                                        product.salePrice
                                                            ? `${product
                                                                .salePrice
                                                                .toFixed(2)}`
                                                            : ''
                                                    }
                                                </td>
                                                <td className="p-3">
                                                    <button  onClick={() => handleRemove(product)}
                                                        title='Remove from Wishlist'
                                                        className="text-Gray700 ml-4 p-[0.2vw] border rounded-full">
                                                        <IoIosClose className='text-[1.5vw]'/>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        )
                        : (
                            <div className="flex flex-col p-[5vw] justify-center items-center">
                                <NoProduct/>
                                <h3
                                    className="text-[4vw] md:text-[1.3vw] text-Gray700 font-semibold font-Poppins">Oops! You have no product in wishlist yet.</h3>
                            </div>
                        )
            }
        </div>
    );
};

export default Wishlist;
