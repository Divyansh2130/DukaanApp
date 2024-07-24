import { useEffect, useState } from "react"
import { SupplierList } from "./SupplierList";
import { Button } from "./Button";
import AddSupplierCard from "./AddSupplierCard";
import axios from "axios";
export const SupplierCentreBar=({selectedSupplier,setSelectedSupplier})=>{
    const [Search, setSearch] =useState("");
    const [showAddSupplierCard, setShowAddSupplierCard]=useState(false);
    const [totalNetRemain, setTotalNetRemain] = useState(0);
    const [totalNetGave, setTotalNetGave] = useState(0);
    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/seeSupplierList", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });
                setTotalNetRemain(response.data.totalNetRemain);
                setTotalNetGave(response.data.totalNetGave);
            } catch (error) {
                console.error("Error fetching supplier data:", error);
            }
        };

        fetchData();
    },[])
    const toggleAddSupplierCard=()=>{
        setShowAddSupplierCard(!showAddSupplierCard);
    }
    return<div>
        <div class="flex flex-col h-screen">
        <div className="font-bold mt-6 text-lg px-2 ">Balance
    <div className="p-2 grid grid-cols-2 gap-2 font-normal">
        <div className="flex justify-center items-center border-2 border-black flex flex-row hover:bg-slate-100 p-2 px-2.5 rounded-lg">
            Remain : <div className="font-medium text-green-700"> Rs {totalNetRemain}</div>
        </div>

        <div className="flex justify-center items-center border-2 border-black flex flex-row hover:bg-slate-100 p-2 px-2.5 rounded-lg">
        You Gave: <div className="font-medium"> Rs {totalNetGave}</div>
        </div>
    </div>
</div>
        <div><SupplierList selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier}/></div>
  <div class="mt-auto p-4">
  <div class=" p-2 "><Button label={"Add Supplier"} onClick={toggleAddSupplierCard}></Button></div>
  {showAddSupplierCard && <AddSupplierCard onClose={toggleAddSupplierCard}/>}
  </div>
</div>   
        
    </div>
}