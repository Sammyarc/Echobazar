import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import NoProduct from "../Animations/NoProduct";

const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/create"
    : "/api/create";

axios.defaults.withCredentials = true;

const OrderHistory = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                // Fetch orders
                setLoading(true);
                const token = localStorage.getItem('token');
                const ordersResponse = await axios.get(`${API_URL}/user/orders`, {
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

        fetchUserOrders();
    }, []);

    return (
        <div>
            <div className="border rounded-[2vw] md:rounded-[0.5vw]">
                <h2
                    className="font-Poppins font-semibold text-[4.5vw] md:text-[1.2vw] p-[4vw] md:p-[1vw] text-Gray700">Order History</h2>
                <div className="overflow-scroll custom-scrollbar h-[50vw] md:h-[15vw]">
                    {
                        loading
                            ? (
                                <div className="flex flex-col p-[5vw] justify-center items-center">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                                    <h3
                                        className="text-[4vw] md:text-[1.3vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                        Loading orders, please wait...
                                    </h3>
                                </div>
                            )
                            : orders.length > 0
                                ? (
                                    <table className="w-[250%] md:w-full">
                                        <thead className="bg-Gray50">
                                            <tr>
                                                <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">ORDER ID</th>
                                                <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">ORDER DATE</th>
                                                <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">TOTAL</th>
                                               <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">PAYMENT STATUS</th>
                                                <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">DELIVERY STATUS</th>
                                                <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">DELIVERY DATE</th>
                                                <th
                                                    className="p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                orders.map((order) => {
                                                    // Calculate delivery status dynamically for each order
                                                    const orderDate = new Date(order.createdAt);
                                                    const deliveryDate = new Date(order.deliveryDate);
                                                    const currentDate = new Date();

                                                    let deliveryStatus = "Pending";

                                                    // Determine the delivery status
                                                    const oneDayAfterOrder = new Date(orderDate);
                                                    oneDayAfterOrder.setDate(orderDate.getDate() + 1);

                                                    if (currentDate >= oneDayAfterOrder && currentDate < deliveryDate) {
                                                        deliveryStatus = "Shipped";
                                                    } else if (currentDate >= deliveryDate) {
                                                        deliveryStatus = "Delivered";
                                                    }

                                                    return (
                                                        <tr key={order._id}>
                                                            <td className="p-3 font-Poppins text-[3.2vw] md:text-[0.9vw]">#{order.orderId}</td>
                                                            <td className="p-3 font-Poppins text-[3.2vw] md:text-[0.9vw]">
                                                                {new Date(order.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="p-3 font-Poppins text-[3.2vw] md:text-[0.9vw]">
                                                                ${(order.totalAmount / 1700).toFixed(2)}
                                                            </td>
                                                            <td className="p-3 font-Poppins text-[3.2vw] md:text-[0.9vw]">{order.paymentStatus}</td>
                                                            <td className="p-3">
                                                                <span
                                                                    className={`px-[2.5vw] md:px-[1vw] py-[0.7vw] md:py-1 font-medium rounded-md md:rounded-lg font-Poppins text-[3.2vw] md:text-[0.9vw] ${
                                                                    deliveryStatus === "Delivered"
                                                                        ? "bg-green-100 text-Gray700"
                                                                        : deliveryStatus === "Shipped"
                                                                            ? "bg-yellow-100 text-Gray700"
                                                                            : "bg-gray-100 text-Gray700"}`}>
                                                                    {deliveryStatus}
                                                                </span>
                                                            </td>

                                                            <td className="p-3 font-Poppins text-[3.2vw] md:text-[0.9vw]">
                                                                {new Date(order.deliveryDate).toLocaleDateString()}
                                                            </td>
                                                            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                                                                <td className="p-3 font-Poppins text-Primary text-[3.2vw] md:text-[0.9vw]">View Details</td>
                                                            </Link>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                )
                                : (
                                    <div className="flex flex-col p-[5vw] justify-center items-center">
                                        <NoProduct/>
                                        <h3 className="text-[3.5vw] md:text-[1.5vw] text-Gray700 font-semibold font-Poppins">
                                            Oops! You have no orders yet.
                                        </h3>
                                    </div>
                                )
                    }
                </div>

            </div>
        </div>
    )
}

export default OrderHistory