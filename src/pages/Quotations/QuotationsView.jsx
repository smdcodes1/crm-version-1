import React, { useState, useMemo } from 'react';
import Swal from 'sweetalert2';
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
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import { SearchIcon, ViewIcon, EditIcon, TrashIcon } from '../../components/StatCard/StatCard';

const yearOptions = ['Monthly', 'Quarterly', 'Halfly', 'Annually'];
function QuotationsView() {
  const { quotations, invoices, isCreateQuotationOpen, setIsCreateQuotationOpen, deleteQuotation, fetchQuotationsByDate } = useCRM();
  const [isLoading, setIsLoading] = useState(false);
  const [yearFilter, setYearFilter] = useState('Monthly');
  const [initialDate, setInitialDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [finalDate, setFinalDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  // const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const filterTabs = ['All', 'Draft', 'Sent', 'Approved', 'Rejected'];
  const [editingQuotation, setEditingQuotation] = useState(null);
  const [viewingQuotation, setViewingQuotation] = useState(null);
  const [invoiceGenQuotationId, setInvoiceGenQuotationId] = useState(null);

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
  const filteredQuotationsHeader = quotations.filter(q => isWithinFilter(q.quotationDate || q.createdAt, yearFilter));
  // Summary Metrics
  const totalCount = filteredQuotationsHeader.length;
  const acceptedCount = filteredQuotationsHeader.filter((q) => q.status === 'Approved').length;
  const sentCount = filteredQuotationsHeader.filter((q) => q.status === 'Sent' || q.status === 'Draft').length;
  const totalValue = filteredQuotationsHeader.reduce((sum, q) => sum + (q.total || 0), 0);

  const filteredQuotations = quotations.filter((item) => {
    const matchesSearch =
      item.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesDate = isWithinFilter(item.quotationDate || item.createdAt, yearFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });
  // const handleDelete = (id) => {
  //   setQuotations((prev) => prev.filter((q) => q.id !== id));
  // };
  const handleDelete = async (id, qNum) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete quotation "${qNum}". This action cannot be undone!`,
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
        await deleteQuotation(id);
        // Optional: Show success toast/alert after successful deletion
        Swal.fire({
          title: 'Deleted!',
          text: `Quotation "${qNum}" has been deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete quotation:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete quotation. Please try again.',
          icon: 'error',
        });
      }
    }
  };
  const handleSearch = async () => {
    setIsLoading(true);
    try {
      await fetchQuotationsByDate(initialDate, finalDate);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Quotations</h2>
          <p>Manage and issue customer quotations.</p>
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
          <button onClick={() => {
            setEditingQuotation(null);
            setIsCreateQuotationOpen(true);
          }}>Create Quotation</button>
        </div>

      </div>

      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">

          <StatCard
            // key={index}
            title="Total Quotations"
            value={totalCount}
            subtitle="Issued proposals"
            icon={<FileText />}
            colorScheme="purple"

          />
          <StatCard
            // key={index}
            title="Accepted"
            value={acceptedCount}
            subtitle="Ready for invoicing"
            icon={<CheckCircle2 />}
            colorScheme="green"

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

          />
        </div>
      </div>
      <div className='projects-controls2'>
        <div className='projects-controls2-left'>
          <input
            type="date"
            required
            value={initialDate}
            onChange={(e) => setInitialDate(e.target.value)}
            className="projects-controls2-input"
          />
          <input
            type="date"
            required
            value={finalDate}
            onChange={(e) => setFinalDate(e.target.value)}
            className="projects-controls2-input"
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
                            <TrashIcon />
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
