import React from 'react'
import "./StatCard.css";
function StatCard({ title, value, subtitle, icon, colorScheme = 'purple', valueColor }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-card-icon-wrapper ${colorScheme}`}>
          {icon}
        </div>
      </div>
      <div 
        className="stat-card-value" 
        style={valueColor ? { color: valueColor } : {}}
      >
        {value}
      </div>
      <div className="stat-card-subtitle">{subtitle}</div>
    </div>
  );
}

export default StatCard

// SVG Icon Helpers

// export const CustomersIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//     <circle cx="9" cy="7" r="4" />
//     <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//     <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//   </svg>
// );

// export const FollowingIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//     <circle cx="8.5" cy="7" r="4" />
//     <polyline points="17 11 19 13 23 9" />
//   </svg>
// );

// export const TrophyIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
//     <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
//     <path d="M4 22h16" />
//     <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
//     <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
//     <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
//   </svg>
// );

// export const LostSalesIcon = () => (
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <circle cx="12" cy="12" r="10" />
//     <line x1="15" y1="9" x2="9" y2="15" />
//     <line x1="9" y1="9" x2="15" y2="15" />
//   </svg>
// );

// export const DocumentIcon = () => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     width="24" 
//     height="24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//     <polyline points="14 2 14 8 20 8" />
    
//     <line x1="9" y1="9" x2="10" y2="9" />
//     <line x1="9" y1="13" x2="15" y2="13" />
//     <line x1="9" y1="17" x2="15" y2="17" />
//   </svg>
// );

// export const CheckCircleIcon = () => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     width="24" 
//     height="24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2.5" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <circle cx="12" cy="12" r="9" />
//     <polyline points="8.5 12.5 11 15 15.5 9.5" />
//   </svg>
// );

// export const ClockIcon = () => (
//   <svg 
//   xmlns="http://www.w3.org/2000/svg" 
//   viewBox="0 0 24 24" 
//   width="24" 
//   height="24" 
//   fill="none" 
//   stroke="currentColor" 
//   strokeWidth="2.5" 
//   strokeLinecap="round" 
//   strokeLinejoin="round"
// >
//   <circle cx="12" cy="12" r="9" />
//   <polyline points="12 7 12 12 15 14" />
// </svg>
// );

// export const ReceiptDollarIcon = () => (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg" 
//     viewBox="0 0 24 24" 
//     width="24" 
//     height="24" 
//     fill="none" 
//     stroke="currentColor" 
//     strokeWidth="2" 
//     strokeLinecap="round" 
//     strokeLinejoin="round"
//   >
//     <path d="M4 2.5l2.67 1.5L9.33 2.5 12 4l2.67-1.5L17.33 4 20 2.5v19l-2.67-1.5L14.67 21.5 12 20l-2.67 1.5L6.67 20 4 21.5V2.5z" />
    
//     <path d="M12 7v10" />
//     <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0c0 3 5 2 5 5a2.5 2.5 0 0 1-5 0" />
//   </svg>
// );

// export const FolderKanbanIcon = () => (
//     <svg 
//       xmlns="http://www.w3.org/2000/svg" 
//       viewBox="0 0 24 24" 
//       width="24" 
//       height="24" 
//       fill="none" 
//       stroke="currentColor" 
//       strokeWidth="2" 
//       strokeLinecap="round" 
//       strokeLinejoin="round"
//     >
//       <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
      
//       <path d="M8 10v4" />
//       <path d="M12 10v2" />
//       <path d="M16 10v6" />
//     </svg>
// );

// export const TrendingUpIcon= () => (
//     <svg 
//       xmlns="http://www.w3.org/2000/svg" 
//       viewBox="0 0 24 24" 
//       width="24" 
//       height="24" 
//       fill="none" 
//       stroke="currentColor" 
//       strokeWidth="2.5" 
//       strokeLinecap="round" 
//       strokeLinejoin="round"
//     >
//       <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      
//       <polyline points="16 7 22 7 22 13" />
//     </svg>
// );
