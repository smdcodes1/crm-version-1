import React, { useState,useEffect } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { formatDate,formatINR } from '../../../utils/Formatters';
import { StatusBadge } from '../../StatusBadge/StatusBadge';
import { Modal } from '../../Modal/Modal';
import "./GenerateInvoiceModal.css";
function GenerateInvoiceModal({isOpen,onClose,preselectedQuotationId}) {
    const {quotations,setActiveTab,generateInvoiceFromQuotation}= useCRM();
    const [selectedQuotationId, setSelectedQuotationId] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [dueDate, setDueDate] = useState(() => {
                                    const d = new Date();
                                    d.setDate(d.getDate() + 15);
                                    return d.toISOString().split('T')[0];
                                    });
  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (preselectedQuotationId) {
      setSelectedQuotationId(preselectedQuotationId);
    } else if (quotations.length > 0) {
      const accepted = quotations.find((q) => q.status === 'Approved');
      setSelectedQuotationId(accepted ? accepted.id : quotations[0].id);
    } else {
      setSelectedQuotationId('');
    }

    setInvoiceDate(new Date().toISOString().split('T')[0]);
    const d = new Date();
    d.setDate(d.getDate() + 15);
    setDueDate(d.toISOString().split('T')[0]);
  }, [preselectedQuotationId, quotations, isOpen]);

  const selectedQuotation = quotations.find((q) => q.id === selectedQuotationId);
  const filteredQuotations = quotations.filter(
    (q) =>
      (q.quotationNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = (e) => {
        e.preventDefault();
        if (!selectedQuotation) return;

        generateInvoiceFromQuotation(
        selectedQuotation.id,
        invoiceDate,
        dueDate,
        notes.trim() || selectedQuotation.notes || ''
        );

        setActiveTab('invoices');
        onClose();
  };

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Generate Invoice"
        subtitle="Invoices must be generated directly from an existing Quotation"
        maxWidth="3xl"
    >
        {quotations.length === 0 ? (
          <div className="gim-empty-state">
            <svg
              className="gim-empty-icon"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
            <h4 className="gim-empty-title">No Quotations Found</h4>
            <p className="gim-empty-desc">
              Per the CRM business rule, an invoice cannot exist without a valid quotation. Please create a quotation first.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                setActiveTab('quotations');
              }}
              className="gim-btn-primary"
            >
              Go to Quotations
            </button>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="gim-space-y">
            {/* Step 1: Select Quotation */}
            <div>
              <label className="gim-step-label">
                1. Select Quotation Number
              </label>

              {/* Quick Search */}
              <div className="gim-search-box">
                <svg
                  className="gim-search-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search quotation number or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="gim-search-input"
                />
              </div>

              {/* Quotation Picker Grid */}
              <div className="gim-picker-grid">
                {filteredQuotations.map((q) => {
                  const isSelected = q.id === selectedQuotationId;
                  return (
                    <div
                      key={q.id}
                      id={`quote-select-card-${q.quotationNumber}`}
                      onClick={() => setSelectedQuotationId(q.id)}
                      className={`gim-quote-card ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="gim-card-top">
                        <span className="gim-quote-num">{q.quotationNumber}</span>
                        <StatusBadge status={q.status} size="sm" />
                      </div>
                      <div className="gim-card-name">{q.customerName}</div>
                      <div className="gim-card-bottom">
                        <span>{formatDate(q.quotationDate)}</span>
                        <span className="gim-card-total">{formatINR(q.total)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Inherited Information Preview & Invoice Dates */}
            {selectedQuotation && (
              <div className='gim-quotation-details'>
                <label className="gim-step-label" style={{ marginBottom: 0 }}>
                  2. Inherited Quotation Details
                </label>

                <div className="gim-inherited-box">
                  <div className="gim-inherited-header">
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Quotation Number: </span>
                      <span style={{ fontWeight: 700, color: '#7c3aed', fontFamily: 'monospace' }}>
                        {selectedQuotation.quotationNumber}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem' }}>Company: </span>
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedQuotation.customerName}</span>
                    </div>
                  </div>

                  {/* Inherited Line Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Quotation Items:</div>
                    <div className="gim-items-list">
                      {(selectedQuotation.items || []).map((item) => (
                        <div key={item.id} className="gim-item-row">
                          <div>
                            <div style={{ fontWeight: 500, color: '#0f172a' }}>{item.service}</div>
                            {item.description && (
                              <div style={{ fontSize: '0.75rem', color: '#64748b', maxWidth: '340px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item.description}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginRight: '12px' }}>Qty: {item.quantity}</span>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(item.total)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtotal, Tax, Total */}
                  <div className="gim-totals-summary">
                    <div className="gim-total-line">
                      <span>Subtotal:</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>
                        {formatINR(selectedQuotation.subtotal)}
                      </span>
                    </div>
                    {selectedQuotation.discount > 0 && (
                      <div className="gim-total-line" style={{ color: '#059669' }}>
                        <span>Discount:</span>
                        <span>-{formatINR(selectedQuotation.discount)}</span>
                      </div>
                    )}
                    <div className="gim-total-line">
                      <span>Tax ({selectedQuotation.taxPercentage || 18}% GST):</span>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>
                        {formatINR(selectedQuotation.tax)}
                      </span>
                    </div>
                    <div className="gim-total-line gim-final-total">
                      <span>Invoice Total:</span>
                      <span style={{ color: '#7c3aed' }}>{formatINR(selectedQuotation.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Date & Due Date Inputs */}
                <div className="gim-inputs-grid">
                  <div className="gim-field">
                    <label className="gim-label" htmlFor="invoice-date-input">
                      Invoice Date <span className="gim-required">*</span>
                    </label>
                    <input
                      id="invoice-date-input"
                      type="date"
                      required
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="gim-text-input"
                    />
                  </div>

                  <div className="gim-field">
                    <label className="gim-label" htmlFor="invoice-due-date-input">
                      Due Date <span className="gim-required">*</span>
                    </label>
                    <input
                      id="invoice-due-date-input"
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="gim-text-input"
                    />
                  </div>
                </div>

                <div className="gim-field">
                  <label className="gim-label" htmlFor="invoice-notes-input">
                    Invoice Notes & Payment Instructions
                  </label>
                  <input
                    id="invoice-notes-input"
                    type="text"
                    placeholder="Bank transfer details, UPI ID, or terms..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="gim-text-input"
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="gim-actions">
              <button
                type="button"
                onClick={onClose}
                className="gim-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="confirm-generate-invoice-btn"
                disabled={!selectedQuotation}
                className="gim-btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.875rem' }}
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
                  <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                  <path d="M16 8h-8" />
                  <path d="M16 12h-8" />
                  <path d="M13 16h-5" />
                </svg>
                Generate Invoice
              </button>
            </div>
          </form>
        )}
    </Modal>
  );
}

export default GenerateInvoiceModal
