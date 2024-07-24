import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { CustomerDetails } from "./DetailCard";

export const CustomerList = ({setSelectedCustomer}) => {
    const [customers, setCustomers] = useState([]);
    const [filter, setFilter] = useState("");
   
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/seeCustomerList", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Example of adding an authorization header
                        'Content-Type': 'application/json'
                    },
                    params: {
                        filter: filter
                    }
                });
                setCustomers(response.data.customer);
            } catch (error) {
                console.error("There was an error fetching the customer list!", error);
            }
        };

        fetchCustomers();
    }, [filter]);
    
    const handleCustomerClick = async (phoneNumber) => {
        try {
            const response = await axios.get("http://localhost:3000/api/v1/user/seeCustomerDetails", {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                params: { phoneNumber: phoneNumber }
            });
            setSelectedCustomer(response.data.customer);
        } catch (error) {
            console.error("Error fetching customer details:", error);
        }
    };

    return (
        <>
            <div className="font-bold mt-6 text-lg px-2">Customers</div>
            <div className="my-2 px-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search Customers..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {customers.map(customer => (
                    <Customer key={customer.customerName} customer={customer} onClick={() => handleCustomerClick(customer.customerNumber)} />
                ))}
                
            </div>
        </>
    );
};

function Customer({ customer,onClick }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-between hover:bg-blue-300" onClick={onClick} >
            <div className="flex p-1">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {customer.customerName[0]}
                    </div>
                </div>
                <div className="flex  grid grid-cols-4 ">
                    <div className="flex-auto col-span-2 p-1 font-bold ">
                        {customer.customerName}  
                    </div>
                    <div className="flex-auto col-span-1 p-1 font-semibold flex justify-center">
                         <strong>Net Remain:</strong><div className="text-red-800">{customer.netRemain}</div>
                    </div>
                    <div className="flex-auto col-span-1 p-1 font-semibold flex justify-center">
                     <strong>Net Get:</strong><div className="text-green-800">{customer.netGet}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
