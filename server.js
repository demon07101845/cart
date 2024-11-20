const express = require('express');
const Razorpay = require('razorpay');
const app = express();
const sequelize = require('./configuration/database');
const Product = require('./models/product.js');
const Payment = require('./models/payment.js');
const cors = require('cors');
const PORT = 5000;
app.use(express.json());

app.use(cors());
// const seedProducts = async () => {
//   try {
//     const productCount = await Product.count();
//     if (productCount === 0) {
//       await Product.bulkCreate([
//         { name: 'Apple', quantity: 15, price: 7.5 },
//         { name: 'Banana', quantity: 15, price: 5 },
//         { name: 'Orange', quantity: 18, price: 5.85 },
//         { name: 'Kiwi', quantity: 20, price: 6.25 },
//       ]);
//       console.log('Initial products added');
//     } else {
//       console.log('Products already exist in the database');
//     }
//   } catch (error) {
//     console.error('Error seeding products:', error);
//   }7
// };

const razorpay = new Razorpay({
  key_id: 'rzp_test_xm7QTZxgSB4n5U',
  key_secret: '2yXrl56n2IFhjYzmZZgDJliW',
});

// Create Order API
app.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  const receiptNumber = `receipt_${Date.now()}`;
  const options = {
    amount: amount,
    currency: 'INR',
    receipt: receiptNumber,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.json(response);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Error creating Razorpay order' });
  }
});

//get products route
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll(); //--//it fetches all the product  from the database
    return res.json(products);
    console.log(response);
  } catch (error) {
    console.error('error in fetching products', error);
    return res.status(500).json({ message: 'error in fetching products' });
  }
});
app.post('/addproducts', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const newProduct = await Product.create({ name, quantity, price });
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('error in creating product', error);
    return res.status(500).json({ message: 'error in creating product' });
  }
});

app.post('/store-payment', async (req, res) => {
  const { payment_id, order_id, amount, currency, status } = req.body;
  try {
    const payment = await Payment.create({
      paymentId: payment_id,
      orderId: order_id,
      amount: amount * 100,
      currency,
      status,
    });
    res.status(201).json({ message: 'payment stored successfully ', payment });
  } catch (error) {
    console.error('error in storing payment:', error);
    res.status(500).json({ error: 'failed to store the payment  data' });
  }
});
sequelize
  .sync()
  .then(() => {
    console.log('Database connected and synchronized');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
  });

const syncDatabase = async () => {
  try {
    await Payment.sync({ alter: true });
    console.log('Payment table synced successfully!');
  } catch (error) {
    console.error('Error syncing Payment table:', error);
  }
};

syncDatabase();
