
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const orderAccess = localStorage.getItem('orderAccess');
    if (!orderAccess) {
      navigate('/'); // Redirect to home if access is invalid
    }
  }, [navigate]);

   // Function to handle navigation and flag removal
   const handleGoToShop = () => {
    localStorage.removeItem('orderAccess'); // Remove access flag
    navigate('/shop'); // Redirect to shop page
    window.scrollTo(0, 0);
  };

  return (
    <div>
      <div className='bg-white shadow-lg p-3 md:p-12 flex flex-col justify-center items-center h-screen font-Poppins text-center'>
        <h2 className='text-[7.5vw] md:text-[2.5vw] font-semibold'>Order Confirmed!</h2>
        <p className='text-[4vw] md:text-[1vw] mt-4 md:mt-[1vw] md:w-2/3 mx-auto'>
          Your order has been successfully placed. You will receive a confirmation email soon.
        </p>
        <button
          onClick={handleGoToShop}
          className="w-[80vw] md:w-[15vw] py-[2.5vw] md:py-3 rounded-xl md:rounded-full font-Poppins mt-6 md:mt-4 text-white bg-Primary"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
