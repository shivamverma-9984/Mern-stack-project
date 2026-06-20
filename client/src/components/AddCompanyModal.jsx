import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { addCompanyAsync } from '../redux/slices/companySlice';
import confetti from 'canvas-confetti';

export default function AddCompanyModal({ isOpen, onClose, showToast }) {
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    foundedOn: '',
    city: '',
    logo: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Company Name is required';
    if (!formData.location.trim()) return 'State/Country Location is required';
    if (!formData.foundedOn) return 'Founded date is required';
    if (!formData.city.trim()) return 'City is required';
    return null;
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      showToast(error, 'error');
      return;
    }
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(addCompanyAsync(formData)).unwrap();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('Company profile created successfully!', 'success');
      setStep(3);
    } catch (err) {
      showToast(err || 'Failed to add company', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setFormData({
      name: '',
      location: '',
      foundedOn: '',
      city: '',
      logo: '',
      description: ''
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        
        {/* Modal Header */}
        <div className="modal-header-row">
          <h3>
            {step === 1 && 'Add Company Profile'}
            {step === 2 && 'Verify Details'}
            {step === 3 && 'Success!'}
          </h3>
          {step !== 3 && (
            <button className="close-modal-btn" onClick={handleResetAndClose}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body-panel">
          {step === 1 && (
            <form onSubmit={handleNextStep}>
              <div className="form-field-group">
                <label htmlFor="name">Company Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Acme Tech Solutions"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-field-row">
                <div className="form-field-group">
                  <label htmlFor="city">Address *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="e.g. AB Road New Pralasia, Indore"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="location">State / Country *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="e.g. Madhya Pradesh, India"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field-row">
                <div className="form-field-group">
                  <label htmlFor="foundedOn">Founded On *</label>
                  <input
                    type="date"
                    id="foundedOn"
                    name="foundedOn"
                    value={formData.foundedOn}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="logo">Logo Image URL</label>
                  <input
                    type="url"
                    id="logo"
                    name="logo"
                    placeholder="https://example.com/logo.png"
                    value={formData.logo}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="description">About the Company</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Tell us what the company does..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="modal-footer-row" style={{ padding: '12px 0 0 0', borderTop: 'none' }}>
                <button type="button" className="btn-modal-cancel" onClick={handleResetAndClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Next <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                Please review the details below. Ensure all information is accurate before submitting.
              </p>
              
              <div className="verification-container" style={{ padding: '15px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                <div className="verification-field" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span className="verification-label" style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Company Name:</span>
                  <span className="verification-value" style={{ fontWeight: '600', color: '#000000' }}>{formData.name}</span>
                </div>
                <div className="verification-field" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span className="verification-label" style={{ fontWeight: '500', color: 'var(--text-muted)' }}>City:</span>
                  <span className="verification-value" style={{ fontWeight: '600', color: '#000000' }}>{formData.city}</span>
                </div>
                <div className="verification-field" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span className="verification-label" style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Location:</span>
                  <span className="verification-value" style={{ fontWeight: '600', color: '#000000' }}>{formData.location}</span>
                </div>
                <div className="verification-field" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span className="verification-label" style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Founded On:</span>
                  <span className="verification-value" style={{ fontWeight: '600', color: '#000000' }}>{formData.foundedOn}</span>
                </div>
                {formData.logo && (
                  <div className="verification-field" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span className="verification-label" style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Logo:</span>
                    <span className="verification-value" style={{ color: '#000000', wordBreak: 'break-all', maxWidth: '250px', fontSize: '11px', textAlign: 'right' }}>
                      {formData.logo}
                    </span>
                  </div>
                )}
                {formData.description && (
                  <div className="verification-field" style={{ display: 'block', marginTop: '10px', borderTop: '1px solid #f1f3f7', paddingTop: '8px', fontSize: '13px' }}>
                    <span className="verification-label" style={{ fontWeight: '500', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Description:</span>
                    <span className="verification-value" style={{ display: 'block', color: '#333333', fontSize: '12px', lineHeight: '1.4' }}>
                      {formData.description}
                    </span>
                  </div>
                )}
              </div>

              <div className="modal-footer-row" style={{ padding: '12px 0 0 0', borderTop: 'none' }}>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <ArrowLeft size={14} /> Edit
                </button>
                <button
                  type="button"
                  className="btn-modal-submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Submit Profile'}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px', padding: '15px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--color-success)' }} />
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '6px', color: '#000000' }}>Company Created!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '280px' }}>
                  <strong>{formData.name}</strong> has been added successfully.
                </p>
              </div>
              <button className="btn-modal-submit" onClick={handleResetAndClose} style={{ width: '120px' }}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
