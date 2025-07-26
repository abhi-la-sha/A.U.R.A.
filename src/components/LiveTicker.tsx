import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThreatEvent } from './AuraDashboard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveTickerProps {
  events: ThreatEvent[];
}

export const LiveTicker: React.FC<LiveTickerProps> = ({ events }) => {
  const sortedEvents = useMemo(() => {
    return [...events]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 50); // Show last 50 events
  }, [events]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getEventIcon = (event: ThreatEvent) => {
    if (event.suspicious) {
      switch (event.severity) {
        case 'critical': return '🚨';
        case 'high': return '⚠️';
        case 'medium': return '🔶';
        default: return '⚡';
      }
    }
    return event.status === 'blocked' ? '🛡️' : '✅';
  };

  const getEventColor = (event: ThreatEvent) => {
    if (event.suspicious) {
      switch (event.severity) {
        case 'critical': return 'text-threat-red border-threat-red/50 bg-threat-red/10';
        case 'high': return 'text-cyber-orange border-cyber-orange/50 bg-cyber-orange/10';
        case 'medium': return 'text-warning-yellow border-warning-yellow/50 bg-warning-yellow/10';
        default: return 'text-destructive border-destructive/50 bg-destructive/10';
      }
    }
    return event.status === 'blocked' 
      ? 'text-cyber-green border-cyber-green/50 bg-cyber-green/10'
      : 'text-primary border-primary/50 bg-primary/10';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-primary/20 bg-background/80 backdrop-blur-md">
        <h3 className="text-lg font-bold text-foreground">Live Threat Feed</h3>
        <p className="text-sm text-muted-foreground">
          Real-time global network activity
        </p>
      </div>

      {/* Event Feed */}
      <ScrollArea className="flex-1 p-4">
        <AnimatePresence initial={false}>
          {sortedEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100
              }}
              className={`
                mb-3 p-3 rounded-lg border backdrop-blur-sm
                ${getEventColor(event)}
                ${event.suspicious ? 'threat-pulse' : ''}
                hover:scale-[1.02] transition-transform cursor-pointer
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getEventIcon(event)}</span>
                  <span className="text-xs font-mono opacity-70">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
                {event.suspicious && (
                  <span className="text-xs px-2 py-1 rounded bg-destructive/20 text-destructive font-mono">
                    {event.severity?.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {event.source_geo.country} → {event.dest_geo.country}
                  </span>
                  <span className={`
                    text-xs px-2 py-1 rounded font-mono
                    ${event.status === 'success' ? 'bg-cyber-green/20 text-cyber-green' :
                      event.status === 'blocked' ? 'bg-destructive/20 text-destructive' :
                      'bg-warning-yellow/20 text-warning-yellow'}
                  `}>
                    {event.status.toUpperCase()}
                  </span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {event.source_geo.city} → {event.dest_geo.city}
                </div>
                
                <div className="text-xs font-mono opacity-60">
                  {event.source_ip} → {event.dest_ip}
                </div>
                
                {event.attack_type && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <span className="text-xs font-semibold">
                      {event.attack_type}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {events.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            <div className="text-4xl mb-4">🔍</div>
            <p>Waiting for threat data...</p>
          </div>
        )}
      </ScrollArea>

      {/* Footer stats */}
      <div className="p-4 border-t border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Events: {events.length}</span>
          <span>Threats: {events.filter(e => e.suspicious).length}</span>
        </div>
      </div>
    </div>
  );
};