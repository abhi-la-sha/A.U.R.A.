import React, { useMemo } from 'react';
import { ThreatEvent } from './AuraDashboard';

interface ThreatHeatmapProps {
  events: ThreatEvent[];
}

const severityMap = {
  low: 1,
  medium: 3,
  high: 7,
  critical: 10
};

const HeatmapCell: React.FC<{ 
  severity: number;
  day: string;
  hour: number;
  maxSeverity: number;
}> = ({ severity, day, hour, maxSeverity }) => {
  
  const getColor = (severity: number, maxSeverity: number) => {
    if (severity === 0) return 'rgba(26, 26, 46, 0.3)';
    
    const intensity = maxSeverity > 0 ? severity / maxSeverity : 0;
    
    if (severity <= 1) return `rgba(22, 33, 62, ${0.3 + intensity * 0.4})`;
    if (severity <= 3) return `rgba(15, 52, 96, ${0.4 + intensity * 0.4})`;
    if (severity <= 7) return `rgba(233, 69, 96, ${0.5 + intensity * 0.4})`;
    return `rgba(245, 0, 90, ${0.6 + intensity * 0.4})`;
  };

  const getGlow = (severity: number) => {
    if (severity === 0) return 'none';
    if (severity <= 1) return '0 0 4px rgba(22, 33, 62, 0.5)';
    if (severity <= 3) return '0 0 6px rgba(15, 52, 96, 0.6)';
    if (severity <= 7) return '0 0 8px rgba(233, 69, 96, 0.7)';
    return '0 0 12px rgba(245, 0, 90, 0.8)';
  };

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 hover:scale-110 hover:z-10"
      style={{
        backgroundColor: getColor(severity, maxSeverity),
        boxShadow: getGlow(severity),
        border: severity > 0 ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.05)',
      }}
      title={`${day} ${hour.toString().padStart(2, '0')}:00 - Severity: ${severity}`}
    >
      {severity > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-mono opacity-80">
            {severity}
          </span>
        </div>
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
        {day} {hour.toString().padStart(2, '0')}:00
        <br />
        Severity: {severity}
        {severity > 0 && (
          <span className="block text-yellow-400">
            {severity <= 1 ? 'Low' : severity <= 3 ? 'Medium' : severity <= 7 ? 'High' : 'Critical'}
          </span>
        )}
      </div>
    </div>
  );
};

export const ThreatHeatmap: React.FC<ThreatHeatmapProps> = ({ events }) => {
  const { heatmapData, maxSeverity, totalThreats } = useMemo(() => {
    // Initialize 7x24 grid (days x hours)
    const data: number[][] = Array(7).fill(null).map(() => Array(24).fill(0));
    let total = 0;
    
    // Process events
    events.forEach(event => {
      if (event.severity && event.suspicious) {
        const date = new Date(event.timestamp);
        const dayOfWeek = date.getDay(); // 0 = Sunday
        const hour = date.getHours();
        
        const severityValue = severityMap[event.severity];
        // Keep maximum severity for each time block
        data[dayOfWeek][hour] = Math.max(data[dayOfWeek][hour], severityValue);
        total++;
      }
    });
    
    const maxSev = Math.max(...data.flat());
    
    return {
      heatmapData: data,
      maxSeverity: maxSev,
      totalThreats: total
    };
  }, [events]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="h-full w-full bg-background/90 rounded-lg border border-primary/20 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Attack Severity Heatmap</h3>
            <p className="text-sm text-muted-foreground">Peak severity by day and hour</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Total Threats</div>
            <div className="text-xl font-bold text-primary">{totalThreats}</div>
          </div>
        </div>
      </div>
      
      {/* Heatmap Grid */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="w-full max-w-6xl mx-auto">
          {/* Hour labels */}
          <div className="grid grid-cols-25 gap-1 mb-2">
            <div></div> {/* Empty corner */}
            {hours.map(hour => (
              <div key={hour} className="text-xs text-center text-muted-foreground font-mono py-1">
                {hour.toString().padStart(2, '0')}
              </div>
            ))}
          </div>
          
          {/* Heatmap rows */}
          <div className="space-y-1">
            {heatmapData.map((dayData, dayIndex) => (
              <div key={dayIndex} className="grid grid-cols-25 gap-1">
                {/* Day label */}
                <div className="text-sm text-right text-muted-foreground font-medium py-2 pr-2 flex items-center justify-end">
                  {days[dayIndex]}
                </div>
                
                {/* Hour cells */}
                {dayData.map((severity, hourIndex) => (
                  <div key={hourIndex} className="aspect-square">
                    <HeatmapCell
                      severity={severity}
                      day={days[dayIndex]}
                      hour={hourIndex}
                      maxSeverity={maxSeverity}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="p-4 border-t border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium mb-2 text-muted-foreground">Severity Scale</div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(22, 33, 62, 0.7)' }}></div>
                <span>Low (1)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(15, 52, 96, 0.8)' }}></div>
                <span>Medium (3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(233, 69, 96, 0.9)' }}></div>
                <span>High (7)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(245, 0, 90, 1)' }}></div>
                <span>Critical (10)</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Max Severity</div>
            <div className="text-lg font-bold text-primary">{maxSeverity}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
