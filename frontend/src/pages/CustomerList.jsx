import { useEffect } from "react";
import Customer from "../components/Animations/Customer"


const CustomerList = () => {


  useEffect(() => {
    window.scrollTo(0, 0);
}, []);


  return (
    <div className="pr-[2vw]">
        <div className='w-full p-[5vw] bg-White rounded-lg shadow-lg h-screen md:h-[40vw] mt-[1vw] overflow-scroll custom-scrollbar'>
                        <div className='flex flex-col justify-center items-center'>
                            <Customer />
                            <h3 className='text-[3.5vw] md:text-[1.5vw] text-Gray700 font-semibold font-Poppins'>Oops! You have no customer yet.</h3>
                        </div>
                    </div>
    </div>
  )
}

export default CustomerList