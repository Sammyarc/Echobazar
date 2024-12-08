import {useEffect, useState} from "react";
import Avatar from "../../assets/Avatar/download (3).png"
import {FaTrashAlt} from "react-icons/fa";
import axios from "axios";
import {toast} from 'react-toastify';

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;
    

const UserSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        phone: "",
        country: "",
        localGovernment: "",
        address: "",
        state: "",
        city: "",
        dateOfBirth: "",
        gender: "",
        twitter: "",
        instagram: "",
        facebook: "",
        tiktok: "",
        profileImage: null // Store the file object for the profile image
    });
    const [imagePreview, setImagePreview] = useState(""); // Image preview for the profile
    const [initialFormData, setInitialFormData] = useState(null); // Store initial form data

    // This function checks if the current form data matches the initial data
    const isFormChanged = JSON.stringify(formData) !== JSON.stringify(
        initialFormData
    );

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${API_URL}/profile`);
                const user = response.data;
                setFormData(user);
                setImagePreview(user.profileImage || Avatar); // Set image preview from the backend or default Avatar
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleFileChange = (e) => {
        const file = e
            .target
            .files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size should be less than 2MB');
                return;
            }
            setImagePreview(URL.createObjectURL(file)); // Set the preview for the uploaded image
            setFormData((prev) => ({
                ...prev,
                profileImage: file // Store the file object
            }));
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const form = new FormData();
        form.append('name', formData.name);
        form.append('phone', formData.phone);
        form.append('address', formData.address);
        form.append('state', formData.state);
        form.append('city', formData.city);
        form.append('country', formData.country);
        form.append('gender', formData.gender);
        form.append('dateOfBirth', formData.dateOfBirth);
        form.append('localGovernment', formData.localGovernment);
        form.append('twitter', formData.twitter);
        form.append('instagram', formData.instagram);
        form.append('facebook', formData.facebook);
        form.append('tiktok', formData.tiktok);

        if (formData.profileImage) {
            form.append('profileImage', formData.profileImage); // Append the image if present
        }

        try {
            await axios.put(`${API_URL}/profile`, form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
            setIsLoading(false);
            setInitialFormData(formData); // Update the initial form data after successful submission
    };

  return (
    <div className="p-[2vw] overflow-hidden border rounded-[0.5vw]">
    <form onSubmit={handleSubmit}>
        {/* Profile Image Upload */}
        <div className="w-[90vw] md:w-[40vw]">
            <div className="mt-[1.5vw] p-[2vw] md:p-0 flex flex-col md:flex-row items-center space-x-[2vw]">
                {
                    imagePreview
                        ? (
                            <div className="w-[50vw] h-[50vw] md:w-[15vw] md:h-[15vw] rounded-full object-cover">
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="w-[50vw] h-[50vw] md:w-[15vw] md:h-[15vw] rounded-full object-cover mb-2"/>
                            </div>
                        )
                        : (
                            <div className="w-[50vw] h-[50vw] md:w-[15vw] md:h-[15vw] rounded-full object-cover">
                                <img src={Avatar} className="rounded-full object-cover w-full h-full"/>
                            </div>
                        )
                }
                <div className="flex items-center space-x-[2vw] mt-[5vw] md:mt-0">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("fileInput")
                                .click();
                        }}
                        className="bg-Primary rounded-md font-Poppins text-[3.5vw] md:text-[1vw] text-White font-medium w-[30vw] h-[8vw] md:w-[10vw] md:h-[2.5vw]">
                        {
                            imagePreview 
                                ? "Change"
                                : "Upload"
                        }
                    </button>
                    {
                        imagePreview && (
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(Avatar); // Reset to placeholder image
                                    setFormData((prev) => ({
                                        ...prev,
                                        profileImage: ""
                                    }));
                                }}
                                className="border border-red-500 rounded-md font-Poppins text-[3.5vw] md:text-[1.2vw] text-red-500 font-medium px-[2vw] h-[8vw] md:px-[1vw] md:h-[2.5vw]">
                                <FaTrashAlt/>
                            </button>
                        )
                    }
                </div>
                <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    style={{
                        display: "none"
                    }}
                    onChange={handleFileChange}/>
            </div>
        </div>

        <div className="grid md:grid-cols-2 mt-[5vw] md:mt-[2vw]">
            <div className="p-[2vw]">
                <h3 className="text-[4.5vw] md:text-[1.5vw] text-Gray800 font-Poppins font-bold mb-[1vw]">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-[1vw]">
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Name:</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]"
                            value={formData.name}
                            onChange={handleChange}/>
                    </div>
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Email:</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]"
                            value={formData.email}
                            onChange={handleChange}/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-[5vw] md:gap-[1vw] mt-[4vw] md:mt-[1.5vw]">
                    <div>
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Date of Birth:</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            style={{
                                backgroundImage: 'none', // Removes the default arrow in most browsers
                                WebkitAppearance: 'none', // For Safari
                                MozAppearance: 'none', // For Firefox
                            }}/>
                    </div>
                    <div>
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Role:</label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            className="w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]"
                            onChange={handleChange}
                            disabled="disabled"/>
                    </div>
                </div>

                <div className="mt-[4vw] md:mt-[1.5vw]">
                    <label className="font-Poppins text-[4vw] md:text-[1vw]">Gender:</label>
                    <div className="mt-[3vw] md:mt-[0.5vw] flex items-center space-x-[3vw] md:space-x-[1.5vw]">
                        {/* Male */}
                        <label className="flex items-center space-x-[2vw] md:space-x-[0.5vw] text-Gray700 font-Poppins">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === "male"}
                                onChange={handleChange}
                                className="w-[5vw] h-[5vw] md:w-[1vw] md:h-[1vw] accent-Primary"/>
                            <span className="font-Poppins text-[3.5vw] md:text-[1vw]">Male</span>
                        </label>

                        {/* Female */}
                        <label className="flex items-center space-x-[2vw] md:space-x-[0.5vw] text-Gray700 font-Poppins">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === "female"}
                                onChange={handleChange}
                                className="w-[5vw] h-[5vw] md:w-[1vw] md:h-[1vw] accent-Primary"/>
                            <span className="font-Poppins text-[3.5vw] md:text-[1vw]">Female</span>
                        </label>

                        {/* Other */}
                        <label className="flex items-center space-x-[2vw] md:space-x-[0.5vw] text-Gray700 font-Poppins">
                            <input
                                type="radio"
                                name="gender"
                                value="other"
                                checked={formData.gender === "other"}
                                onChange={handleChange}
                                className="w-[5vw] h-[5vw] md:w-[1vw] md:h-[1vw] accent-Primary"/>
                            <span className="font-Poppins text-[3.5vw] md:text-[1vw]">Other</span>
                        </label>
                    </div>
                </div>

            </div>
            <div className="p-[2vw]">
                <h3 className="text-[4.5vw] md:text-[1.5vw] text-Gray800 font-Poppins font-bold mb-[1vw]">Contact</h3>
                <div className="grid md:grid-cols-2 gap-[1vw]">
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Phone:</label>
                        <input
                            type="number"
                            name="phone"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.phone}
                            onChange={handleChange}/>
                    </div>
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">City:</label>
                        <input
                            type="text"
                            name="city"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.city}
                            onChange={handleChange}/>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-[1vw] mt-[4vw] md:mt-[1.5vw]">
                    <div>
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Local Government:</label>
                        <input
                            type="text"
                            name="localGovernment"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.localGovernment}
                            onChange={handleChange}/>
                    </div>
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Address:</label>
                        <input
                            type="text"
                            name="address"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.address}
                            onChange={handleChange}/>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-[1vw] mt-[4vw] md:mt-[1.5vw]">
                    <div>
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">State:</label>
                        <input
                            type="text"
                            name="state"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.state}
                            onChange={handleChange}/>
                    </div>
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Country:</label>
                        <input
                            type="text"
                            name="country"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.country}
                            onChange={handleChange}/>
                    </div>
                </div>
            </div>

            <div className="p-[4vw] md:p-[2vw]">
                <h3 className="text-[4.5vw] md:text-[1.5vw] text-Gray800 font-Poppins font-bold mb-[1vw]">Social</h3>
                <div className="grid md:grid-cols-2 gap-[1vw]">
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Twitter:</label>
                        <input
                            type="text"
                            name="twitter"
                            value={formData.twitter}
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            onChange={handleChange}/>
                    </div>
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Instagram:</label>
                        <input
                            type="text"
                            name="instagram"
                            value={formData.instagram}
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            onChange={handleChange}/>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-[1vw] mt-[4vw] md:mt-[1.5vw]">
                    <div>
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">Facebook:</label>
                        <input
                            type="text"
                            name="facebook"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.facebook}
                            onChange={handleChange}/>
                    </div>
                    <div className="mt-[2vw] md:mt-0">
                        <label className="text-Gray700 font-Poppins text-[4vw] md:text-[1vw]">TikTok:</label>
                        <input
                            type="text"
                            name="tiktok"
                            className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.5vw] text-[3.5vw] md:text-[1vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins focus:border-Primary mt-[2vw] md:mt-[0.5vw]'
                            value={formData.tiktok}
                            onChange={handleChange}/>
                    </div>
                </div>
            </div>
        </div>

        {/* Submit Button */}
        <div className='flex items-end'>
            <button
                type="submit"
                className={`${
                isFormChanged
                    ? 'bg-Primary hover:bg-PrimaryDark'
                    : 'bg-Gray400 cursor-not-allowed'} rounded-md font-Poppins text-[3.5vw] md:text-[1vw] text-White font-medium w-[40vw] h-[10vw] mt-[4vw] md:w-[10vw] md:h-[2.5vw] md:mt-[1.5vw] ml-auto`}
                disabled={!isFormChanged || isLoading}>
                {
                    isLoading
                        ? (
                            <div className="flex justify-center items-center space-x-[0.5vw]">
                                <div
                                    className="spinner-border animate-spin border-2 border-t-2 border-white w-6 h-6 rounded-full"></div>
                                <span>Saving...</span>
                            </div>
                        )
                        : ('Save Changes')
                }
            </button>
        </div>
    </form>
</div>
  )
}

export default UserSettings