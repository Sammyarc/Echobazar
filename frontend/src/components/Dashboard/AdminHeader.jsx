import { GoSearch } from "react-icons/go";
import { useAuthStore } from "../../store/authStore";
import { CiBellOn } from "react-icons/ci";
import { useEffect, useState } from "react";
import Avatar from "../../assets/Avatar/download (3).png";

const AdminHeader = () => {
  const { user } = useAuthStore();
  const [profileImage, setProfileImage] = useState(Avatar); // Default to Avatar initially

  useEffect(() => {
    // Check if `user` and `user.profileImage` exist before setting
    if (user && user.profileImage) {
      setProfileImage(user.profileImage);
    } else {
      setProfileImage(Avatar); // Use default avatar if not logged in or no image
    }
  }, [user]); // Watch `user` for changes

  const [notificationCount] = useState(0);

  const date = new Date();
  const hours = date.getHours();

  let timeOfDay;

  if (hours < 12) {
    timeOfDay = "morning";
  } else if (hours >= 12 && hours <= 17) {
    timeOfDay = "afternoon";
  } else {
    timeOfDay = "evening";
  }

  return (
    <div className="py-[1vw] pr-[2vw] mt-[1vw] flex justify-between items-center">
      {/* Search bar */}
      <div className="flex w-[50vw] h-[8vw] md:w-[20vw] md:h-[2.5vw] border border-Gray100 items-center space-x-1 rounded-[1.5vw] md:rounded-[0.5vw] focus-within:border-Primary">
        {/* Search icon */}
        <GoSearch className="px-[0.4vw] w-[15%] md:w-[10%] text-[4vw] md:text-[1.3vw]" />
        {/* Search input */}
        <input
          type="search"
          placeholder="Search"
          className="search-input h-full text-[3.5vw] md:text-[1vw] outline-none border-none w-[60%] font-Poppins text-Gray900 placeholder:text-Gray400 placeholder:md:text-[1vw]"
        />
        {/* Search button */}
        <button className="bg-Primary w-[40%] md:w-[30%] h-full border border-Primary rounded-r-[1.5vw] md:rounded-r-[0.5vw] font-Poppins text-White text-[3vw] md:text-[0.9vw]">
          Search
        </button>
      </div>
      <div className="flex space-x-[1vw] items-center">
        <button className="">
          <div className="relative">
            {/* Notification Icon */}
            <CiBellOn className="w-[12vw] h-[8vw] md:w-[2.2vw] md:h-[2.2vw]" />
            {/* Notification Count Badge */}
            <span className="absolute -top-[0.15vw] right-[1.5vw] md:right-[0.1vw] bg-Primary text-White text-[3vw] md:text-[0.8vw] rounded-full w-[5vw] md:w-[1.2vw] h-[5vw] md:h-[1.2vw] flex items-center justify-center font-Poppins">
              {notificationCount}
            </span>
          </div>
        </button>
        <img
          src={profileImage}
          alt="Profile picture"
          className="w-[9vw] h-[9vw] md:w-[2.5vw] md:h-[2.5vw] border-2 border-SoftPrimary rounded-full object-cover"
        />
        <span className="hidden md:block font-Poppins text-[1.1vw] text-Gray600">
          Good {timeOfDay}, {user?.name?.split(" ")[0] || "Guest"}
        </span>
      </div>
    </div>
  );
};

export default AdminHeader;
