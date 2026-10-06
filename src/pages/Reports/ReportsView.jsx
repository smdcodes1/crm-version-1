import React from 'react';
import StatCard from '../../components/StatCard/StatCard';
import {TrendingUp,Award,DollarSign,Users,Target} from "lucide-react";
import BarChart from '../../components/BarChart/BarChart';
import './ReportsView.css';
import { useCRM } from '../../context/CRMContext';
import { formatINR } from '../../utils/Formatters';
// const statsData = [
//   {
//     title: 'TOTAL WON REVENUE',
//     value: '₹1,60,000',
//     subtitle: 'Closed sales total',
//     icon: <ReceiptDollarIcon />,
//     colorScheme: 'green',
//   },
//   {
//     title: 'WIN RATE',
//     value: '40%',
//     subtitle: '2 of 5 opportunities',
//     icon: <CheckCircleIcon />,
//     colorScheme: 'purple',
//   },
//   {
//     title: 'AVERAGE DEAL SIZE',
//     value: '₹80,000',
//     subtitle: 'Per closed deal',
//     icon: <TrendingUpIcon />,
//     colorScheme: 'blue',
//     valueColor: '#7c3aed',
//   },
//   {
//     title: 'PIPELINE VOLUME',
//     value: '₹4,85,000',
//     subtitle: 'Total proposal value',
//     icon: <DocumentIcon />,
//     colorScheme: 'red',
//   },
// ];
// const INDUSTRY_DATA = [
//   { label: 'IT & Software', count: 1, color: '#7c3aed' },
//   { label: 'Retail & E-commerce', count: 1, color: '#8b5cf6' },
//   { label: 'Manufacturing', count: 1, color: '#a855f7' },
//   { label: 'Healthcare', count: 1, color: '#c084fc' },
//   { label: 'Logistics & Supply', count: 1, color: '#e9d5ff' },
// ];
const COLORS = ['#7c3aed', '#9333ea', '#a855f7', '#c084fc', '#e9d5ff', '#6366f1'];
// const clients = [
//     { id: 1, name: 'Apex Logistics', closedDeals: 1, revenue: '₹1,20,000' },
//     { id: 2, name: 'XYZ Ltd', closedDeals: 1, revenue: '₹40,000' },
//   ];
function ReportsView() {
  const {customers, sales}= useCRM();
  // Metrics
  const wonSales= sales.filter((s)=> s.status === 'Won');
  const totalRevenue = wonSales.reduce((sum, s) => sum + (s.proposalValue || 0), 0);
  const totalPipeline = sales.reduce((sum, s) => sum + (s.proposalValue || 0), 0);
  const winRate = sales.length > 0 ? Math.round((wonSales.length / sales.length) * 100) : 0;
  const avgDealSize = wonSales.length > 0 ? Math.round(totalRevenue / wonSales.length) : 0;

  // Industry breakdown
  const industryMap= {};
  customers.forEach((c) => {
    const ind = c.industry || 'Other';
    industryMap[ind] = (industryMap[ind] || 0) + 1;
  });
  const industryData = Object.keys(industryMap).map((key) => ({
    name: key,
    value: industryMap[key],
  }));
const total = industryData.reduce((sum, item) => sum + item.value, 0);
  const size = 220;
  const strokeWidth = 34;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Render individual segmented stroke rings
  let accumulatedAngle = -90;
// Top customers by revenue
const customerRevenueMap = {};
wonSales.forEach((s) => {
  if (!customerRevenueMap[s.customerName]) {
    customerRevenueMap[s.customerName] = { name: s.customerName, revenue: 0, deals: 0 };
  }
  customerRevenueMap[s.customerName].revenue += s.proposalValue || 0;
  customerRevenueMap[s.customerName].deals += 1;
  });
const topCustomers = Object.values(customerRevenueMap).sort((a, b) => b.revenue - a.revenue);
// const subtitle = "Accounts with highest closed deal volume";

  return (
    <>
      <div className='title-header'>
        <div className="title-group">
          <h2>Reports & Analytics</h2>
          <p>Performance metrics, revenue summary, and industry breakdown.</p>
        </div>
        {/* <button>Add Report</button> */}
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
              title="Total Won Revenue"
              value={formatINR(totalRevenue)}
              subtitle="Closed sales total"
              icon={<DollarSign/>}
              colorScheme="green"
              valueColor="#7c3aed"
          />
          <StatCard
              // key={index}
              title="Win Rate"
              value={`${winRate}%`}
              subtitle={`${wonSales.length} of ${sales.length} opportunities`}
              icon={<Award/>}
              colorScheme="purple"
              // valueColor={stat.valueColor}
          />
          <StatCard
              // key={index}
              title="Average Deal Size"
              value={formatINR(avgDealSize)}
              subtitle="Per closed deal"
              icon={<TrendingUp/>}
              colorScheme="blue"
              // valueColor="#7c3aed"
          />
          <StatCard
              // key={index}
              title="Pipeline Volume"
              value={formatINR(totalPipeline)}
              subtitle="Total proposal value"
              icon={<Target/>}
              colorScheme="red"
              // valueColor="#7c3aed"
          />
        </div>
      </div>
      <div className='reports-bottom-wrapper'>
        <div className='reports-chart-wrapper'>
          <BarChart
            data={[
              { month: 'Jan', revenue: 35000 },
              { month: 'Feb', revenue: 52000 },
              { month: 'Mar', revenue: 78000 },
              { month: 'Apr', revenue: 64000 },
              { month: 'May', revenue: 95000 },
              { month: 'Jun', revenue: 110000 },
              { month: 'Jul', revenue: 145000 },
              { month: 'Aug', revenue: 160000 },
              { month: 'Sep', revenue: totalRevenue > 0 ? totalRevenue : 180000 },
            ]}
            bars={[
              {
                key: 'revenue',
                label: 'Revenue',
                barClass: 'bar-revenue',
                legendClass: 'legend-revenue',
                tooltipClass: 'tooltip-revenue',
              }
            ]}
            title="Monthly Sales Revenue"
            content="Historical performance & revenue run-rate "
          />
        </div>

        <div className='reports-industry-distribution-card'>

          {/* Card Header */}
          <div className="reports-chart-header">
            <h3 className="reports-chart-title">Industry Distribution</h3>
            <p className="reports-chart-subtitle">Customer base segmentation</p>
          </div>

          <hr className="header-divider" />

          {/* Donut Chart Visual */}
          <div className="reports-chart-visual-wrapper">
            <svg viewBox={`0 0 ${size} ${size}`} className="donut-svg">
              {industryData.map((item, index) => {
                const fraction = item.value / total;
                const strokeLength = fraction * circumference;
                // 4px gap between slices
                const gapLength = 4;
                const dashArray = `${strokeLength - gapLength} ${circumference - (strokeLength - gapLength)}`;
                const currentAngle = accumulatedAngle;
                accumulatedAngle += fraction * 360;

                return (
                  <circle
                    key={index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    strokeDashoffset={0}
                    transform={`rotate(${currentAngle} ${size / 2} ${size / 2})`}
                    className="donut-segment"
                  />
                );
              })}
            </svg>
          </div>

          <hr className="chart-bottom-divider" />

          {/* Segment Legend */}
          <ul className="reports-legend-list">
            {industryData.map((item, index) => (
              <li key={index} className="reports-legend-item">
                <div className="reports-legend-item-left">
                  <span
                    className="reports-legend-dot"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="reports-legend-label">{item.name}</span>
                </div>
                <span className="reports-legend-count">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='trc-card-container'>
        {/* Card Header */}
        <div className="trc-header">
          <div className="trc-title-group">
            <h2 className="trc-title">Top Revenue Clients</h2>
            <p className="trc-subtitle">Accounts with highest closed deal volume</p>
          </div>
          <span className="trc-badge">
            {topCustomers.length} closed account(s)
          </span>
        </div>

        {/* Table Content */}
        {topCustomers.length === 0 ? (
          <p style={{fontSize:'14px', color:'#94a3b8',padding:'1.5rem 0',textAlign:'center'}}>
            No won deals recorded yet.</p>
        ) : (
          <div className="trc-table-wrapper">
          <table className="trc-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Company Name</th>
                <th>Closed Deals</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((client, index) => (
                <tr key={client.id || index} >
                  <td className="trc-col-id">{index + 1}</td>
                  <td className="trc-col-name">{client.name}</td>
                  <td className="trc-col-deals">{client.deals}</td>
                  <td className="trc-col-rev">{formatINR(client.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        
      </div>
    </>
  );
}

export default ReportsView

