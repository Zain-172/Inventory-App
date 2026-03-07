import EmployeeAccounts from "../controller/employee_accounts.js";
import express from 'express';

const employee_accounts_router = express.Router();
const employeeAccountsInstance = new EmployeeAccounts();

employee_accounts_router.get('/', (req, res) => {
    employeeAccountsInstance.getEmployeeAccounts(req, res);
});
employee_accounts_router.post('/add-account', (req, res) => {
    employeeAccountsInstance.insertEmployeeAccount(req, res);
});
employee_accounts_router.delete('/:id', (req, res) => {
    employeeAccountsInstance.deleteEmployeeAccount(req, res);
});
employee_accounts_router.put('/:id', (req, res) => {
    employeeAccountsInstance.updateEmployeeAccount(req, res);
});

export default employee_accounts_router;