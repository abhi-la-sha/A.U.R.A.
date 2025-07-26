import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ThreatEvent } from './AuraDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ThreatStatsProps {
  events: ThreatEvent[];
}

export const ThreatStats: React.FC<ThreatStatsProps> = ({ events }) => {
  const stats = useMemo(() => {
    const total = events.length;
    const suspicious = events.filter(e => e.suspicious).length;
    const blocked = events.filter(e => e.status === 'blocked').length;
    const criticalThreats = events.filter(e => e.severity === 'critical').length;
    
    const threatTypes = events
      .filter(e => e.suspicious && e.attack_type)
      .reduce((acc, event) => {
        acc[event.attack_type!] = (acc[event.attack_type!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topCountries = events
      .reduce((acc, event) => {
        acc[event.source_geo.country] = (acc[event.source_geo.country] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total,
      suspicious,
      blocked,
      criticalThreats,
      threatTypes: Object.entries(threatTypes)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      topCountries: Object.entries(topCountries)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5),
      threatRate: total > 0 ? (suspicious / total * 100).toFixed(1) : '0.0'
    };
  }, [events]);

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    subtitle?: string; 
    color?: string;
    pulse?: boolean;
  }> = ({ title, value, subtitle, color = 'text-primary', pulse = false }) => (
    <Card className={`cyber-card ${pulse ? 'pulse-glow' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${color}`}>
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 text-foreground">
          Threat Intelligence
        </h2>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Events"
          value={stats.total}
          subtitle="Last 100 events"
          color="text-primary"
        />
        <StatCard
          title="Threats Detected"
          value={stats.suspicious}
          subtitle={`${stats.threatRate}% threat rate`}
          color="text-destructive"
          pulse={stats.suspicious > 0}
        />
        <StatCard
          title="Blocked"
          value={stats.blocked}
          subtitle="Auto-mitigated"
          color="text-cyber-green"
        />
        <StatCard
          title="Critical"
          value={stats.criticalThreats}
          subtitle="Requires attention"
          color="text-threat-red"
          pulse={stats.criticalThreats > 0}
        />
      </div>

      {/* Threat Types */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Active Threat Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.threatTypes.length > 0 ? (
              stats.threatTypes.map(([type, count], index) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-foreground">{type}</span>
                  <span className="text-sm font-mono text-destructive">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-2">
                No active threats
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Source Countries */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Top Source Countries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.topCountries.map(([country, count], index) => (
              <div key={country} className="flex justify-between items-center">
                <span className="text-sm text-foreground">{country}</span>
                <div className="flex items-center space-x-2">
                  <div 
                    className="h-2 bg-primary rounded"
                    style={{ 
                      width: `${(count / stats.topCountries[0][1]) * 60}px`,
                      opacity: 0.7 
                    }}
                  />
                  <span className="text-sm font-mono text-primary w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="cyber-card">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">AI Analysis</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-green rounded-full pulse-glow" />
                <span className="text-sm text-cyber-green">ACTIVE</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Threat Detection</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-green rounded-full pulse-glow" />
                <span className="text-sm text-cyber-green">ONLINE</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Auto-Mitigation</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyber-green rounded-full pulse-glow" />
                <span className="text-sm text-cyber-green">ENABLED</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};