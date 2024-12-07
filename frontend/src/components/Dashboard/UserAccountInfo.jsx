import {useEffect, useState} from "react";
import Avatar from "../../assets/Avatar/download (3).png";
import axios from "axios";
import {Link} from "react-router-dom";
import NoProduct from "../Animations/NoProduct";

// Set the API URL based on the environment
const API_URL1 = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";
const API_URL2 = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/create"
    : "/api/create";

axios.defaults.withCredentials = true;

const UserAccountInfo = () => {
    const [imagePreview, setImagePreview] = useState(""); // Image preview for the profile
    const [user, setUser] = useState("");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDataAndOrders = async () => {
            try {
                // Fetch user details
                const userResponse = await axios.get(`${API_URL1}/profile`);
                const user = userResponse.data;
                setUser(user);
                setImagePreview(user.profileImage || Avatar); // Set image preview from the backend or default Avatar
    
                // Fetch orders
                setLoading(true);
                const token = localStorage.getItem('token');
                const ordersResponse = await axios.get(`${API_URL2}/user/orders`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setOrders(ordersResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchUserDataAndOrders();
    }, []);
    

    return (
        <div>
            <div className="grid md:grid-cols-2 gap-[2vw]">
                <div
                    className="p-[2vw] md:p-[3vw] flex flex-col items-center space-y-[0.5vw] border rounded-[0.5vw]">
                    {
                        imagePreview
                            ? (
                                <div
                                    className="w-[30vw] h-[30vw] md:w-[10vw] md:h-[10vw] rounded-full object-cover">
                                    <img
                                        src={imagePreview}
                                        alt="Profile Preview"
                                        className="w-[30vw] h-[30vw] md:w-[10vw] md:h-[10vw] rounded-full object-cover mb-2"/>
                                </div>
                            )
                            : (
                                <div
                                    className="w-[30vw] h-[30vw] md:w-[10vw] md:h-[10vw] rounded-full object-cover">
                                    <img
                                        src={Avatar}
                                        className="rounded-full object-cover w-full h-full"
                                        alt="Default Avatar"/>
                                </div>
                            )
                    }
                    <span
                        className="font-Poppins font-semibold text-[4.5vw] md:text-[1.2vw] text-Gray700">{user.name}</span>
                    <span className="font-Poppins text-[4vw] md:text-[1vw] text-Gray500 capitalize">{user.role}</span>
                </div>
                <div className="p-[2vw] flex flex-col space-y-[1vw] border rounded-[0.5vw]">
                    <h1
                        className="font-Poppins font-semibold text-[4.5vw] md:text-[1.2vw] text-Gray700">Delivery details</h1>
                    <span className="font-Poppins text-[4vw] md:text-[1vw] text-Gray500 capitalize">{user.country}</span>
                    <span className="font-Poppins text-[4vw] md:text-[1vw] text-Gray500 capitalize">{user.state}</span>
                    <span className="font-Poppins text-[4vw] md:text-[1vw] text-Gray500 capitalize">{user.address}</span>
                    <span className="font-Poppins text-[4vw] md:text-[1vw] text-Gray500">{user.email}</span>
                    <span className="font-Poppins text-[4vw] md:text-[1vw] text-Gray500">{user.phone}</span>
                </div>
            </div>
            <div className="mt-[1.5vw] border rounded-[0.5vw] ">
                <div className="flex justify-between items-center p-[1vw]">
                    <h2
                        className="font-Poppins font-semibold text-[4.5vw] md:text-[1.2vw] text-Gray700">Recent Order History</h2>
                    <Link
                        to='/my-account/orders'
                        className="font-Poppins font-medium text-[4vw] md:text-[1vw] text-Primary">View All</Link>
                </div>
                {
                    loading
                        ? (
                            <div className="flex flex-col p-[5vw] justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                                <h3
                                    className="text-[4vw] md:text-[1.3vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                    Loading orders, please wait...
                                </h3>
                            </div>
                        )
                        : orders.length > 0
                            ? (
                                <table className="w-full ">
                                    <thead className="bg-Gray100">
                                        <tr>
                                            <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">ORDER ID</th>
                                            <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">ORDER DATE</th>
                                            <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">TOTAL</th>
                                            <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">STATUS</th>
                                            <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">DELIVERY DATE</th>
                                            <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            orders.map((order) => (
                                                <tr key={order._id} >
                                                    <td className="p-3 font-Poppins text-[4vw] md:text-[0.9vw]">#{order.orderId}</td>
                                                    <td className="p-3 font-Poppins text-[4vw] md:text-[0.9vw]">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-3 font-Poppins text-[4vw] md:text-[0.9vw]">${(order.totalAmount / 1700).toFixed(2)}</td>
                                                    <td className="p-3 font-Poppins text-[4vw] md:text-[0.9vw]">{order.paymentStatus}</td>
                                                    <td className="p-3 font-Poppins text-[4vw] md:text-[0.9vw]">{
                                                            order.deliveryDate

                                                        }</td>
                                                        <Link to='/'><td className="p-3 font-Poppins text-Primary text-[4vw] md:text-[0.9vw]">View Details</td></Link>
                                                        
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )
                            : (
                                <div className="flex flex-col p-[5vw] justify-center items-center">
                                    <NoProduct/>
                                    <h3 className="text-[1.5vw] text-Gray700 font-semibold font-Poppins">
                                        Oops! You have no orders yet.
                                    </h3>
                                </div>
                            )
                }
            </div>
        </div>
    );
};

export default UserAccountInfo;
