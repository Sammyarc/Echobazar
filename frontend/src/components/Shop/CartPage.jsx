import {FiMinus, FiPlus} from 'react-icons/fi';
import useCartStore from '../../store/useCartStore';
import {IoIosClose} from "react-icons/io";
import Empty from "../../assets/Group 1 (1).svg";
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
    const {cart, removeFromCart, clearCart, updateQuantity} = useCartStore();
    

    // Calculate subtotal
    const subtotal = cart.reduce(
        (sum, item) => sum + item.salePrice * item.quantity,
        0
    );

    const navigate = useNavigate();

  const handleCheckout = () => {
    window.scrollTo(0, 0);
    navigate("/checkout"); // Client-side navigation
  };

    return (
        <div className="my-[8vw] md:my-[3vw] px-[2vw] md:px-[8vw]">
            <div className="flex flex-col md:flex-row">
                {/* Cart Items Section */}
                <div className="w-full h-full md:w-2/3 border rounded-lg p-[1vw]">
  {cart.length === 0 ? (
    <div className='flex flex-col justify-center items-center py-[5vw] md:py-[3vw]'>
      <div className='w-[70vw] h-[65vw] md:w-[25vw] md:h-[24vw]'>
        <img src={Empty} alt='Empty cart' className='w-full h-full object-cover' />
      </div>
      <span className='mt-[1.5vw] font-Poppins font-semibold text-Gray700 md:text-[1.5vw]'>
        Your cart is empty.
      </span>
    </div>
  ) : (
    <>
      {/* Desktop Layout */}
      <table className="hidden md:table w-full">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2 font-Poppins text-Gray500 uppercase text-[1vw]">Product</th>
            <th className="p-2 font-Poppins text-Gray500 uppercase text-[1vw]">Price</th>
            <th className="p-2 font-Poppins text-Gray500 uppercase text-[1vw]">Quantity</th>
            <th className="p-2 font-Poppins text-Gray500 uppercase text-[1vw]">Subtotal</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-2 flex items-center">
                <img src={item.images[0]} alt={item.name} className="w-[4vw] h-[3vw] rounded-lg mr-4" />
                <span className='font-Poppins overflow-hidden text-ellipsis whitespace-nowrap text-[1vw]'>
                <Link to={`/product/${encodeURIComponent(item.name)}`} onClick={() => window.scrollTo(0,0)}>{item.name}</Link>
                  </span>
              </td>
              <td className="p-2 font-Poppins text-[1vw]">${item.salePrice.toFixed(2)}</td>
              <td className="p-2">
                {/* Quantity Control */}
                <div className='flex justify-around items-center border rounded-3xl py-[0.2vw] w-[7vw] h-[2.7vw]'>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={`w-[2vw] h-[2vw] border bg-Gray100 rounded-full text-Gray800 text-[1vw] flex justify-center items-center ${
                    item.quantity === 1 ? "cursor-not-allowed opacity-50" : ""
                  }`} disabled={item.quantity <= 1}>
                    <FiMinus />
                  </button>
                  <span className="font-Poppins text-[1vw]">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={`w-[2vw] h-[2vw] border bg-Gray100 rounded-full text-Gray800 text-[1vw] flex justify-center items-center ${
                    item.quantity >= item.stock ? "cursor-not-allowed opacity-50" : ""
                  }`} disabled={item.quantity >= item.stock}>
                    <FiPlus />
                  </button>
                </div>
              </td>
              <td className="p-2 font-Poppins text-[1vw]">${(item.salePrice * item.quantity).toFixed(2)}</td>
              <td className="p-2">
                <button onClick={() => removeFromCart(item.id)} className="text-Gray700 p-[0.1vw] border border-Gray600 rounded-full">
                  <IoIosClose className='text-[1.5vw]' />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="border-b p-4">
            <div className="flex items-start">
            <img src={item.images[0]} alt={item.name} className="w-[18vw] h-[18vw] object-cover rounded-lg mr-4" />
            <div className="flex-1">
              <h3 className="text-[4.5vw] text-Gray700 font-Poppins font-semibold overflow-hidden text-ellipsis whitespace-wrap">
              <Link to={`/product/${encodeURIComponent(item.name)}`} onClick={() => window.scrollTo(0,0)}>{item.name}</Link>
              </h3>
              <p className="text-Gray500 text-[4vw] font-Poppins">${item.salePrice.toFixed(2)}</p>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-Gray700 ml-4 p-[0.5vw] border rounded-full">
              <IoIosClose className='text-[8vw]' />
            </button>
            </div>
            <div className='flex justify-between items-center'>
                <p className="mt-2 font-Poppins text-[4vw] text-Gray600">Total: ${(item.salePrice * item.quantity).toFixed(2)}</p>
              <div className="flex items-center mt-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className={`w-[8vw] h-[8vw] border bg-Gray100 rounded-full text-Gray800 text-[4vw] flex justify-center items-center ${
                  item.quantity === 1 ? "cursor-not-allowed opacity-50" : ""
                }`} disabled={item.quantity <= 1}>
                  <FiMinus />
                </button>
                <span className="mx-4 font-Poppins text-[4vw]">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className={`w-[8vw] h-[8vw] border bg-Gray100 rounded-full text-Gray800 text-[4vw] flex justify-center items-center ${
                  item.quantity >= item.stock ? "cursor-not-allowed opacity-50" : ""
                }`} disabled={item.quantity >= item.stock}>
                  <FiPlus />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
  {cart.length > 0 && (
    <button onClick={clearCart} className="text-[4vw] md:text-[0.9vw] my-4 md:mt-4 bg-Gray100 text-Gray700 font-Poppins px-[4.5vw] py-[1.5vw] md:py-[0.5vw] md:px-[2vw] flex ml-auto mr-[2vw] md:mr-0 rounded-lg md:rounded-xl">
      Clear Cart
    </button>
  )}
</div>


                {/* Cart Summary Section */}
                <div
                    className="w-full h-full md:w-1/3 md:ml-8 mt-6 md:mt-0 border p-2 md:p-6 rounded-lg">
                    <h2
                        className="text-[6vw] md:text-[1.5vw] font-semibold text-Gray700 font-Poppins mb-4">Cart Total</h2>
                    <div className="flex justify-between font-Poppins text-Gray700 mb-2">
                        <span className='text-Gray800 font-semibold font-Poppins text-[4.5vw] md:text-[1vw]'>Subtotal:</span>
                        <span className='text-Gray700 font-Poppins font-semibold text-[4vw] md:text-[1vw]'>${subtotal.toFixed(2)}</span>
                    </div>
                    <hr className="my-[2.5vw] md:my-2"/>
                    <div className="flex justify-between font-Poppins text-Gray700 mb-2">
                        <span className='text-Gray800 font-medium  font-Poppins text-[4.5vw] md:text-[1vw]'>Shipping:</span>
                        <span className='text-Gray700 font-Poppins font-medium text-[4vw] md:text-[1vw]'>Free</span>
                    </div>
                    <hr className="my-[2.5vw] md:my-2"/>
                    <div className="flex justify-between font-Poppins text-Gray900 mb-2">
                        <span className='text-Gray800 font-semibold font-Poppins text-[4.5vw] md:text-[1vw]'>Total:</span>
                        <span className='text-Gray700 font-Poppins font-semibold text-[4vw] md:text-[1vw]'>${subtotal.toFixed(2)}</span>
                    </div>

                    <button
                       onClick={handleCheckout}
                        className={`w-full py-[2.5vw] md:py-[0.6vw] rounded-lg md:rounded-full font-Poppins my-[2vw] md:my-[0.5vw] text-[4.5vw] md:text-[1vw] ${
                        cart.length === 0
                            ? "bg-Gray400 cursor-not-allowed text-Gray100"
                            : "bg-Primary text-white"}`}
                        disabled={cart.length === 0}>
                        Proceed to Checkout
                    </button>

                </div>
            </div>

            {/* Coupon Section */}
            <div
                className="mt-8 md:w-[54vw] px-[2vw] py-[3vw] md:p-[1vw] flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg">
                <h2
                    className="text-[5vw] mb-4 md:mb-0 md:text-[1.3vw] font-semibold text-Gray700 font-Poppins">Coupon Code</h2>
                <div className="relative w-full md:w-auto">
                    <input
                        type="text"
                        className="w-[90vw] md:w-[40vw] py-[3vw] md:py-3 pl-[3vw] md:pl-[1vw] pr-[37vw] md:pr-[12vw] text-Gray900 text-[4vw] md:text-[1vw] rounded-lg md:rounded-full border border-Gray200 bg-transparent outline-none placeholder:font-Poppins placeholder:text-Gray500 focus:border-Primary"
                        placeholder="Enter code"/>
                    <button
                        className="absolute right-0 top-0 bottom-0 bg-Gray800 font-Poppins font-semibold text-white rounded-r-lg md:rounded-full px-[5vw] text-[3.5vw] md:text-[0.9vw] md:px-[2vw]">
                        Apply Coupon
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
