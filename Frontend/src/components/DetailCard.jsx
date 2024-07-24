import AddProductModal from './AddProductModal';
import { useState } from 'react';
export const CustomerDetails = ({ customer }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

    return (
        <div>
            <div className=" bg-slate-200 p-4 rounded-md border-l border-black">
            <h2 className="text-xl flex flex justify-center  font-bold mb-4">Customer Details</h2>
            <div>
                <strong>Name:</strong> {customer.customerName}
            </div>
            <div>
                <strong>Phone Number:</strong> {customer.customerNumber}
            </div>
            <div>
                <strong>Net Remain:</strong> {customer.netRemain}
            </div>
            <div>
                <strong>Net Get:</strong> {customer.netGet}
            </div>
            
        </div>
        <div className='p-1 flex justify-center items-center'>
        <button className="text-white bg-slate-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleOpenModal}>Add Product to Customer</button>
        </div>
        
{isModalOpen && (
  <AddProductModal customerNumber={customer.customerNumber} onClose={handleCloseModal} />
)}

        </div>

    );  
};
export const SupplierDetails=({ supplier }) => {
    return (
        <div className=" bg-slate-200 p-4 rounded-md border-l border-black">
            <h2 className="text-xl flex flex justify-center  font-bold mb-4">Supplier Details</h2>
            <div>
                <strong>Name:</strong> {supplier.supplierName}
            </div>
            <div>
                <strong>Phone Number:</strong> {supplier.supplierNumber}
            </div>
            <div>
                <strong>Net Remain:</strong> {supplier.netRemain}
            </div>
            <div>
                <strong>Net Get:</strong> {supplier.netGet}
            </div>
            {/* Add more supplier details as needed */}
        </div>
    );  
};
export const ProductDetails=({ product })=>{
    return (
        <div className=" bg-slate-200 p-4 rounded-md border-l border-black">
            <h2 className="text-xl flex flex justify-center  font-bold mb-4">Supplier Details</h2>
            <div>
                <strong>Name:</strong> {product.productName}
            </div>
            <div>
                <strong>Quantity:</strong> {product.quantity}
            </div>
            <div>
                <strong>Price:</strong> {product.price}
            </div>
            <div>
                <strong>Supplier No.</strong> {product.supplierNumber}
            </div>
            <div>
                <strong>Product Id</strong> {product.productId}
            </div>
            
        </div>
    );  

}