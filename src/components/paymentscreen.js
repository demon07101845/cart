import React from 'react';
import axios from 'axios';
const PaymentPage = ({ getTotalPrice, onPaymentSuccess }) => {
  const handlePayment = async () => {
    try {
      // Step 1: Create an order on the server
      const response = await axios.post('http://localhost:5000/create-order', {
        amount: getTotalPrice * 100,
      });
      const { id: orderId, currency, amount } = response.data;

      // Step 2: Configure Razorpay payment options
      const options = {
        key: 'rzp_test_xm7QTZxgSB4n5U',
        amount: amount,
        currency: currency,
        name: ' On-Board-Cart',
        description: 'Test-Transaction',
        order_id: orderId,
        handler: async function (response) {
          try {
            alert(
              `Payment Successful! Payment ID: ${response.razorpay_payment_id}`
            );
            await axios.post('http://localhost:5000/store-payment', {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              amount: amount / 10000,
              currency: currency,
              status: 'success',
            });
            onPaymentSuccess();
          } catch (error) {
            console.error('error in storing payment  data :', error);
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '1234567890',
        },
        notes: {
          address: 'Customer Address',
        },
        theme: {
          color: '#3399cc',
        },
      };

      // Step 3: Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', async function (response) {
        try {
          alert(`Payment Failed! ${response.error.description}`);
          await axios.post('http://localhost:5000/store-payment', {
            payment_id: response.error.metadata.payment_id || null,
            order_id: response.error.metadata.order_id || null,
            amount: amount / 10000,
            currency: currency,
            status: 'failed',
            reason: response.error.reason,
            code: response.error.code,
            description: response.error.description,
          });
        } catch (error) {
          console.error('error in storing payment failed data  ', error);
        }
      });

      // Step 4: Open Razorpay
      razorpay.open();
    } catch (error) {
      console.error('Error during payment process:', error);
      alert('Payment process failed. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className="h1" style={{ fontSize: '50px', fontWeight: 'bold' }}>
        Payment Page
      </h1>

      <p className="h2">Total Amount Due: ₹{getTotalPrice}</p>
      <button
        className="button 
      "
        style={{ padding: '15px 30px', fontSize: '18px', cursor: 'pointer' }}
        onClick={handlePayment}
      >
        Confirm and Pay
      </button>
    </div>
  );
};

export default PaymentPage;
