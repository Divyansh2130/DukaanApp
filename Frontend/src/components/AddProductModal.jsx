import React, { useState } from 'react';
import axios from 'axios';

const AddProductModal = ({ customerNumber, onClose }) => {
  const [productList, setProductList] = useState([{ productId: '', quantityBought: 0 }]);

  const handleChange = (index, event) => {
    const values = [...productList];
    values[index][event.target.name] = event.target.value;
    setProductList(values);
  };

  const handleAddProduct = () => {
    setProductList([...productList, { productId: '', quantityBought: 0 }]);
  };

  const handleRemoveProduct = (index) => {
    const values = [...productList];
    values.splice(index, 1);
    setProductList(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put('http://localhost:3000/api/v1/user/addCustomerProduct', { productList }, { params: { phoneNumber: customerNumber } });
      console.log(response.data);
      onClose();
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <div className="modal flex justify-center items-center bg-slate-400 p-2 rounded-lg ">
      <div className="modal-content">
        <button onClick={onClose} type="button" class="bg-slate-500 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span class="sr-only">Close menu</span>
              <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        <form onSubmit={handleSubmit}>
          {productList.map((product, index) => (
            <div key={index} className='p-1 rounded-xl gap space-x-1'>
              <input
                className='rounded-md'
                type="text"
                name="productId"
                placeholder="Product ID"
                value={product.productId}
                onChange={(event) => handleChange(index, event)}
                required
              />
              <input
                className='rounded-md'
                type="number"
                name="quantityBought"
                placeholder="Quantity"
                value={product.quantityBought}
                onChange={(event) => handleChange(index, event)}
                required
              />
              <button className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" type="button" onClick={() => handleRemoveProduct(index)}>Remove</button>
            </div>
          ))}
          <button type="button" className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-slate-800 rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700' onClick={handleAddProduct}>Add Product</button>
          <button type="submit" className='py-2.5 px-5 me-2 mb-2 text-sm font-medium text-white focus:outline-none bg-slate-800 rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
