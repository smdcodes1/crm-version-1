import React, { useEffect } from 'react'
import { useCRM } from '../../../context/CRMContext';
import { formatINR,formatDate } from '../../../utils/Formatters';
import { Modal } from '../../Modal/Modal';
import { StatusBadge } from '../../StatusBadge/StatusBadge';
import "./CustomerDetailModal.css";
function CustomerDetailModal({ isOpen, onClose, customer, onEdit = () => { }, }) {
    const { sales, projects, quotations, invoices, openAddSaleModal, openAddProjectModal, setActiveTab } = useCRM();
    if (!customer) return null;
    // Filter linked items
    const customerSales = sales.filter((s) => s.customerId === customer.id);
    const customerProjects = projects.filter((p) => p.customerId === customer.id);
    const customerInvoices = invoices.filter((i) => i.customerId === customer.id);

    const totalProposalValue = customerSales.reduce((sum, s) => sum + (s.proposalValue || 0), 0);
    const totalInvoiced = customerInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);


    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={customer.companyName}
            subtitle={`Customer Profile • ${customer.industry || 'General'}`}
            maxWidth="3xl"
        >
            <div className="cdm-space-y">
                {/* Top Header Card */}
                <div className="cdm-top-card">
                    <div className="cdm-header-left">
                        <div className="cdm-title-row">
                            <h2 className="cdm-company-title">{customer.companyName}</h2>
                            <StatusBadge status={customer.status} size="md" />
                        </div>
                        <p className="cdm-meta-text">
                            Customer since {formatDate(customer.createdAt)}
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                onEdit(customer);
                            }}
                            className="cdm-btn-outline"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            </svg>
                            Edit Details
                        </button>
                    </div>
                </div>

                {/* 2-Column Info Grid */}
                <div className="cdm-info-grid">
                    {/* Contact Information */}
                    <div className="cdm-card">
                        <div className="cdm-card-heading">
                            <svg className="cdm-icon-primary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                            Contact Information
                        </div>
                        <div className="cdm-info-list">
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{customer.contactPerson}</div>
                            <div className="cdm-info-row">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                                <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                            </div>
                            {customer.email && (
                                <div className="cdm-info-row">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    <a href={`mailto:${customer.email}`}>{customer.email}</a>
                                </div>
                            )}
                            {customer.whatsapp && (
                                <div className="cdm-info-row">
                                    <span className="cdm-badge-wa">WA</span>
                                    <span>{customer.whatsapp}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className="cdm-card">
                        <div className="cdm-card-heading">
                            <svg className="cdm-icon-primary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" />
                            </svg>
                            Company Information
                        </div>
                        <div className="cdm-info-list">
                            <div style={{ fontSize: '0.8rem' }}>
                                <span style={{ color: '#94a3b8' }}>Industry: </span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{customer.industry || '—'}</span>
                            </div>
                            {customer.website && (
                                <div className="cdm-info-row">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
                                    </svg>
                                    <a
                                        href={customer.website.startsWith('http') ? customer.website : `https://${customer.website}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ color: '#7c3aed', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                    >
                                        {customer.website}
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                    </a>
                                </div>
                            )}
                            {(customer.city || customer.state || customer.address) && (
                                <div className="cdm-info-row" style={{ alignItems: 'flex-start' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span>{[customer.address, customer.city, customer.state].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                            {customer.notes && (
                                <div className="cdm-notes-box">
                                    {customer.notes}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Financial Summary */}
                <div className="cdm-metrics-grid">
                    <div className="cdm-metric-card cdm-metric-default">
                        <span className="cdm-metric-label">Sales Pipeline</span>
                        <span className="cdm-metric-value">{customerSales.length} Deals</span>
                    </div>
                    <div className="cdm-metric-card cdm-metric-violet">
                        <span className="cdm-metric-label">Proposal Value</span>
                        <span className="cdm-metric-value">{formatINR(totalProposalValue)}</span>
                    </div>
                    <div className="cdm-metric-card cdm-metric-default">
                        <span className="cdm-metric-label">Current Projects</span>
                        <span className="cdm-metric-value">{customerProjects.length} Active</span>
                    </div>
                    <div className="cdm-metric-card cdm-metric-emerald">
                        <span className="cdm-metric-label">Total Invoiced</span>
                        <span className="cdm-metric-value">{formatINR(totalInvoiced)}</span>
                    </div>
                </div>

                {/* Grouped Projects */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="cdm-section-header">
                        <h4 className="cdm-section-title">
                            <svg className="cdm-icon-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                                <path d="M8 10v4" /><path d="M12 10v2" /><path d="M16 10v6" />
                            </svg>
                            Projects ({customerProjects.length})
                        </h4>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                // openAddProjectModal();
                                setActiveTab('projects');
                            }}
                            className="cdm-link-btn"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Project
                        </button>
                    </div>

                    {customerProjects.length === 0 ? (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0' }}>No active projects for this customer.</p>
                    ) : (
                        <div className="cdm-projects-grid">
                            {customerProjects.map((proj) => (
                                <div key={proj.id} className="cdm-project-item">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>{proj.projectName}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Deadline: {formatDate(proj.deadline)}</div>
                                        </div>
                                        <StatusBadge status={proj.status} size="sm" />
                                    </div>
                                    <div>
                                        <div className='cdm-progress-percentage'>
                                            <span>Progress</span>
                                            <span>{proj.progress}%</span>
                                        </div>
                                        <div className="cdm-progress-bar">
                                            <div className="cdm-progress-fill" style={{ width: `${proj.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sales Opportunities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="cdm-section-header">
                        <h4 className="cdm-section-title">
                            <svg className="cdm-icon-primary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
                            </svg>
                            Sales & Opportunities ({customerSales.length})
                        </h4>
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                // openAddSaleModal();
                                setActiveTab('tracker');
                            }}
                            className="cdm-link-btn"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Sale
                        </button>
                    </div>

                    {customerSales.length === 0 ? (
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0' }}>No sales opportunities logged yet.</p>
                    ) : (
                        <div className="cdm-sales-list">
                            {customerSales.map((sale) => (
                                <div key={sale.id} className="cdm-sale-row">
                                    <div>
                                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{sale.service}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date: {formatDate(sale.saleDate)}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{formatINR(sale.proposalValue)}</span>
                                        <StatusBadge status={sale.status} size="sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default CustomerDetailModal
