import { useState,useEffect } from "react"
import { CustomerList } from "./CustomerList";
import { Button } from "./Button";
import AddCustomerCard from "./AddCustomerCard";
import axios from "axios";
export const CustomerCentreBar=({selectedCustomer,setSelectedCustomer})=>{
    const [Search, setSearch] =useState("");
    const [showAddCustomerCard, setShowAddCustomerCard]=useState(false);
    const [totalNetRemain, setTotalNetRemain] = useState(0);
    const [totalNetGet, setTotalNetGet] = useState(0);
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/seeCustomerList", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setTotalNetRemain(response.data.totalNetRemain);
                setTotalNetGet(response.data.totalNetGet);
            } catch (error) {
                console.error("Error fetching supplier data:", error);
            }
        };

        fetchData();
    },[])
    const toggleAddCustomerCard=()=>{
        setShowAddCustomerCard(!showAddCustomerCard);
    }
    return<div>
        <div class="flex flex-col h-screen">
        <div className="font-bold mt-6 text-lg px-2 ">Balance
    <div className="p-2 grid grid-cols-2 gap-2 font-normal">
        <div className="flex justify-center items-center border-2 border-black flex flex-row hover:bg-slate-100 p-2 px-2.5 rounded-lg">
            You Got: <div className="font-medium text-green-700"> Rs {totalNetGet}</div>
        </div>

        <div className="flex justify-center items-center border-2 border-black flex flex-row hover:bg-slate-100 p-2 px-2.5 rounded-lg">
        You Get: <div className="font-medium"> Rs {totalNetRemain}</div>
        </div>
    </div>
</div>
        <div><CustomerList setSelectedCustomer={setSelectedCustomer}/></div>
  <div class="mt-auto p-4">
  <div class=" p-2 "><Button label={"Add Customer"} onClick={toggleAddCustomerCard}></Button></div>
  {showAddCustomerCard && <AddCustomerCard onClose={toggleAddCustomerCard}/>}
  </div>
</div>   
        
    </div>
}