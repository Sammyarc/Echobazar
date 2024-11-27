import { useState } from 'react';
import  Image  from '../../assets/Image (2).png';
import { FiMinus, FiPlus } from 'react-icons/fi';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is Ecobazar and what makes it unique?",
      answer: "Ecobazar is an online marketplace dedicated to eco-friendly products. We focus on promoting sustainable living by connecting consumers with environmentally conscious sellers. Our platform ensures that all products meet high standards of sustainability and ethical sourcing."
    },
    { question: "How are the products on Ecobazar sourced?", 
      answer: "All products on Ecobazar are sourced from verified sellers who follow sustainable practices. We conduct thorough checks to ensure that materials are eco-friendly, ethically sourced, and contribute to environmental conservation." 
    },
    { question: "Are the products certified organic or eco-friendly?", 
      answer: "Yes, many products on Ecobazar are certified organic and eco-friendly. We work closely with suppliers to ensure certifications from reputable organizations like USDA Organic, Fair Trade, and others. Each product description highlights its certifications." 
    },
    { question: "How can I track my order?", 
      answer: 'After placing your order, you will receive an email with a tracking number. You can use this number to track your package in real-time through our "Track Order" page.' 
    },
    { question: "How can I contact customer support?", 
      answer: 'You can reach our customer support team via the "Contact Us" page on our website. We offer support through email and live chat, and we strive to respond within 24 hours.' 
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-[2vw] px-[2vw] md:px-[8vw] mt-[5vw]">
      <div className="w-full h-full md:w-[40vw] my-[8vw] md:mt-[5vw] md:my-0">
        <h1 className="text-[6vw] md:text-[2vw] md:w-[20ch] font-Poppins font-bold mb-[4vw] md:mb-[2vw] leading-tight">
          Welcome, Let’s Talk About Our Ecobazar
        </h1>
        <div className="space-y-[3vw] md:space-y-[1vw]">
          {faqs.map((faq, index) => (
            <div key={index} className={`border rounded-lg overflow-hidden ${openIndex === index ? 'border-Primary bg-White' : 'border-none'}`}>
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full text-left py-[3vw] px-[3vw] md:py-[0.7vw] md:px-[1vw] flex justify-between items-center space-x-[2.5vw] md:space-x-0 ${openIndex === index ? 'text-Primary border-Primary border-b' : 'bg-Gray50'}`}
              >
                <span className="text-[4.5vw] md:text-[1.1vw] font-Poppins font-medium">{faq.question}</span>
                <span className={`text-[4.5vw] md:text-[1vw] p-[1vw] md:p-[0.5vw] rounded-full ${openIndex === index ? 'text-Gray800 bg-Gray100' : 'bg-White'}`}>
                  {openIndex === index ? (<FiMinus />) : (<FiPlus />)}
                </span>
              </button>
              {openIndex === index && faq.answer && (
                <div className="text-[4vw] p-[2.5vw] md:p-[1vw] font-Poppins font-normal text-Gray600 md:text-[1vw]">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="hidden md:block w-[40vw] h-full mb-0">
        <img
          src={Image}
          alt="An elderly man carrying a basket of fruits and vegetables"
          className="w-full h-auto rounded-lg"
        />
      </div>
    </div>
  );
};

export default FAQSection;
