import React, { useRef, useState, useEffect } from 'react';
import caretIconNew from '../../assets/caret_icon_new.svg';
import { Menu, Search, Bell, Check, Calendar, X } from 'lucide-react';
import "./NavBar.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { useCRM } from '../../context/CRMContext';
import { supabase } from '../../supabase/supabaseClient';
import { getRelativeDay, formatINR } from '../../utils/Formatters';

const CheckCircleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="8.5 12.5 11 15 15.5 9.5" />
    </svg>
);
function NavBar({ onOpenMobileMenu }) {
    const navigate = useNavigate();
    const { activeTab, setActiveTab, notifications, markNotificationRead, clearNotifications, followUps, toggleFollowUpComplete, deleteFollowUp, customers, sales, quotations, invoices, notificationStatus, setNotificationStatus } = useCRM();
    const { user, setUser } = useAuth();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const notifRef = useRef(null);
    const searchRef = useRef(null);
    // Close dropdowns on outside click 
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const pendingFollowups = followUps.filter((f) => !f.completed);
    const unreadNotifCount = notifications.filter((n) => !n.read).length + pendingFollowups.length;
    // Search Results
    const filteredCustomers = searchQuery.trim()
        ? customers.filter(
            (c) =>
                c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.industry.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const filteredSales = searchQuery.trim()
        ? sales.filter(
            (s) =>
                s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.service.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const filteredQuotations = searchQuery.trim()
        ? quotations.filter(
            (q) =>
                q.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const filteredInvoices = searchQuery.trim()
        ? invoices.filter(
            (i) =>
                i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.customerName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const totalResultsCount = filteredCustomers.length + filteredSales.length + filteredQuotations.length + filteredInvoices.length;

    const handleLogout = async () => {
        if (user?.id) {
            localStorage.removeItem(`notifications_enabled_${user.id}`);
            setNotificationStatus('default');
        }
        await supabase.auth.signOut();
        setUser(null);
        navigate('/login');
    };
    return (
        <header className="navbar-container">
            <div className="navbar-content">
                {/* Left Title */}
                <div className="navbar-left">
                    {activeTab === 'dashboard' ?
                        <h1 className="page-title">Dashboard</h1> : activeTab === 'customers' ?
                            <h1 className="page-title">Customers</h1> : activeTab === 'quotations' ?
                                <h1 className="page-title">Quotations</h1> : activeTab === 'invoices' ?
                                    <h1 className="page-title">Invoices</h1> : activeTab === 'projects' ?
                                        <h1 className="page-title">Current Projects</h1> : activeTab === 'reports' ?
                                            <h1 className="page-title">Reports</h1> : activeTab === 'settings' ?
                                                <h1 className="page-title">Settings</h1> : activeTab === 'signout' ?
                                                    <h1 className="page-title">Sign In / Register</h1> : activeTab === 'tracker' ?
                                                        <h1 className="page-title">Sales Tracker</h1> : activeTab}
                </div>

                {/* Search Bar */}
                <div className="navbar-center" ref={searchRef}>
                    <div className="search-wrapper">
                        <svg
                            className="search-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            id='global-search-input'
                            type="text"
                            className="search-input"
                            placeholder="Search customers, sales, quotes, invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                        />
                        {searchQuery && (
                            <button
                                style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translate(0%, -50%)', color: 'rgb(156 163 175)', border: 'none', background: 'none', cursor: 'pointer' }}
                                onClick={() => setSearchQuery('')}
                            >
                                <X />
                            </button>
                        )}
                    </div>
                    {/* Search Results Dropdown */}
                    {isSearchFocused && searchQuery.trim().length > 0 && (
                        <div className='search-dropdown'>
                            {totalResultsCount === 0 ? (
                                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'rgb(107, 114, 128)' }}>
                                    No matching results found for "{searchQuery}"
                                </div>
                            ) : (
                                <div style={{ rowGap: '12px' }}>
                                    {filteredCustomers.length > 0 && (
                                        <div>
                                            <div className='search-dropdown-label'>Customers ({filteredCustomers.length})</div>
                                            {filteredCustomers.map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => {
                                                        setActiveTab('customers');
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className='search-dropdown-button'
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: 'rgb(17 24 39)' }}>{c.companyName}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'rgb(107 114 128)' }}>{c.contactPerson} • {c.industry}</div>
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', color: '#7c3aed', fontWeight: 600 }}>View</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {filteredSales.length > 0 && (
                                        <div>
                                            <div className='search-dropdown-label'>
                                                Sales ({filteredSales.length})
                                            </div>
                                            {filteredSales.map((s) => (
                                                <div key={s.id}
                                                    className='search-dropdown-button'
                                                    onClick={() => {
                                                        setActiveTab('sales');
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: 'rgb(17, 24, 39)' }}>{s.customerName}</div>
                                                        <div style={{ fontSize: '0.875rem', color: 'rgb(107 114 128)' }}>{s.service}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 600, color: '#1a202c' }}>{formatINR(s.proposalValue)}</div>
                                                        <div style={{ fontSize: '0.875rem', color: "#6b7280" }}>{s.status}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {filteredQuotations.length > 0 && (
                                        <div>
                                            <div className='search-dropdown-label'>
                                                Quotations ({filteredQuotations.length})
                                            </div>
                                            {filteredQuotations.map((q) => (
                                                <div
                                                    key={q.id}
                                                    className='search-dropdown-button'
                                                    onClick={() => {
                                                        setActiveTab('quotations');
                                                        setIsSearchFocused(false);
                                                        setSearchQuery("");
                                                    }}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: '#111827' }}>{q.quotationNumber} — {q.customerName}</div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status: {q.status}</div>
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#111827' }}>{formatINR(q.total)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {filteredInvoices.length > 0 && (
                                        <div>
                                            <div className='search-dropdown-label'>Invoices ({filteredInvoices.length})</div>
                                            {filteredInvoices.map((i) => (
                                                <div
                                                    key={i.id}
                                                    onClick={() => {
                                                        setActiveTab('invoices');
                                                        setIsSearchFocused(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className='search-label-button'
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 500, color: '#111827' }}>{i.invoiceNumber} — {i.customerName}</div>
                                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status: {i.paymentStatus}</div>
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#111827' }}>{formatINR(i.total)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Action Icons & User Info */}
                <div className="navbar-right"  >
                    <div style={{ position: 'relative' }} ref={notifRef} >
                        <button className="notification-btn" aria-label="Notifications" onClick={() => setIsNotifOpen(!isNotifOpen)}>
                            <svg
                                className="bell-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.75"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {unreadNotifCount > 0 && (
                                <span className="notification-badge"></span>
                            )}
                        </button>
                        {isNotifOpen && (
                            <div className='notification-open' >
                                <div className='notification-open-header'>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <h4 style={{ fontWeight: 600, color: '#111827' }}>Reminders & Alerts</h4>
                                        {unreadNotifCount > 0 && (
                                            <span style={{ fontSize: '0.875rem', backgroundColor: '#ede9fe', color: '#6d28d9', padding: '0.125rem 0.5rem', borderRadius: '50%', fontWeight: 600 }}>
                                                {unreadNotifCount}
                                            </span>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <button onClick={clearNotifications} style={{ fontSize: '0.75rem', color: '#9ca3af', border: 'none', background: 'none', cursor: 'pointer' }}>
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div style={{ maxHeight: '20rem', overflowY: 'auto' }}>
                                    {pendingFollowups.length > 0 && (
                                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 243, 255, 0.3)' }}>
                                            <div className='pending-followup-header'>
                                                <Calendar />
                                                <span>Pending Follow-ups ({pendingFollowups.length})</span>
                                            </div>
                                            <div style={{ gap: '0.5rem' }}>
                                                {pendingFollowups.map((fu) => (
                                                    <div key={fu.id} style={{ background: '#fff', padding: '0.625rem', borderRadius: '0.5rem', border: '1px solid #ede9fe', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                                        <div>
                                                            <div style={{ fontWeight: 500, color: '#111827', fontSize: '0.875rem' }}>{fu.customerName}</div>
                                                            <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '0.125rem' }}>{fu.note}</p>
                                                            <div style={{ fontSize: '10px', color: '#6d28d9', fontWeight: 600, marginTop: '0.25rem' }}>{getRelativeDay(fu.reminderDate)} at {fu.reminderTime}</div>
                                                        </div>
                                                        <button title='Mark Completed' style={{ padding: '0.25rem', color: '#9ca3af', borderRadius: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => toggleFollowUpComplete(fu.id)}>
                                                            <CheckCircleIcon />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {/*Notifications List*/}
                                    {notifications.length === 0 && pendingFollowups.length === 0 ? (
                                        <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>All caught up! No active follow-ups or alerts.</div>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif.id} onClick={() => markNotificationRead(notif.id)} className={`navbar-notification ${notif.read ? 'navbar-notification-read' : 'navbar-notification-unread'}`}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                                    <div>
                                                        <div style={{ fontWeight: 500, fontSize: '0.875rem', color: '#111827' }}>{notif.title}</div>
                                                        <p style={{ fontSize: '11px', color: 'rgb(75, 85, 99)', marginTop: '0.125rem' }}>{notif.body}</p>
                                                    </div>
                                                    {!notif.read && (
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#7c3aed', marginTop: '0.25rem', flexShrink: 0 }} />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>


                    <div className="divider"></div>

                    <div className="user-profile">
                        {user ? user?.full_name : "Login"}
                        <img style={{ color: "#000" }} src={caretIconNew} alt="" />
                        <div className='dropdown'>
                            {user ? <p onClick={handleLogout}>Sign out of App</p> : <p onClick={() => navigate("/login")}>Sign into App</p>}
                        </div>
                        {/* <div className="user-info">
                            <span className="user-name">John Doe</span>
                            <span className="user-role">Demo Mode</span>
                        </div> */}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default NavBar
