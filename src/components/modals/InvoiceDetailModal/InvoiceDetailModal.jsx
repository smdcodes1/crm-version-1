import React, { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { formatDate,formatINR } from '../../../utils/Formatters';
import { Modal } from '../../Modal/Modal';
import { StatusBadge } from '../../StatusBadge/StatusBadge';
import "./InvoiceDetailModal.css";
function InvoiceDetailModal({isOpen,onClose,invoice}) {
    const {updateInvoice}= useCRM();
    const [status, setStatus]= useState(invoice?.paymentStatus);
    if (!invoice) return null;
    const handlePrint = () => {
        window.print();
    };
    const handlePaymentStatusChange = (newStatus) => {
        const paidAmount =
        newStatus === 'Paid'
            ? invoice.total
            : newStatus === 'Unpaid'
            ? 0
            : invoice.paidAmount || Math.round(invoice.total / 2);

        updateInvoice(invoice.id, {
            paymentStatus: newStatus,
            paidAmount,
        });
        setStatus(newStatus);
    };
  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Tax Invoice ${invoice.invoiceNumber}`}
        subtitle={`Generated from Quotation ${invoice.quotationNumber}`}
        maxWidth="3xl"
    >
        <div className="idm-space-y">
          {/* Top Control Bar */}
          <div className="idm-control-bar">
            <div className="idm-status-controls">
              <span>Payment Status:</span>
              <StatusBadge status={invoice.paymentStatus} size="sm" />
              <select
                value={status}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                className="idm-status-select"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Partly Paid">Partly Paid</option>
                <option value="Paid">Paid (Full)</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={handlePrint}
                className="idm-btn-action"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect width="12" height="8" x="6" y="14"/>
                </svg>
                Print / Save PDF
              </button>
            </div>
          </div>

          {/* Printable Tax Invoice Document */}
          <div id="invoice-document" className="idm-document">
            {/* Header */}
            <div className="idm-doc-header">
              <div>
                <div className="idm-brand">
                  <div className="idm-logo">C</div>
                  <h1 className="idm-company-name">CRM SERVICES PVT LTD</h1>
                </div>
                <p className="idm-subtext">GSTIN: 29AAAAA0000A1Z5 • Technology Solutions</p>
                <p className="idm-subtext">Kerala, India • contact@crmportal.com</p>
              </div>

              <div className="idm-inv-meta">
                <div className="idm-inv-num">{invoice.invoiceNumber}</div>
                <div className="idm-inv-ref">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <line x1="10" y1="9" x2="8" y2="9"/>
                  </svg>
                  Ref Quotation:{' '}
                  <span style={{ fontWeight: 600, color: '#0f172a', fontFamily: 'monospace' }}>
                    {invoice.quotationNumber}
                  </span>
                </div>
                <div className="idm-inv-date">
                  Invoice Date:{' '}
                  <span style={{ fontWeight: 600, color: '#1e293b' }}>
                    {formatDate(invoice.invoiceDate)}
                  </span>
                </div>
                <div className="idm-inv-date">
                  Due Date:{' '}
                  <span className="idm-due-date">{formatDate(invoice.dueDate)}</span>
                </div>
              </div>
            </div>

            {/* Billed To */}
            <div className="idm-billed-to">
              <span className="idm-label-caps">Billed To:</span>
              <div className="idm-client-name">{invoice.customerName}</div>
              <div className="idm-subtext">Account ID: {invoice.customerId}</div>
            </div>

            {/* Items Table */}
            <div className="idm-table-container">
              <table className="idm-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>#</th>
                    <th>Item / Deliverable</th>
                    <th className="idm-cell-hide-sm">Description</th>
                    <th className="idm-col-center">Qty</th>
                    <th className="idm-col-right">Unit Price</th>
                    <th className="idm-col-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.items || []).map((item, idx) => (
                    <tr key={item.id || idx}>
                      <td className="idm-col-num">{idx + 1}</td>
                      <td className="idm-col-title">{item.service}</td>
                      <td className="idm-col-desc idm-cell-hide-sm">{item.description || '—'}</td>
                      <td className="idm-col-center" style={{ color: '#334155' }}>{item.quantity}</td>
                      <td className="idm-col-right" style={{ color: '#334155' }}>{formatINR(item.unitPrice)}</td>
                      <td className="idm-col-right" style={{ fontWeight: 700, color: '#0f172a' }}>{formatINR(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Totals */}
            <div className="idm-bottom-section">
              <div className="idm-payment-info">
                <div style={{ fontWeight: 600, color: '#0f172a' }}>Payment Information:</div>
                <div className="idm-bank-details">
                  <div>Bank: HDFC Bank Limited</div>
                  <div>A/C Name: CRM Services Pvt Ltd</div>
                  <div>IFSC: HDFC0001234 • A/C No: 50200012345678</div>
                  <div>UPI: crmservices@okhdfcbank</div>
                </div>
                {invoice.notes && (
                  <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b' }}>
                    {invoice.notes}
                  </p>
                )}
              </div>

              <div className="idm-totals-card">
                <div className="idm-total-row">
                  <span>Subtotal:</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(invoice.subtotal)}</span>
                </div>
                <div className="idm-total-row">
                  <span>GST ({invoice.taxPercentage || 18}%):</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatINR(invoice.tax)}</span>
                </div>
                <div className="idm-total-row idm-due-total">
                  <span>Total Due:</span>
                  <span style={{ color: '#6d28d9' }}>{formatINR(invoice.total)}</span>
                </div>
                {invoice.paidAmount !== undefined && invoice.paidAmount > 0 && (
                  <div className="idm-total-row idm-paid-total">
                    <span>Paid Amount:</span>
                    <span>{formatINR(invoice.paidAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
  );
}

export default InvoiceDetailModal
