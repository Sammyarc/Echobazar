// eslint-disable-next-line no-unused-vars
import React from 'react'
import Image from '../../assets/image 1.png';
import Image2 from '../../assets/image 1 (2).png';
import Image4 from '../../assets/image 1 (4).png';
import Image5 from '../../assets/image 1 (5).png';
import Image6 from '../../assets/image 1 (6).png';
import Image9 from '../../assets/image 1 (9).png';
import { Link } from 'react-router-dom';
import { BsArrowRight } from "react-icons/bs";

const categories = [
    {
        name: 'Fruit & Vegetables',
        image: Image,
        link: '/'
    },{
        name: 'Meat & Fish',
        image: Image2,
        link: '/'
    }, {
        name: 'Beverages',
        image: Image4,
        link: '/'
    }, {
        name: 'Beauty & Health',
        image: Image5,
        link: '/'
    }, {
        name: 'Bread & Bakery',
        image: Image6,
        link: '/'
    }, {
        name: 'Diabetic Food',
        image: Image9,
        link: '/'
    }
];

const CategoryCard = ({name, image, link}) => {
    return (
        <a
            href={link}
            className="p-[0.5vw] h-[28vw] md:w-[12vw] md:h-[12vw] border border-Gray100 rounded-lg md:p-[0.2vw] transition-all duration-300 hover:border-Primary hover:shadow-xl hover:text-Primary">
            <img src={image} alt={name} className="w-full md:w-[100vw] object-contain mb-[0.5vw]"/>
            <p className="text-[3vw] md:text-[1vw] text-center font-medium font-Poppins">{name}</p>
        </a>
    );
};

const ProductCategories = () => {
    return (
        <div>
            <section className='md:mt-[3vw] mt-[6vw] px-[2vw] md:px-[8vw]'>
                <div className='flex justify-between items-center mb-[3vw] md:mb-[0.7vw]'>
                    <h2 className='font-Poppins text-[6vw] md:text-[2vw] font-semibold'>Popular Categories</h2>
                    <Link to='/' className='flex gap-1 md:gap-2 items-center text-Primary font-Poppins text-[4vw] md:text-[1.2vw]'>View All <BsArrowRight className='text-[5vw] md:text-[1.2vw]'/></Link>
                </div>
                <div className="w-full grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-6">
                    {
                        categories.map((category, index) => (
                            <CategoryCard
                                key={index}
                                name={category.name}
                                image={category.image}
                                link={category.link}/>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}

export default ProductCategories