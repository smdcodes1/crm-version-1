import React, { useState } from 'react'
import { useCRM } from '../../../context/CRMContext';
import { Modal } from '../../Modal/Modal';
import { getRelativeDay, formatDate, formatINR } from '../../../utils/Formatters';
import { StatusBadge } from '../../StatusBadge/StatusBadge';
import "./SaleDetailModal.css";
import CreateQuotationModal from '../../forms/CreateQuotationModal/CreateQuotationModal';

const IconCalendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);
const IconBell = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
);
const IconCheckCircle = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);
const IconBriefcase = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
);
const IconTag = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
);
const IconBuilding = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
);
const IconPhone = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const IconMessageSquare = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);
const IconMail = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const IconFileText = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
);
const IconEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
function SaleDetailModal({ isOpen, onClose, sale, onEdit }) {
    const { customers, updateSale, setIsCreateQuotationOpen, openCreateQuotationModal, sales } = useCRM();
    const [status, setStatus]= useState('');
    if (!sale) return null;

    // Find linked customer details if available 
    const linkedCustomer = customers.find(
        (c) => c.id === sale.customerId || c.companyName?.toLowerCase() === sale.customerName?.toLowerCase()
    );
    const phoneToCall = sale.contactNumber || linkedCustomer?.phone;
    const whatsappNum = linkedCustomer?.whatsapp || sale.contactNumber;
    const cleanPhone = (phoneToCall || '').replace(/[^\d+]/g, '');
    const cleanWhatsapp = (whatsappNum || '').replace(/[^\d]/g, '');
    const currentSale = sales.find((s) => s.id === sale?.id) || sale;
    const handleStatusChange = (newStatus) => {
        // setStatus(newStatus);
        updateSale(sale.id, { status: newStatus });
    };
    const handleToggleProposalShared = () => {
        updateSale(currentSale.id, { proposalShared: !currentSale.proposalShared });
    };
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={sale.customerName}
                subtitle={`Opportunity Details • ${sale.service}`}
                maxWidth="2xl"
            >
                <div className="sale-modal-space">
                    {/* Top Header Card */}
                    <div className="sale-top-banner">
                        <div>
                            <div className="sale-stage-row">
                                <span className="sale-text-xs-gray">Stage:</span>
                                <StatusBadge status={currentSale.status} />
                                <select
                                    value={currentSale.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="sale-status-dropdown"
                                >
                                    <option value="Following">Following</option>
                                    <option value="Proposal Sent">Proposal Sent</option>
                                    <option value="Negotiation">Negotiation</option>
                                    <option value="Won">Won</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>
                            <div className="sale-created-date">
                                <IconCalendar />
                                <span>Deal Created on {formatDate(sale.saleDate)}</span>
                            </div>
                        </div>

                        <div className="sale-value-container">
                            <span className="sale-value-label">Proposal Value</span>
                            <div className="sale-value-number">
                                {formatINR(sale.proposalValue)}
                            </div>
                        </div>
                    </div>

                    {/* Reminder Banner (if set) */}
                    {sale.reminder?.enabled && (
                        <div className="sale-reminder-card">
                            <div className="sale-reminder-icon-wrap">
                                <IconBell />
                            </div>
                            <div className="sale-reminder-content">
                                <div className="sale-reminder-title-row">
                                    <span className="sale-reminder-heading">Scheduled Follow-up Reminder</span>
                                    <span className="sale-reminder-pill">
                                        {getRelativeDay(sale.reminder.date)} • {sale.reminder.time}
                                    </span>
                                    {sale.reminder.completed && (
                                        <span className="sale-reminder-completed">
                                            <IconCheckCircle /> Completed
                                        </span>
                                    )}
                                </div>
                                {sale.reminder.note && (
                                    <p className="sale-reminder-note">{sale.reminder.note}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Key Deal Details Grid */}
                    <div className="sale-grid-2">
                        <div className="sale-card">
                            <div className="sale-card-heading">
                                <IconBriefcase /> Service & Solution
                            </div>
                            <div className="sale-service-title">{sale.service}</div>
                            <div className="sale-industry-row">
                                <IconTag />
                                <span>Industry: {sale.industry || 'General'}</span>
                            </div>
                        </div>

                        <div className="sale-card">
                            <div className="sale-card-heading">
                                <IconBuilding /> Proposal Delivery
                            </div>
                            <div className="sale-proposal-row">
                                <span className="sale-service-title">
                                    {currentSale.proposalShared ? 'Proposal Shared' : 'Proposal Pending'}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleToggleProposalShared}
                                    className={`sale-proposal-toggle-btn ${currentSale.proposalShared ? 'shared' : 'pending'}`}
                                >
                                    {currentSale.proposalShared ? 'Mark as Not Sent' : 'Mark as Sent'}
                                </button>
                            </div>
                            <div className="sale-text-xs-gray">
                                {currentSale.proposalShared
                                    ? 'Client has received the formal proposal or quote.'
                                    : 'Initial pitch or scope in progress.'}
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Card */}
                    <div className="sale-card">
                        <div className="sale-card-heading">
                            <IconPhone /> Client Contact Information
                        </div>
                        <div className="sale-contact-flex">
                            <div>
                                <div className="sale-service-title">{sale.customerName}</div>
                                {linkedCustomer?.contactPerson && (
                                    <div className="sale-text-sub">Contact Person: {linkedCustomer.contactPerson}</div>
                                )}
                                {phoneToCall && (
                                    <div className="sale-phone-mono">{phoneToCall}</div>
                                )}
                            </div>

                            <div className="sale-action-buttons-group">
                                {cleanPhone && (
                                    <a href={`tel:${cleanPhone}`} className="sale-btn-action">
                                        <IconPhone /> Call
                                    </a>
                                )}
                                {cleanWhatsapp && (
                                    <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noopener noreferrer" className="sale-btn-whatsapp">
                                        <IconMessageSquare /> WhatsApp
                                    </a>
                                )}
                                {linkedCustomer?.email && (
                                    <a href={`mailto:${linkedCustomer.email}`} className="sale-btn-action">
                                        <IconMail /> Email
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Remarks / Notes */}
                    <div className="sale-card">
                        <div className="sale-card-heading">
                            <IconMessageSquare /> Remarks & Notes
                        </div>
                        {sale.remarks ? (
                            <p className="sale-remarks-text">
                                {sale.remarks}
                            </p>
                        ) : (
                            <p className="sale-remarks-empty">No remarks recorded for this sale.</p>
                        )}
                    </div>

                    {/* Quick Action: Convert / Create Quotation */}
                    <div className="sale-quotation-banner">
                        <div className="sale-quotation-left">
                            <IconFileText />
                            <span>Ready to send a detailed quotation?</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                setIsCreateQuotationOpen(true);
                            }}
                            className="sale-quotation-link"
                        >
                            Create Quotation →
                        </button>
                    </div>

                    {/* Footer Buttons */}
                    <div className="sale-modal-footer">
                        <div className="sale-updated-timestamp">
                            Updated {formatDate(sale.updatedAt || sale.createdAt)}
                        </div>
                        <div className="sale-footer-actions">
                            <button
                                type="button"
                                onClick={onClose}
                                className="sale-btn-close"
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                onClick={() => onEdit(sale)}
                                className="sale-btn-edit"
                            >
                                <IconEdit /> Edit Deal
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            
        </>
    );
}

export default SaleDetailModal
