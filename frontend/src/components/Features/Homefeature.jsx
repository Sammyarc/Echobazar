// eslint-disable-next-line no-unused-vars
import React from 'react'
import Truck from '../../assets/Icons/Truck.svg'
import Headphones from '../../assets/Icons/headphones 1.svg'
import Shoppingbag from '../../assets/Icons/Shoppingbag.svg'
import Package from '../../assets/Icons/package.svg'

const Homefeature = () => {
  return (
    <div>
        <section>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 py-[5vw] px-[2vw] mx-[2vw] md:py-[1.5vw] md:mx-[8vw] md:px-[2vw] bg-white shadow-xl rounded-lg">
            {/* Free Shipping */}
            <div className="flex items-start md:items-center space-x-3">
                <img src={Truck} className="w-[8vw] md:w-[2.2vw]" />
                <div>
                    <h3 className="text-[3.5vw] md:text-[1.2vw] font-bold font-Poppins">Free Shipping</h3>
                    <p className="text-[2.7vw] md:text-[0.9vw] text-Gray600 font-Poppins mt-[0.5vw]">Free shipping on all your orders</p>
                </div>
            </div>

            {/* Customer Support */}
            <div className="flex items-start md:items-center space-x-3">
                <img src={Headphones} className="w-[8vw] md:w-[2.2vw]" />
                <div>
                    <h3 className="text-[3.5vw] md:text-[1.2vw] font-bold font-Poppins">Customer Support 24/7</h3>
                    <p className="text-[2.7vw] md:text-[0.9vw] text-Gray600 font-Poppins mt-[0.5vw]">Instant access to Support</p>
                </div>
            </div>

            {/* Secure Payment */}
            <div className="flex items-start md:items-center space-x-3">
                <img src={Shoppingbag} className="w-[8vw] md:w-[2.2vw]" />
                <div>
                    <h3 className="text-[3.5vw] md:text-[1.2vw] font-bold font-Poppins">100% Secure Payment</h3>
                    <p className="text-[2.7vw] md:text-[0.9vw] text-Gray600 font-Poppins mt-[0.5vw]">We ensure your money is safe</p>
                </div>
            </div>

            {/* Money-Back Guarantee */}
            <div className="flex items-start md:items-center space-x-3">
                <img src={Package} className="w-[8vw] md:w-[2.2vw]" />
                <div>
                    <h3 className="text-[3.5vw] md:text-[1.2vw] font-bold font-Poppins">Money-Back Guarantee</h3>
                    <p className="text-[2.7vw] md:text-[0.9vw] text-Gray600 font-Poppins mt-[0.5vw]">30 Days Money-Back Guarantee</p>
                </div>
            </div>
        </div>
        </section>
    </div>
  )
}

export default Homefeature