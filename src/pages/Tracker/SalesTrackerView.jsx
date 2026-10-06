import React, { useState, useMemo } from 'react';
import StatCard from '../../components/StatCard/StatCard';

import { TrendingUp, UserCheck, Trophy, XCircle, Plus, Search, Calendar, Bell, Edit2, Trash2, FileText, Clock, CheckCircle2, Filter } from "lucide-react";
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import "./SalesTrackerView.css";
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR, getRelativeDay } from '../../utils/Formatters';
import SaleFormModal from '../../components/forms/SaleFormModal/SaleFormModal';
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);
const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

// const statsData = [
//       {
//       title: 'TOTAL SALES',
//       value: '5',
//       subtitle: 'Oppurtunities logged',
//       icon: <TrendingUpIcon />,
//       colorScheme: 'purple',
//       },
//       {
//       title: 'FOLLOWING',
//       value: '2',
//       subtitle: 'Active pipeline deals ',
//       icon: <FollowingIcon />,
//       colorScheme: 'blue',
//       },
//       {
//       title: 'WON',
//       value: '2',
//       subtitle: 'Closed successfully',
//       icon: <CheckCircleIcon />,
//       colorScheme: 'green',
//       valueColor: '#7c3aed',
//       },
//       {
//       title: 'LOST',
//       value: '1',
//       subtitle: 'Declined / postponed',
//       icon: <LostSalesIcon />,
//       colorScheme: 'red',
//       },
//       {
//       title: 'TOTAL PROPOSAL VALUE',
//       value: '₹4,85,000',
//       subtitle: 'Cumulative pipeline',
//       icon: <TrophyIcon />,
//       colorScheme: 'blue',
//       },
// ];
// const INITIAL_SALES = [
//   {
//     id: 1,
//     company: 'ABC\nTechnologies',
//     contact: '+91 98765\n43210',
//     service: 'Website & Portal Development',
//     serviceDescription: 'Customer requested minor revision in milestone payments.',
//     industry: 'IT & Software',
//     hasProposal: true,
//     value: '₹80,000',
//     status: 'Following',
//     date: '15 Aug 2026'
//   },
//   {
//     id: 2,
//     company: 'XYZ Ltd',
//     contact: '+91 87654\n32109',
//     service: 'SEO & Growth Marketing',
//     serviceDescription: 'Deal closed with 1-year upfront commitment.',
//     industry: 'Retail & E-commerce',
//     hasProposal: true,
//     value: '₹40,000',
//     status: 'Won',
//     date: '14 Aug 2026'
//   },
//   {
//     id: 3,
//     company: 'HealthCare\n360',
//     contact: '+91 99887\n76655',
//     service: 'Patient Portal Application',
//     serviceDescription: 'Final negotiation round with the management committee.',
//     industry: 'Healthcare',
//     hasProposal: true,
//     value: '₹1,50,000',
//     status: 'Negotiation',
//     date: '12 Aug 2026'
//   },
//   {
//     id: 4,
//     company: 'Demo Corp',
//     contact: '+91 76543\n21098',
//     service: 'ERP Integration Module',
//     serviceDescription: 'Budget frozen until next financial quarter.',
//     industry: 'Manufacturing',
//     hasProposal: true,
//     value: '₹95,000',
//     status: 'Lost',
//     date: '5 Aug 2026'
//   },
//   {
//     id: 5,
//     company: 'Apex Logistics',
//     contact: '+91 98112\n23344',
//     service: 'Fleet Tracker Dashboard',
//     serviceDescription: 'Approved by Managing Director. 50% advance received.',
//     industry: 'Logistics &\nSupply',
//     hasProposal: true,
//     value: '₹1,20,000',
//     status: 'Won',
//     date: '1 Aug 2026'
//   }
// ];
function SalesTrackerView() {
  // const [sales, setSales]= useState(INITIAL_SALES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [industryFilter, setIndustryFilter] = useState('All Industries');
  const [editingSale, setEditingSale] = useState(null);
  const { isAddSaleOpen, setIsAddSaleOpen, deleteSale, sales, deleteFollowUp } = useCRM();
  const statusOptions = ['All Statuses', 'Following', 'Negotiation', 'Won', 'Lost'];
  // Unique industries
  // const industryOptions = [
  //   'All Industries',
  //   'IT & Software',
  //   'Retail & E-commerce',
  //   'Healthcare',
  //   'Manufacturing',
  //   'Logistics & Supply'
  // ];
  const industries = Array.from(new Set(sales.map((s) => s.industry).filter(Boolean)));
  // Metrics
  const totalSalesCount = sales.length;
  const followingCount = sales.filter(
    (s) => s.status === 'Following' || s.status === 'Proposal Sent' || s.status === 'Negotiation'
  ).length;
  const wonCount = sales.filter((s) => s.status === 'Won').length;
  const lostCount = sales.filter((s) => s.status === 'Lost').length;
  const totalProposalValue = sales.reduce((sum, s) => sum + (s.proposalValue || 0), 0);
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

      return matchesStatus && matchesIndustry && matchesSearch;
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
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the sale for "${name}"?`)) {
      deleteSale(id);
    }
  };
  const handleUpdateFollowUp = (id, name) => {
    if (window.confirm(`Are you sure you want to delete the sale for "${name}"?`)) {
      deleteFollowUp(id);
    }
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Sales Tracker</h2>
          <p>Track your sales oppurtunities and follow-ups!</p>
        </div>
        <button onClick={() => {
          setEditingSale(null);
          setIsAddSaleOpen(true);
        }}>Add Sale</button>
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
            title="Total Sales"
            value={totalSalesCount}
            subtitle="Oppurtunities logged"
            icon={<TrendingUp />}
            colorScheme="purple"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="Following"
            value={followingCount}
            subtitle="Active pipeline deals"
            icon={<UserCheck />}
            colorScheme="blue"
          // valueColor={stat.valueColor}
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width='24'
                            height='24'
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap="round"
                            strokeLinejoin="round"

                          >
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                          </svg>
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
