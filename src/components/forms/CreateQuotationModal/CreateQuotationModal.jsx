import React, { useState,useEffect } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { formatINR } from '../../../utils/Formatters';
import { Modal } from '../../Modal/Modal';
import "./CreateQuotationModal.css";

function CreateQuotationModal({ isOpen, onClose, quotationToEdit, defaultCustomerId }) {
    const { customers, quotations, getNextQuotationNumber, addQuotation, updateQuotation } = useCRM();
    const [customerId, setCustomerId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [quotationNumber, setQuotationNumber] = useState('');
    const [quotationDate, setQuotationDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [validUntil, setValidUntil] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().split('T')[0];
    });

    const [status, setStatus] = useState('Draft');
    const [notes, setNotes] = useState('Standard 30-day payment term upon project milestone completion.');
    const [discount, setDiscount] = useState(0);
    const [taxPercentage, setTaxPercentage] = useState(18);

    const [items, setItems] = useState([
        {
            id: 'qi-new-1',
            service: 'Website Development',
            description: 'Custom programming',
            quantity: 1,
            unitPrice: 50000,
            total: 50000,
        },
    ]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (quotationToEdit) {
            setCustomerId(quotationToEdit.customerId || '');
            setCustomerName(quotationToEdit.customerName || '');
            setQuotationNumber(quotationToEdit.quotationNumber || '');
            setQuotationDate(quotationToEdit.quotationDate || new Date().toISOString().split('T')[0]);
            setValidUntil(quotationToEdit.validUntil || '');
            setStatus(quotationToEdit.status || 'Draft');
            setNotes(quotationToEdit.notes || '');
            setDiscount(quotationToEdit.discount ?? 0);
            setTaxPercentage(quotationToEdit.taxPercentage ?? 18);
            setItems(quotationToEdit.items && quotationToEdit.items.length > 0 ? quotationToEdit.items : [
                {
                    id: `qi-${Date.now()}`,
                    service: '',
                    description: '',
                    quantity: 1,
                    unitPrice: 0,
                    total: 0,
                },
            ]);
        } else {
            setQuotationNumber(getNextQuotationNumber());
            setQuotationDate(new Date().toISOString().split('T')[0]);
            const d = new Date();
            d.setDate(d.getDate() + 30);
            setValidUntil(d.toISOString().split('T')[0]);
            setStatus('Sent');
            setDiscount(0);
            setTaxPercentage(18);
            setNotes('Standard 30-day payment term upon invoice issuance.');

            if (defaultCustomerId) {
                const found = customers.find((c) => c.id === defaultCustomerId);
                if (found) {
                    setCustomerId(found.id);
                    setCustomerName(found.companyName);
                }
            } else if (customers.length > 0) {
                setCustomerId(customers[0].id);
                setCustomerName(customers[0].companyName);
            } else {
                setCustomerId('');
                setCustomerName('');
            }

            setItems([
                {
                    id: `qi-${Date.now()}`,
                    service: 'Website & App Development',
                    description: 'Full stack development',
                    quantity: 1,
                    unitPrice: 60000,
                    total: 60000,
                },
            ]);
        }
        setErrors({});
    }, [quotationToEdit, defaultCustomerId, isOpen, customers, quotations]);

    const handleCustomerChange = (selectedCustId) => {
        setCustomerId(selectedCustId);
        const found = customers.find((c) => c.id === selectedCustId);
        if (found) {
            setCustomerName(found.companyName);
        }
    };

    const handleAddItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: `qi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                service: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                total: 0,
            },
        ]);
    };

    const handleRemoveItem = (id) => {
        if (items.length <= 1) return;
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const handleItemChange = (id, field, value) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    const q = field === 'quantity' ? Number(value) : item.quantity;
                    const p = field === 'unitPrice' ? Number(value) : item.unitPrice;
                    updated.total = (q || 0) * (p || 0);
                }
                return updated;
            })
        );
    };
    // Calculations
    const subtotal = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
    const discountVal = Number(discount) || 0;
    const taxableAmount = Math.max(0, subtotal - discountVal);
    const taxAmount = (taxableAmount * (Number(taxPercentage) || 0)) / 100;
    const grandTotal = taxableAmount + taxAmount;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!customerName.trim()) newErrors.customerName = 'Customer name is required';
        if (!quotationDate) newErrors.quotationDate = 'Quotation date is required';
        if (items.some((item) => !item.service.trim())) {
            newErrors.items = 'All line items must have a service name specified';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const payload = {
            customerId: customerId || `cust_custom_${Date.now()}`,
            customerName: customerName.trim(),
            quotationNumber,
            quotationDate,
            validUntil,
            items,
            subtotal,
            discount: discountVal,
            taxPercentage: Number(taxPercentage) || 0,
            tax: taxAmount,
            total: grandTotal,
            status,
            notes: notes.trim(),
        };

        if (quotationToEdit) {
            updateQuotation(quotationToEdit.id, payload);
        } else {
            addQuotation(payload);
        }

        onClose();
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={quotationToEdit ? `Edit Quotation (${quotationNumber})` : 'Create Quotation'}
            subtitle="Generate professional quotation with automatic numbering"
            maxWidth="3xl"
        >
            <form onSubmit={handleSubmit} className="cqm-form">
                {/* Top Info Grid */}
                <div className="cqm-top-grid">
                    <div className="cqm-field cqm-col-span-2">
                        <label className="cqm-label" htmlFor="quote-customer-select">
                            Customer / Company <span className="cqm-required">*</span>
                        </label>
                        {customers.length > 0 ? (
                            <select
                                id="quote-customer-select"
                                value={customerId}
                                onChange={(e) => handleCustomerChange(e.target.value)}
                                className="cqm-select"
                            >
                                {customers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.companyName} ({c.contactPerson})
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                required
                                placeholder="Company Name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="cqm-input"
                            />
                        )}
                        {errors.customerName && (
                            <p className="cqm-error-text">{errors.customerName}</p>
                        )}
                    </div>

                    <div className="cqm-field">
                        <label className="cqm-label">Quotation No.</label>
                        <input
                            type="text"
                            readOnly
                            value={quotationNumber}
                            className="cqm-input cqm-input-readonly"
                        />
                    </div>

                    <div className="cqm-field">
                        <label className="cqm-label">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="cqm-select"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Expired">Expired</option>
                        
                        </select>

                    </div>

                    <div className="cqm-field">
                        <label className="cqm-label">Quotation Date</label>
                        <input
                            type="date"
                            required
                            value={quotationDate}
                            onChange={(e) => setQuotationDate(e.target.value)}
                            className="cqm-input"
                        />
                    </div>

                    <div className="cqm-field">
                        <label className="cqm-label">Valid Until</label>
                        <input
                            type="date"
                            required
                            value={validUntil}
                            onChange={(e) => setValidUntil(e.target.value)}
                            className="cqm-input"
                        />
                    </div>
                </div>

                {/* Line Items Section */}
                <div>
                    <div className="cqm-section-header">
                        <h4 className="cqm-section-title">Services & Deliverables</h4>
                        <button
                            type="button"
                            onClick={handleAddItem}
                            id="quote-add-item-btn"
                            className="cqm-btn-add"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Service
                        </button>
                    </div>

                    <div className="cqm-table-container">
                        <table className="cqm-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '35%' }}>Service / Item</th>
                                    <th className="cqm-cell-hide-sm" style={{ width: '35%' }}>Description</th>
                                    <th className="cqm-text-center" style={{ width: '8%',minWidth:'60px' }}>Qty</th>
                                    <th className="cqm-text-right" style={{ width: '11%',minWidth:'90px' }}>Price (₹)</th>
                                    <th className="cqm-text-right" style={{ width: '11%' }}>Total (₹)</th>
                                    <th className="cqm-text-center" style={{ width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Website Development"
                                                value={item.service}
                                                onChange={(e) => handleItemChange(item.id, 'service', e.target.value)}
                                                className="cqm-table-input"
                                            />
                                        </td>
                                        <td className="cqm-cell-hide-sm">
                                            <input
                                                type="text"
                                                placeholder="Scope description..."
                                                value={item.description}
                                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                                className="cqm-table-input"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleItemChange(item.id, 'quantity', Math.max(1, Number(e.target.value)))
                                                }
                                                className="cqm-table-input cqm-text-center"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                min="0"
                                                step="500"
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleItemChange(item.id, 'unitPrice', Number(e.target.value))
                                                }
                                                className="cqm-table-input cqm-text-right"
                                            />
                                        </td>
                                        <td className="cqm-text-right" style={{ fontWeight: 600, color: '#0f172a' }}>
                                            {formatINR(item.total)}
                                        </td>
                                        <td className="cqm-text-center">
                                            <button
                                                type="button"
                                                disabled={items.length <= 1}
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="cqm-btn-trash"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {errors.items && <p className="cqm-error-text">{errors.items}</p>}
                </div>

                {/* Totals & Notes Breakdown */}
                <div className="cqm-bottom-grid">
                    <div className="cqm-field">
                        <label className="cqm-label">Notes & Terms</label>
                        <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Payment terms, delivery timelines, guarantees..."
                            className="cqm-textarea"
                        />
                    </div>

                    <div className="cqm-summary-card">
                        <div className="cqm-summary-row">
                            <span>Subtotal:</span>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(subtotal)}</span>
                        </div>

                        <div className="cqm-summary-row">
                            <span>Discount (₹):</span>
                            <input
                                type="number"
                                min="0"
                                value={discount}
                                onChange={(e) =>
                                    setDiscount(e.target.value === '' ? '' : Number(e.target.value))
                                }
                                className="cqm-discount-input"
                            />
                        </div>

                        <div className="cqm-summary-row">
                            <span>GST / Tax ({taxPercentage}%):</span>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(taxAmount)}</span>
                        </div>

                        <div className="cqm-summary-row cqm-grand-total">
                            <span>Total Amount:</span>
                            <span style={{ color: '#7c3aed' }}>{formatINR(grandTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="cqm-actions">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cqm-btn-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        id="save-quotation-submit-btn"
                        className="cqm-btn-submit"
                    >
                        {quotationToEdit ? 'Update Quotation' : 'Save Quotation'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default CreateQuotationModal
