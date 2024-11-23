// eslint-disable-next-line no-unused-vars
import React from 'react';
import bgImg from '../../assets/Discount Bannar.jpg'
import { Link } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';

const SummerSaleBanner = () => {
    return (
        <div>
            <section
                className='py-[0.5vw] px-[2vw] my-[2vw] md:px-[8vw] w-full'>

                {/* Content */}
                <div
                    className="md:flex md:justify-end h-[80vw] md:h-[25vw] py-[15vw] px-[3vw] md:px-[1vw] md:py-[0vw] rounded-xl items-center"
                    style={{
                        backgroundImage: `url(${bgImg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <div className="md:ml-16 text-white">
                        <p className="md:text-[1.2vw] text-center md:text-start mb-2 font-Poppins">SUMMER SALE</p>
                        <div className="flex justify-center md:justify-normal md:items-baseline mb-4 font-Poppins mx-auto w-[40vw] md:w-0 md:mx-0 px-[2vw] py-[1vw] bg-gradient-to-l from-neutral-700 via-neutral-800 to-transparent rounded-md md:px-0 md:py-0 md:bg-transparent md:rounded-none">
                            <span className="text-[6vw] md:text-[3vw] font-bold text-orange-500">37%</span>
                            <span className="text-[6vw] md:text-[3vw] font-bold ml-2">OFF</span>
                        </div>
                        <p className="text-Gray100 text-[3.5vw] md:text-[1vw] text-center md:text-start mb-6 md:max-w-md font-Poppins">
                            Free on all your order, Free Shipping and 30 days money-back guarantee
                        </p>
                        <Link
                            to='/'
                            className="bg-Primary transition-colors text-white py-2 px-4 mx-auto md:mx-0 md:px-4 md:py-2 rounded-xl md:rounded-full flex w-[35vw] md:w-[9.5vw] text-[4vw] md:text-[1vw] items-center gap-1 font-meduim font-Poppins">
                            Shop Now
                            <BsArrowRight className='text-[5vw] md:text-[1.3vw]'/>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SummerSaleBanner;