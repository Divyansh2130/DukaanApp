import { useEffect, useState } from "react";
import axios from "axios";
import { SupplierDetails } from "./DetailCard";

export const SupplierList = ({ setSelectedSupplier }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/seeSupplierList", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                        'Content-Type': 'application/json'
                    },
                    params: {
                        filter: filter
                    }
                });
                setSuppliers(response.data.suppliers); // Ensure it's an array
            } catch (error) {
                console.error("There was an error fetching the supplier list!", error);
                setSuppliers([]); // Fallback to an empty array on error
            }
        };

        fetchSuppliers();
    }, [filter]);

    const handleSupplierClick = async (phoneNumber) => {
        try {
            console.log(phoneNumber);
            const response = await axios.get("http://localhost:3000/api/v1/user/seeSupplierDetails", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                params: { phoneNumber: phoneNumber }
            });
            setSelectedSupplier(response.data.supplier);
        } catch (error) {
            console.error("Error fetching supplier details:", error);
        }
    };

    return (
        <>
            <div className="font-bold mt-6 text-lg px-2">Suppliers</div>
            <div className="my-2 px-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search Suppliers..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {
                    suppliers.map(supplier => (
                        <Supplier
                            key={supplier.supplierNumber} // Use a unique identifier
                            supplier={supplier}
                            onClick={() => handleSupplierClick(supplier.supplierNumber)}
                        />
                    ))
                 }
            </div>
        </>
    );
};

function Supplier({ supplier, onClick }) {
    return (
        <div className="flex justify-between hover:bg-blue-300 p-1" onClick={onClick}>
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {supplier.supplierName[0]}
                    </div>
                </div>
                <div className="flex grid grid-cols-4">
                    <div className="flex-auto col-span-2 p-1 font-bold">
                        {supplier.supplierName}
                    </div>
                    <div className="flex-auto col-span-1 p-1 font-semibold flex justify-center">
                        <strong>Net Remain:</strong>
                        <div className="text-red-800">{supplier.netRemain}</div>
                    </div>
                    <div className="flex-auto col-span-1 p-1 font-semibold flex justify-center">
                        <strong>Net Gave:</strong>
                        <div className="text-green-800">{supplier.netGave}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
