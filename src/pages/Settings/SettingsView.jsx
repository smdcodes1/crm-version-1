import { Building,Save,CheckCircle2,Bell,Database,Download,RotateCcw } from 'lucide-react';
import React, { useState,useEffect } from 'react';
import './SettingsView.css';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMContext';
import { requestNotificationPermission,triggerNotification } from '../../utils/Notification';
function SettingsView() {
  // const [formData, setFormData] = useState({
  //   companyLegalName: '',
  //   gstinTaxId: '',
  //   billingEmail: '',
  //   officialPhone: '',
  //   defaultGstRate: '',
  //   baseCurrency: 'INR (₹)',
  // });
   const {profile, updateProfile,user }= useAuth();
    const {customers, sales, quotations, invoices, projects, followUps,notificationStatus,setNotificationStatus }= useCRM();
  
  // const [notifState, setNotifState] = useState(() =>
  //   typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  // );
  
  const [companyName, setCompanyName]= useState(profile.companyName);
  const [gstin, setGstin]= useState(profile.gstin);
  const [email, setEmail]= useState(profile.email);
  const [phone, setPhone]= useState(profile.phone);
  const [defaultTax, setDefaultTax]= useState(18);
  const [currency,setCurrency] = useState('INR (₹)');
  const [savedSuccess, setSavedSuccess]= useState(false);
 
  // const handleEnableNotifications = async () => {
  //   if (!('Notification' in window)) {
  //     alert('This browser does not support desktop notifications.');
  //     return;
  //   }

  //   try {
  //     const permission = await Notification.requestPermission();
  //     if (permission === 'granted') {
  //       setNotificationStatus('Enabled');
  //     } else if (permission === 'denied') {
  //       setNotificationStatus('Blocked by Browser');
  //     } else {
  //       setNotificationStatus('Default');
  //     }
  //   } catch (err) {
  //     console.error('Error requesting notification permission:', err);
  //   }
  // };
  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationStatus('granted');
      
      // Save to localStorage if currentUser exists
      if (user?.id) {
        localStorage.setItem(`notifications_enabled_${user.id}`, 'granted');
      }

      triggerNotification(
        'Notifications Enabled!',
        'CRM will now alert you for upcoming customer follow-up reminders.',
        'followup'
      );
    } else {
      setNotificationStatus('denied');
      if (user?.id) {
        localStorage.setItem(`notifications_enabled_${user.id}`, 'denied');
      }
    }
  };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ companyName, gstin, email, phone });
    setSavedSuccess(true);
    triggerNotification('Settings Saved', 'Organization details updated.');
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // const handleDownloadBackup = () => {
  //   // Example backup logic: collect data and trigger JSON download
  //   const sampleData = {
  //     timestamp: new Date().toISOString(),
  //     crmRecords: 'Sample CRM export dataset',
  //   };
  //   const blob = new Blob([JSON.stringify(sampleData, null, 2)], {
  //     type: 'application/json',
  //   });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = `crm-backup-${Date.now()}.json`;
  //   link.click();
  //   URL.revokeObjectURL(url);
  // };
  const handleDownloadBackup = ()=> {
    const exportData = {
      customers,
      sales,
      quotations,
      invoices,
      projects,
      followUps,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `crm_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };
  const handleResetData = () => {
    const confirmReset = window.confirm(
      'Are you sure you want to reset all the data back to the default demonstration dataset?'
    );
    if (confirmReset) {
      // LocalStorage reset logic
      localStorage.clear();
      window.location.reload();
    }
  };
  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
      return;
    }

    if (Notification.permission === 'denied') {
      setNotificationStatus('denied');
      return;
    }

    if (user?.id) {
      const stored = localStorage.getItem(`notifications_enabled_${user.id}`);
      if (stored === 'granted' && Notification.permission === 'granted') {
        setNotificationStatus('granted');
      } else {
        // If new user or preference was removed on logout
        setNotificationStatus('default');
      }
    } else {
      setNotificationStatus('default');
    }
  }, [user?.id]);
  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Settings & Preferences</h2>
          <p>Manage your organization profile, taxation defaults, alerts and data backups.</p>
        </div>
        {/* <button>Add Sale</button> */}
      </div>
      <div className='org-profile-wrapper'>
        <div className="org-card">
          {/* Header with Title & Icon */}
          <div className="org-header">
            <Building color='#7c3aed'/>
           
            <h2>Organization &amp; Tax Profile</h2>
          </div>

          {/* Profile Details Form */}
          <form className="org-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Company Legal Name */}
              <div className="form-group">
                <label htmlFor="companyLegalName">Company Legal Name</label>
                <input
                  id="companyLegalName"
                  name="companyLegalName"
                  type="text"
                  className="form-input"
                  value={companyName}
                  onChange={(e)=> setCompanyName(e.target.value)}
                />
              </div>

              {/* GSTIN / Tax ID */}
              <div className="form-group">
                <label htmlFor="gstinTaxId">GSTIN / Tax ID</label>
                <input
                  id="gstinTaxId"
                  name="gstinTaxId"
                  type="text"
                  className="form-input"
                  value={gstin}
                  onChange={(e)=> setGstin(e.target.value)}
                />
              </div>

              {/* Billing Support Email */}
              <div className="form-group">
                <label htmlFor="billingEmail">Billing Support Email</label>
                <input
                  id="billingEmail"
                  name="billingEmail"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e)=> setEmail(e.target.value)}
                />
              </div>

              {/* Official Phone Number */}
              <div className="form-group">
                <label htmlFor="officialPhone">Official Phone Number</label>
                <input
                  id="officialPhone"
                  name="officialPhone"
                  type="text"
                  className="form-input"
                  value={phone}
                  onChange={(e)=> setPhone(e.target.value)}
                />
              </div>

              {/* Default GST Rate (%) */}
              <div className="form-group">
                <label htmlFor="defaultGstRate">Default GST Rate (%)</label>
                <input
                  id="defaultGstRate"
                  name="defaultGstRate"
                  type="text"
                  className="form-input"
                  value={defaultTax}
                  onChange={(e)=> setDefaultTax(e.target.value)}
                />
              </div>

              {/* Base Currency */}
              <div className="form-group">
                <label htmlFor="baseCurrency">Base Currency</label>
                <input
                  id="baseCurrency"
                  name="baseCurrency"
                  type="text"
                  className="form-input"
                  value={currency}
                  onChange={(e)=> setCurrency(e.target.value)}
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="form-actions">
             {savedSuccess ? 
             <div style={{fontSize:'12px',fontWeight:600,color:'#7c3aed',display:'flex',gap:'1px',alignItems:'center'}}>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="8 12 11 15 16 9" />
              </svg> */}
              <CheckCircle2 color='#03ac13'/>
              <span> Preferences saved successfully!</span>
             </div>
            : <span />
            }
              <button type="submit" className="btn-save">
                <Save />
               
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className='alerts-notifications-wrapper'>
        <div className="alerts-card">
          {/* Section Header */}
          <div className="alerts-header">
            <Bell color='#7c3aed'/>
          
            <h2>Follow-up Alerts &amp; Notifications</h2>
          </div>

          {/* Content Body */}
          <div className="alerts-body">
            <div className="alerts-info">
              <h3>Browser Push Notifications</h3>
              <p>Receive timely desktop popups when scheduled sales reminders or follow-ups arrive.</p>
              <div className="alerts-status">
                Status:{' '}
                <span
                  className={`status-badge-text ${notificationStatus === 'granted' ? 'enabled' : notificationStatus === 'denied' ? 'disabled' : ''
                    }`}
                >
                  {notificationStatus === 'granted' ? 'Enabled & Active' : notificationStatus === 'denied' ? 'Blocked by Browser' : 'Pending Permission'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-enable-notifications"
              onClick={handleEnableNotifications}
            >
             {notificationStatus === 'granted' ? 'Send Test Alert' : 'Enable Notifications'}
            </button>
          </div>
        </div>
      </div>

      <div className='data-backup-wrapper'>
        <div className="data-backup-card">
          {/* Header */}
          <div className="data-backup-header">
            <Database color='#7c3aed'/>
           
            <h2>Data Management &amp; Backup</h2>
          </div>

          {/* Action Boxes Grid */}
          <div className="cards-grid">
            {/* Export All Records Box */}
            <div className="action-box box-export">
              <div className="action-box-info">
                <h3>Export All Records</h3>
                <p>
                  Download your complete CRM dataset including customers,
                  quotations, and invoices in standard JSON format.
                </p>
              </div>
              <div className="btn-action-container">
                <button
                  type="button"
                  className="btn-download"
                  onClick={handleDownloadBackup}
                >
                  <Download />
                  
                  <span>Download JSON Backup</span>
                </button>
              </div>
            </div>

            {/* Reset Demo Data Box */}
            <div className="action-box box-reset">
              <div className="action-box-info">
                <h3>Reset Demo Data</h3>
                <p>
                  Restore initial sample customers, quotations, sales pipelines,
                  and project boards.
                </p>
              </div>
              <div className="btn-action-container">
                <button
                  type="button"
                  className="btn-reset"
                  onClick={handleResetData}
                >
                  <RotateCcw />
                 
                  <span>Reset Local Storage</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingsView

