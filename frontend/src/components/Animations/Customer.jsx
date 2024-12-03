import Lottie from "lottie-react";
import CustomerAnimation from "../../assets/Animations/customer.json";


const Customer = () => {
  return (
    <div>
      <Lottie animationData={CustomerAnimation} loop={false} />
    </div>
  )
}

export default Customer