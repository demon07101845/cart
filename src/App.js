import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import Products from './components/product';
import { cartReducer } from './reducers/cartreducers';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PaymentPage from './components/paymentscreen';
import './index.css';
function App() {
  const [products, setProducts] = useState([]); //------>/ useState([])
  const [cart, dispatch] = useReducer(cartReducer, []);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products');
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error in fetching the product:', error);
      }
    };
    fetchproducts();
  }, []);
  const handleAddToCart = (product) => {
    if (product.quantity > 0) {
      setProducts(
        products.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
        )
      );
      dispatch({ type: 'ADD_ITEM', item: product, quantity: 1 });
    } else {
      alert('Product out of stock!!!!!');
    }
  };
  const incrementItem = (id) => {
    const itemInCart = cart.find((item) => item.id === id);
    if (itemInCart) {
      const product = products.find((product) => product.id === id);

      if (product && product.quantity > 0) {
        setProducts(
          products.map((prod) =>
            prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod
          )
        );
        dispatch({ type: 'INCREMENT_ITEM', id });
      } else if (product && product.quantity === 0) {
        alert('Product out of stock');
      }
    }
  };
  const decrementItem = (id) => {
    const itemInCart = cart.find((item) => item.id === id);
    if (itemInCart && itemInCart.cartQuantity > 1) {
      setProducts(
        products.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
      dispatch({ type: 'DECREMENT_ITEM', id });
    } else if (itemInCart && itemInCart.cartQuantity === 1) {
      setProducts(
        products.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );
      dispatch({ type: 'REMOVE_ITEM', id });
    }
  };
  const removeItem = (id) => {
    const itemToRemove = cart.find((item) => item.id === id);
    if (itemToRemove) {
      setProducts(
        products.map((product) =>
          product.id === id
            ? {
                ...product,
                quantity: product.quantity + itemToRemove.cartQuantity,
              }
            : product
        )
      );
    }
    dispatch({ type: 'REMOVE_ITEM', id });
  };
  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) => total + item.cartQuantity * item.price,
      0
    );
  };
  const handleProceedToPayment = () => {
    navigate('/payment');
  };
  return (
    <Routes>
      <Route
        path="/"
        element={
          <div>
            <Products products={products} onAddToCart={handleAddToCart} />
            <h1 className="h1">Cart</h1>
            <ul className="cart">
              {cart.map((item) => (
                <li className="cart-item" key={item.id}>
                  {item.name} - Quantity: {item.cartQuantity} ₹
                  {item.price * item.cartQuantity}
                  <button
                    className="button"
                    onClick={() => incrementItem(item.id)}
                  >
                    +
                  </button>
                  <button
                    className="button"
                    onClick={() => decrementItem(item.id)}
                  >
                    -
                  </button>
                  <button
                    className="button"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="h1">Total: ₹{getTotalPrice()}</h3>
            <button className="button" onClick={handleProceedToPayment}>
              Make Payment
            </button>
          </div>
        }
      />
      <Route
        path="/payment"
        element={
          <PaymentPage
            getTotalPrice={getTotalPrice()}
            onPaymentSuccess={() => navigate('/')}
          />
        }
      />
    </Routes>
  );
}
export default App;
