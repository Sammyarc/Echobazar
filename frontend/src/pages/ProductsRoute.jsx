import {useEffect, useState} from 'react';
import {FaCloudUploadAlt, FaEdit, FaTrashAlt} from 'react-icons/fa';
import {GoPlus} from "react-icons/go";
import NoProduct from '../components/Animations/NoProduct';
import {toast} from 'react-toastify';
import axios from "axios";

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api"
    : "/api";

axios.defaults.withCredentials = true;

const ProductsRoute = () => {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // State Management
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [productToEdit, setProductToEdit] = useState(null);
    const [newBenefit, setNewBenefit] = useState("");
    const [productData, setProductData] = useState({
        name: '',
        productSummary: '',
        description: '',
        regularPrice: '',
        salePrice: '',
        quantity: '',
        benefits: [],
        additionalDescription: '',
        categories: [],
        selectedCategory: '',
        files: []
    });
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Utility Functions Function to handle adding categories
    const handleAddCategory = (e) => {
        const category = e.target.value;
        if (category && !productData.categories.includes(category)) {
            setProductData((prevData) => ({
                ...prevData,
                categories: [
                    ...prevData.categories,
                    category
                ],
                selectedCategory: '', // Clear selection after adding
            }));
        }
    };

    // Function to remove a category
    const handleRemoveCategory = (categoryToRemove) => {
        setProductData((prevData) => ({
            ...prevData,
            categories: prevData
                .categories
                .filter((category) => category !== categoryToRemove)
        }));
    };

    // Function to handle file upload
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length + productData.files.length > 3) {
            setError("You can only upload up to 3 images.");
            return;
        }

        setProductData((prevData) => ({
            ...prevData,
            files: [
                ...prevData.files,
                ...selectedFiles
            ].slice(0, 3)
        }));
        setError(null); // Clear error if file count is valid
    };

    // Function to remove selected files
    const handleRemoveImage = (index) => {
        setProductData((prevData) => {
            const newFiles = prevData
                .files
                .filter((_, i) => i !== index);
            return {
                ...prevData,
                files: newFiles
            };
        });
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem('token'); // Retrieve the token
            const response = await axios.get(`${API_URL}/products/user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    // Fetch products whenever isCreating changes to false
    useEffect(() => {
        if (!isCreating) {
            fetchProducts();
        }
    }, [isCreating]);

    // Editing Functions
    const handleEdit = (product) => {
        setIsCreating(true);
        setIsEditing(true);
        setProductToEdit(product._id); // Store product ID for editing
        setProductData({
            name: product.name || '',
            regularPrice: product.regularPrice || 0,
            salePrice: product.salePrice || 0,
            quantity: product.quantity || 1,
            productSummary: product.productSummary || '',
            description: product.description || '',
            benefits: product.benefits || [],
            additionalDescription: product.additionalDescription || '',
            selectedCategory: '', // Update this if you want to pre-select a category
            categories: product.categories || [],
            files: product.images
                ? product
                    .images
                    .map((imageUrl) => ({url: imageUrl}))
                : [], // Handle empty or missing images gracefully
        });
    };

    // Delete Function
    const handleDelete = async (productId) => {
        try {
            const response = await axios.delete(`${API_URL}/products/${productId}`);

            if (response.status === 200) {
                toast.success('Product successfully deleted!');
                // Optionally, you can remove the product from the local state or list
                setProducts(
                    prevProducts => prevProducts.filter(product => product._id !== productId)
                );
            }
        } catch (error) {
            console.error(
                'Error deleting product:',
                error.response
                    ?.data || error.message
            );
            toast.error('Failed to delete the product. Please try again.');
        }
    };

    const handleCancel = () => {
        // Reset productData to initial state
        setProductData({
            name: "",
            regularPrice: "",
            salePrice: "",
            quantity: "",
            productSummary: "",
            description: "",
            benefits: [],
            additionalDescription: "",
            categories: [],
            files: [],
            selectedCategory: ""
        });

        // Toggle back to list mode
        setIsEditing(false);
        setIsCreating(false);
    };

    // Function to handle appending a benefit
    const handleAddBenefit = () => {
        const trimmedBenefit = newBenefit.trim();

        // Validate the input to avoid empty benefits or duplicates
        if (!trimmedBenefit) {
            toast.warn("health benefit cannot be empty."); // Optional: user feedback
            return;
        }

        if (!productData.benefits.includes(trimmedBenefit)) {
            setProductData((prevData) => ({
                ...prevData,
                benefits: [
                    ...prevData.benefits,
                    trimmedBenefit
                ]
            }));
            setNewBenefit(""); // Reset the input field
        } else {
            toast.info("This benefit already exists."); // Optional: user feedback
        }
    };

    // Submit Functionality
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();

        // Append product data to the form
        formData.append('name', productData.name);
        formData.append('regularPrice', productData.regularPrice);
        formData.append('salePrice', productData.salePrice);
        formData.append('quantity', productData.quantity);
        formData.append('productSummary', productData.productSummary);
        formData.append('description', productData.description);
        formData.append('additionalDescription', productData.additionalDescription);
        // Append benefits (each benefit as a separate field)
        productData
            .benefits
            .forEach((benefit, index) => {
                formData.append(`benefits[${index}]`, benefit);
            });

        // Append categories (assuming categories is an array of strings)
        productData
            .categories
            .forEach((category) => formData.append('categories', category));

        // Check if files are correctly appended
        if (productData.files && Array.isArray(productData.files) && productData.files.length > 0) {
            productData
                .files
                .forEach((file) => formData.append('files', file));
        } else {
            console.warn("No files to upload or files is not an array.");
        }

        try {
            let response;

            if (isEditing) {
                // Handle editing a product
                response = await axios.put(`${API_URL}/products/${productToEdit}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Handle creating a product
                response = await axios.post(`${API_URL}/post-a-product`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
            }

            if (response.status === 200 || response.status === 201) {
                // Clear form or show success message
                setProductData({
                    name: '',
                    regularPrice: '',
                    salePrice: '',
                    quantity: '',
                    productSummary: '',
                    description: '',
                    additionalDescription: '',
                    benefits: [],
                    selectedCategory: '',
                    categories: [],
                    files: []
                });
                setIsEditing(false); // Reset editing state
                setIsLoading(false);
                setError('');
                toast.success(
                    isEditing
                        ? 'Product successfully updated!'
                        : 'Product successfully posted!'
                );
                setIsCreating(false);
            }
        } catch (error) {
            setIsLoading(false); // Ensure loading is disabled even on error
            console.error(
                'Error submitting product:',
                error.response
                    ?.data || error.message
            );
            toast.error('Failed to submit the product. Please try again.');
        }
    };

    return (
        <div className="p-[2vw]">
            <div className='flex justify-between items-center'>
                <h2 className='text-[4vw] md:text-[1.8vw] text-Gray700 font-semibold font-Poppins'>
                    {
                        isCreating
                            ? 'Edit Product'
                            : 'Product List'
                    }
                </h2>
                {/* Button to toggle between views */}

                {
                    !isCreating && (
                        <button onClick={() => setIsCreating(true)}
                            // Enable creating mode
                            className="bg-Primary rounded-md font-Poppins text-[3vw] md:text-[1vw] text-White font-medium px-[2vw] md:px-[1vw] h-[8vw] md:h-[2.5vw] flex items-center space-x-[0.5vw]">
                            <GoPlus className="text-[4.5vw] md:text-[1.5vw]"/>
                            Add Product
                        </button>
                    )
                }

            </div>

            {/* Product List View */}
            {
                !isCreating && (
                    <div
                        className="md:w-full bg-White rounded-lg shadow-lg h-screen overflow-scroll mt-[5vw] md:mt-[1vw] custom-scrollbar">
                        {
                            loading
                                ? (
                                    <div className="flex flex-col p-[5vw] justify-center items-center h-full">
                                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-Primary"></div>
                                        <h3 className="text-[4vw] md:text-[1.5vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">
                                            Loading products, please wait...
                                        </h3>
                                    </div>
                                )
                                : products.length > 0
                                    ? (
                                        <table className="w-[350%] md:w-full mt-[2vw] rounded-lg">
                                            <thead className="border-b border-Gray200">
                                                <tr>
                                                    {/*<th className="p-3 text-left">
                                                        <input type="checkbox" className='accent-Primary'/>
                                                    </th>*/
                                                    }
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Product</th>
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Categories</th>
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Status</th>
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Stock</th>
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Regular Price</th>
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Sale Price</th>
                                                    <th className="p-2 md:p-3 text-left font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    products.map((product) => (
                                                        <tr key={product.id}>
                                                            {/*<td className="p-3">
                                                                <input type="checkbox" className='accent-Primary'/>
                                                            </td>*/
                                                            }
                                                            <td className="p-3 flex items-center">
                                                                {
                                                                    product.images && product.images.length > 0
                                                                        ? (
                                                                            <img
                                                                                src={product.images[1]}
                                                                                alt={product.name}
                                                                                className="w-[10vw] h-[10vw] md:w-[3vw] md:h-[2.5vw] mr-3 rounded-lg object-cover"/>
                                                                        )
                                                                        : (<span className="w-10 h-10 mr-3 bg-gray-200 rounded-lg"></span>)
                                                                }
                                                                <span className="font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">{product.name}</span>
                                                            </td>
                                                            <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                                {
                                                                    product
                                                                        .categories
                                                                        .join(', ')
                                                                }
                                                            </td>
                                                            <td className="p-3">
                                                                <span
                                                                    className={`px-[2.5vw] md:px-[1vw] py-[0.7vw] md:py-1 font-medium rounded-md md:rounded-lg font-Poppins text-[3vw] md:text-[0.8vw] text-Gray700 ${
                                                                    product.quantity > 10
                                                                        ? 'bg-green-100 text-green-700'
                                                                        : product.quantity === 0
                                                                            ? 'bg-red-100 text-red-700'
                                                                            : 'bg-yellow-100 text-yellow-700'}`}>
                                                                    {
                                                                        product.quantity > 10
                                                                            ? 'In Stock'
                                                                            : product.quantity === 0
                                                                                ? 'Out of Stock'
                                                                                : 'Low Stock'
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                                {product.quantity || 'N/A'}
                                                            </td>
                                                            <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">${
                                                                    product
                                                                        .regularPrice
                                                                        .toFixed(2)
                                                                }</td>
                                                            <td className="p-3 font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700">
                                                                {
                                                                    product.salePrice
                                                                        ? `$${product
                                                                            .salePrice
                                                                            .toFixed(2)}`
                                                                        : 'N/A'
                                                                }
                                                            </td>
                                                            <td className="p-3">
                                                                <div className="flex space-x-[1vw]">
                                                                    <button
                                                                        className="text-Gray700"
                                                                        title="Delete"
                                                                        onClick={() => handleDelete(product._id)}>
                                                                        <FaTrashAlt/>
                                                                    </button>
                                                                    <button
                                                                        className="text-Gray700"
                                                                        title="Edit"
                                                                        onClick={() => handleEdit(product)}>
                                                                        <FaEdit/>
                                                                    </button>
                                                                </div>
                                                            </td>

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
                                                Oops! You have no products yet.
                                            </h3>
                                        </div>
                                    )
                        }
                    </div>
                )
            }

            {/* Product Creation Form */}
            {
                isCreating && (
                    <form
                        onSubmit={handleSubmit}
                        className="p-[4vw] md:p-[1.5vw] bg-White rounded-lg shadow-lg ">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-[5vw]'>
                            <div>
                                <div className='flex flex-col'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Product Name:</label>
                                    <input
                                        type="text"
                                        value={productData.name}
                                        className='w-full outline-none border border-Gray200 px-[2.5vw] py-[1.5vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                        onChange={(e) => setProductData({
                                            ...productData,
                                            name: e.target.value
                                        })}
                                        required="required"/>
                                </div>
                                <div className='flex flex-col md:flex-row justify-between md:items-center md:space-x-[0.5vw]'>
                                    <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                        <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Regular Price:</label>
                                        <input
                                            type="number"
                                            value={productData.regularPrice}
                                            className='w-full outline-none border border-Gray200 px-[2.5vw] py-[1.5vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                            onChange={(e) => setProductData({
                                                ...productData,
                                                regularPrice: e.target.value
                                            })}
                                            required="required"/>
                                    </div>
                                    <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                        <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Sale Price:</label>
                                        <input
                                            type="number"
                                            value={productData.salePrice}
                                            className='w-full outline-none border border-Gray200 px-[2.5vw] py-[1.5vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                            onChange={(e) => setProductData({
                                                ...productData,
                                                salePrice: e.target.value
                                            })}
                                            required="required"/>
                                    </div>
                                    <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                        <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Quantity:</label>
                                        <input
                                            type="number"
                                            value={productData.quantity}
                                            className='w-full outline-none border border-Gray200 px-[2.5vw] py-[1.5vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                            onChange={(e) => setProductData({
                                                ...productData,
                                                quantity: e.target.value
                                            })}
                                            required="required"/>
                                    </div>
                                </div>

                                <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Product Summary:</label>
                                    <textarea
                                        value={productData.productSummary}
                                        rows="3"
                                        maxLength="500"
                                        className='w-full outline-none border border-Gray200 md:h-[5vw] p-[2vw] md:p-[1vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                        onChange={(e) => setProductData({
                                            ...productData,
                                            productSummary: e.target.value
                                        })}
                                        required="required"/>
                                </div>
                                <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Description:</label>
                                    <textarea
                                        value={productData.description}
                                        rows="3"
                                        className='w-full outline-none border border-Gray200 md:h-[5vw] p-[2vw] md:p-[1vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                        onChange={(e) => setProductData({
                                            ...productData,
                                            description: e.target.value
                                        })}
                                        required="required"/>
                                </div>
                                <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Additional Description:</label>
                                    <textarea
                                        value={productData.additionalDescription}
                                        rows="3"
                                        className='w-full outline-none border border-Gray200 md:h-[5vw] p-[2vw] md:p-[1vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                        onChange={(e) => setProductData({
                                            ...productData,
                                            additionalDescription: e.target.value
                                        })}
                                        required="required"/>
                                </div>
                            </div>

                            <div>
                                <div className='flex flex-col'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Health Benefits:</label>
                                    <span className='flex flex-col md:flex-row md:items-center md:space-x-[2vw]'>
                                        <input
                                            type="text"
                                            value={newBenefit}
                                            className='w-[70vw] outline-none border border-Gray200 px-[2.5vw] py-[1.5vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                                            onChange={(e) => setNewBenefit(e.target.value)}
                                            placeholder="Enter a health benefit"/>
                                        <button
                                            type="button"
                                            onClick={handleAddBenefit}
                                            className='bg-Primary rounded-md font-Poppins text-[3vw] md:text-[1vw] text-White font-medium h-[8vw] w-[30vw] md:h-[2.5vw] mt-[3vw] md:mt-[0.5vw]'>Add Benefit</button>
                                    </span>
                                    <ul>
                                        {
                                            productData
                                                ?.benefits
                                                    ?.length > 0
                                                        ? ( // Check if benefits exist
                                                                productData.benefits.map((benefit, index) => (
                                                            <li
                                                                key={index}
                                                                className='bg-White shadow-lg rounded-lg p-[2vw] md:p-[0.5vw] font-Poppins text-Gray700 text-[3vw] md:text-[0.9vw] mt-[3vw] md:mt-[0.5vw]'>
                                                                {benefit}
                                                            </li>
                                                        )))
                                                        : (<li className='text-Gray700 text-[3vw] md:text-[0.9vw] mt-[2vw] md:mt-[0.5vw] font-Poppins'>No health benefits added yet.</li>)
                                        }
                                    </ul>

                                </div>
                                <div className='mt-[4vw] md:mt-[1.5vw]'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Category:</label>
                                    <div className='mt-[2vw] md:mt-[0.5vw]'>
                                        <select
                                            value={productData.selectedCategory}
                                            onChange={handleAddCategory}
                                            className='text-[3.5vw] md:text-[0.9vw]'
                                            style={{
                                                backgroundImage: 'none', // Removes the default arrow in most browsers
                                                WebkitAppearance: 'none', // For Safari
                                                MozAppearance: 'none', // For Firefox
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingLeft: '10px',
                                                paddingTop: '5px',
                                                paddingBottom: '7px',
                                                outline: 'none',
                                                border: '1px solid #CCCCCC',
                                                borderRadius: '5px',
                                                fontFamily: 'Poppins',
                                            }}>
                                            <option value="">Select Category</option>
                                            <option value="Fruit & Vegetables">Fruit & Vegetables</option>
                                            <option value="Meat & Fish">Meat & Fish</option>
                                            <option value="Bread & Bakery">Bread & Bakery</option>
                                            <option value="Beauty & Health">Beauty & Health</option>
                                            <option value="Beverages">Beverages</option>
                                            <option value="Diabetic Foods">Diabetic Foods</option>
                                        </select>
                                    </div>

                                    {/* Selected categories display */}
                                    <div className="p-[0.5vw] flex flex-wrap gap-2 mt-[1vw] md:mt-[0.2vw]">
                                        {
                                            productData
                                                .categories
                                                .map((category, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center px-2 py-1 bg-Gray50 rounded font-Poppins text-[3vw] md:text-[0.9vw]">
                                                        {category}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveCategory(category)}
                                                            className="ml-2 text-red-600 text-[4.5vw] md:text-[1.4vw]">
                                                            ×
                                                        </button>
                                                    </div>
                                                ))
                                        }
                                    </div>

                                </div>
                                <div className='flex flex-col mt-[4vw] md:mt-[1.5vw]'>
                                    <label className='text-[3.5vw] md:text-[1vw] text-Gray700 font-Poppins'>Product Gallery:</label>
                                    <div
                                        className="mt-[2vw] md:mt-[0.5vw] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-SoftPrimary transition"
                                        onClick={() => document.getElementById('fileInput').click()}>
                                        <FaCloudUploadAlt className="text-[8vw] md:text-[4vw] text-Gray300 mb-2"/>
                                        <p className="text-[3vw] md:text-[0.8vw] text-center text-Gray500 font-Poppins">
                                            Drag files here to upload or
                                            <span className="text-blue-500 ml-1 underline">browse</span>
                                            <br/>
                                            3mb max per file, and only jpeg and PNG files are allowed
                                        </p>
                                    </div>
                                    <input
                                        id="fileInput"
                                        type="file"
                                        multiple="multiple"
                                        accept="image/*"
                                        style={{
                                            display: 'none'
                                        }}
                                        onChange={handleFileChange}/> {error && <p className="text-red-500 text-[3.5vw] md:text-[0.9vw] font-Poppins mt-2">{error}</p>}

                                    {/* Preview selected images */}
                                    <div className="flex flex-wrap mt-4 gap-4">
                                        {
                                            productData
                                                .files
                                                .map((file, index) => (
                                                    <div key={index} className="relative">
                                                        <img
                                                            src={file instanceof File
                                                                ? URL.createObjectURL(file)
                                                                : file.url || file}
                                                            alt={`preview-${index}`}
                                                            className="w-[20vw] h-[20vw] md:w-[6vw] md:h-[6vw] object-cover rounded"/>
                                                        <button
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute -top-[0.5vw] -right-[0.5vw] bg-red-600 text-white rounded-full w-[4.5vw] h-[4.5vw] md:w-[1.2vw] md:h-[1.2vw] flex items-center justify-center text-[4vw] md:text-[1.2vw] pb-1">
                                                            ×
                                                        </button>
                                                    </div>
                                                ))
                                        }
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Buttons Section */}
                        <div className='flex items-end space-x-[2vw] md:space-x-[1vw] mt-[4vw] md:mt-0'>
                            <button
                                type="submit"
                                className="bg-Primary rounded-md font-Poppins text-[3.5vw] md:text-[1vw] text-White font-medium w-[30vw] h-[8vw] md:w-[10vw] md:h-[2.5vw] mt-[1.5vw] ml-auto"
                                disabled={isLoading}>
                                {
                                    isLoading
                                        ? (
                                            <div className="flex justify-center items-center space-x-[0.5vw]">
                                                <div
                                                    className="spinner-border animate-spin border-2 border-t-2 border-white w-6 h-6 rounded-full"></div>
                                                <span className="">Please wait...</span>
                                            </div>
                                        )
                                        : (
                                            isEditing
                                                ? 'Update Product'
                                                : 'Post Product'
                                        )
                                }
                            </button>

                            {/* Cancel Button */}
                            <button
                                type="button"
                                className="bg-gray-300 rounded-md font-Poppins text-[3.5vw] md:text-[1vw] text-Gray700 font-medium w-[30vw] h-[8vw] md:w-[10vw] md:h-[2.5vw] mt-[1.5vw] ml-[1vw]"
                                onClick={handleCancel}>
                                Cancel
                            </button>
                        </div>

                    </form>
                )
            }
        </div>
    );
};

export default ProductsRoute;
