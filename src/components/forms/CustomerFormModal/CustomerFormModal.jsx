import React, { useState, useEffect } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { Modal } from '../../Modal/Modal';
import "./CustomerFormModal.css";
// --- Industry Options ---
const INDUSTRIES = [
  'IT & Software',
  'Retail & E-commerce',
  'Manufacturing',
  'Healthcare',
  'Logistics & Supply',
  'Real Estate & Construction',
  'Education & Training',
  'Financial Services',
  'Hospitality & Tourism',
  'Other',
];

function CustomerFormModal({isOpen,onClose,customerToEdit,}) {
    const {addCustomer,updateCustomer}= useCRM();
    const [companyName, setCompanyName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [industry, setIndustry] = useState(INDUSTRIES[0]);
    const [website, setWebsite] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('Following');
    const [errors, setErrors] = useState({});

    useEffect(() => {
      if (customerToEdit) {
        setCompanyName(customerToEdit.companyName || '');
        setContactPerson(customerToEdit.contactPerson || '');
        setEmail(customerToEdit.email || '');
        setPhone(customerToEdit.phone || '');
        setWhatsapp(customerToEdit.whatsapp || '');
        setIndustry(customerToEdit.industry || INDUSTRIES[0]);
        setWebsite(customerToEdit.website || '');
        setAddress(customerToEdit.address || '');
        setCity(customerToEdit.city || '');
        setState(customerToEdit.state || '');
        setNotes(customerToEdit.notes || '');
        setStatus(customerToEdit.status || 'Following');
      } else {
        setCompanyName('');
        setContactPerson('');
        setEmail('');
        setPhone('');
        setWhatsapp('');
        setIndustry(INDUSTRIES[0]);
        setWebsite('');
        setAddress('');
        setCity('');
        setState('');
        setNotes('');
        setStatus('Following');
      }
      setErrors({});
    }, [customerToEdit, isOpen]);

    const handleSubmit = (e) => {
      e.preventDefault();
      const newErrors = {};

      if (!companyName.trim()) newErrors.companyName = 'Company name is required';
      if (!contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
      if (!phone.trim()) newErrors.phone = 'Contact number is required';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const payload = {
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        industry,
        website: website.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        notes: notes.trim(),
        status,
      };

      if (customerToEdit) {
        updateCustomer(customerToEdit.id, payload);
      } else {
        addCustomer(payload);
      }

      onClose();
    };

  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={customerToEdit ? 'Edit Customer' : 'Add Customer'}
        subtitle="Enter details to manage your client relationship"
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit} className="cfm-form">
          <div className="cfm-grid">
            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-company-name-input">
                Company Name <span className="cfm-required">*</span>
              </label>
              <input
                id="customer-company-name-input"
                type="text"
                placeholder="e.g. ABC Technologies"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`cfm-input ${errors.companyName ? 'cfm-input-error' : ''}`}
              />
              {errors.companyName && (
                <p className="cfm-error-msg">{errors.companyName}</p>
              )}
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-contact-person-input">
                Contact Person <span className="cfm-required">*</span>
              </label>
              <input
                id="customer-contact-person-input"
                type="text"
                placeholder="e.g. John Doe"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className={`cfm-input ${errors.contactPerson ? 'cfm-input-error' : ''}`}
              />
              {errors.contactPerson && (
                <p className="cfm-error-msg">{errors.contactPerson}</p>
              )}
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-email-input">
                Email Address
              </label>
              <input
                id="customer-email-input"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cfm-input"
              />
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-phone-input">
                Contact Number <span className="cfm-required">*</span>
              </label>
              <input
                id="customer-phone-input"
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`cfm-input ${errors.phone ? 'cfm-input-error' : ''}`}
              />
              {errors.phone && (
                <p className="cfm-error-msg">{errors.phone}</p>
              )}
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-whatsapp-input">
                WhatsApp Number
              </label>
              <input
                id="customer-whatsapp-input"
                type="text"
                placeholder="+91 98765 43210"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="cfm-input"
              />
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-industry-select">
                Industry
              </label>
              <select
                id="customer-industry-select"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="cfm-select"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-website-input">
                Website
              </label>
              <input
                id="customer-website-input"
                type="url"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="cfm-input"
              />
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-status-select">
                Status <span className="cfm-required">*</span>
              </label>
              <select
                id="customer-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="cfm-select"
              >
                <option value="Following">Following (Default)</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-city-input">
                City
              </label>
              <input
                id="customer-city-input"
                type="text"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="cfm-input"
              />
            </div>

            <div className="cfm-field">
              <label className="cfm-label" htmlFor="customer-state-input">
                State
              </label>
              <input
                id="customer-state-input"
                type="text"
                placeholder="e.g. Karnataka"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="cfm-input"
              />
            </div>
          </div>

          <div className="cfm-field">
            <label className="cfm-label" htmlFor="customer-address-input">
              Address
            </label>
            <input
              id="customer-address-input"
              type="text"
              placeholder="Office address / Street name"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="cfm-input"
            />
          </div>

          <div className="cfm-field">
            <label className="cfm-label" htmlFor="customer-notes-input">
              Notes
            </label>
            <textarea
              id="customer-notes-input"
              rows={2}
              placeholder="Additional context, meeting outcomes, or relationship notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="cfm-textarea"
            />
          </div>

          <div className="cfm-actions">
            <button
              type="button"
              onClick={onClose}
              className="cfm-btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-customer-submit-btn"
              className="cfm-btn-submit"
            >
              {customerToEdit ? 'Update Customer' : 'Save Customer'}
            </button>
          </div>
        </form>
      </Modal>
  );
}

export default CustomerFormModal
