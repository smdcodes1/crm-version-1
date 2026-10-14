import React, { useState, useMemo } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import Swal from 'sweetalert2';
import { TrendingUp, UserCheck, Trophy, XCircle, Plus, Search, Calendar, Bell, Edit2, Trash2, FileText, Clock, CheckCircle2, Filter } from "lucide-react";
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import "./SalesTrackerView.css";
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR, getRelativeDay } from '../../utils/Formatters';
import SaleFormModal from '../../components/forms/SaleFormModal/SaleFormModal';
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import { SearchIcon,EditIcon,TrashIcon } from '../../components/StatCard/StatCard';

// const BellIcon= ()=> (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width='24'
//     height='24'
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke='currentColor'
//     strokeWidth='2'
//     strokeLinecap="round"
//     strokeLinejoin="round"

//   >
//     <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
//     <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
//   </svg>
// );
const yearOptions= ['Monthly', 'Quarterly', 'Halfly', 'Yearly'];
function SalesTrackerView() {
  const [isLoading, setIsLoading]= useState(false);
  // const [sales, setSales]= useState(INITIAL_SALES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [editingSale, setEditingSale] = useState(null);
  const [yearFilter, setYearFilter]= useState('Monthly');
  const [initialDate, setInitialDate]= useState(() => new Date().toISOString().split('T')[0]);
  const [finalDate, setFinalDate]= useState(() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
  });
  const { isAddSaleOpen, setIsAddSaleOpen, deleteSale, sales, deleteFollowUp, fetchSalesByDate } = useCRM();
  const statusOptions = ['All Statuses', 'Following', 'Negotiation', 'Won', 'Lost'];
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

  const industries = ['All Industries', ...Array.from(new Set(sales.map((s) => s.industry).filter(Boolean)))];
  const filteredSalesHeader = sales.filter(s => isWithinFilter(s.createdAt || s.saleDate, yearFilter));
  // Metrics
  const totalSalesCount = filteredSalesHeader.length;
  const followingCount = filteredSalesHeader.filter(
    (s) => s.status === 'Following' || s.status === 'Proposal Sent' || s.status === 'Negotiation'
  ).length;
  const wonCount = filteredSalesHeader.filter((s) => s.status === 'Won').length;
  const lostCount = filteredSalesHeader.filter((s) => s.status === 'Lost').length;
  const totalProposalValue = filteredSalesHeader.reduce((sum, s) => sum + (s.proposalValue || 0), 0);
  // Filter list 
  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      const matchesStatus =
        statusFilter === 'All Statuses' || item.status === statusFilter;

      const cleanIndustry = item.industry.replace('\n', ' ');
      const matchesIndustry =
        industryFilter === 'All Industries' || cleanIndustry === industryFilter;

      const term = searchQuery.toLowerCase().trim();
      const matchesSearch =
        term === '' ||
        (item.customerName || '').toLowerCase().includes(term) ||
        (item.contactNumber || '').replace(/\s+/g, '').includes(term.replace(/\s+/g, '')) ||
        (item.remarks || '').toLowerCase().includes(term) ||
        (item.service || '').toLowerCase().includes(term) ||
        (item.industry || '').toLowerCase().includes(term) ||
        String(item.proposalValue || '').toLowerCase().includes(term) ||
        String(item.reminder?.date || '').toLowerCase().includes(term);
        const matchesDate = isWithinFilter(item.createdAt, yearFilter);

      return matchesStatus && matchesIndustry && matchesSearch && matchesDate;
    });
  }, [sales, searchQuery, statusFilter, industryFilter]);
  // const filteredSales = sales.filter((s) => {
  //   const matchesSearch =
  //     s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     s.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     s.contactNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     (s.remarks && s.remarks.toLowerCase().includes(searchQuery.toLowerCase()));

  //   const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
  //   const matchesIndustry = industryFilter === 'All' || s.industry === industryFilter;

  //   return matchesSearch && matchesStatus && matchesIndustry;
  // });
  // const handleDelete = (id) => {
  //   setSales((prev) => prev.filter((s) => s.id !== id));
  // };
  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete sale "${name}". This action cannot be undone!`,
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
        await deleteSale(id);
        // Optional: Show success toast/alert after successful deletion
        Swal.fire({
          title: 'Deleted!',
          text: `Sale "${name}" has been deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete sale:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete sale. Please try again.',
          icon: 'error',
        });
      }
    }
  };
  const handleUpdateFollowUp = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the follow-up for "${name}". This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      await deleteFollowUp(id);
    }
  }; 
  const handleSearch= async ()=> {
    setIsLoading(true);
    try {
      await fetchSalesByDate(initialDate,finalDate);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Sales Tracker</h2>
          <p>Track your sales oppurtunities and follow-ups!</p>
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
            setEditingSale(null);
            setIsAddSaleOpen(true);
          }}>Add Sale</button>
        </div>
       
      </div>

      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">
         
          <StatCard
            // key={index}
            title="Total Sales"
            value={totalSalesCount}
            subtitle="Oppurtunities logged"
            icon={<TrendingUp />}
            colorScheme="purple"
     
          />
          <StatCard
            // key={index}
            title="Following"
            value={followingCount}
            subtitle="Active pipeline deals"
            icon={<UserCheck />}
            colorScheme="blue"
       
          />
          <StatCard
            // key={index}
            title="Won"
            value={wonCount}
            subtitle="Closed successfully"
            icon={<CheckCircle2 />}
            colorScheme="green"
            valueColor="#7c3aed"
          />
          <StatCard
            // key={index}
            title="Lost"
            value={lostCount}
            subtitle="Declined / postponed"
            icon={<XCircle />}
            colorScheme="red"
          // valueColor="#7c3aed"
          />
          <StatCard
            // key={index}
            title="Total Proposal Value"
            value={formatINR(totalProposalValue)}
            subtitle="Cumulative pipeline"
            icon={<Trophy />}
            colorScheme="blue"
          // valueColor="#7c3aed"
          />
        </div>
      </div>
      <div className='projects-controls4'>
        <div className='projects-controls4-left'>
          <input
              type="date"
              required
              value={initialDate}
              onChange={(e) => setInitialDate(e.target.value)}
              className="projects-controls4-input"
          />
          <input
              type="date"
              required
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
              className="projects-controls4-input"
          />
          
        </div>
        <button 
          type='button'
          disabled={isLoading}
          className='search-button-right' 
          onClick={handleSearch}
        >
          {isLoading ? 'Searching..' : "Search"}
          {isLoading && <LoadingIndicator />}
        </button>
      </div>
      <div className='pipeline-wrapper'>
        {/* Header Bar */}
        <div className="pipeline-header">
          <div className="title-group">
            <h2>Sales Pipeline</h2>
            {/* <span className="count-badge">{filteredSales.length}</span> */}
          </div>

          <div className="filter-controls">
            <div className="search-box">
              <span className="search-icon">
                <SearchIcon />
              </span>
              <input
                type="text"
                className="tracker-search-input"
                placeholder="Search sales..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select
              className="select-filter status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              className="select-filter industry-select"
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
            >
              {industries.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="tracker-table-responsive">
          <table className="pipeline-table">
            <thead>
              <tr>
                <th style={{ width: '13%' }}>Company</th>
                <th style={{ width: '11%' }}>Contact</th>
                <th style={{ width: '27%' }}>Service</th>
                <th style={{ width: '13%' }}>Industry</th>
                <th style={{ width: '8%' }}>Proposal</th>
                <th style={{ width: '9%' }}>Value</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '9%' }}>Date</th>
                <th style={{ width: '6%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan="9" className='empty-row'>
                    No pipeline records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredSales.map((item) => (
                  <tr key={item.id}>
                    {/* Company */}
                    <td>
                      <div className="company-cell">{item.customerName}</div>
                      {item.reminder?.enabled ? (
                        <button
                          type='button'
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', color: '#7c3aed', fontWeight: 600, fontSize: '11px', gap: '0px', marginTop: '0.5px', cursor: 'pointer', border: 'none', background: 'none' }}
                          onClick={() => handleUpdateFollowUp(item.id, item.customerName)}
                        >
                          <Bell color='#7c3aed' />
                          <span>{getRelativeDay(item.reminder.date)} ({item.reminder.time})</span>
                        </button>
                      ) : <div />}
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="contact-cell">{item.contactNumber}</div>
                    </td>

                    {/* Service */}
                    <td>
                      <div className="service-cell">
                        <span className="service-title">{item.service}</span>
                        {item.remarks && (
                          <span className="service-desc">{item.remarks}</span>
                        )}
                      </div>
                    </td>

                    {/* Industry */}
                    <td>
                      <div className="industry-cell">{item.industry}</div>
                    </td>

                    {/* Proposal */}
                    <td>
                      <span className={`${item.proposalShared ? 'proposal-badge-yes' : 'proposal-badge-no'}`}>
                        {item.proposalShared ? 'Yes' : 'No'}
                      </span>
                    </td>

                    {/* Value */}
                    <td>
                      <span className="value-cell">{formatINR(item.proposalValue)}</span>
                    </td>

                    {/* Status via StatusBadge */}
                    <td>
                      <StatusBadge status={item.status} size="md" />
                    </td>

                    {/* Date */}
                    <td>
                      <span className="date-cell">{formatDate(item.saleDate)}</span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        <button type="button" className="action-icon-btn1" title="Edit" onClick={() => {
                          setEditingSale(item);
                          setIsAddSaleOpen(true);
                        }}>
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn2"
                          title="Delete"
                          onClick={() => handleDelete(item.id, item.customerName)}
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

      <SaleFormModal
        isOpen={isAddSaleOpen}
        onClose={() => {
          setIsAddSaleOpen(false);
          setEditingSale(null);
        }}
        saleToEdit={editingSale}
      />
    </>
  );
}

export default SalesTrackerView
