import React, { useState, useMemo } from 'react';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import Swal from 'sweetalert2';
import { Receipt, Plus, Search, Eye, Trash2, CheckCircle2, AlertCircle, FileText, DollarSign, Clock } from "lucide-react";
import StatCard from '../../components/StatCard/StatCard';
import "./InvoicesView.css";
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR } from '../../utils/Formatters';
import InvoiceDetailModal from '../../components/modals/InvoiceDetailModal/InvoiceDetailModal';
import GenerateInvoiceModal from '../../components/forms/GenerateInvoiceModal/GenerateInvoiceModal';
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import { SearchIcon, ViewIcon, TrashIcon } from '../../components/StatCard/StatCard';
const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <polyline points="8.5 12.5 11 15 15.5 9.5" />
  </svg>
);
const yearOptions = ['Monthly', 'Quarterly', 'Halfly', 'Annually'];
function InvoicesView() {
  const [isLoading, setIsLoading] = useState(false);
  // const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingInvoice, setViewingInvoice] = useState(null);
  const [yearFilter, setYearFilter] = useState('Monthly');
  const [initialDate, setInitialDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [finalDate, setFinalDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const { isGenerateInvoiceOpen, setIsGenerateInvoiceOpen, invoices, updateInvoice, deleteInvoice, fetchInvoicesByDate } = useCRM();
  const filterTabs = ['All', 'Unpaid', 'Partially Paid', 'Paid', 'Overdue'];
  const isWithinFilter = (dateString, filter) => {
    if (!dateString) return false;
    const itemDate = new Date(dateString);
    if (isNaN(itemDate.getTime())) return false;

    const now = new Date();
    const daysDifference = (now.getTime() - itemDate.getTime()) / (1000 * 3600 * 24);

    switch (filter) {
      case 'Monthly':
        return daysDifference <= 30;
      case 'Quarterly':
        return daysDifference <= 90;
      case 'Halfly':
        return daysDifference <= 180;
      case 'Annually':
        return daysDifference <= 365;
      default:
        return true;
    }
  };
  const filteredInvoicesHeader = invoices.filter(i => isWithinFilter(i.invoiceDate || i.createdAt, yearFilter));
  // Summary Metrics 
  const totalCount = filteredInvoicesHeader.length;
  const totalBilled = filteredInvoicesHeader.reduce((sum, i) => sum + (Number(i.total) || 0), 0);
  const paidInvoices = filteredInvoicesHeader.filter((i) => i.paymentStatus === 'Paid');
  const totalCollected = filteredInvoicesHeader.reduce((sum, i) => {
    if (i.paymentStatus === 'Paid') return sum + (Number(i.total) || 0);
    if (i.paymentStatus === 'Partially Paid') return sum + (Number(i.paidAmount) || 0);
    return sum;
  }, 0);
  const unpaidCount = filteredInvoicesHeader.filter(
    (i) => i.paymentStatus === 'Unpaid' || i.paymentStatus === 'Overdue'
  ).length;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
    const matchesDate = isWithinFilter(inv.invoiceDate || inv.createdAt, yearFilter);
    return matchesSearch && matchesStatus && matchesDate;
  })
    .sort((a, b) => {
      // Descending order: newest / highest timestamp first
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
  // const handleDelete = (id) => {
  //   setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  // }; 
  const handleDelete = async (id, invNum) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete invoice "${invNum}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {

        await deleteInvoice(id);
        // Optional: Show success toast/alert after successful deletion
        Swal.fire({
          title: 'Deleted!',
          text: `Invoice "${invNum}" has been deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete invoice:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete invoice. Please try again.',
          icon: 'error',
        });
      }
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
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await fetchInvoicesByDate(initialDate, finalDate);
    } finally {
      setIsLoading(false);
    }
  };
  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) return;

    const headers = [
      'Invoice Number',
      'Quotation Number',
      'Customer Name',
      'Invoice Date',
      'Due Date',
      'Items',
      'Subtotal',
      'Tax Percentage',
      'Tax',
      'Total',
      'Payment Status',
      'Paid Amount',
      'Notes',
      'Created Date',
    ];

    const escapeCSV = (value) => {
      if (value === undefined || value === null) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    };
    const formatItems = (items) => {
      if (!Array.isArray(items) || items.length === 0) return '';
      return items
        .map((item) => {
          if (typeof item === 'string') return item;
          // Extracts common item properties dynamically (supports description/name, quantity/qty, and price/rate)
          const total = item.total || 0;
          const service = item.service || 'service';
          const qty = item.quantity || 1;
          const price = item.unitPrice || 0;
          const description = item.description || 'Item';
          return price !== undefined
            ? `${service} (Qty: ${qty}, UnitPrice: ${price}, Description: ${description}, Total: ${total})`
            : `${service} (Qty: ${qty}, Description: ${description})`;
        })
        .join('; '); // Use semicolon to separate multiple items inside the CSV cell safely
    };
    const rows = filteredInvoices.map((c) => [
      escapeCSV(c.invoiceNumber),
      escapeCSV(c.quotationNumber),
      escapeCSV(c.customerName),
      escapeCSV(formatDate(c.invoiceDate)),
      escapeCSV(formatDate(c.dueDate)),
      escapeCSV(formatItems(c.items || [])),
      escapeCSV(c.subtotal || ''),
      escapeCSV(c.taxPercentage),
      escapeCSV(c.tax || 0),
      escapeCSV(c.total || 0),
      escapeCSV(c.paymentStatus),
      escapeCSV(c.paidAmount),
      escapeCSV(c.notes),
      escapeCSV(c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB') : ''),
    ]);

    const csvContent = [headers.map((h) => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.setAttribute('download', `invoices-export-${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Invoices</h2>
          <p>Manage billing generated strictly from accepted quotations.</p>
        </div>
        <div className='year-container'>
          <select
            className="select-filter year-select"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {yearOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button onClick={() => setIsGenerateInvoiceOpen(true)}>
            Generate Invoice
          </button>

        </div>

      </div>

      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">

          <StatCard
            // key={index}
            title="Total Invoices"
            value={totalCount}
            subtitle="Tax invoices issued"
            icon={<Receipt />}
            colorScheme="purple"

          />
          <StatCard
            // key={index}
            title="Total Invoiced"
            value={formatINR(totalBilled)}
            subtitle="Gross billed amount"
            icon={<FileText />}
            colorScheme="blue"

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
      <div className='projects-controls3'>
        <div className='projects-controls3-left'>
          <input
            type="date"
            required
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
            className="projects-controls3-input"
          />
          <input
            type="date"
            required
            value={finalDate}
            onChange={(e) => setFinalDate(e.target.value)}
            className="projects-controls3-input"
          />
        </div>
        <button
          type='button'
          className='search-button-right'
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Searching..' : 'Search'}
          {isLoading && <LoadingIndicator />}
        </button>
      </div>
      <div className='invoices-wrapper'>
        {/* Header with Search and Filter Tabs */}
        <div className="invoices-header">
          <div className="title-group">
            <h2>Invoices List</h2>
            {/* <span className="count-badge">{filteredInvoices.length}</span> */}
            <button
              id='export-invoices-csv-btn'
              title='Export current Invoices table to csv'
              className='export-csv-btn'
              disabled={filteredInvoices.length === 0}
              onClick={handleExportCSV}
            >
              Export CSV
            </button>
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
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', fontSize: "14px", color: '#94a3b8' }}>
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
                        {item.paymentStatus === 'Partially Paid' && item.paidAmount && (
                          <span className="amount-subtext">Paid: {formatINR(item.paidAmount)}</span>
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
                          <TrashIcon />
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
        onClose={() => setViewingInvoice(null)}
        invoice={viewingInvoice}
      />
      <GenerateInvoiceModal
        isOpen={isGenerateInvoiceOpen}
        onClose={() => setIsGenerateInvoiceOpen(false)}
      />
    </>
  );
}

export default InvoicesView
