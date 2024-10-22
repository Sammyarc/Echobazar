// eslint-disable-next-line no-unused-vars
import React from 'react'

const Role = ({ onClose, onSelectRole }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[40vw] flex flex-col justify-center items-center p-[2vw] rounded-lg shadow-lg">
                <h2 className="text-lg font-Poppins font-medium mb-4">What do you intend to use our platform as?</h2>
                <div className="flex justify-between space-x-3">
                    <button
                        className="bg-Primary text-white px-4 py-2 rounded font-Poppins"
                        onClick={() => {
                            onSelectRole('buyer');
                            onClose();
                        }}>
                        Buyer
                    </button>
                    <button
                        className="bg-Primary text-white px-4 py-2 rounded font-Poppins"
                        onClick={() => {
                            onSelectRole('seller');
                            onClose();
                        }}>
                        Seller
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Role