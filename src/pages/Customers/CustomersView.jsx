import React, { useState, useMemo } from 'react';
import "./CustomersView.css";
import Swal from 'sweetalert2';
import {Users,UserCheck,Trophy,XCircle,Plus,Search,Eye,Edit2,Trash2,Phone,Mail,Building,Filter} from "lucide-react";
import StatCard, { EditIcon, SearchIcon, TrashIcon, ViewIcon } from '../../components/StatCard/StatCard';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { useCRM } from '../../context/CRMContext';
import CustomerDetailModal from '../../components/modals/CustomerDetailModal/CustomerDetailModal';
import CustomerFormModal from "../../components/forms/CustomerFormModal/CustomerFormModal";
import LoadingIndicator from '../../components/LoadingIndicator/LoadingIndicator';
const PhoneIcon= ()=> (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);
const yearOptions= ['Monthly', 'Quarterly', 'Halfly', 'Annually'];
function CustomersView() {
  const [isLoading, setIsLoading]= useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const filterTabs = ['All', 'Following', 'Won', 'Lost'];
  const { customers, deleteCustomer, isAddCustomerOpen, setIsAddCustomerOpen, fetchCustomersByDate } = useCRM();
  const [yearFilter, setYearFilter]= useState('Monthly');
  const [initialDate, setInitialDate]= useState(() => new Date().toISOString().split('T')[0]);
  const [finalDate, setFinalDate]= useState(() => {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
  });
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
  const filteredCustomersHeader = customers.filter(c => isWithinFilter(c.createdAt, yearFilter));
  // summary counts
  const totalCount = filteredCustomersHeader.length;
  const followingCount = filteredCustomersHeader.filter((c) => c.status === 'Following').length;
  const wonCount = filteredCustomersHeader.filter((c) => c.status === 'Won').length;
  const lostCount = filteredCustomersHeader.filter((c) => c.status === 'Lost').length;
  // filter list 
 
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust.city && cust.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatusFilter === 'All' || cust.status === selectedStatusFilter;
    const matchesDate = isWithinFilter(cust.createdAt, yearFilter);

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete customer "${name}". This action cannot be undone!`,
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
        await deleteCustomer(id);
        // Optional: Show success toast/alert after successful deletion
        Swal.fire({
          title: 'Deleted!',
          text: `Customer "${name}" has been deleted.`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete customer:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete customer. Please try again.',
          icon: 'error',
        });
      }
    }
  };
  const handleSearch= async ()=> {
    setIsLoading(true);
  try {
    await fetchCustomersByDate(initialDate,finalDate);
  } finally {
    setIsLoading(false);
  }
  };
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Customers</h2>
          <p>Manage your customer relationships.</p>
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
            <button onClick={()=> {
              setEditingCustomer(null);
              setIsAddCustomerOpen(true);
            }}>Add Customer</button>

          </div>
        
      </div>
      <div className='stat-cards-wrapper'>
        <div className="stat-cards-grid">
        
          <StatCard
            // key={index}
            title="Total Customers"
            value={totalCount}
            subtitle="Directory accounts"
            icon={<Users />}
            colorScheme="purple"
       
          />
          <StatCard
            // key={index}
            title="Following"
            value={followingCount}
            subtitle="Ongoing dialogues"
            icon={<UserCheck />}
            colorScheme="blue"
        
          />
          <StatCard
            // key={index}
            title="Won"
            value={wonCount}
            subtitle="Converted clients"
            icon={<Trophy />}
            colorScheme="green"
            valueColor="#7c3aed"
          />
          <StatCard
            // key={index}
            title="Lost"
            value={lostCount}
            subtitle="Past interactions"
            icon={<XCircle />}
            colorScheme="red"
          // valueColor="#7c3aed"
          />
        </div>
      </div>
      <div className='projects-controls1'>
        <div className='projects-controls1-left'>
          <input
              type="date"
              required
              value={initialDate}
              onChange={(e) => setInitialDate(e.target.value)}
              className="projects-controls1-input"
          />
          <input
              type="date"
              required
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value)}
              className="projects-controls1-input"
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
      <div className='customers-wrapper'>
        {/* Header controls: Search & Filter Tabs */}
        <div className="customers-header">
          <div className="title-group">
            <h2>All Customers</h2>
            {/* <span className="count-badge">{filteredCustomers.length}</span> */}
          </div>

          <div className="actions-group">
            <div className="search-box">
              <span className="search-icon">
                <SearchIcon />
   
              </span>
              <input
                type="text"
                className="cust-search-input"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-tabs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${selectedStatusFilter === tab ? 'active' : ''}`}
                  onClick={() => setSelectedStatusFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="cust-table-responsive">
          <table className="customers-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Company</th>
                <th style={{ width: '22%' }}>Contact</th>
                <th style={{ width: '18%' }}>Phone</th>
                <th style={{ width: '16%' }}>Industry</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className='empty-row'>
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id}>
                    {/* Company */}
                    <td>
                      <div className="company-cell">
                        <div className="company-avatar">{cust.companyName.charAt(0)}</div>
                        <div className="company-info">
                          <span className="company-name">{cust.companyName}</span>
                          <span className="company-location">{cust.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="contact-cell">
                        <span className="contact-name">{cust.contactPerson}</span>
                        {cust.email && (<span className="contact-email">{cust.email}</span>)}
                      </div>
                    </td>

                    {/* Phone */}
                    <td>
                      <div className="phone-cell">
                        <span className="phone-icon">
                         <PhoneIcon />
                            {/* <Phone/> */}
                        </span>
                        <span>{cust.phone}</span>
                      </div>
                    </td>

                    {/* Industry */}
                    <td>
                      <div className="industry-cell">{cust.industry}</div>
                    </td>

                    {/* Status via StatusBadge */}
                    <td>
                      <StatusBadge status={cust.status} size="md" />
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="actions-cell">
                        <button type="button" className="action-view" title="View details" onClick={() => setViewingCustomer(cust)}>
                          <ViewIcon />
                    
                          <span>View</span>
                        </button>
                        <button type="button" className="action-icon-btn1" title="Edit" onClick={() => { 
                          setEditingCustomer(cust); 
                          setIsAddCustomerOpen(true); }}>
                         <EditIcon />
                   
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn2"
                          title="Delete"
                          onClick={() => handleDelete(cust.id, cust.companyName)}
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
      
      <CustomerDetailModal 
        isOpen={!!viewingCustomer}
        onClose={()=> setViewingCustomer(null)}
        customer={viewingCustomer}
        onEdit={(c)=> {
            setEditingCustomer(c);
            setIsAddCustomerOpen(true);
        }}
      />
      <CustomerFormModal 
        isOpen={isAddCustomerOpen}
        onClose={()=> {
            setIsAddCustomerOpen(false);
            setEditingCustomer(null);
        }}
        customerToEdit={editingCustomer}
      />
    </>
  );
}

export default CustomersView
