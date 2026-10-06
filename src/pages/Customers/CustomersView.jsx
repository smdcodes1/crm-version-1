import React, { useState, useMemo } from 'react';
import "./CustomersView.css";

import {Users,UserCheck,Trophy,XCircle,Plus,Search,Eye,Edit2,Trash2,Phone,Mail,Building,Filter} from "lucide-react";
import StatCard from '../../components/StatCard/StatCard';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { useCRM } from '../../context/CRMContext';
import CustomerDetailModal from '../../components/modals/CustomerDetailModal/CustomerDetailModal';
import CustomerFormModal from "../../components/forms/CustomerFormModal/CustomerFormModal";
// const statsData = [
//   {
//     title: 'TOTAL CUSTOMERS',
//     value: '5',
//     subtitle: 'Directory Accounts',
//     icon: <CustomersIcon />,
//     colorScheme: 'purple',
//   },
//   {
//     title: 'FOLLOWING',
//     value: '2',
//     subtitle: 'Ongoing Dialogues',
//     icon: <FollowingIcon />,
//     colorScheme: 'blue',
//   },
//   {
//     title: 'WON',
//     value: '2',
//     subtitle: 'Converted clients',
//     icon: <TrophyIcon />,
//     colorScheme: 'green',
//     valueColor: '#7c3aed',
//   },
//   {
//     title: 'LOST',
//     value: '1',
//     subtitle: 'Past interactions',
//     icon: <LostSalesIcon />,
//     colorScheme: 'red',
//   },
// ];
// const INITIAL_CUSTOMERS = [
//   {
//     id: 1,
//     initial: 'A',
//     companyName: 'ABC Technologies',
//     location: 'Bengaluru',
//     contactName: 'John Doe',
//     email: 'john@abctech.example.com',
//     phone: '+91 98765 43210',
//     industry: 'IT & Software',
//     status: 'Following'
//   },
//   {
//     id: 2,
//     initial: 'X',
//     companyName: 'XYZ Ltd',
//     location: 'Mumbai',
//     contactName: 'Sarah Jenkins',
//     email: 'sarah@xyzretail.example.com',
//     phone: '+91 87654 32109',
//     industry: 'Retail & E-commerce',
//     status: 'Won'
//   },
//   {
//     id: 3,
//     initial: 'D',
//     companyName: 'Demo Corp',
//     location: 'Pune',
//     contactName: 'David Miller',
//     email: 'david@democorp.example.com',
//     phone: '+91 76543 21098',
//     industry: 'Manufacturing',
//     status: 'Lost'
//   },
//   {
//     id: 4,
//     initial: 'H',
//     companyName: 'HealthCare 360',
//     location: 'Hyderabad',
//     contactName: 'Dr. Anita Rao',
//     email: 'anita@hc360.example.com',
//     phone: '+91 99887 76655',
//     industry: 'Healthcare',
//     status: 'Following'
//   },
//   {
//     id: 5,
//     initial: 'A',
//     companyName: 'Apex Logistics',
//     location: 'New Delhi',
//     contactName: 'Rahul Sharma',
//     email: 'rahul@apexlog.example.com',
//     phone: '+91 98112 23344',
//     industry: 'Logistics & Supply',
//     status: 'Won'
//   }
// ];
function CustomersView() {
  const [searchQuery, setSearchQuery] = useState('');
  // const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [viewingCustomer, setViewingCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const filterTabs = ['All', 'Following', 'Won', 'Lost'];
  const { customers, deleteCustomer, isAddCustomerOpen, setIsAddCustomerOpen } = useCRM();
  // summary counts
  const totalCount = customers.length;
  const followingCount = customers.filter((c) => c.status === 'Following').length;
  const wonCount = customers.filter((c) => c.status === 'Won').length;
  const lostCount = customers.filter((c) => c.status === 'Lost').length;
  // filter list 
  // const filteredCustomers = useMemo(() => {
  //   return customers.filter((cust) => {
  //     const matchesFilter = selectedStatusFilter === 'All' || cust.status === selectedStatusFilter;
  //     const term = searchQuery.toLowerCase().trim();
  //     const matchesSearch =
  //       term === '' ||
  //       cust.companyName.toLowerCase().includes(term) ||
  //       cust.contactName.toLowerCase().includes(term) ||
  //       cust.email.toLowerCase().includes(term) ||
  //       cust.phone.includes(term) ||
  //       cust.industry.toLowerCase().includes(term) ||
  //       cust.location.toLowerCase().includes(term);

  //     return matchesFilter && matchesSearch;
  //   });
  // }, [customers, searchQuery, selectedStatusFilter]);
  const filteredCustomers = customers.filter((cust) => {
    const matchesSearch =
      cust.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cust.city && cust.city.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatusFilter === 'All' || cust.status === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete customer "${name}"?`)) {
      deleteCustomer(id);
    }
  };

  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Customers</h2>
          <p>Manage your customer relationships.</p>
        </div>
        <button onClick={()=> {
          setEditingCustomer(null);
          setIsAddCustomerOpen(true);
        }}>Add Customer</button>
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
            title="Total Customers"
            value={totalCount}
            subtitle="Directory accounts"
            icon={<Users />}
            colorScheme="purple"
          // valueColor={stat.valueColor}
          />
          <StatCard
            // key={index}
            title="Following"
            value={followingCount}
            subtitle="Ongoing dialogues"
            icon={<UserCheck />}
            colorScheme="blue"
          // valueColor={stat.valueColor}
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
   
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                    
                          <span>View</span>
                        </button>
                        <button type="button" className="action-icon-btn1" title="Edit" onClick={() => { 
                          setEditingCustomer(cust); 
                          setIsAddCustomerOpen(true); }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                          </svg>
                   
                        </button>
                        <button
                          type="button"
                          className="action-icon-btn2"
                          title="Delete"
                          onClick={() => handleDelete(cust.id, cust.companyName)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                  
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
