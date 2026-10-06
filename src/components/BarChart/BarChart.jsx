import React from 'react'
import { useState } from 'react';
import "./BarChart.css";
// const defaultData = [
//   { month: 'Apr', pipeline: 80000, closedWon: 45000 },
//   { month: 'May', pipeline: 120000, closedWon: 65000 },
//   { month: 'Jun', pipeline: 150000, closedWon: 90000 },
//   { month: 'Jul', pipeline: 210000, closedWon: 120000 },
//   { month: 'Aug', pipeline: 270000, closedWon: 160000 },
// ];

// const defaultBars = [
//   { key: 'closedWon', label: 'Closed Won', barClass: 'bar-closed-won', legendClass: 'legend-closed-won', tooltipClass: 'tooltip-closed' },
//   { key: 'pipeline', label: 'Pipeline Value', barClass: 'bar-pipeline', legendClass: 'legend-pipeline', tooltipClass: 'tooltip-pipeline' }
// ];

function BarChart({ data, bars, title, content }) {
  const [activeTooltip, setActiveTooltip] = useState('Jun');
  const yAxisLabels = ['₹280k', '₹210k', '₹140k', '₹70k', '₹0'];
  const maxVal = 280000;
  const formatCurrency = (val) => {
    return '₹' + (val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="chart-card">
      {/* Header */}
      <div className="chart-header">
        <div className="chart-title-group">
          <h2>{title}</h2>
          <p>{content}</p>
        </div>

        <div className="chart-legend">
          {bars.map((bar) => (
            <div key={bar.key} className="legend-item">
              <span className={`legend-indicator ${bar.legendClass || ''}`}></span>
              <span>{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="chart-body">
        {/* Y Axis */}
        <div className="y-axis-labels">
          {yAxisLabels.map((lbl, idx) => (
            <span key={idx} className="y-label">{lbl}</span>
          ))}
        </div>

        {/* Grid and Bars Area */}
        <div className="grid-container">
          <div className="grid-lines">
            {yAxisLabels.map((_, idx) => (
              <div key={idx} className="grid-line"></div>
            ))}
          </div>

          <div className="bars-container">
            {data.map((item, index) => {
              const isHovered = activeTooltip === item.month;
              return (
                <div
                  key={index}
                  className="month-group"
                  onMouseEnter={() => setActiveTooltip(item.month)}
                  onClick={() => setActiveTooltip(item.month)}
                >
                  {isHovered && <div className="hover-line"></div>}

                  {isHovered && (
                    <div className="chart-tooltip">
                      <div className="tooltip-month">{item.month}</div>
                      {bars.map((bar) => (
                        <div key={bar.key} className={`tooltip-row ${bar.tooltipClass || ''}`}>
                          {bars.length > 1 ? `${bar.label}: ` : ''}{formatCurrency(item[bar.key])}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bars-pair">
                    {bars.map((bar) => {
                      const height = `${((item[bar.key] || 0) / maxVal) * 100}%`;
                      return (
                        <div
                          key={bar.key}
                          className={`bar ${bar.barClass || ''}`}
                          style={{ height }}
                        ></div>
                      );
                    })}
                  </div>

                  <span className="month-label">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarChart
