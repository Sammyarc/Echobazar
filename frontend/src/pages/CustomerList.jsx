import {useEffect, useState} from "react";
import axios from 'axios'; // Make sure axios is installed
import Customer from "../components/Animations/Customer";

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/create"
    : "https://echobazar.onrender.com/api/create";

axios.defaults.withCredentials = true;

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${API_URL}/customers`); // API endpoint to fetch customers
                setCustomers(response.data); // Store the fetched customer data in the state
            } catch  {
                setError("Failed to load customers"); // Handle errors
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchCustomers();
    }, []);

    // Handle loading state
    if (loading) {
        return (
            <div
                className="flex flex-col p-[5vw] justify-center items-center h-[150vw] md:h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                <h3
                    className="text-[4vw] md:text-[1.5vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                    Loading customers, please wait...
                </h3>
            </div>
        );
    }

    // Handle error state
    if (error) {
        return (
            <div className="pr-[2vw]">
                <div
                    className="w-full p-[5vw] border border-Gray200 rounded-lg flex justify-center h-screen md:h-[40vw] mt-[1vw] overflow-scroll custom-scrollbar">
                    <div className="flex flex-col justify-center items-center">
                        <Customer/>
                        <h3
                            className="text-[3.5vw] md:text-[1.5vw] text-Gray700 font-semibold font-Poppins">{error}</h3>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pr-[2vw]">
            <div
                className="w-full p-[3vw] md:p-[1vw] border border-Gray200 rounded-lg h-screen md:h-[40vw] mt-[1vw] overflow-scroll custom-scrollbar">
                <div>
                    {
                        customers.length === 0
                            ? (
                                <div className="flex flex-col justify-center items-center">
                                    <Customer/>
                                    <h3
                                        className="text-[3.5vw] md:text-[1.5vw] text-Gray700 font-semibold font-Poppins">Oops! You have no customers yet.</h3>
                                </div>
                            )
                            : (
                                <div className="w-[250%] md:w-full">
                                    <h3
                                        className="text-[3.5vw] md:text-[1.5vw] text-Gray700 font-semibold font-Poppins">Customer List</h3>
                                    <table className="w-full mt-4">
                                        <thead>
                                            <tr className="bg-Gray100">
                                                <th
                                                    className="px-4 py-2 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Name</th>
                                                <th
                                                    className="px-4 py-2 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Email</th>
                                                <th
                                                    className="px-4 py-2 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Total Orders</th>
                                                <th
                                                    className="px-4 py-2 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Total Spent</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                customers.map((customer) => (
                                                    <tr key={customer._id}>
                                                        <td className="px-4 py-2 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{customer.buyerDetails.name}</td>
                                                        <td className="px-4 py-2 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{customer.buyerDetails.email}</td>
                                                        <td className="px-4 py-2 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{customer.totalOrders}</td>
                                                        <td className="px-4 py-2 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">${
                                                                customer
                                                                    .totalSpent
                                                                    .toFixed(2)
                                                            }</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomerList;
