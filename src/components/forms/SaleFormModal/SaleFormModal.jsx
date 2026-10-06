import React, { useState,useEffect } from 'react';
import { useCRM } from '../../../context/CRMContext';
import {Modal} from "../../Modal/Modal";
import "./SaleFormModal.css";
const INDUSTRIES = [
    'Technology & Software',
    'E-commerce & Retail',
    'Healthcare & Medical',
    'Education & EdTech',
    'Real Estate & Construction',
    'Finance & Banking',
    'Hospitality & Tourism',
    'Manufacturing & Logistics',
    'Media & Entertainment',
    'Other',
];
const SALE_STATUSES = [
    'Following',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost',
];
function SaleFormModal({ isOpen, onClose, saleToEdit, defaultCustomerId }) {
    const { customers, addSale, updateSale } = useCRM();
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [service, setService] = useState('');
    const [industry, setIndustry] = useState(INDUSTRIES[0]);
    const [proposalShared, setProposalShared] = useState(true);
    const [proposalValue, setProposalValue] = useState(50000);
    const [status, setStatus] = useState('Following');
    const [remarks, setRemarks] = useState('');
    const [saleDate, setSaleDate] = useState(() => new Date().toISOString().split('T')[0]);

    // Follow-up reminder fields
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderDate, setReminderDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    });
    const [reminderTime, setReminderTime] = useState('10:30');
    const [reminderNote, setReminderNote] = useState('');

    const [errors, setErrors] = useState({});
    // Auto-fill phone & industry when customer is selected
    const handleCustomerChange = (selectedCustId) => {
        setCustomerId(selectedCustId);
        const found = customers.find((c) => c.id === selectedCustId);
        if (found) {
            setCustomerName(found.companyName || '');
            setContactNumber(found.phone || '');
            setIndustry(found.industry || INDUSTRIES[0]);
        }
    };
    useEffect(() => {
        if (saleToEdit) {
            setCustomerId(saleToEdit.customerId || '');
            setCustomerName(saleToEdit.customerName || '');
            setContactNumber(saleToEdit.contactNumber || '');
            setService(saleToEdit.service || '');
            setIndustry(saleToEdit.industry || INDUSTRIES[0]);
            setProposalShared(saleToEdit.proposalShared ?? true);
            setProposalValue(saleToEdit.proposalValue ?? 50000);
            setStatus(saleToEdit.status || 'Following');
            setRemarks(saleToEdit.remarks || '');
            setSaleDate(saleToEdit.saleDate || new Date().toISOString().split('T')[0]);

            if (saleToEdit.reminder?.enabled) {
                setReminderEnabled(true);
                setReminderDate(saleToEdit.reminder.date || new Date().toISOString().split('T')[0]);
                setReminderTime(saleToEdit.reminder.time || '10:30');
                setReminderNote(saleToEdit.reminder.note || '');
            } else {
                setReminderEnabled(false);
            }
        } else {
            if (defaultCustomerId) {
                handleCustomerChange(defaultCustomerId);
            } else if (customers.length > 0) {
                handleCustomerChange(customers[0].id);
            } else {
                setCustomerId('');
                setCustomerName('');
                setContactNumber('');
                setIndustry(INDUSTRIES[0]);
            }
            setService('');
            setProposalShared(true);
            setProposalValue(50000);
            setStatus('Following');
            setRemarks('');
            setSaleDate(new Date().toISOString().split('T')[0]);
            setReminderEnabled(false);
            setReminderNote('');
        }
        setErrors({});
    }, [saleToEdit, defaultCustomerId, isOpen, customers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!customerName.trim()) newErrors.customerName = 'Customer/Company name is required';
        if (!contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
        if (!service.trim()) newErrors.service = 'Service provided is required';
        if (!saleDate) newErrors.saleDate = 'Sale date is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            customerId: customerId || `cust_custom_${Date.now()}`,
            customerName: customerName.trim(),
            contactNumber: contactNumber.trim(),
            service: service.trim(),
            industry,
            proposalShared,
            proposalValue: Number(proposalValue) || 0,
            status,
            remarks: remarks.trim(),
            saleDate,
            reminder: reminderEnabled
                ? {
                    enabled: true,
                    date: reminderDate,
                    time: reminderTime,
                    note: reminderNote.trim() || `Follow up with ${customerName}`,
                    completed: false,
                }
                : undefined,
        };

        if (saleToEdit) {
            updateSale(saleToEdit.id, payload);
        } else {
            addSale(payload);
        }

        onClose();
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={saleToEdit ? 'Edit Sale' : 'Create Sale'}
            subtitle="Track sales opportunities, proposal values, and follow-ups"
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit} className="sfm-form">
                {/* Customer & Primary Info Grid */}
                <div className="sfm-grid-2">
                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-customer-select">
                            Customer / Company Name <span className="sfm-required">*</span>
                        </label>
                        {customers.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <select
                                    id="sale-customer-select"
                                    value={customerId}
                                    onChange={(e) => handleCustomerChange(e.target.value)}
                                    className="sfm-select"
                                >
                                    <option value="">Select Existing or Custom...</option>
                                    {customers.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.companyName} ({c.contactPerson})
                                        </option>
                                    ))}
                                </select>
                                {!customerId && (
                                    <input
                                        type="text"
                                        placeholder="Or type new company name"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        className="sfm-input"
                                    />
                                )}
                            </div>
                        ) : (
                            <input
                                id="sale-customer-name-input"
                                type="text"
                                required
                                placeholder="e.g. ABC Technologies"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="sfm-input"
                            />
                        )}
                        {errors.customerName && (
                            <p className="sfm-error-text">{errors.customerName}</p>
                        )}
                    </div>

                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-contact-number-input">
                            Contact Number <span className="sfm-required">*</span>
                        </label>
                        <input
                            id="sale-contact-number-input"
                            type="text"
                            required
                            placeholder="+91 98765 43210"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            className="sfm-input"
                        />
                        {errors.contactNumber && (
                            <p className="sfm-error-text">{errors.contactNumber}</p>
                        )}
                    </div>

                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-service-input">
                            Service Provided <span className="sfm-required">*</span>
                        </label>
                        <input
                            id="sale-service-input"
                            type="text"
                            required
                            placeholder="e.g. Website Development, SEO, ERP"
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            className="sfm-input"
                        />
                        {errors.service && (
                            <p className="sfm-error-text">{errors.service}</p>
                        )}
                    </div>

                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-industry-select">
                            Industry <span className="sfm-required">*</span>
                        </label>
                        <select
                            id="sale-industry-select"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            className="sfm-select"
                        >
                            {INDUSTRIES.map((ind) => (
                                <option key={ind} value={ind}>
                                    {ind}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Proposal & Status Grid */}
                <div className="sfm-grid-3" style={{ paddingTop: '4px' }}>
                    <div className="sfm-field">
                        <label className="sfm-label">Proposal Shared?</label>
                        <div className="sfm-radio-group">
                            <label className="sfm-radio-label">
                                <input
                                    type="radio"
                                    name="proposalShared"
                                    checked={proposalShared === true}
                                    onChange={() => setProposalShared(true)}
                                    className="sfm-radio-input"
                                />
                                <span>Yes</span>
                            </label>
                            <label className="sfm-radio-label">
                                <input
                                    type="radio"
                                    name="proposalShared"
                                    checked={proposalShared === false}
                                    onChange={() => setProposalShared(false)}
                                    className="sfm-radio-input"
                                />
                                <span>No</span>
                            </label>
                        </div>
                    </div>

                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-proposal-value-input">
                            Proposal Value (₹)
                        </label>
                        <input
                            id="sale-proposal-value-input"
                            type="number"
                            min="0"
                            step="1000"
                            placeholder="e.g. 80000"
                            value={proposalValue}
                            onChange={(e) =>
                                setProposalValue(e.target.value === '' ? '' : Number(e.target.value))
                            }
                            className="sfm-input"
                        />
                    </div>

                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-status-select">
                            Status <span className="sfm-required">*</span>
                        </label>
                        <select
                            id="sale-status-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="sfm-select"
                        >
                            {SALE_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                    {st}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date & Remarks Grid */}
                <div className="sfm-grid-3">
                    <div className="sfm-field">
                        <label className="sfm-label" htmlFor="sale-date-input">
                            Sale Date <span className="sfm-required">*</span>
                        </label>
                        <input
                            id="sale-date-input"
                            type="date"
                            required
                            value={saleDate}
                            onChange={(e) => setSaleDate(e.target.value)}
                            className="sfm-input"
                        />
                        {errors.saleDate && (
                            <p className="sfm-error-text">{errors.saleDate}</p>
                        )}
                    </div>

                    <div className="sfm-field sfm-col-span-2">
                        <label className="sfm-label" htmlFor="sale-remarks-input">
                            Remarks
                        </label>
                        <input
                            id="sale-remarks-input"
                            type="text"
                            placeholder="e.g. Discussed pricing milestones; customer interested in 1-year contract"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="sfm-input"
                        />
                    </div>
                </div>

                {/* Follow-up Reminder Box */}
                <div className="sfm-reminder-card">
                    <div className="sfm-reminder-header">
                        <label className="sfm-checkbox-label">
                            <input
                                id="sale-set-reminder-checkbox"
                                type="checkbox"
                                checked={reminderEnabled}
                                onChange={(e) => setReminderEnabled(e.target.checked)}
                                className="sfm-checkbox-input"
                            />
                            <span className="sfm-reminder-title">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#7c3aed"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                </svg>
                                Follow-up Reminder
                            </span>
                        </label>
                        {reminderEnabled && (
                            <span className="sfm-reminder-pill">Alert Active</span>
                        )}
                    </div>

                    {reminderEnabled && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' }}>
                            <div className="sfm-grid-2">
                                <div className="sfm-field">
                                    <label className="sfm-icon-label" htmlFor="sale-reminder-date-input">
                                        <svg
                                            className="sfm-icon"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        Reminder Date
                                    </label>
                                    <input
                                        id="sale-reminder-date-input"
                                        type="date"
                                        value={reminderDate}
                                        onChange={(e) => setReminderDate(e.target.value)}
                                        className="sfm-input"
                                    />
                                </div>

                                <div className="sfm-field">
                                    <label className="sfm-icon-label" htmlFor="sale-reminder-time-input">
                                        <svg
                                            className="sfm-icon"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        Reminder Time
                                    </label>
                                    <input
                                        id="sale-reminder-time-input"
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                        className="sfm-input"
                                    />
                                </div>
                            </div>

                            <div className="sfm-field">
                                <label className="sfm-label" htmlFor="sale-reminder-note-input">
                                    Reminder Note
                                </label>
                                <input
                                    id="sale-reminder-note-input"
                                    type="text"
                                    placeholder="e.g. Call customer regarding proposal and scope review"
                                    value={reminderNote}
                                    onChange={(e) => setReminderNote(e.target.value)}
                                    className="sfm-input"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="sfm-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="sfm-btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="save-sale-submit-btn"
                        className="sfm-btn-submit"
                    >
                        {saleToEdit ? 'Update Sale' : 'Save Sale'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default SaleFormModal
