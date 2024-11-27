import Location from "../../assets/Icons/Group (4).svg"
import Email from "../../assets/Icons/Email.svg"
import Phone from "../../assets/Icons/PhoneCall.svg"

const ContactForm = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-[90vw] md:w-[70vw] gap-[10vw] md:gap-[2vw] mx-auto my-[10vw]">
      {/* Left Contact Info Section */}
      <div className="w-full md:h-[28vw] md:w-1/4 bg-White rounded-lg shadow-lg p-[6vw] md:p-[1vw] flex flex-col items-center space-y-[3vw] md:space-y-[1vw]">
        <div className="text-center md:border-b border-Gray100">
          <img src={Location} className="mx-auto w-[10vw] h-[12vw] md:w-[20vw] md:h-[3vw]"/>
          <p className="text-[4vw] md:text-[1vw] font-medium my-[2vw] md:my-[1vw] font-Poppins text-Gray700">7 Ajegunle Drive, V.I, Lagos State</p>
        </div>
        {/* Email */}
        <div className="text-center md:border-b border-Gray100">
        <img src={Email} className="mx-auto w-[10vw] h-[12vw] md:w-[20vw] md:h-[3vw]"/>
          <p className="text-[4vw] md:text-[1vw] font-medium mt-[2vw] md:mt-[1vw] font-Poppins text-Gray700">Proxy@gmail.com</p>
          <p className="text-[4vw] md:text-[1vw] font-medium mb-[2vw] md:mb-[1vw] font-Poppins text-Gray700">Help.proxy@gmail.com</p>
        </div>
        {/* Phone */}
        <div className="text-center">
        <img src={Phone} className="mx-auto w-[10vw] h-[12vw] md:w-[20vw] md:h-[3vw]"/>
          <p className="text-[4vw] md:text-[1vw] font-medium mt-[2vw] md:mt-[1vw] font-Poppins text-Gray700">(219) 555-0114</p>
          <p className="text-[4vw] md:text-[1vw] font-medium mb-[2vw] md:mb-[1vw] font-Poppins text-Gray700">(164) 333-0487</p>
        </div>
      </div>

      {/* Right Contact Form Section */}
      <div className="w-full md:h-[28vw] md:w-3/4 bg-White rounded-lg shadow-lg p-[4vw] md:p-[2vw]">
        <h2 className="text-[7vw] md:text-[2vw] font-semibold mb-[1.5vw] md:mb-[0.2vw] font-Poppins">Just Say Hello!</h2>
        <p className="text-Gray600 text-[4vw] md:text-[1vw] font-Poppins mb-[3.5vw] md:mb-[1vw]">
          Do you fancy saying hi to me or you want to get started with your project and you need my help?
        </p>

        <form className="space-y-[5vw] md:space-y-[1vw]">
          <div className="flex flex-col md:flex-row gap-[5vw] md:gap-[2vw]">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full md:w-1/2 text-[4vw] md:text-[1vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full md:w-1/2 text-[4vw] md:text-[1vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"
            />
          </div>

          <input
            type="text"
            placeholder="Subject"
            className="w-full text-[4vw] md:text-[1vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"
          />

<textarea
  placeholder="Enter your message"
  className="w-full text-[4vw] md:text-[1vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary resize-none"
  rows="3"  // Adjust the number of visible rows
></textarea>


          <button
            type="submit"
            className="w-full md:w-[25%] bg-Primary text-white text-[4vw] md:text-[1vw] font-Poppins font-medium py-[2.5vw] md:py-[0.7vw] rounded-lg md:rounded-full"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
