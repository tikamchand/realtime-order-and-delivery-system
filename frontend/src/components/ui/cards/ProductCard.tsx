import { Button, Card } from "antd";
import { IProduct } from "../../../utils/types";
import { apiRequest } from "../../../utils/apiRequest";

const ProductCard = ({ product }: { product: IProduct }) => {
  const handleAddToCart = async () => {
    try {
      await apiRequest(
        "POST",
        "/carts",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };
  return (
    <Card
      hoverable
      style={{ width: 240 }}
      cover={<img alt={product.name} src={product.image_url} />}
    >
      <p>{product.name}</p>
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>Quantity: {product.quantity}</p>
      <p>Available: {product.quantity > 0 ? "In Stock" : "Out of Stock"}</p>
      <Button type="primary" onClick={() => handleAddToCart()}>
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
