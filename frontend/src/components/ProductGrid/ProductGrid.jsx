// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect} from 'react';
import { BsArrowRight } from "react-icons/bs";
import Img1 from '../../assets/Rectangle 54.png';
import Img2 from '../../assets/Pimg1.png';
import Img3 from '../../assets/Pimg2.png';

const ProductGrid = () => {
    return (
        <div>
            <section className='my-[5vw] px-[2vw] md:my-[2vw] md:px-[8vw]'>
                <div className="md:grid md:grid-cols-3 w-full space-x-[1.2vw]">
                    <SaleCountdownGrid/>
                    <LowFatMeatGrid/>
                    <FreshFruitGrid/>
                </div>
            </section>
        </div>

    );
};

// First grid - Sale Countdown 

const SaleCountdownGrid = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0
    });

    useEffect(() => {
        // Set the target end time (e.g., 24 days from now)
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 24);

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    mins: Math.floor((difference / 1000 / 60) % 60),
                    secs: Math.floor((difference / 1000) % 60),
                });
            } else {
                // Stop the timer when time is up
                setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
                clearInterval(timer);
            }
        };

        // Initial call to set countdown immediately
        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        // Clean up timer on unmount
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="h-[80vw] md:h-[35vw] rounded-2xl p-6 relative overflow-hidden" style={{
            backgroundImage: `url(${Img1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
        }}>
            <div className="text-white">
                <p className="uppercase text-[3vw] md:text-[1vw] mb-2 text-center font-Poppins">Best deals</p>
                <h2 className="text-[7vw] md:text-[2.5vw] font-bold mb-2 text-center font-Poppins">Sale of the Month</h2>

                <div className="flex justify-center text-center space-x-[1.2vw] mb-6 font-Poppins">
                    <TimeUnit value={String(timeLeft.days).padStart(2, '0')} label="DAYS" />
                    <span className='text-[3vw] md:text-[1.5vw] font-Poppins'>:</span>
                    <TimeUnit value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
                    <span className='text-[3vw] md:text-[1.5vw] font-Poppins'>:</span>
                    <TimeUnit value={String(timeLeft.mins).padStart(2, '0')} label="MINS" />
                    <span className='text-[3vw] md:text-[1.5vw] font-Poppins'>:</span>
                    <TimeUnit value={String(timeLeft.secs).padStart(2, '0')} label="SECS" />
                </div>

                <ShopNowButton />
            </div>
        </div>
    );
};



// Second grid - Low-Fat Meat
const LowFatMeatGrid = () => {
    return (
        <div className="h-[80vw] md:h-[35vw] rounded-2xl p-6 relative mt-[4vw] md:mt-[0vw] overflow-hidden"
        style={{
            backgroundImage: `url(${Img2})`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
        }}>
            <div className="text-white">
                <p className="uppercase text-[3vw] md:text-[1vw] mb-2 text-center font-Poppins">85% FAT FREE</p>
                <h2 className="text-[7vw] md:text-[2.5vw] font-bold mb-2 text-center font-Poppins">Low-Fat Meat</h2>

                <div className="mb-6 text-center">
                    <p className="text-[4vw] md:text-[1.2vw] font-Poppins mb-1">Started at <span className='font-bold text-Warning'>$79.99</span></p>
                </div>

                <ShopNowButton/>
            </div>
        </div>
    );
};

// Third grid - Fresh Fruit
const FreshFruitGrid = () => {
    return (
        <div className="h-[80vw] md:h-[35vw] rounded-2xl p-6 relative mt-[4vw] md:mt-[0vw] overflow-hidden"
        style={{
            backgroundImage: `url(${Img3})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div>
                <p className="uppercase text-[3vw] md:text-[1vw] mb-2 text-center font-Poppins">SUMMER SALE</p>
                <h2 className="text-[7vw] md:text-[2.5vw] font-bold mb-2 text-center font-Poppins">100% Fresh Fruit</h2>

                <div className="mb-6 text-center">
                    <p className="text-[4vw] md:text-[1.2vw] font-Poppins mb-1">Up to <span className='bg-black text-yellow-500 font-semibold inline-block px-3 py-1 rounded-md'>64% OFF</span></p>
                </div>

                <ShopNowButton/>
            </div>

        </div>
    );
};

// Reusable components
const TimeUnit = ({value, label}) => (
    <div className="text-center">
        <div className="text-[5vw] md:text-[1.5vw] font-meduim">{value}</div>
        <div className="text-xs">{label}</div>
    </div>
);

const ShopNowButton = () => (
    <button
        className='px-5 py-2 rounded-full flex text-Primary text-[3.5vw] md:text-[1.2vw] bg-White items-center justify-center gap-2 mx-auto font-semibold'>
        Shop Now
        <BsArrowRight className='text-[5vw] md:text-[1.2vw]'/>
    </button>
);

export default ProductGrid;