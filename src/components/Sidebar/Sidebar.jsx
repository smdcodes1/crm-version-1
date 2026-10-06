import React from 'react';
import { useState } from 'react';
import "./Sidebar.css";
import { LayoutDashboard, Users, FileText, Receipt, FolderKanban, TrendingUp, BarChart3, Settings, LogOut, Power, UserCheck } from "lucide-react";
import { useCRM } from '../../context/CRMContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase/supabaseClient';
import { useAuth } from '../../context/AuthContext';

// Placeholder data for navigation items
const primaryNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'quotations', label: 'Quotations', icon: FileText },
    { id: 'invoices', label: 'Invoices', icon: Receipt },
    { id: 'projects', label: 'Current Projects', icon: FolderKanban },
    { id: 'tracker', label: 'Sales Tracker', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
];

// const preferenceNavItems = [
//     { id: 'settings', label: 'Settings & Data', icon: Settings, href: '#', badge: 2 },
//     { id: 'signout', label: 'Logout', icon: Power, href: '#', isAction: true },
//     { id: 'signin', label: 'Login', icon: Power, href: '#' },
// ];
function Sidebar({ mobileOpen, onCloseMobile }) {
    // State for tracking the currently active item
    // const [activeItemId, setActiveItemId] = useState('settings');
    const { activeTab, setActiveTab, followUps, notifications,notificationStatus,setNotificationStatus } = useCRM();
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const pendingFollowUpsCount = followUps.filter((f) => !f.completed).length;
    const unreadNotifsCount = notifications.filter((n) => !n.read).length;
    // State to control sidebar visibility on mobile
    // const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Helper function to render an icon by its name
    // const renderIcon = (iconName, color = '#2D3748') => {
    //     // Dynamically loading icons from lucide-react if needed for a production build
    //     // but using SVG paths directly here for a single file component.
    //     // Paths are simplified representations.

    //     const iconStyles = {
    //         width: '20px',
    //         height: '20px',
    //         stroke: color,
    //         strokeWidth: '1.5',
    //         fill: 'none',
    //         strokeLinecap: 'round',
    //         strokeLinejoin: 'round'
    //     };

    //     switch (iconName) {
    //         case 'LayoutDashboard': return <svg style={iconStyles} viewBox="0 0 24 24"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>;
    //         case 'Users': return <svg style={iconStyles} viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
    //         case 'FileText': return <svg style={iconStyles} viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" x2="8" y1="13" y2="13"></line><line x1="16" x2="8" y1="17" y2="17"></line><line x1="10" x2="8" y1="9" y2="9"></line></svg>;
    //         case 'FileDollar': return <svg style={iconStyles} viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M12 18V10"></path><path d="M10 12h3a1 1 0 1 1 0 2h-2a1 1 0 1 0 0 2h3"></path></svg>;
    //         case 'FolderInput': return <svg style={iconStyles} viewBox="0 0 24 24"><path d="M2 11V4.5A1.5 1.5 0 0 1 3.5 3h6.39c.55 0 1.07.24 1.43.66l2.36 2.68c.36.42.88.66 1.43.66h5.89A1.5 1.5 0 0 1 22 8.5V11a2 2 0 0 0-2 2v2"></path><path d="M22 17v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path><path d="M10 18H14"></path></svg>;
    //         case 'TrendingUp': return <svg style={iconStyles} viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>;
    //         case 'BarChart3': return <svg style={iconStyles} viewBox="0 0 24 24"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>;
    //         case 'Settings': return <svg style={iconStyles} viewBox="0 0 24 24"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
    //         case 'Power': return <svg style={iconStyles} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" > <line x1="12" y1="2" x2="12" y2="12" /> <path d="M16.24 7.76a7.5 7.5 0 1 1-8.48 0" /></svg>
    //         default: return null;
    //     }

    // };
    const handleNavClick = async (tab) => {
        // if (tab === 'signout') {
        //     await supabase.auth.signOut();
        //     setUser(null);
        //     navigate('/login');
        //     return;
        // }
        // if (tab === 'signin') {
        //     navigate('/login');
        //     return;
        // }

        setActiveTab(tab);
        if (mobileOpen && onCloseMobile) {
            onCloseMobile(false);
        }

    };
    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to log out of CRM?')) {
            if (user?.id) {
                localStorage.removeItem(`notifications_enabled_${user.id}`);
                setNotificationStatus('default');

                await supabase.auth.signOut();
                setUser(null);
                navigate('/login');
              

            } else {
                alert('You are currently logged out.');
            }
        }
    }
    // const NavItem = ({ item }) => {
    //     const isActive = item.id === activeTab;
    //     // Check if item should have light purple styling without being active (for actions like Sign In)
    //     const isSpecialAction = item.isAction && !isActive;

    //     // Determine icon color based on item state
    //     const iconColor = isActive ? '#7A1CFC' : isSpecialAction ? '#d0312d' : '#2D3748';

    //     // Use proper color for text based on state
    //     const textColor = isActive ? '#7A1CFC' : isSpecialAction ? '#d0312d' : '#2D3748';

    //     return (
    //         <a
    //             href={item.href}
    //             className={`nav-item ${isActive ? 'active' : ''}`}
    //             onClick={(e) => {
    //                 e.preventDefault();
    //                 handleNavClick(item.id);
    //             }}
    //         >
    //             <div className="nav-item-left">
    //                 <div className="icon-wrapper">
    //                     {renderIcon(item.icon, iconColor)}
    //                 </div>
    //                 <span className="nav-item-text" style={{ color: textColor }}>{item.name}</span>
    //             </div>
    //             {item.badge && (
    //                 <span className="badge">{item.badge}</span>
    //             )}
    //         </a>
    //     );
    // };
    return (
        <div className="sidebar-component">
            {/* Mobile Header with Toggle */}
            <div className="mobile-toggle-header">
                <button className="toggle-btn" onClick={() => onCloseMobile(true)} aria-label="Open Sidebar">
                    <svg style={{ width: '28px', height: '28px', stroke: '#2D3748', strokeWidth: '1.5' }} viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                <div className="main-title" style={{ fontSize: '18px', marginLeft: '12px' }}>CRM Sales</div>
            </div>

            {/* Mobile Backdrop Overlay */}
            <div className={`mobile-overlay ${mobileOpen ? 'active' : ''}`} onClick={() => onCloseMobile(false)}></div>

            {/* Sidebar Container */}
            <aside className={`sidebar-container ${mobileOpen ? 'open' : ''}`}>
                {/* Header with Logo & Text */}
                <div className="sidebar-header">
                    <div className="logo-box">CRM</div>
                    <div className="title-box">
                        <span className="main-title">CRM</span>
                        <span className="sub-title">Sales Management</span>
                    </div>
                </div>

                <div className="nav-sections">
                    {/* Divider below main title */}
                    <div className="section-divider"></div>

                    {/* Primary Navigation Section */}
                    <nav className="nav-section primary-nav">
                        {primaryNavItems.map((item) => {
                            const isActive = activeTab === item.id;
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`primary-nav-button ${isActive ? 'activate' : 'deactivate'}`}>
                                    <div className='primary-nav-container'>
                                        <Icon className={`primary-nav-icon ${isActive ? 'activate' : 'deactivate'}`} />
                                        <span>{item.label}</span>
                                    </div>
                                    {
                                        item.id === 'tracker' && pendingFollowUpsCount > 0 && (
                                            <span className='badge'>
                                                {pendingFollowUpsCount}
                                            </span>
                                        )}
                                </button>
                            );
                        }
                        )}
                    </nav>

                    {/* Section Divider */}
                    <div className="section-divider"></div>

                    {/* Preferences Section */}
                    <nav className="nav-section preferences-nav">
                        <h3 className="category-label">PREFERENCES</h3>
                        {/* {preferenceNavItems
                            .filter(item => {
                                if (item.id === 'signout') return !!user;
                                if (item.id === 'signin') return !user;
                                return true;
                            })
                            .map(item => (
                                <NavItem key={item.id} item={item} />
                            ))} */}

                        <button
                            id='nav-item-settings'
                            onClick={() => handleNavClick('settings')}
                            className={`settings-nav-button ${activeTab === 'settings' ? 'activate' : 'deactivate'}`}
                        >
                            <div className='settings-nav-container'>
                                <Settings className={`settings-nav-icon ${activeTab === 'settings' ? 'activate' : 'deactivate'}`} />
                                <span>Settings & Data</span>
                            </div>
                            {unreadNotifsCount > 0 && (
                                <span className='badge'>
                                    {unreadNotifsCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <button
                                id='sidebar-logout-btn'
                                onClick={handleLogout}
                                className='logout-nav-button'
                            >
                                <Power className='logout-nav-icon' />
                                <span className='logout-nav-text'>Logout</span>
                            </button>
                        ) : (
                            <button
                                id='sidebar-login-btn'
                                onClick={() => navigate('/login')}
                                className='login-nav-button'
                            >
                                <UserCheck className='login-nav-icon' />
                                <span className='login-nav-text'>Login</span>
                            </button>
                        )}


                    </nav>
                </div>
            </aside>
        </div>
    );
}

export default Sidebar
