
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
    <div className="py-[1vw] pr-[2vw] mt-[1vw] flex justify-end items-center">
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
          className="w-[9vw] h-[9vw] md:w-[2.5vw] md:h-[2.5vw] border-2 border-GreenGray50 rounded-full object-cover"
        />
        <span className="hidden md:block font-Poppins text-[1.1vw] text-Gray600">
          Good {timeOfDay}, {user?.name?.split(" ")[0] || "Guest"}
        </span>
      </div>
    </div>
  );
};

export default AdminHeader;
