import { getCompanies, addCompany, getCompanyById } from '../models/company.model.js';

// Get filtered list of companies
export const getAllCompanies = async (req, res) => {
  try {
    const { search, city, rating } = req.query;
    const companies = await getCompanies(search, city, rating);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new company
export const createNewCompany = async (req, res) => {
  try {
    const { name, location, foundedOn, city, logo, description } = req.body;
    if (!name || !location || !foundedOn || !city) {
      return res.status(400).json({ error: "Missing required fields (name, location, foundedOn, city)" });
    }
    const company = await addCompany({ name, location, foundedOn, city, logo, description });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get detailed company info
export const getCompanyDetails = async (req, res) => {
  try {
    const company = await getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
