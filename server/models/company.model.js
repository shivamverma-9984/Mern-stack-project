import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  foundedOn: { type: String, required: true },
  city: { type: String, required: true },
  logo: { type: String },
  description: { type: String }
});

export const CompanyModel = mongoose.model('Company', companySchema);

// Get all companies with optional search, city, and average rating filters
export const getCompanies = async (search = '', city = '', rating = 0) => {
  let query = {};
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (city) {
    query.city = { $regex: city, $options: 'i' };
  }
  
  const companies = await CompanyModel.find(query).lean();
  const ReviewModel = mongoose.model('Review');
  
  // Process companies with reviews to compute average rating
  const processedCompanies = await Promise.all(companies.map(async (company) => {
    const reviews = await ReviewModel.find({ companyId: company._id }).lean();
    const avgRating = reviews.length > 0 
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 
      : 0;
    return {
      ...company,
      avgRating,
      reviewCount: reviews.length
    };
  }));

  if (rating > 0) {
    return processedCompanies.filter(c => Math.round(c.avgRating) === Number(rating));
  }
  return processedCompanies;
};

// Add new company
export const addCompany = async (companyData) => {
  const newCompany = new CompanyModel({
    name: companyData.name,
    location: companyData.location,
    foundedOn: companyData.foundedOn,
    city: companyData.city,
    logo: companyData.logo || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80",
    description: companyData.description || "No description provided."
  });
  const saved = await newCompany.save();
  return saved.toObject();
};

// Get single company details
export const getCompanyById = async (id) => {
  const company = await CompanyModel.findById(id).lean();
  if (!company) return null;
  const ReviewModel = mongoose.model('Review');
  const reviews = await ReviewModel.find({ companyId: id }).lean();
  const avgRating = reviews.length > 0 
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 
    : 0;
  return {
    ...company,
    avgRating,
    reviewCount: reviews.length
  };
};
