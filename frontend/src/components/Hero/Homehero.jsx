// eslint-disable-next-line no-unused-vars
import React, {useRef, useState} from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../Slider/Customdots.css";
import {Link} from "react-router-dom";
import {GoArrowRight} from "react-icons/go";
import Hero1 from '../../assets/Heroimg-1.jpg'
import Hero2 from '../../assets/Hero-2.png'
import Hero3 from '../../assets/Hero-3.png'

const Homehero = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const sliderRef = useRef(null);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 6000,
        beforeChange: (current, next) => setActiveSlide(next),
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    dots: false,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // List of slides for custom dots
    const slides = [Hero1, Hero2, Hero3];

    return (
        <div>
            <section className='hidden py-[2vw] px-[8vw] md:flex md:space-x-[1vw]'>
                <div
                    className='rounded-[3.5vw] w-[60%] h-[40vw] md:rounded-[1vw] px-[3vw] flex flex-col justify-center'
                    style={{
                        backgroundImage: `url(${Hero1})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <h1
                        className='text-[6.5vw] md:text-[3vw] text-White font-Poppins font-semibold w-[15ch]'>Fresh & Healthy Organic Food</h1>
                    <div className='border-l-2 border-White px-[1vw] mt-[1vw]'>
                        <p className='text-[3.5vw] md:text-[1.5vw] font-medium font-Poppins text-White'>
                            Sale up to
                            <span
                                className='px-[1vw] py-[0.2vw] font-medium bg-Warning rounded-md ml-[0.5vw]'>30% OFF</span>
                        </p>

                        <p className='mt-[0.5vw] font-Poppins text-White text-[2.5vw] md:text-[0.8vw]'>Free shipping on all your order.</p>
                    </div>
                    <Link
                        to="/shop"
                        className="flex justify-center rounded-full space-x-[0.5vw] items-center mt-[2.5vw] md:mt-[1.5vw] w-[30vw] h-[8vw] md:w-[12vw] md:h-[3vw] bg-White">
                        <span
                            className='font-semibold font-Poppins text-Primary text-[3.2vw] md:text-[1.2vw]'>Shop Now</span>
                        <GoArrowRight className='text-[5vw] md:text-[1.7vw] text-Primary'/>
                    </Link>
                </div>

                <div
                    className='flex md:block h-[40vw] space-x-[1vw] md:space-x-[0vw] mt-[2vw] md:mt-[0vw] md:w-[40%] md:h-[40vw] md:space-y-[1vw]'>
                    <div
                        className='w-full rounded-[3.5vw] md:h-[19.5vw] md:rounded-[1vw] px-[3vw] py-[3vw]'
                        style={{
                            backgroundImage: `url(${Hero2})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <span className='uppercase text-[2.5vw] md:text-[1vw] font-medium font-Poppins'>Summer Sale</span>
                        <p className='uppercase text-[4.8vw] md:text-[2.4vw] font-bold font-Poppins'>75% OFF</p>
                        <p className='text-[2.5vw] md:text-[1vw] font-Poppins text-Gray600'>Only Fruit & Vegetable</p>
                        <Link to="/shop" className="flex space-x-[0.5vw] items-center mt-[1vw]">
                            <span
                                className='font-semibold font-Poppins text-Primary text-[3.2vw] md:text-[1.2vw]'>Shop Now</span>
                            <GoArrowRight className='text-[5vw] md:text-[1.7vw] text-Primary'/>
                        </Link>
                    </div>

                    <div
                        className='w-full rounded-[3.5vw] md:h-[19.5vw] md:rounded-[1vw] px-[3vw] flex flex-col justify-center text-center'
                        style={{
                            backgroundImage: `url(${Hero3})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                        <span
                            className='font-Poppins text-[2.2vw] text-White uppercase font-medium md:text-[1.1vw]'>Best Deal</span>
                        <h2
                            className='font-Poppins text-[4vw] text-White font-semibold md:text-[2.2vw] w-[15ch] mx-auto'>Special Products Deal of the Month</h2>
                        <Link
                            to="/shop"
                            className="flex justify-center mx-auto space-x-[0.5vw] items-center mt-[1vw]">
                            <span
                                className='font-semibold font-Poppins text-Primary text-[3.2vw] md:text-[1.2vw]'>Shop Now</span>
                            <GoArrowRight className='text-[5vw] md:text-[1.7vw] text-Primary'/>
                        </Link>
                    </div>
                </div>

            </section>

            <section>
                <div className="py-[5vw] px-[2vw] overflow-hidden md:hidden">
                    <Slider {...sliderSettings} ref={sliderRef}>

                        {/* Slide 1 */}
                        <div
                            className='w-full h-[80vw] px-[6vw] py-[15vw] rounded-[3.5vw] flex flex-col justify-center slide1'>
                            <h1 className='text-[6.5vw] text-White font-Poppins font-semibold w-[15ch]'>Fresh & Healthy Organic Food</h1>
                            <div className='border-l-2 border-White px-[2.5vw] mt-[2vw]'>
                                <p className='text-[3.5vw] font-medium font-Poppins text-White'>
                                    Sale up to
                                    <span
                                        className='px-[2vw] py-[0.5vw] md:px-[1vw] md:py-[0.2vw] font-medium bg-Warning rounded-md ml-[1vw]'>30% OFF</span>
                                </p>
                                <p className='mt-[1vw] font-Poppins text-White text-[3vw] md:text-[2.5vw]'>Free shipping on all your order.</p>
                            </div>
                        </div>

                        {/* Slide 2 */}
                        <div
                            className='w-full h-[80vw] rounded-[3.5vw] px-[3vw] py-[15vw] flex flex-col justify-center slide2'>
                            <span className='uppercase text-[3vw] font-medium font-Poppins'>Summer Sale</span>
                            <p className='uppercase text-[9vw] font-bold font-Poppins'>75% OFF</p>
                            <p className='text-[3vw] font-Poppins text-Gray600'>Only Fruit & Vegetable</p>
                        </div>

                        {/* Slide 3 */}
                        <div
                            className='w-full h-[80vw] rounded-[3.5vw] py-[15vw] flex flex-col justify-center text-center slide3'>
                            <span className='font-Poppins text-[3vw] text-White uppercase font-medium'>Best Deal</span>
                            <h2
                                className='font-Poppins text-[7vw] text-White font-semibold w-[15ch] mx-auto'>Special Products Deal of the Month</h2>
                            <Link
                                to="/shop"
                                className="flex justify-center mx-auto space-x-[1vw] items-center mt-[3vw]">
                                <span className='font-semibold font-Poppins text-Primary text-[4vw]'>Shop Now</span>
                                <GoArrowRight className='text-[6vw] text-Primary'/>
                            </Link>
                        </div>

                    </Slider>

                    {/* Custom Dots */}
                    <div className="slick-dots">
                        {
                            slides.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${activeSlide === index
                                        ? "slick-active"
                                        : ""}`}
                                    onClick={() => {
                                        sliderRef
                                            .current
                                            .slickGoTo(index);
                                        setActiveSlide(index);
                                    }}/>
                            ))
                        }
                    </div>

                </div>
            </section>

        </div>
    )
}

export default Homehero