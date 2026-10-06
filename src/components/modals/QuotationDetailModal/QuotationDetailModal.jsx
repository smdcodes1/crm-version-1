import React, { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { formatDate,formatINR } from '../../../utils/Formatters';
import { StatusBadge } from '../../StatusBadge/StatusBadge';
import { Modal } from '../../Modal/Modal';
import "./QuotationDetailModal.css";

function QuotationDetailModal({isOpen,onClose,quotation,onGenerateInvoice = () => {}}) {
    const {updateQuotation,invoices}= useCRM();
    const [status, setStatus]= useState(quotation?.status);
   if (!quotation) return null;

  const existingInvoice = invoices.find((inv) => inv.quotationId === quotation.id);

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = (newStatus) => {
    updateQuotation(quotation.id, { status: newStatus });
    setStatus(newStatus);

  };
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Quotation ${quotation.quotationNumber}`}
        subtitle={`Issued to ${quotation.customerName}`}
        maxWidth="3xl"
      >
        <div className="qdm-space-y">
          {/* Actions Bar */}
          <div className="qdm-action-bar">
            <div className="qdm-status-controls">
              <span>Status:</span>
              <StatusBadge status={quotation.status} size="sm" />
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="qdm-status-select"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div className="qdm-action-buttons">
              <button
                type="button"
                onClick={handlePrint}
                className="qdm-btn-outline"
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
                  <polyline points="6 9 6 2 18 2 18 9" />
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                  <rect width="12" height="8" x="6" y="14" />
                </svg>
                Print / Save PDF
              </button>

              {existingInvoice ? (
                <span className="qdm-invoiced-pill">
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
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  Invoiced ({existingInvoice.invoiceNumber})
                </span>
              ) : (
                <button
                  type="button"
                  id="modal-generate-invoice-btn"
                  onClick={() => {
                    onClose();
                    onGenerateInvoice(quotation.id);
                  }}
                  className="qdm-btn-primary"
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
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                    <path d="M16 8h-8" />
                    <path d="M16 12h-8" />
                    <path d="M13 16h-5" />
                  </svg>
                  Generate Invoice
                </button>
              )}
            </div>
          </div>

          {/* Printable Quotation Document */}
          <div id="quotation-document" className="qdm-document">
            {/* Header */}
            <div className="qdm-doc-header">
              <div>
                <div className="qdm-brand">
                  <div className="qdm-logo">C</div>
                  <h1 className="qdm-company-title">CRM SERVICES</h1>
                </div>
                <p className="qdm-subtext">Digital Solutions & Software Engineering</p>
                <p className="qdm-subtext">Bangalore, India • gst@crmportal.example</p>
              </div>

              <div className="qdm-quote-meta">
                <div className="qdm-quote-num">{quotation.quotationNumber}</div>
                <div className="qdm-meta-date">
                  Date:{' '}
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {formatDate(quotation.quotationDate)}
                  </span>
                </div>
                <div className="qdm-meta-date">
                  Valid Until:{' '}
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {formatDate(quotation.validUntil)}
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="qdm-recipient-box">
              <span className="qdm-label-caps">Quotation For:</span>
              <div className="qdm-client-title">{quotation.customerName}</div>
              <div className="qdm-subtext">Client Account Reference: {quotation.customerId}</div>
            </div>

            {/* Line Items Table */}
            <div className="qdm-table-container">
              <table className="qdm-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Service</th>
                    <th className="qdm-cell-hide-sm">Description</th>
                    <th className="qdm-col-center">Qty</th>
                    <th className="qdm-col-right">Unit Price</th>
                    <th className="qdm-col-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(quotation.items || []).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="qdm-col-num">{idx + 1}</td>
                      <td className="qdm-col-service">{item.service}</td>
                      <td className="qdm-col-desc qdm-cell-hide-sm">{item.description || '—'}</td>
                      <td className="qdm-col-center" style={{ color: '#334155' }}>{item.quantity}</td>
                      <td className="qdm-col-right" style={{ color: '#334155' }}>{formatINR(item.unitPrice)}</td>
                      <td className="qdm-col-right" style={{ fontWeight: 700, color: '#0f172a' }}>{formatINR(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Breakdown */}
            <div className="qdm-bottom-section">
              <div className="qdm-terms-card">
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Terms & Conditions:</div>
                <p style={{ margin: 0, color: '#64748b', lineHeight: 1.45 }}>
                  {quotation.notes || 'Payment terms: 30 days from invoice issuance. Taxes applicable as per GST regulations.'}
                </p>
              </div>

              <div className="qdm-totals-card">
                <div className="qdm-total-row">
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(quotation.subtotal)}</span>
                </div>
                {quotation.discount > 0 && (
                  <div className="qdm-total-row" style={{ color: '#059669' }}>
                    <span>Discount:</span>
                    <span>-{formatINR(quotation.discount)}</span>
                  </div>
                )}
                <div className="qdm-total-row">
                  <span>GST / Tax ({quotation.taxPercentage || 18}%):</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(quotation.tax)}</span>
                </div>
                <div className="qdm-total-row qdm-grand-total">
                  <span>Grand Total:</span>
                  <span style={{ color: '#6d28d9' }}>{formatINR(quotation.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
}

export default QuotationDetailModal
