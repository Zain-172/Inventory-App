import express from 'express';
import Customer from '../controller/customer.js';

const customer_router = express.Router();
const CustomerInstance = new Customer();

customer_router.get('/', CustomerInstance.getCustomers);
customer_router.get('/:id', CustomerInstance.getCustomerById);
customer_router.post('/add-customer', CustomerInstance.insertCustomer);
customer_router.delete('/:id', CustomerInstance.deleteCustomer);
customer_router.put('/:id', CustomerInstance.updateCustomer);

export default customer_router;