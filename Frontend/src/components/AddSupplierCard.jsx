import { useState } from "react";
import axios from "axios";

const AddSupplierCard = ({ onClose }) => {
    const [supplierName, setSupplierName] = useState("");
    const [supplierNumber, setSupplierNumber] = useState("");
    const [netRemain, setNetRemain] = useState(0);
    const [netGave, setNetGave] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/addSupplier", {
                supplierName,
                supplierNumber,
                netRemain,
                netGave
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Supplier added:", response.data);
            onClose(); // Close the card after successful submission
        } catch (error) {
            console.error("Error adding supplier:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-4">Add Supplier</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
                        <input
                            type="text"
                            value={supplierName}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Supplier Number</label>
                        <input
                            type="text"
                            value={supplierNumber}
                            onChange={(e) => setSupplierNumber(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Net Remain</label>
                        <input
                            type="number"
                            value={netRemain}
                            onChange={(e) => setNetRemain(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Net Gave</label>
                        <input
                            type="number"
                            value={netGave}
                            onChange={(e) => setNetGave(Number(e.target.value))}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSupplierCard;
