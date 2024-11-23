import Lottie from "lottie-react";
import CustomerAnimation from "../../assets/Animations/customer.json";


const Customer = () => {
  return (
    <div>
      <Lottie animationData={CustomerAnimation} loop={false} style={{ width: 500, height: 300 }}/>
    </div>
  )
}

export default Customer