import {useState, useEffect} from 'react';
import statesData from '../../states.json';
import PaystackPop from '@paystack/inline-js';
import {closePaymentModal} from 'flutterwave-react-v3';
import axios from "axios";
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import useCartStore from '../../store/useCartStore';

// Set the API URL based on the environment
const API_URL1 = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";
const API_URL2 = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/create"
    : "/api/create";

axios.defaults.withCredentials = true;

const CheckoutComponent = () => {
    const {clearCart} = useCartStore();
    const [loading, setLoading] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [states, setStates] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedPayment, setSelectedPayment] = useState('paystack');
    const [userDetails, setuserDetails] = useState({
        name: '',
        address: '',
        country: '',
        state: '',
        zipCode: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});

    // Handle country selection change
    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedState(''); // Clear the selected state when country changes
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${API_URL1}/profile`);
                const user = response.data;
                setuserDetails(user);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        // Retrieve cart data from local storage
        const cartData = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(cartData);

        // Calculate total
        const cartTotal = cartData.reduce(
            (acc, item) => acc + item.salePrice * item.quantity,
            0
        );
        setTotal(cartTotal);
    }, []);

    // Fetch countries on mount
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await fetch('https://countriesnow.space/api/v0.1/countries');
                const data = await response.json();
                console.log('API Response:', data); // Log the entire response

                if (data && Array.isArray(data.data)) { // Check that 'data' and 'data.data' exist
                    setCountries(data.data.map(country => country.country).sort()); // Adjusted field name
                } else {
                    console.error("Error: Countries data is not in the expected format");
                }
            } catch (error) {
                console.error('Error fetching countries:', error.message);
            }
        };

        fetchCountries();
    }, []);

    // Fetch states when Nigeria is selected
    useEffect(() => {
        if (selectedCountry === 'Nigeria') {
            const fetchStates = async () => {
                try {
                    setStates(statesData.states);
                } catch (error) {
                    console.error('Error fetching states:', error);
                }
            };

            fetchStates();
        } else {
            setStates([]); // Clear states if country is not Nigeria
        }
    }, [selectedCountry]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.flutterwave.com/v3.js';
        script.async = true;
        document
            .body
            .appendChild(script);

        // Cleanup the script when component is unmounted
        return() => {
            document
                .body
                .removeChild(script);
        };
    }, []);

    // Form validation function
    const validateForm = () => {
        const validationErrors = {};
        if (!userDetails.name) 
            validationErrors.name = 'Full Name is required';
        if (!userDetails.address) 
            validationErrors.address = 'Address is required';
        if (!userDetails.email || !/\S+@\S+\.\S+/.test(userDetails.email)) 
            validationErrors.email = 'Valid email is required';
        if (!userDetails.phone) 
            validationErrors.phone = 'Phone number is required';
        if (!userDetails.zipCode) 
            validationErrors.zipCode = 'Zip Code is required';
        if (!selectedCountry) 
            validationErrors.country = 'Country is required';
        if (selectedCountry === 'Nigeria' && !selectedState) 
            validationErrors.state = 'State is required';
        
        setErrors(validationErrors);
        return Object
            .keys(validationErrors)
            .length === 0;
    };

    // Save user billing details to backend
    const saveUserDetails = async () => {
        const form = new FormData(); // Correct initialization of FormData
        form.append('name', userDetails.name);
        form.append('zipCode', userDetails.zipCode);
        form.append('phone', userDetails.phone);
        form.append('address', userDetails.address);
        form.append('state', selectedState || userDetails.state); // Ensure selected state is used
        form.append('country', selectedCountry || userDetails.country);

        try {
            await axios.put(`${API_URL1}/user-details`, form, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

        } catch (error) {
            console.error("Error updating profile:", error);
        }

    };

    const handlePlaceOrder = async () => {
        // Validate form before proceeding
        if (!validateForm()) {
            return;
        }

        setIsButtonClicked(true);

        try {
            // Save billing details to backend
            await saveUserDetails();

            // Proceed with the selected payment method
            switch (selectedPayment) {
                case 'paystack':
                    await handlePaystackPayment();
                    break;
                case 'flutterwave':
                    handleFlutterwavePayment();
                    break;
                default:
                    toast.error('Please select a payment method');
            }
        } catch (error) {
            console.error("Error placing order:", error);
        } finally {
            setIsButtonClicked(false);
        }
    };

    // Paystack Payment Logic
    const handlePaystackPayment = () => {
        const paystack = new PaystackPop();
        paystack.newTransaction({
            key: import.meta.env.VITE_PAYSTACK_KEY,
            amount: total * 100 * 1700,
            email: userDetails.email,
            currency: 'NGN',
            onSuccess: (response) => {
                sendOrderToBackend(response, 'Paystack'); // Clear cart only after successful backend response
            },
            onCancel: () => {
                toast.error('Payment cancelled');
            },
            onClose: () => {
                console.log('Payment modal closed');
            }
        });
    };

    const handleFlutterwavePayment = () => {
        if (typeof window.FlutterwaveCheckout !== 'function') {
            console.error('Flutterwave checkout script not loaded.');
            return;
        }

        const flutterwaveConfig = {
            public_key: import.meta.env.VITE_FLUTTER_KEY,
            tx_ref: Date.now(),
            amount: total * 1700,
            currency: 'NGN',
            payment_options: 'card,mobilemoney,ussd',
            customer: {
                email: userDetails.email,
                phone_number: userDetails.phone,
                name: userDetails.name
            },
            customizations: {
                title: 'Ecobazar',
                description: 'Payment for items in cart',
                logo: 'https://res.cloudinary.com/diwj3q9hg/image/upload/v1732976825/Logo_1_kjid0b.sv' +
                        'g'
            },
            callback: (response) => {
                if (response.status === 'successful') {
                    closePaymentModal();
                    sendOrderToBackend(response, 'Flutterwave'); // Clear cart only after successful backend response
                } else {
                    toast.error('Payment failed. Please try again.');
                }
            },
            onClose: () => {
                console.log('Payment modal closed');
            }
        };

        window.FlutterwaveCheckout(flutterwaveConfig);
    };

    // Function to send the order data to the backend
    const sendOrderToBackend = async (paymentResponse, paymentMethod) => {
        setLoading(true); // Start loading
        try {
            const orderId = generateRandomOrderId();
            const trackingId = generateRandomTrackingId();

            const deliveryDate = new Date();
            deliveryDate.setDate(deliveryDate.getDate() + 7);  // Add 7 days to the current date
            
            const formattedDate = new Date(deliveryDate).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            console.log(formattedDate);  // Output example: "1 December 2024"
            

            const orderData = {
                orderId,
                trackingId,
                user: {
                    email: userDetails.email,
                    name: userDetails.name,
                    phone: userDetails.phone
                },
                totalAmount: total * 1700,
                orderItems: cart,
                paymentReference: paymentResponse.reference || paymentResponse.tx_ref,
                paymentStatus: 'successful',
                paymentMethod,
                deliveryDate: formattedDate, 
            };

            const response = await axios.post(`${API_URL2}/orders`, orderData);

            if (response.status === 201) {
                clearCart(); // Clear the cart
                localStorage.setItem('orderAccess', 'true'); // Set access flag
                navigate('/order-confirmation'); // Redirect to confirmation page
            }
        } catch (error) {
            console.error('Error sending order to backend:', error);
            toast.error('There was an issue processing your order. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // Function to generate a random 6-digit order ID
    const generateRandomOrderId = () => {
        return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit order ID
    };

    // Function to generate a random 10-digit tracking ID
    const generateRandomTrackingId = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000); // Generates a 10-digit tracking ID
    };

    return (
        <div className="my-[8vw] md:my-[3vw] px-[2vw] md:px-[8vw]">
            {/* Loading Overlay */}
            {
                loading && (
                    <div className="fixed inset-0 flex justify-center items-center bg-White z-50">
                        <div className="text-center">
                            <div
                                className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary mx-auto"></div>
                            <h3
                                className="text-[4vw] md:text-[1.5vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                Processing your order...
                            </h3>
                        </div>
                    </div>
                )
            }

            <div className="flex flex-col md:flex-row gap-[1vw]">
                {/* Billing Information */}
                <div className="w-full h-full md:w-2/3 p-[1vw]">
                    <h2
                        className="text-[6vw] md:text-[2vw] font-Poppins font-semibold text-Gray700 mb-4">Billing Information</h2>
                    <form>
                        <div>
                            <label className="block text-Gray800 font-Poppins text-[4.5vw] md:text-[1vw]">Full Name:</label>
                            <input
                                type="text"
                                placeholder="Your Full Name"
                                value={userDetails.name}
                                onChange={(e) => setuserDetails({
                                    ...userDetails,
                                    name: e.target.value
                                })}
                                className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"/> {errors.name && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.name}</p>}
                        </div>

                        <div className="mt-4">
                            <label className="block text-Gray800 font-Poppins text-[4.5vw] md:text-[1vw]">Street Address:</label>
                            <input
                                type="text"
                                placeholder="Street Address"
                                value={userDetails.address}
                                onChange={(e) => setuserDetails({
                                    ...userDetails,
                                    address: e.target.value
                                })}
                                className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"/> {errors.address && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {/* Country Dropdown */}
                            <div>
                                <label className="block text-Gray800 font-Poppins text-[4.5vw] md:text-[1vw]">Country / Region:</label>
                                <select
                                    style={{
                                        backgroundImage: 'none', // Removes the default arrow in most browsers
                                        WebkitAppearance: 'none', // For Safari
                                        MozAppearance: 'none', // For Firefox
                                    }}
                                    className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 bg-transparent rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary cursor-pointer"
                                    onChange={handleCountryChange}
                                    value={selectedCountry}>
                                    <option>Select</option>
                                    {
                                        countries.map(
                                            (country, index) => (<option key={index} value={country}>{country}</option>)
                                        )
                                    }
                                </select>
                                {errors.country && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.country}</p>}
                            </div>

                            {/* State Dropdown */}
                            <div>
                                <label className="block text-gray-800 font-Poppins text-[4.5vw] md:text-[1vw]">State:</label>
                                <select style={{
                                        backgroundImage: 'none', // Removes the default arrow in most browsers
                                        WebkitAppearance: 'none', // For Safari
                                        MozAppearance: 'none', // For Firefox
                                    }} className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 bg-transparent rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary cursor-pointer" disabled={selectedCountry !== 'Nigeria'}
                                    // Only enable for Nigeria
                                    value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                                    <option value="">Select State</option>
                                    {
                                        states.map(
                                            (state, index) => (<option key={index} value={state}>{state}</option>)
                                        )
                                    }
                                </select>
                                {errors.state && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.state}</p>}
                            </div>

                            {/* Zip Code Input */}
                            <div>
                                <label className="block text-gray-800 font-Poppins text-[4.5vw] md:text-[1vw]">Zip Code:</label>
                                <input
                                    type="text"
                                    placeholder="Zip Code"
                                    value={userDetails.zipCode}
                                    onChange={(e) => setuserDetails({
                                        ...userDetails,
                                        zipCode: e.target.value
                                    })}
                                    className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"/> {errors.zipCode && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.zipCode}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className="block text-Gray800 font-Poppins text-[4.5vw] md:text-[1vw]">Email:</label>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={userDetails.email}
                                    onChange={(e) => setuserDetails({
                                        ...userDetails,
                                        email: e.target.value
                                    })}
                                    className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"/> {errors.email && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-Gray800 font-Poppins text-[4.5vw] md:text-[1vw]">Phone:</label>
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={userDetails.phone}
                                    onChange={(e) => setuserDetails({
                                        ...userDetails,
                                        phone: e.target.value
                                    })}
                                    className="w-full text-[4vw] md:text-[1vw] mt-[2vw] md:mt-[0.5vw] border border-Gray200 rounded-lg px-[3vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] font-Poppins focus:outline-none focus:border-Primary"/> {errors.phone && <p className="text-red-600 font-Poppins text-[4vw] md:text-[0.9vw] mt-[0.5vw]">{errors.phone}</p>}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div
                    className="w-full h-full md:w-1/3 md:ml-8 mt-6 md:mt-0 border p-[5vw] md:p-6 rounded-lg">
                    <h2
                        className="text-[6vw] md:text-[1.5vw] font-semibold text-Gray700 font-Poppins mb-4">Order Summary</h2>
                    <ul className="space-y-[7vw] md:space-y-4">
                        {
                            cart.map((item) => (
                                <li
                                    key={item.id}
                                    className="flex justify-between items-center space-x-[4vw] md:space-x-[1vw]">
                                    <div className="flex items-center space-x-[4vw] md:space-x-[1vw]">
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-14 h-14 rounded-lg md:w-16 md:h-16 object-cover md:rounded"/>
                                        <div>
                                            <p
                                                className="text-gray-800 font-semibold font-Poppins text-[4vw] md:text-[1vw] overflow-hidden text-ellipsis whitespace-wrap">{item.name}
                                                &nbsp;({item.quantity})</p>
                                            <p className="text-Gray600 text-[4vw] md:text-[1vw] font-Poppins">${
                                                    item
                                                        .salePrice
                                                        .toFixed(2)
                                                }</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-800 font-medium font-Poppins text-[4vw] md:text-[1vw]">${(item.salePrice * item.quantity).toFixed(2)}</p>
                                </li>
                            ))
                        }
                    </ul>

                    {/* Total Section */}
                    <div className="border-t mt-4 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span
                                className="text-Gray800 font-semibold font-Poppins text-[4.5vw] md:text-[1.2vw]">Subtotal:</span>
                            <span
                                className="text-Gray700 font-Poppins font-semibold text-[4vw] md:text-[1vw]">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2 border-t mt-3 pt-3">
                            <span className="text-Gray600 font-Poppins text-[4.5vw] md:text-[1.1vw]">Shipping:</span>
                            <span
                                className="text-Gray700 font-Poppins font-medium text-[4vw] md:text-[1vw]">Free</span>
                        </div>
                        <div className="flex justify-between items-center border-y my-3 py-3">
                            <span
                                className='text-Gray800 font-semibold font-Poppins text-[4.5vw] md:text-[1.2vw]'>Total:</span>
                            <span
                                className='text-Gray700 font-Poppins font-semibold text-[4vw] md:text-[1vw]'>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <h3
                        className="text-Gray800 font-semibold font-Poppins text-[4.5vw] md:text-[1.2vw] my-[3.5vw] md:my-[1vw]">Payment Method</h3>
                    <div className="space-y-2">
                        <div className='flex space-x-[2vw] md:space-x-[0.5vw] items-center'>
                            <input
                                type="radio"
                                id="paystack"
                                name="payment"
                                value="paystack"
                                checked={selectedPayment === 'paystack'}
                                onChange={(e) => setSelectedPayment(e.target.value)}
                                className='w-[4.5vw] h-[4.5vw] md:w-[1.2vw] md:h-[1.2vw] accent-Primary cursor-pointer'/>
                            <label
                                htmlFor="paystack"
                                className="text-Gray700 font-Poppins font-medium text-[4vw] md:text-[1vw] cursor-pointer">Paystack</label>
                        </div>
                        <div className='flex space-x-[2vw] md:space-x-[0.5vw] items-center'>
                            <input
                                type="radio"
                                id="flutterwave"
                                name="payment"
                                value="flutterwave"
                                checked={selectedPayment === 'flutterwave'}
                                onChange={(e) => setSelectedPayment(e.target.value)}
                                className='w-[4.5vw] h-[4.5vw] md:w-[1.2vw] md:h-[1.2vw] accent-Primary cursor-pointer'/>
                            <label
                                htmlFor="flutterwave"
                                className="text-Gray700 font-Poppins font-medium text-[4vw] md:text-[1vw] cursor-pointer">Flutterwave</label>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <button onClick={handlePlaceOrder} disabled={isButtonClicked}
                        className={`w-full py-[2vw] md:py-[0.6vw] rounded-lg md:rounded-full font-Poppins mt-[4vw] md:mt-[1.5vw] text-[4.5vw] md:text-[1vw] bg-Primary text-white ${isButtonClicked
                            ? 'opacity-75 cursor-not-allowed'
                            : ''}`}>
                        {
                            isButtonClicked
                                ? (<div className="flex justify-center items-center space-x-[0.5vw]">
                                    <div
                                        className="spinner-border animate-spin border-2 border-t-2 border-white w-6 h-6 rounded-full"></div>
                                    <span className="">Please wait...</span>
                                </div>)
                                : 'Place Order'
                        }
                    </button>

                </div>
            </div>
        </div>
    );
};

export default CheckoutComponent;
