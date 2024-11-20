import React from 'react';
const Products = ({ products, onAddToCart }) => {
  return (
    <div>
      <h1 className="h1">Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} --- Available: {product.quantity}
            {';'}
            {''} price :₹{product.price}
            <button
              className="button"
              onClick={() => onAddToCart(product)}
              disabled={product.quantity === 0}
            >
              {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Products;
