import bg from "../../assets/Icons/emptystates-empty-cart.svg";

const OrderList = ({ orders }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg mt-[2vw] h-[40vw]">
      <h2 className="text-[1.5vw] text-Gray800 font-semibold font-Poppins">Order List</h2>
      <div className="flex flex-col justify-center items-center h-full">
            <img src={bg} alt="Empty Cart" className="mx-auto w-[20vw] h-[20vw]" />
            <p className="text-[1.5vw] text-Gray500 font-semibold font-Poppins mt-[2vw]">No orders available.</p>
        </div>
      {/*{orders.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Order Date</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">{order.customerName}</td>
                <td className="border border-gray-300 px-4 py-2">${order.total.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.status === "Completed"
                        ? "bg-green-500"
                        : order.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
            <img src={bg} alt="Empty Cart" className="mx-auto w-32" />
            <p className="text-center text-gray-600">No orders available.</p>
        </div>
      )}*/}
    </div>
  );
};

export default OrderList;
