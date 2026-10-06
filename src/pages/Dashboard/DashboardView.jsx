import React, { useState } from 'react';
import "./DashboardView.css";
import StatCard from '../../components/StatCard/StatCard';
import {Users,UserCheck,Trophy,XCircle,Plus,Search,Eye,Edit2,Trash2,Phone,Mail,Building,Filter,TrendingUp,Calendar,Clock,Check} from "lucide-react";
import BarChart from '../../components/BarChart/BarChart';
import { StatusBadge } from '../../components/StatusBadge/StatusBadge';
import { useCRM } from '../../context/CRMContext';
import { formatDate, formatINR, getRelativeDay } from '../../utils/Formatters';
import SaleFormModal from '../../components/forms/SaleFormModal/SaleFormModal';
const doubleData = [
    { month: 'Jan', pipeline: 80000, closedWon: 45000 },
    { month: 'Feb', pipeline: 120000, closedWon: 65000 },
    { month: 'May', pipeline: 150000, closedWon: 90000 },
    { month: 'Jun', pipeline: 210000, closedWon: 120000 },
    { month: 'Jul', pipeline: 270000, closedWon: 160000 },
];
const doubleBars = [
    { key: 'closedWon', label: 'Closed Won', barClass: 'bar-closed-won', legendClass: 'legend-closed-won', tooltipClass: 'tooltip-closed' },
    { key: 'pipeline', label: 'Pipeline Value', barClass: 'bar-pipeline', legendClass: 'legend-pipeline', tooltipClass: 'tooltip-pipeline' }
];
// const statsData = [
//     {
//         title: 'CUSTOMERS',
//         value: '5',
//         subtitle: 'Active relationships',
//         icon: <CustomersIcon />,
//         colorScheme: 'purple',
//     },
//     {
//         title: 'FOLLOWING',
//         value: '2',
//         subtitle: 'Warm leads in pipeline',
//         icon: <FollowingIcon />,
//         colorScheme: 'blue',
//     },
//     {
//         title: 'WON SALES',
//         value: '2',
//         subtitle: '₹1,60,000',
//         icon: <TrophyIcon />,
//         colorScheme: 'green',
//         valueColor: '#7c3aed',
//     },
//     {
//         title: 'LOST SALES',
//         value: '1',
//         subtitle: 'Archived opportunities',
//         icon: <LostSalesIcon />,
//         colorScheme: 'red',
//     },
// ];
// const salesData = [
//     {
//         id: 1,
//         client: 'ABC Technologies',
//         service: 'Website & Portal Development',
//         date: '15 Aug 2026',
//         amount: '₹80,000',
//         status: 'Following',
//     },
//     {
//         id: 2,
//         client: 'XYZ Ltd',
//         service: 'SEO & Growth Marketing',
//         date: '14 Aug 2026',
//         amount: '₹40,000',
//         status: 'Won',
//     },
//     {
//         id: 3,
//         client: 'HealthCare 360',
//         service: 'Patient Portal Application',
//         date: '12 Aug 2026',
//         amount: '₹1,50,000',
//         status: 'Negotiation',
//     },
//     {
//         id: 4,
//         client: 'Demo Corp',
//         service: 'ERP Integration Module',
//         date: '5 Aug 2026',
//         amount: '₹95,000',
//         status: 'Lost',
//     },
//     {
//         id: 5,
//         client: 'Apex Logistics',
//         service: 'Fleet Tracker Dashboard',
//         date: '1 Aug 2026',
//         amount: '₹1,20,000',
//         status: 'Won',
//     },
// ];
function DashboardView() {
    const { setActiveTab, customers, sales, followUps, toggleFollowUpComplete, openAddSaleModal,quotations, invoices, projects, isAddSaleOpen, setIsAddSaleOpen } = useCRM();
//     const [items, setItems] = useState([
//         {
//             id: 1,
//             client: 'HealthCare 360',
//             badge: '8d overdue',
//             description: 'Follow up with Dr. Anita on security compliance review',
//             time: '14:00',
//             completed: false,
//         },
//     ]
// );
    // Metrics computation
    const totalCustomersCount = customers.length;
    const followingCount = customers.filter((c) => c.status === 'Following').length;
    const wonSalesCount = sales.filter((s) => s.status === 'Won').length;
    const lostSalesCount = sales.filter((s) => s.status === 'Lost').length;

    const totalWonValue = sales
        .filter((s) => s.status === 'Won')
        .reduce((sum, s) => sum + (s.proposalValue || 0), 0);
    // Recent 5 sales
    const recentSales = [...sales]
        .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
        .slice(0, 5);
    // Pending follow-ups 
    const pendingFollowups = followUps.filter((f) => !f.completed).slice(0, 5);
    // const pendingCount = items.filter((item) => !item.completed).length;
    // const toggleComplete = (id) => {
    //     setItems((prev) =>
    //         prev.map((item) =>
    //             item.id === id ? { ...item, completed: !item.completed } : item
    //         )
    //     );
    // };
    return (
        <>
            <div className='title-header'>
                <div className="title-group">
                    <h2>Good morning!</h2>
                    <p>Here's an overview of your sales activity today.</p>
                </div>
                <button onClick={()=> setIsAddSaleOpen(true)}>Add Sale</button>
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
                        key="stat-customers"
                        title="Customers"
                        value={totalCustomersCount}
                        subtitle="Active relationships"
                        icon= {<Users/>}
                        colorScheme='purple'
                    />
                    <StatCard
                        key="stat-following"
                        title="Following"
                        value={followingCount}
                        subtitle="Warm leads in pipeline"
                        icon={<UserCheck/>}
                        colorScheme='green'
                    />
                    <StatCard
                        key="stat-won"
                        title="Won Sales"
                        value={wonSalesCount}
                        subtitle={formatINR(totalWonValue)}
                        icon={<Trophy/>}
                        colorScheme='blue'
                        valueColor='#7c3aed'
                    />
                    <StatCard
                        key="stat-lost"
                        title="Lost Sales"
                        value={lostSalesCount}
                        subtitle='Archived oppurtunities'
                        icon={<XCircle/>}
                        colorScheme='red'
                    />


                </div>
            </div>
            <div className='chart-wrapper'>

                <BarChart
                    title="Overview"
                    content="Monthly closed revenue vs total proposal pipeline"
                    data={doubleData}
                    bars={doubleBars}
                />
            </div>
            <div className='sales-bottom-wrapper'>
                <div className="recent-sales-card">
                    {/* Card Header */}
                    <div className="card-header1">
                        <div className="card-title-group">
                            <span className="title-icon">
                               
                                <TrendingUp/>
                            </span>
                            <h2 className="card-title">Recent Sales</h2>
                        </div>

                        <button className='view-all-link' type='button' onClick={() => setActiveTab('tracker')}>
                            View all ↗
                        </button>
                    </div>

                    {/* Sales Items List */}
                    {recentSales.length === 0 ? (
                        <div style={{ alignItems: 'center', justifyContent: 'center', padding: '8px 10px', color: '#94a3b8',fontSize:'14px' }}>No sales logged yet</div>
                    ) : (
                        <div className="sales-list">
                            {recentSales.map((item) => (
                                <div key={item.id} className="sale-item">
                                    <div className="sale-info">
                                        <span className="client-name">{item.customerName}</span>
                                        <span className="service-details">
                                            {item.service} • {formatDate(item.saleDate)}
                                        </span>
                                    </div>
                                    <div className="sale-meta">
                                        <span className="sale-amount">{formatINR(item.proposalValue)}</span>
                                        <StatusBadge status={item.status} size="sm" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Card Footer */}
                    <div className="card-footer1">
                        <span className="total-count">
                            Total Sales Tracked: {sales.length}
                        </span>
                        <button className="add-sale-btn" type="button" onClick={()=> setIsAddSaleOpen(true)}>
                            + Add new sale
                        </button>
                    </div>
                </div>
                <div className="followups-card">
                    {/* Header */}
                    <div>
                        <div className="card-header1">
                            <div className="card-title-group">
                                <span className="title-icon">
                                 
                                    <Calendar/>
                                </span>
                                <h2 className="card-title">Upcoming Follow-ups</h2>
                            </div>
                            <span className="pending-badge">{pendingFollowups.length} Pending</span>
                        </div>

                        {/* Content */}
                        {pendingFollowups.length === 0 ? (
                            <div style={{alignItems:'center', justifyContent:'center', padding:'8px 10px', color:'#94a3b8',fontSize:'14px'}}>
                                <p>No follow-ups due right now!</p>
                            </div>
                        ) : (
                            <div className="card-content">
                            {pendingFollowups.map((item) => (
                                <div
                                    key={item.id}
                                    className={`followup-item ${item.completed ? 'is-completed' : ''}`}
                                >
                                    <div className="item-details">
                                        <div className="client-header">
                                            <span className="client-name">{item.customerName}</span>
                                            <span className="overdue-badge">{getRelativeDay(item.reminderDate)}</span>
                                        </div>
                                        <p className="item-description">{item.note}</p>
                                        <div className="item-time">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                           
                                            <span>{item.reminderTime}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className={`action-check-btn ${item.completed ? 'checked' : ''}`}
                                        onClick={() => toggleFollowUpComplete(item.id)}
                                        aria-label="Mark complete"
                                    >
                                        {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg> */}
                                        <Check/>
                                    </button>
                                </div>
                            ))}
                        </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="card-footer1">
                        <span className="footer-note">Reminders sync with Browser Notifications</span>

                        <button className='manage-link' type='button' onClick={() => setActiveTab('tracker')}>
                            Manage in Sales Tracker →
                        </button>
                    </div>
                </div>
            </div>

            <SaleFormModal 
                isOpen={isAddSaleOpen}
                onClose={() => setIsAddSaleOpen(false)}
            />
        </>
    );
}

export default DashboardView
