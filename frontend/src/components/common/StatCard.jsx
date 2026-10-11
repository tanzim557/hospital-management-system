import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ 
  label, 
  value, 
  icon, 
  color = 'blue', 
  change, 
  positive = true,
  subtext,
  badge,
  badgePulse,
  onClick
}) {
  return (
    <div 
      className={`figma-stat-card ${color} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        <div className={`stat-card-icon-box ${color}`}>
          {icon}
        </div>
      </div>

      <div className="stat-card-value-wrap">
        <span className="stat-card-value">{value}</span>
        {badge && (
          <span className={`stat-card-pill ${color}`}>
            {badgePulse && <span className="stat-pill-dot" />}
            {badge}
          </span>
        )}
      </div>

      <div className="stat-card-bottom">
        {change && (
          <span className={`stat-card-change ${positive ? 'positive' : 'negative'}`}>
            {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            <span>{change}</span>
          </span>
        )}
        {subtext && <span className="stat-card-subtext">{subtext}</span>}
      </div>

      {/* Ambient gradient glow on card edge */}
      <div className={`stat-card-glow ${color}`} />
    </div>
  );
}
