// eslint-disable-next-line no-unused-vars
import React from 'react'
import {Link} from "react-router-dom";
import { GoArrowRight } from "react-icons/go";
import Hero1 from '../../assets/Heroimg-1.jpg'
import Hero2 from '../../assets/Hero-2.png'
import Hero3 from '../../assets/Hero-3.png'

const Homehero = () => {
    return (
        <div>
            <section className='py-[2vw] px-[2vw] md:py-[2vw] md:px-[8vw] md:flex md:space-x-[1vw]'>
                <div
                    className='w-full h-[80vw] px-[6vw] rounded-[3.5vw] md:w-[60%] md:h-[40vw] md:rounded-[1vw] md:px-[3vw] flex flex-col justify-center'
                    style={{
                        backgroundImage: `url(${Hero1})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                    <h1 className='text-[6.5vw] md:text-[3vw] text-White font-Poppins font-semibold w-[15ch]'>Fresh & Healthy Organic Food</h1>
                    <div
                        className='border-l-2 border-White px-[1vw] mt-[1vw]'>
                        <p className='text-[3.5vw] md:text-[1.5vw] font-medium font-Poppins text-White'>
                            Sale up to
                            <span className='px-[1vw] py-[0.2vw] font-medium bg-Warning rounded-md ml-[0.5vw]'>30% OFF</span>
                        </p>

                        <p className='mt-[0.5vw] font-Poppins text-White text-[2vw] md:text-[0.8vw]'>Free shipping on all your order.</p>
                    </div>
                        <Link
                        to="/shop"
                        className="flex justify-center rounded-full space-x-[0.5vw] items-center mt-[2.5vw] md:mt-[1.5vw] w-[30vw] h-[8vw] md:w-[12vw] md:h-[3vw] bg-White">
                        <span className='font-semibold font-Poppins text-Primary text-[3.2vw] md:text-[1.2vw]'>Shop Now</span>
                        <GoArrowRight className='text-[5vw] md:text-[1.7vw] text-Primary'/>
                    </Link>
                </div>

                <div className='flex md:block h-[40vw] space-x-[1vw] md:space-x-[0vw] mt-[2vw] md:mt-[0vw] md:w-[40%] md:h-[40vw] md:space-y-[1vw]'>
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
                            <Link
                        to="/shop"
                        className="flex space-x-[0.5vw] items-center mt-[1vw]">
                        <span className='font-semibold font-Poppins text-Primary text-[3.2vw] md:text-[1.2vw]'>Shop Now</span>
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
                            <span className='font-Poppins text-[2.2vw] text-White uppercase font-medium md:text-[1.1vw]'>Best Deal</span>
                            <h2 className='font-Poppins text-[4vw] text-White font-semibold md:text-[2.2vw] w-[15ch] mx-auto'>Special Products Deal of the Month</h2>
                            <Link
                        to="/shop"
                        className="flex justify-center mx-auto space-x-[0.5vw] items-center mt-[1vw]">
                        <span className='font-semibold font-Poppins text-Primary text-[3.2vw] md:text-[1.2vw]'>Shop Now</span>
                        <GoArrowRight className='text-[5vw] md:text-[1.7vw] text-Primary'/>
                    </Link>
                        </div>
                </div>

            </section>
        </div>
    )
}

export default Homehero