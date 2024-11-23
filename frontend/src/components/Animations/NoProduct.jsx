import Lottie from "lottie-react";
import NoProductAnimation from "../../assets/Animations/noproduct.json";

const NoProduct = () => {
  return (
    <div>
      <Lottie animationData={NoProductAnimation} loop={true} autoplay={true} style={{ width: 500, height: 350 }}/>
    </div>
  )
}

export default NoProduct