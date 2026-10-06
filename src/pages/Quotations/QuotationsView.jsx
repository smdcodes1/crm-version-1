import React, { useState, useMemo } from 'react';

import { FileText, Plus, Search, Eye, Edit2, Trash2, Receipt, CheckCircle2, Clock, Check, Trophy } from 'lucide-react';
import StatCard from '../../components/StatCard/StatCard';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import "./QuotationsView.css";
import { useCRM } from '../../context/CRMContext';
import { INITIAL_QUOTATIONS } from '../../data/InitialData';
import { formatDate, formatINR } from '../../utils/Formatters';
import QuotationDetailModal from '../../components/modals/QuotationDetailModal/QuotationDetailModal';
import CreateQuotationModal from '../../components/forms/CreateQuotationModal/CreateQuotationModal';
import GenerateInvoiceModal from "../../components/forms/GenerateInvoiceModal/GenerateInvoiceModal";
// const statsData = [
//   {
//     title: 'TOTAL QUOTATIONS',
//     value: '4',
//     subtitle: 'Issued proposals',
//     icon: <DocumentIcon />,
//     colorScheme: 'purple',
//   },
//   {
//     title: 'ACCEPTED',
//     value: '1',
//     subtitle: 'Ready for invoicing',
//     icon: <CheckCircleIcon />,
//     colorScheme: 'green',
//   },
//   {
//     title: 'PENDING / SENT',
//     value: '1',
//     subtitle: 'Awaiting client decision',
//     icon: <ClockIcon />,
//     colorScheme: 'red',
//     valueColor: '#7c3aed',
//   },
//   {
//     title: 'TOTAL QUOTATION VALUE ',
//     value: '₹1,60,000',
//     subtitle: 'Gross quoted amounts ',
//     icon: <TrophyIcon />,
//     colorScheme: 'blue',
//   },
// ];
// const INITIAL_QUOTATIONS = [
//   {
//     id: 1,
//     quotationNo: 'QT-0001',
//     company: 'ABC Technologies',
//     itemsCount: 2,
//     date: '15 Aug 2026',
//     validUntil: '15 Sept 2026',
//     amount: '₹94,400',
//     status: 'Rejected',
//     isInvoiced: true
//   },
//   {
//     id: 2,
//     quotationNo: 'QT-0002',
//     company: 'XYZ Ltd',
//     itemsCount: 2,
//     date: '14 Aug 2026',
//     validUntil: '14 Sept 2026',
//     amount: '₹53,100',
//     status: 'Accepted',
//     isInvoiced: true
//   },
//   {
//     id: 3,
//     quotationNo: 'QT-0003',
//     company: 'HealthCare 360',
//     itemsCount: 1,
//     date: '12 Aug 2026',
//     validUntil: '12 Sept 2026',
//     amount: '₹1,77,000',
//     status: 'Sent',
//     isInvoiced: false
//   },
//   {
//     id: 4,
//     quotationNo: 'QT-0004',
//     company: 'Demo Corp',
//     itemsCount: 1,
//     date: '5 Aug 2026',
//     validUntil: '25 Aug 2026',
//     amount: '₹1,12,100',
//     status: 'Rejected',
//     isInvoiced: false
//   }
// ];
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const ViewIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const DeleteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

