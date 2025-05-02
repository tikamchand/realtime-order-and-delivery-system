import { useEffect, useState } from "react";
import { apiRequest } from "../../../utils/apiRequest";
import { IProduct } from "../../../utils/types";
import ProductCard from "../../ui/cards/ProductCard";

interface FetchProductsResponse {
  data: Array<IProduct>;
}

const Home = () => {
  const [products, setProducts] = useState<Array<IProduct> | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiRequest<FetchProductsResponse>(
          "GET",
          "/products"
        );
        setProducts(data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products &&
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default Home;
