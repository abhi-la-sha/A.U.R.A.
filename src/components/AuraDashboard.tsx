import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ThreatGlobe } from './ThreatGlobe';
import { LiveTicker } from './LiveTicker';
import { ThreatStats } from './ThreatStats';
import { ThreatHeatmap } from './ThreatHeatmap';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export interface ThreatEvent {
  id: string;
  source_ip: string;
  dest_ip: string;
  source_geo: {
    lat: number;
    lng: number;
    country: string;
    city: string;
  };
  dest_geo: {
    lat: number;
    lng: number;
    country: string;
    city: string;
  };
  status: 'success' | 'blocked' | 'suspicious';
  suspicious: boolean;
  timestamp: number;
  attack_type?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const AuraDashboard: React.FC = () => {
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { toast } = useToast();

  // Simulate WebSocket connection and live data stream
  useEffect(() => {
    // Mock data generation
    const generateThreatEvent = (): ThreatEvent => {
      const locations = [
        { lat: 40.7128, lng: -74.0060, country: 'USA', city: 'New York' },
        { lat: 51.5074, lng: -0.1278, country: 'UK', city: 'London' },
        { lat: 35.6762, lng: 139.6503, country: 'Japan', city: 'Tokyo' },
        { lat: 55.7558, lng: 37.6176, country: 'Russia', city: 'Moscow' },
        { lat: 39.9042, lng: 116.4074, country: 'China', city: 'Beijing' },
        { lat: 52.5200, lng: 13.4050, country: 'Germany', city: 'Berlin' },
        { lat: -33.8688, lng: 151.2093, country: 'Australia', city: 'Sydney' },
        { lat: 19.0760, lng: 72.8777, country: 'India', city: 'Mumbai' },
        { lat: -23.5505, lng: -46.6333, country: 'Brazil', city: 'São Paulo' },
        { lat: 30.0444, lng: 31.2357, country: 'Egypt', city: 'Cairo' }
      ];

      const source = locations[Math.floor(Math.random() * locations.length)];
      const dest = locations[Math.floor(Math.random() * locations.length)];
      
      // 15% chance of suspicious activity
      const isSuspicious = Math.random() < 0.15;
      
      return {
        id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        dest_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        source_geo: source,
        dest_geo: dest,
        status: isSuspicious ? 'suspicious' : (Math.random() < 0.9 ? 'success' : 'blocked'),
        suspicious: isSuspicious,
        timestamp: Date.now(),
        attack_type: isSuspicious ? ['DDoS', 'Malware', 'Phishing', 'Ransomware', 'Data Breach'][Math.floor(Math.random() * 5)] : undefined,
        severity: isSuspicious ? (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)] : undefined
      };
    };

    // Simulate connection
    setIsConnected(true);
    toast({
      title: "AURA System Online",
      description: "Global threat monitoring initiated",
    });

    // Generate events every 1-3 seconds
    const interval = setInterval(() => {
      const event = generateThreatEvent();
      setThreatEvents(prev => {
        const newEvents = [event, ...prev].slice(0, 100); // Keep last 100 events
        return newEvents;
      });
      
      // Show toast for suspicious events
      if (event.suspicious) {
        toast({
          title: `⚠️ Threat Detected`,
          description: `${event.attack_type} from ${event.source_geo.country} → ${event.dest_geo.country}`,
          variant: "destructive"
        });
      }
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(interval);
  }, [toast]);

  return (
    <div className="h-screen w-full bg-background relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'pulse 4s ease-in-out infinite'
        }} />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 p-6 border-b border-primary/20 bg-background/80 backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                PROJECT AURA
              </h1>
              <div className="scan-line" />
            </div>
            <div className="text-sm text-muted-foreground">
              Cyber-Financial Threat Fusion Platform
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowHeatmap(!showHeatmap)}
              variant={showHeatmap ? "default" : "outline"}
              className="mr-4"
            >
              {showHeatmap ? 'Show Globe' : 'Show Heatmap'}
            </Button>
            <Button
              variant="outline"
              className="mr-4"
              onClick={() => toast({
                title: "Analysis Feature",
                description: "Advanced threat analysis coming soon...",
              })}
            >
              Analyse
            </Button>
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-cyber-green' : 'text-destructive'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyber-green' : 'bg-destructive'} ${isConnected ? 'pulse-glow' : ''}`} />
              <span className="text-sm font-mono">
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-5rem)]">
        {/* Left Panel - Stats */}
        <motion.div 
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-80 p-6 border-r border-primary/20 bg-background/50 backdrop-blur-md"
        >
          <ThreatStats events={threatEvents} />
        </motion.div>

        {/* Center - 3D Globe or Heatmap */}
        <div className="flex-1 relative">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full w-full"
          >
            {showHeatmap ? (
              <ThreatHeatmap events={threatEvents} />
            ) : (
              <Canvas
                camera={{ position: [0, 0, 300], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
              >
                <ThreatGlobe events={threatEvents} />
              </Canvas>
            )}
          </motion.div>
        </div>

        {/* Right Panel - Live Ticker */}
        <motion.div 
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="w-96 border-l border-primary/20 bg-background/50 backdrop-blur-md"
        >
          <LiveTicker events={threatEvents} />
        </motion.div>
      </div>
    </div>
  );
};