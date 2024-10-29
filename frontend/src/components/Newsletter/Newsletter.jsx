// eslint-disable-next-line no-unused-vars
import React from "react";
import {FaFacebookF, FaTwitter, FaPinterestP, FaInstagram} from "react-icons/fa";

const Newsletter = () => {
    return (
        <div>
            <section className="bg-gray-50 py-8 px-[2vw] md:px-[8vw]">
                <div
                    className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="md:w-[35vw]">
                        <h3 className="text-[5vw] md:text-[2vw] font-semibold font-Poppins">Subscribe to our Newsletter</h3>
                        <p className="text-Gray500 text-[3.6vw] md:text-[1vw] mt-2 font-Poppins">
                        Stay in the loop with our latest updates! Sign up for our newsletter to get exclusive offers, helpful tips, and fresh news delivered straight to your inbox.
                        </p>
                    </div>
                    <div
                        className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
                        <div className="relative w-full md:w-auto">
                            <input
                                type="email"
                                className="w-[90vw] md:w-[30vw] py-3 px-4 pr-32 text-Gray900 rounded-lg md:rounded-full border border-Gray200 outline-none placeholder:font-Poppins placeholder:text-Gray500"
                                placeholder="Your email address"/>
                            <button
                                className="absolute right-0 top-0 bottom-0 bg-Primary font-semibold text-white rounded-r-lg md:rounded-full px-[5vw] md:px-[2vw]">
                                Subscribe
                            </button>
                        </div>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-Gray900 hover:bg-Primary hover:text-White w-[12vw] h-[12vw] md:w-[2.5vw] md:h-[2.5vw] rounded-full flex justify-center items-center transition-colors duration-200">
                                <FaFacebookF className="text-[5vw] md:text-[1.2vw]"/>
                            </a>
                            <a
                                href="#"
                                className="text-Gray900 hover:bg-Primary hover:text-White w-[12vw] h-[12vw] md:w-[2.5vw] md:h-[2.5vw] rounded-full flex justify-center items-center transition-colors duration-200">
                                <FaTwitter className="text-[5vw] md:text-[1.2vw]"/>
                            </a>
                            <a
                                href="#"
                                className="text-Gray900 hover:bg-Primary hover:text-White w-[12vw] h-[12vw] md:w-[2.5vw] md:h-[2.5vw] rounded-full flex justify-center items-center transition-colors duration-200">
                                <FaPinterestP className="text-[5vw] md:text-[1.2vw]"/>
                            </a>
                            <a
                                href="#"
                                className="text-Gray900 hover:bg-Primary hover:text-White w-[12vw] h-[12vw] md:w-[2.5vw] md:h-[2.5vw] rounded-full flex justify-center items-center transition-colors duration-200">
                                <FaInstagram className="text-[5vw] md:text-[1.2vw]"/>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Newsletter;
