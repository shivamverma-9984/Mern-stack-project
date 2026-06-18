import express from 'express';
import { getAllCompanies, createNewCompany, getCompanyDetails } from '../controllers/company.controller.js';

const router = express.Router();

// Get filtered list of companies
router.get('/', getAllCompanies);

// Add a new company
router.post('/', createNewCompany);

// Get detailed company info
router.get('/:id', getCompanyDetails);

export default router;