function QuotationsView() {
  const { quotations, invoices, isCreateQuotationOpen, setIsCreateQuotationOpen, deleteQuotation } = useCRM();
  // const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const filterTabs = ['All', 'Draft', 'Sent', 'Approved', 'Rejected'];
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [viewingQuotation, setViewingQuotation] = useState(null);
  const [invoiceGenQuotationId, setInvoiceGenQuotationId] = useState(null);

  // Summary Metrics
  const totalCount = quotations.length;
  const acceptedCount = quotations.filter((q) => q.status === 'Approved').length;
  const sentCount = quotations.filter((q) => q.status === 'Sent' || q.status === 'Draft').length;
  const totalValue = quotations.reduce((sum, q) => sum + (q.total || 0), 0);

  // const filteredQuotations = useMemo(() => {
  //   return quotations.filter((item) => {
  //     const matchesFilter = statusFilter === 'All' || item.status === statusFilter;
  //     const term = searchQuery.toLowerCase().trim();
  //     const matchesSearch =
  //       term === '' ||
  //       item.quotationNo.toLowerCase().includes(term) ||
  //       item.company.toLowerCase().includes(term) ||
  //       item.date.toLowerCase().includes(term) ||
  //       item.validUntil.toLowerCase().includes(term) ||
  //       item.amount.toLowerCase().includes(term);

  //     return matchesFilter && matchesSearch;
  //   });
  // }, [quotations, searchQuery, statusFilter]);
  const filteredQuotations = quotations.filter((item) => {
    const matchesSearch =
      item.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // const handleDelete = (id) => {
  //   setQuotations((prev) => prev.filter((q) => q.id !== id));
  // };
  const handleDelete = (id, qNum) => {
    if (window.confirm(`Are you sure you want to delete quotation ${qNum}?`)) {
      deleteQuotation(id);
    }
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Quotations</h2>
          <p>Manage and issue customer quotations.</p>
        </div>
        <button onClick={() => {
          setEditingQuotation(null);
          setIsCreateQuotationOpen(true);
        }}>Create Quotation</button>
      </div>

      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">
          {/* {statsData.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              colorScheme={stat.colorScheme}
              valueColor={stat.valueColor}
            />
          ))} */}
          <StatCard
            // key={index}
            title="Total Quotations"
            value={totalCount}
            subtitle="Issued proposals"
            icon={<FileText />}
            colorScheme="purple"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="Accepted"
            value={acceptedCount}
            subtitle="Ready for invoicing"
            icon={<CheckCircle2 />}
            colorScheme="green"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="Pending / Sent"
            value={sentCount}
            subtitle="Awaiting client decision"
            icon={<Clock />}
            colorScheme="red"
            valueColor="#7c3aed"
          />
          <StatCard
            // key={index}
            title="Total Quotation Value"
            value={formatINR(totalValue)}
            subtitle="Gross quoted amounts"
            icon={<Trophy />}
            colorScheme="blue"
          // valueColor={stat.valueColor}
          />
        </div>
      </div>
      <div className='quotations-wrapper'>
        {/* Header with Title & Filter Controls */}
        <div className="quotations-header">
          <div className="title-group">
            <h2>All Quotations</h2>
            {/* <span className="count-badge">{filteredQuotations.length}</span> */}
          </div>

          <div className="actions-group">
            <div className="search-box">
              <span className="search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                className="quot-search-input"
                placeholder="Search quotation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${statusFilter === tab ? 'active' : ''}`}
                  onClick={() => setStatusFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quotations Data Table */}
        <div className="quot-table-responsive">
          <table className="quotations-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Quotation No.</th>
                <th style={{ width: '20%' }}>Company</th>
                <th style={{ width: '14%' }}>Date</th>
                <th style={{ width: '14%' }}>Valid Until</th>
                <th style={{ width: '13%' }}>Amount</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '14%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.length === 0 ? (
                <tr>
                  <td colSpan="7" className='empty-row'>
                    No quotations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredQuotations.map((item) => {
                  const isAlreadyInvoiced = invoices?.some((i) => i.quotationId === item.id);
                  return (
                    <tr key={item.id}>
                      {/* Quotation No */}
                      <td>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setViewingQuotation(item)}>
                          <span className="quotation-no">{item.quotationNumber}</span>
                        </button>

                      </td>

                      {/* Company */}
                      <td>
                        <div className="company-cell">
                          <span className="company-name">{item.customerName}</span>
                          <span className="service-items">
                            {item.items.length} service item(s)
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="date-cell">{formatDate(item.quotationDate)}</span>
                      </td>

                      {/* Valid Until */}
                      <td>
                        <span className="valid-cell">{formatDate(item.validUntil)}</span>
                      </td>

                      {/* Amount */}
                      <td>
                        <span className="amount-cell">{formatINR(item.total)}</span>
                      </td>

                      {/* Status via StatusBadge */}
                      <td>
                        <StatusBadge status={item.status} size="md" />
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="actions-cell">
                          {isAlreadyInvoiced ? (
                            <span className="btn-invoiced-pill">Invoiced</span>
                          ) : (
                            <button type="button" className="btn-invoice-action" title="Create Invoice" onClick={() => setInvoiceGenQuotationId(item.id)} >

                              <span>Invoice</span>
                            </button>
                          )}

                          <button type="button" className="action-icon-btn1" title="View" onClick={() => setViewingQuotation(item)}>
                            <ViewIcon />
                          </button>
                          <button type="button" className="action-icon-btn1" title="Edit" onClick={() => {
                            setEditingQuotation(item);
                            setIsCreateQuotationOpen(true);
                          }}>
                            <EditIcon />
                          </button>
                          <button
                            type="button"
                            className="action-icon-btn2"
                            title="Delete"
                            onClick={() => handleDelete(item.id, item.quotationNumber)}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
      <QuotationDetailModal
        isOpen={!!viewingQuotation}
        onClose={() => setViewingQuotation(null)}
        quotation={viewingQuotation}
        onGenerateInvoice={(qId) => setInvoiceGenQuotationId(qId)}
      />

      <CreateQuotationModal
        isOpen={isCreateQuotationOpen}
        onClose={() => {
          setIsCreateQuotationOpen(false);
          setEditingQuotation(null);
        }}
        quotationToEdit={editingQuotation}
      />

      <GenerateInvoiceModal
        isOpen={!!invoiceGenQuotationId}
        onClose={() => setInvoiceGenQuotationId(null)}
        preselectedQuotationId={invoiceGenQuotationId || undefined}
      />
    </>
  );
}

export default QuotationsView
