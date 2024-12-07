// eslint-disable-next-line no-unused-vars
import React from 'react';
import {Link} from 'react-router-dom';
import Logo from '../../assets/logo/Logo (2).svg';

const Footer = () => {
    const footerSections = [
        {
            title: 'Account',
            links: [
                {
                    name: 'My Account',
                    url: '/my-account'
                }, {
                    name: 'Order History',
                    url: '/my-account/orders'
                }, {
                    name: 'Cart',
                    url: '/cart'
                }, {
                    name: 'Wishlist',
                    url: '/my-account/wishlist'
                }
            ]
        }, {
            title: 'Help',
            links: [
                {
                    name: 'Contact',
                    url: '/contact'
                }, {
                    name: 'Faqs',
                    url: '/faqs'
                }, {
                    name: 'Terms & Condition',
                    url: '/terms'
                }, {
                    name: 'Privacy Policy',
                    url: '/privacy-policy'
                }
            ]
        }, {
            title: 'Proxy',
            links: [
                {
                    name: 'About',
                    url: '/about'
                }, {
                    name: 'Shop',
                    url: '/shop'
                }, {
                    name: 'Product',
                    url: '/product'
                }, {
                    name: 'Track Order',
                    url: '/track-order'
                }
            ]
        }, {
            title: 'Categories',
            links: [
                {
                    name: 'Fruit & Vegetables',
                    url: '/categories/fruit-vegetables'
                }, {
                    name: 'Meat & Fish',
                    url: '/categories/meat-fish'
                }, {
                    name: 'Bread & Bakery',
                    url: '/categories/bread-bakery'
                }, {
                    name: 'Beauty & Health',
                    url: '/categories/beauty-health'
                }
            ]
        }
    ];

    const year = new Date().getFullYear();

    return (
        <footer className="bg-Gray900 text-gray-400 py-5 md:py-12">
            <div className="px-[2vw] md:px-[8vw]">
                <div className="md:flex justify-between gap-5">
                    {/* Logo and contact section */}
                    <div className="md:w-[25%]">
                        {/* logo */}
                        <img src={Logo} className='w-[40vw] h-[10vw] md:w-[15vw] md:h-[5vw]'/>
                        <p
                            className="text-[4vw] md:text-[1vw] mb-3 mt-[1.5vw] md:mt-[0vw] font-Poppins">
                            Shop fresh, quality food delivered to your door. We make grocery shopping
                            simple, so you can enjoy more of what matters.
                        </p>
                        <div className="flex items-center gap-3 mb-2">
                            <span
                                className="border-b-2 text-[4vw] md:text-[1vw] font-Poppins border-Primary pb-[0.5vw]">(219) 555-0114</span>
                            <span
                                className="text-gray-500 font-Poppins pb-[0.5vw] text-[4vw] md:text-[1vw]">or</span>
                            <a
                                href="mailto:proxy@gmail.com"
                                className="text-Primary font-Poppins pb-[0.5vw] text-[4vw] md:text-[1vw] border-b-2 border-Primary">proxy@gmail.com</a>
                        </div>
                    </div>

                    {/* Links sections */}
                    <div
                        className="grid grid-cols-2 gap-4 md:gap-20 md:grid-cols-4 mt-[5vw] md:mt-[2vw]">
                        {
                            footerSections.map((section) => (
                                <div key={section.title} className="flex flex-col">
                                    <h3
                                        className="text-white font-semibold mb-2 font-Poppins text-[4.5vw] md:text-[1vw] ">{section.title}</h3>
                                    <ul>
                                        {
                                            section
                                                .links
                                                .map((link) => (
                                                    <li key={link.name} className="mb-2">
                                                        <Link to={link.url}
                                                            // Using the URL defined in the array
                                                            onClick={() => window.scrollTo(0, 0)} className="hover:text-Primary text-[4vw] md:text-[0.9vw] transition-colors font-Poppins">
                                                            {link.name}
                                                            {/* Display the link name */}
                                                        </Link>
                                                    </li>
                                                ))
                                        }
                                    </ul>
                                </div>
                            ))
                        }
                    </div>

                </div>

                {/* Bottom section with copyright and payment methods */}
                <div
                    className="border-t border-Gray700 mt-8 pt-4 flex flex-row justify-center items-center md:pt-8">
                    <p className="text-[4.2vw] md:text-[1vw] font-Poppins">
                        Ecobazar © {year}. All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;