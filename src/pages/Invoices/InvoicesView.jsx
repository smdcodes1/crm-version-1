import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';

import {Receipt,Plus,Search,Eye,Trash2,CheckCircle2,AlertCircle,FileText,DollarSign,Clock} from "lucide-react";
import StatCard from '../../components/StatCard/StatCard';
import "./InvoicesView.css";
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR } from '../../utils/Formatters';
import InvoiceDetailModal from '../../components/modals/InvoiceDetailModal/InvoiceDetailModal';
import GenerateInvoiceModal from '../../components/forms/GenerateInvoiceModal/GenerateInvoiceModal';
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="8.5 12.5 11 15 15.5 9.5" />
  </svg>
);
const ViewIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const DeleteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);
// const INITIAL_INVOICES = [
//   {
//     id: 1,
//     invoiceNo: 'INV-0001',
//     quotationRef: 'QT-0001',
//     company: 'ABC Technologies',
//     date: '15 Aug 2026',
//     dueDate: '30 Aug 2026',
//     amount: '₹94,400',
//     paidAmount: null,
//     status: 'Paid'
//   },
//   {
//     id: 2,
//     invoiceNo: 'INV-0002',
//     quotationRef: 'QT-0002',
//     company: 'XYZ Ltd',
//     date: '14 Aug 2026',
//     dueDate: '28 Aug 2026',
//     amount: '₹53,100',
//     paidAmount: '₹25,000',
//     status: 'Partially Paid'
//   }
// ];
// const statsData = [
//   {
//     title: 'TOTAL INVOICES',
//     value: '2',
//     subtitle: 'Tax invoices issued',
//     icon: <ReceiptDollarIcon />,
//     colorScheme: 'purple',
//   },
//   {
//     title: 'TOTAL INVOICED',
//     value: '₹1,47,500',
//     subtitle: 'Gross billed amount',
//     icon: <DocumentIcon />,
//     colorScheme: 'blue',
//   },
//   {
//     title: 'COLLECTED REVENUE',
//     value: '₹1,19,400',
//     subtitle: '1 fully settled',
//     icon: <CheckCircleIcon />,
//     colorScheme: 'green',
//     valueColor: '#7c3aed',
//   },
//   {
//     title: 'UNPAID / DUE',
//     value: '0',
//     subtitle: 'Pending Settlements',
//     icon: <ClockIcon />,
//     colorScheme: 'red',
//   },
// ];
function InvoicesView() {
  // const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const { isGenerateInvoiceOpen, setIsGenerateInvoiceOpen, invoices, updateInvoice, deleteInvoice } = useCRM();
  const filterTabs = ['All', 'Unpaid', 'Partly Paid', 'Paid', 'Overdue'];
  // Summary Metrics 
  const totalCount = invoices.length;
  const totalBilled = invoices.reduce((sum, i) => sum + (i.total || 0), 0);
  const paidInvoices = invoices.filter((i) => i.paymentStatus === 'Paid');
  const totalCollected = invoices.reduce((sum, i) => {
    if (i.paymentStatus === 'Paid') return sum + i.total;
    if (i.paymentStatus === 'Partly Paid') return sum + (i.paidAmount || 0);
    return sum;
  }, 0);
  const unpaidCount = invoices.filter(
    (i) => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Overdue'
  ).length;

  // const filteredInvoices = useMemo(() => {
  //   return invoices.filter((item) => {
  //     const matchesFilter = statusFilter === 'All' || item.status === statusFilter;
  //     const term = searchQuery.toLowerCase().trim();
  //     const matchesSearch =
  //       term === '' ||
  //       item.invoiceNo.toLowerCase().includes(term) ||
  //       item.quotationRef.toLowerCase().includes(term) ||
  //       item.company.toLowerCase().includes(term) ||
  //       item.date.toLowerCase().includes(term) ||
  //       item.dueDate.toLowerCase().includes(term) ||
  //       item.amount.toLowerCase().includes(term);

  //     return matchesFilter && matchesSearch;
  //   });
  // }, [invoices, searchQuery, statusFilter]);
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });
  // const handleDelete = (id) => {
  //   setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  // };
  const handleDelete = (id, invNum) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invNum}?`)) {
      deleteInvoice(id);
    }
  }
  // const handleMarkPaid = (id) => {
  //   setInvoices((prev) =>
  //     prev.map((inv) =>
  //       inv.id === id ? { ...inv, status: 'Paid', paidAmount: null } : inv
  //     )
  //   );
  // };
  const handleQuickMarkPaid = (inv) => {
    updateInvoice(inv.id, {
      paymentStatus: 'Paid',
      paidAmount: inv.total,
    });
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Invoices</h2>
          <p>Manage billing generated strictly from accepted quotations.</p>
        </div>
        <button onClick={() => setIsGenerateInvoiceOpen(true)}>
          Generate Invoice
        </button>
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
            title="Total Invoices"
            value={totalCount}
            subtitle="Tax invoices issued"
            icon={<Receipt />}
            colorScheme="purple"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="Total Invoiced"
            value={formatINR(totalBilled)}
            subtitle="Gross billed amount"
            icon={<FileText />}
            colorScheme="blue"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="Collected Revenue"
            value={formatINR(totalCollected)}
            subtitle={`${paidInvoices.length} Fully settled`}
            icon={<CheckCircle2 />}
            colorScheme="green"
            valueColor="#7c3aed"
          />
          <StatCard
            // key={index}
            title="Unpaid / Due"
            value={unpaidCount}
            subtitle='Pending settlements'
            icon={<Clock />}
            colorScheme="red"
          // valueColor="#7c3aed"
          />
        </div>
      </div>

      <div className='invoices-wrapper'>
        {/* Header with Search and Filter Tabs */}
        <div className="invoices-header">
          <div className="title-group">
            <h2>Invoices List</h2>
            {/* <span className="count-badge">{filteredInvoices.length}</span> */}
          </div>

          <div className="actions-group">
            <div className="search-box">
              <span className="search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                className="invoice-search-input"
                placeholder="Search invoice or quote..."
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

        {/* Responsive Table */}
        <div className="invoice-table-responsive">
          <table className="invoices-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Invoice No.</th>
                <th style={{ width: '14%' }}>Quotation Ref</th>
                <th style={{ width: '18%' }}>Company</th>
                <th style={{ width: '13%' }}>Date</th>
                <th style={{ width: '13%' }}>Due Date</th>
                <th style={{ width: '13%' }}>Amount</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '16%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign:'center',padding:'40px',fontSize:"14px",color:'#94a3b8'}}>
                    No invoices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((item) => (
                  <tr key={item.id}>
                    {/* Invoice No */}
                    <td>
                     
                      <button className='invoice-no' onClick={() => setViewingInvoice(item)}>
                        {item.invoiceNumber}
                      </button>
                    </td>

                    {/* Quotation Ref */}
                    <td>
                      <span className="quote-ref-badge">{item.quotationNumber}</span>
                    </td>

                    {/* Company */}
                    <td>
                      <span className="company-name">{item.customerName}</span>
                    </td>

                    {/* Date */}
                    <td>
                      <span className="date-cell">{formatDate(item.invoiceDate)}</span>
                    </td>

                    {/* Due Date */}
                    <td>
                      <span className="due-date-cell">{formatDate(item.dueDate)}</span>
                    </td>

                    {/* Amount */}
                    <td>
                      <div className="amount-cell-wrapper">
                        <span className="amount-val">{formatINR(item.total)}</span>
                        {item.paymentStatus === 'Partly Paid' && item.paidAmount && (
                          <span className="amount-subtext">Paid: {formatINR(Math.min(item.paidAmount, item.total / 2))}</span>
                        )}
                      </div>
                    </td>

                    {/* Status via StatusBadge */}
                    <td>
                      <StatusBadge status={item.paymentStatus} size="md" />
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        {item.paymentStatus !== 'Paid' && (
                          <button
                            type="button"
                            className="btn-mark-paid"
                            title="Mark as Paid"
                            onClick={() => handleQuickMarkPaid(item)}
                          >
                            <CheckCircleIcon />
                            <span>Mark Paid</span>
                          </button>
                        )}

                        <button id={`view-invoice-${item.id}`} type="button" className="action-icon-btn1" title="View" onClick={() => setViewingInvoice(item)}>
                          <ViewIcon />
                        </button>
                        <button
                          id={`delete-invoice-${item.id}`}
                          type="button"
                          className="action-icon-btn2"
                          title="Delete"
                          onClick={() => handleDelete(item.id, item.invoiceNumber)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceDetailModal 
        isOpen={!!viewingInvoice}
        onClose={()=> setViewingInvoice(null)}
        invoice={viewingInvoice}
      />
      <GenerateInvoiceModal 
        isOpen={isGenerateInvoiceOpen}
        onClose={()=> setIsGenerateInvoiceOpen(false)}
      />
    </>
  );
}

export default InvoicesView
