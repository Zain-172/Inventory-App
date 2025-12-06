import express from 'express';
import Employee from '../controller/employee.js';

const employee_router = express.Router();
const employeeInstance = new Employee();

employee_router.get('/', (req, res) => {
    employeeInstance.getEmployees(req, res);
});
employee_router.post('/add-employee', (req, res) => {
    employeeInstance.insertEmployee(req, res);
});
employee_router.delete('/:id', (req, res) => {
    employeeInstance.deleteEmployee(req, res);
});
employee_router.put('/:id', (req, res) => {
    employeeInstance.updateEmployee(req, res);
});

export default employee_router;