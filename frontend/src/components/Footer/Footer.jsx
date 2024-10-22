// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../assets/logo/Logo (2).svg';

const Footer = () => {
    const footerSections = [
        {
            title: 'My Account',
            links: ['My Account', 'Order History', 'Shopping Cart', 'Wishlist']
        }, {
            title: 'Help',
            links: ['Contact', 'Faqs', 'Terms & Condition', 'Privacy Policy']
        }, {
            title: 'Proxy',
            links: ['About', 'Shop', 'Product', 'Track Order']
        }, {
            title: 'Categories',
            links: ['Fruit & Vegetables', 'Meat & Fish', 'Bread & Bakery', 'Beauty & Health']
        }
    ];

    return (
        <footer className="bg-Gray900 text-gray-400 py-5 md:py-12">
            <div className="px-[2vw] md:px-[8vw]">
                <div className="md:flex justify-between gap-5">
                    {/* Logo and contact section */}
                    <div className="md:w-[25%]">
                        {/* logo */}
                        <img src={Logo}/>
                        <p className="md:text-[1vw] mb-4 mt-[0.5vw] font-Poppins">
                        Shop fresh, quality food delivered to your door. We make grocery shopping simple, so you can enjoy more of what matters.
                        </p>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="mr-2 border-b-2 border-Primary pb-[0.5vw]">(219) 555-0114</span>
                            <span className="text-gray-500 pb-[0.5vw]">or</span>
                            <a
                                href="mailto:proxy@gmail.com"
                                className="text-Primary pb-[0.5vw] border-b-2 border-Primary">proxy@gmail.com</a>
                        </div>
                    </div>

                    {/* Links sections */}
                    {
                        footerSections.map((section) => (
                            <div key={section.title} className='flex flex-col justify-between'>
                                <h3 className="text-white font-semibold mb-2 font-Poppins">{section.title}</h3>
                                <ul>
                                    {
                                        section
                                            .links
                                            .map((link) => (
                                                <li key={link} className="mb-2">
                                                    <Link to={`/${link
                                                            .replace(/\s+/g, '-')
                                                            .toLowerCase()}`}
                                                        // Creates a slug for each link
                                                        className="hover:text-White text-[0.9vw] transition-colors font-Poppins">
                                                        {link}
                                                    </Link>
                                                </li>
                                            ))
                                    }
                                </ul>
                            </div>
                        ))
                    }

                </div>

                {/* Bottom section with copyright and payment methods */}
                <div
                    className="border-t border-Gray700 mt-8 pt-8 flex flex-row justify-center items-center">
                    <p className="text-[1vw] mb-4 md:mb-0 font-Poppins">
                        Ecobazar eCommerce © 2024. All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;