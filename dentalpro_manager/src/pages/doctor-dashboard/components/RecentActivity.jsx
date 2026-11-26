import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentActivity = ({ activities, onViewAll }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'appointment': 'Calendar',
      'payment': 'CreditCard',
      'treatment': 'Stethoscope',
      'document': 'FileText',
      'patient': 'User'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'appointment': 'text-primary',
      'payment': 'text-success',
      'treatment': 'text-warning',
      'document': 'text-secondary',
      'patient': 'text-accent'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  return (
    <div className="bg-card border border-border rounded-lg clinical-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
          >
            Ver Todo
          </Button>
        </div>
      </div>
      <div className="p-6">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay actividad reciente</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities?.map((activity, index) => (
              <div key={activity?.id} className="flex items-start space-x-3">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity?.title}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activity?.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>
                    {activity?.patient && (
                      <span className="text-xs text-muted-foreground">
                        • {activity?.patient}
                      </span>
                    )}
                    {activity?.amount && (
                      <span className="text-xs font-medium text-success">
                        ${activity?.amount?.toLocaleString('es-MX')} MXN
                      </span>
                    )}
                  </div>
                </div>

                {activity?.actionable && (
                  <div className="flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ChevronRight"
                      iconSize={16}
                      onClick={() => activity?.onClick && activity?.onClick()}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;