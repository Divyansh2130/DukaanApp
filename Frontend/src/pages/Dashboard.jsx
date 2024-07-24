import { useState } from "react"
import { CustomerDetails } from "../components/DetailCard"
import { SupplierDetails } from "../components/DetailCard"
import { ProductDetails } from "../components/DetailCard"
import { SideBar } from "../components/Sidebar"
import { SupplierCentreBar } from "../components/SupplierCentreBar"
import { CustomerCentreBar } from "../components/CustomerCentreBar"
import { ProductList } from "../components/ProductList"



export const Dashboard=()=>{
        const [selectedCustomer, setSelectedCustomer] = useState(null);
        const [selectedSupplier, setSelectedSupplier] = useState(null);
        const [selectedProduct, setSelectedProduct] =useState(null);
        const [activeComponent,setActiveComponent]=useState("");
        const [activeComponentDetail,setActiveComponentDetail]=useState("");
        
        const renderActiveComponent =()=>{
            console.log("Inside render component");
            switch(activeComponent){
                case 'SupplierCentreBar':
                    return <SupplierCentreBar selectedSupplier={selectedSupplier} setSelectedSupplier={setSelectedSupplier}/>;
                case 'CentreBar':
                    return <CustomerCentreBar selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>;
                case 'ProductList':
                    return <ProductList setSelectedProduct={setSelectedProduct}/>
                default:
                    return <CustomerCentreBar selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer}/>;
    
            }
        }
        const renderActiveComponentDetail = () => {
            if (selectedCustomer) {
                return <CustomerDetails customer={selectedCustomer} />;
            } else if (selectedSupplier) {
                return <SupplierDetails supplier={selectedSupplier} />; 
            } else if (selectedProduct) {
                return <ProductDetails product={selectedProduct}/>;
            }
            return null;
        };

    return <div className="grid grid-cols-6">
        <div className="col-span-1 bg-slate-800 border-black border-2">
            <SideBar setActiveComponent={setActiveComponent} setActiveComponentDetail={setActiveComponentDetail}></SideBar>
        </div>
        <div className="col-span-3 bg-slate-300 border-black border-2">
            {renderActiveComponent()} 
        </div>
        <div className="col-span-2 bg-slate-300 border-black border-2">
         {renderActiveComponentDetail()}
        </div>

    </div>
}