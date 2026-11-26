import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, subtitle, icon, trend, trendValue, color = "primary", onClick }) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getColorClasses = () => {
    const colors = {
      primary: 'bg-primary/10 border-primary/20 text-primary',
      success: 'bg-success/10 border-success/20 text-success',
      warning: 'bg-warning/10 border-warning/20 text-warning',
      error: 'bg-error/10 border-error/20 text-error'
    };
    return colors?.[color] || colors?.primary;
  };

  return (
    <div 
      className={`bg-card border border-border rounded-lg p-6 clinical-shadow transition-clinical hover:clinical-shadow-lg ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-semibold text-foreground mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              <Icon name={getTrendIcon()} size={16} className={getTrendColor()} />
              <span className={`text-sm ml-1 ${getTrendColor()}`}>
                {trendValue}
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;