import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

console.log('KEY_ID:', process.env.RAZORPAY_KEY_ID);
console.log('SECRET:', process.env.RAZORPAY_KEY_SECRET ? 'PRESENT' : 'MISSING');

try {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('Razorpay initialized successfully');

  const order = await razorpay.orders.create({
    amount: 1,
    currency: 'INR',
    receipt: 'test_receipt'
  });
  console.log('Order created:', order.id);
} catch (err) {
  console.error('Error:', err.message);
  if (err.error) console.error('Details:', err.error);
}
