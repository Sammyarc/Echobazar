// eslint-disable-next-line no-unused-vars
import React from 'react'
import {Heart, ShoppingCart} from 'lucide-react';
import Img1 from '../../assets/Image.png'
import Img2 from '../../assets/Image (1).png'
import Img3 from '../../assets/Image (2).png'
import Img4 from '../../assets/Image (3).png'
import Img5 from '../../assets/Image (4).png'
import {Link} from 'react-router-dom';
import {BsArrowRight} from 'react-icons/bs';

const NewProducts = () => {
    const products = [
        {
            id: 1,
            name: 'Green Apple',
            price: 14.99,
            rating: 4,
            image: Img1,
            link: '/'
        }, {
            id: 2,
            name: 'Chinese Cabbage',
            price: 14.99,
            rating: 4,
            image: Img2,
            link: '/'
        }, {
            id: 3,
            name: 'Green Lettuce',
            price: 14.99,
            rating: 4,
            image: Img3,
            link: '/'
        }, {
            id: 4,
            name: 'Green Chili',
            price: 14.99,
            rating: 4,
            image: Img4,
            link: '/'
        }, {
            id: 5,
            name: 'Corn',
            price: 14.99,
            rating: 4,
            image: Img5,
            link: '/'
        }
    ];

    return (
        <div>
            <section className='mt-[6vw] md:mt-[3vw] px-[2vw] md:px-[8vw]'>
                <div className='flex justify-between items-center mb-[0.7vw]'>
                    <h2 className='font-Poppins text-[5vw] md:text-[2vw] font-semibold'>New Products</h2>
                    <Link to='/' className='flex gap-1 md:gap-2 items-center text-Primary text-[3.5vw] md:text-[1.2vw] font-Poppins'>View All
                        <BsArrowRight className='text-[4vw] md:text-[1.2vw]'/></Link>
                </div>
                <div
                    className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {products.map((product) => (<ProductCard key={product.id} product={product}/>))}
                </div>
            </section>
        </div>

    );
};

const ProductCard = ({product}) => {
    return (
        <a
        href={product.link}
            className="group relative bg-white p-2 md:p-4 rounded-lg transition-all duration-300 border border-Gray100 hover:border-Primary hover:shadow-lg">
            <div className="relative aspect-square mb-4">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"/>
                <div
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart className="w-6 h-6 text-Gray600 hover:text-Primary cursor-pointer"/>
                </div>
            </div>

            <h3 className="text-Gray800 text-[4vw] md:text-[1vw] font-medium mb-1 md:mb-2 font-Poppins">{product.name}</h3>

            <div className="lg:flex justify-between items-center">
                <span className="text-Gray900 text-[4vw] md:text-[1vw] font-semibold font-Poppins">${product.price}</span>
                <div className="flex justify-between items-center">
                    <div className="flex mr-2">
                        {
                            [...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-[5vw] md:text-[1.3vw] ${
                                    i < product.rating
                                        ? 'text-yellow-400'
                                        : 'text-Gray300'}`}>
                                    ★
                                </span>
                            ))
                        }
                    </div>
                    <button
                        className="group-hover:bg-Primary group-hover:border-Primary group-hover:shadow-md p-2 rounded-full border border-gray-200 transition-all duration-300">
                        <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-white"/>
                    </button>
                </div>
            </div>
        </a>
    );
}

export default NewProducts