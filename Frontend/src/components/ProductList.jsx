import { useEffect, useState } from "react";
import axios from "axios";
import AddProductCard from "./AddProductCard";
import { Button } from "./Button";

export const ProductList = ({ setSelectedProduct }) => {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("");
    const [showAddProductCard, setShowAddProductCard]=useState(false);
    
    const toggleAddProductCard=()=>{
        setShowAddProductCard(!showAddProductCard);
    }
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/v1/user/seeProductList", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                        'Content-Type': 'application/json'
                    },
                    params: {
                        filter: filter
                    }
                });
                setProducts(response.data.product);
            } catch (error) {
                console.error("There was an error fetching the product list!", error);
                setProducts([]); // Fallback to an empty array on error
            }
        };

        fetchProducts();
    }, [filter]);

    const handleProductClick = (productId) => {
        console.log(productId);
        console.log(products);
        const selectedProduct = products.find(product => product.productId === productId);
        console.log(selectedProduct);
        if (selectedProduct) {
            setSelectedProduct(selectedProduct);
        } else {
            console.error("Product not found with id:", productId);
        }
    };

    return (
        <>
            <div className="font-bold mt-6 text-lg px-2">Products</div>
            <div className="my-2 px-2">
                <input
                    onChange={(e) => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search Products..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                />
            </div>
            <div>
                {products.length > 0 ? (
                    products.map(product => (
                        <Product
                            key={product.productId} // Use a unique identifier
                            product={product}
                            onClick={() => handleProductClick(product.productId)}
                        />
                    ))
                ) : (
                    <div className="text-center text-gray-500">No products found</div>
                )}
            </div>
            <div class="mt-auto p-4">
              <div class=" p-2 "><Button label={"Add Product"} onClick={toggleAddProductCard}></Button></div>
              {showAddProductCard && <AddProductCard onClose={toggleAddProductCard}/>}
           </div>
        </>
    );
};

function Product({ product, onClick }) {
    return (
        <div className="flex justify-between hover:bg-blue-300 p-1" onClick={onClick}>
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {product.productName[0]}
                    </div>
                </div>
                <div className="flex grid grid-cols-4">
                    <div className="flex-auto col-span-2 p-1 font-bold">
                        {product.productName}
                    </div>
                    <div className="flex-auto col-span-1 p-1 font-semibold flex justify-center">
                        <strong>Quantity:</strong>
                        <div className="text-black-800">{product.quantity}</div>
                    </div>
                    <div className="flex-auto col-span-1 p-1 font-semibold flex justify-center">
                        <strong>Price:</strong>
                        <div className="text-black-800">{product.price}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
