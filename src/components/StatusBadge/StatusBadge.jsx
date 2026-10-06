import React from 'react';
import "./StatusBadge.css";

export const StatusBadge = ({ status, size }) => {
  const sizeClasses = size === 'sm' ? 'badge-sm' : 'badge-md';

  // Customer Statuses: Following, Won, Lost
  // Sale Statuses: Following, Proposal Sent, Negotiation, Won, Lost
  // Quotation Statuses: Draft, Sent, Accepted, Rejected, Expired
  // Invoice Statuses: Unpaid, Partially Paid, Paid, Overdue
  // Project Statuses: Planning, In Progress, On Hold, Completed

  let colorClasses = 'badge-gray';

  switch (status) {
    // Green / Won / Paid / Accepted / Completed
    case 'Won':
    case 'Accepted':
    case 'Paid':
    case 'Completed':
    case 'Approved':
      colorClasses = 'badge-emerald';
      break;

    // Blue / Purple / Active / In Progress / Proposal Sent / Negotiation
    case 'Following':
      colorClasses = 'badge-blue';
      break;
    case 'Proposal Sent':
      colorClasses = 'badge-violet';
      break;
    case 'Negotiation':
      colorClasses = 'badge-indigo';
      break;
    case 'In Progress':
      colorClasses = 'badge-sky';
      break;

    // Yellow / Amber / Partially Paid / Planning / Draft / Sent
    case 'Partially Paid':
    case 'Planning':
    case 'Draft':
    case 'Sent':
      colorClasses = 'badge-amber';
      break;

    // Red / Lost / Rejected / Overdue / Expired / On Hold
    case 'Lost':
    case 'Rejected':
    case 'Overdue':
    case 'Expired':
    case 'Cancelled':
      colorClasses = 'badge-rose';
      break;
    case 'Unpaid':
      colorClasses = 'badge-orange';
      break;
    case 'On Hold':
      colorClasses = 'badge-zinc';
      break;

    default:
      colorClasses = 'badge-gray';
  }

  return (
    <span className={`status-badge ${sizeClasses} ${colorClasses}`}>
      <span className="status-badge-dot" />
      {status}
    </span>
  );
};
