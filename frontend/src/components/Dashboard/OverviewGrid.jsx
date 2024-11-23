import {FaCheckCircle, FaUndo} from 'react-icons/fa';
import {PiMoney} from "react-icons/pi";
import {BsCartCheck} from "react-icons/bs";

const OverviewGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-[2vw]">

            {/* Revenue */}
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-[1.2vw] text-Gray800 font-semibold font-Poppins">Revenue</h2>
                <div className="flex items-center space-x-2 mt-[0.5vw]">
                        <PiMoney className="text-Primary text-[2.5vw]"/>
                    <p className="text-[1vw] font-Poppins font-bold text-Gray700">$0.00</p>
                </div>
            </div>

            {/* Active Orders */}
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-[1.2vw] text-Gray800 font-semibold font-Poppins">Active Orders</h2>
                <div className="flex items-center space-x-2 mt-[0.5vw]">
                        <BsCartCheck className="text-Primary text-[2.5vw]"/>
                    <p className="text-[1vw] font-Poppins font-bold text-Gray700">0</p>
                </div>
            </div>

            {/* Completed Orders */}
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg">
                <h2 className="text-[1.2vw] text-Gray800 font-semibold font-Poppins">Completed Orders</h2>
                <div className="flex items-center space-x-2 mt-[0.5vw]">
                        <FaCheckCircle className="text-Primary text-[2vw]"/>
                    <p className="text-[1vw] font-Poppins font-bold text-Gray700">0</p>
                </div>
            </div>

            {/* Return Orders */}
            <div className="flex flex-col p-4 bg-white shadow-lg rounded-lg">
                <p className="text-[1.2vw] text-Gray800 font-semibold font-Poppins">Return Orders</p>
                <div className="flex items-center space-x-2 mt-[0.5vw]">
                        <FaUndo className="text-Primary text-[2vw]"/>
                    <p className="text-[1vw] font-Poppins font-bold text-Gray700">0</p>
                </div>
            </div>
        </div>
    );
};

export default OverviewGrid;
