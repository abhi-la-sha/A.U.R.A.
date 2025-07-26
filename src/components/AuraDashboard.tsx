import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ThreatGlobe } from './ThreatGlobe';
import { LiveTicker } from './LiveTicker';
import { ThreatStats } from './ThreatStats';
import { ThreatHeatmap } from './ThreatHeatmap';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import jsPDF from 'jspdf';

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const generateThreatEvent = (): ThreatEvent => {
      const locations = [
        { lat: 40.7128, lng: -74.006, country: 'USA', city: 'New York' },
        { lat: 51.5074, lng: -0.1278, country: 'UK', city: 'London' },
        { lat: 35.6762, lng: 139.6503, country: 'Japan', city: 'Tokyo' },
        { lat: 55.7558, lng: 37.6176, country: 'Russia', city: 'Moscow' },
        { lat: 39.9042, lng: 116.4074, country: 'China', city: 'Beijing' },
        { lat: 52.52, lng: 13.405, country: 'Germany', city: 'Berlin' },
        { lat: -33.8688, lng: 151.2093, country: 'Australia', city: 'Sydney' },
        { lat: 19.076, lng: 72.8777, country: 'India', city: 'Mumbai' },
        { lat: -23.5505, lng: -46.6333, country: 'Brazil', city: 'São Paulo' },
        { lat: 30.0444, lng: 31.2357, country: 'Egypt', city: 'Cairo' },
      ];

      const source = locations[Math.floor(Math.random() * locations.length)];
      const dest = locations[Math.floor(Math.random() * locations.length)];
      const isSuspicious = Math.random() < 0.15;

      return {
        id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}.${Math.floor(Math.random() * 255)}`,
        dest_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
          Math.random() * 255
        )}.${Math.floor(Math.random() * 255)}`,
        source_geo: source,
        dest_geo: dest,
        status: isSuspicious ? 'suspicious' : Math.random() < 0.9 ? 'success' : 'blocked',
        suspicious: isSuspicious,
        timestamp: Date.now(),
        attack_type: isSuspicious
          ? ['DDoS', 'Malware', 'Phishing', 'Ransomware', 'Data Breach'][Math.floor(Math.random() * 5)]
          : undefined,
        severity: isSuspicious
          ? (['low', 'medium', 'high', 'critical'] as const)[Math.floor(Math.random() * 4)]
          : undefined,
      };
    };

    setIsConnected(true);
    toast({
      title: 'AURA System Online',
      description: 'Global threat monitoring initiated',
    });

    const interval = setInterval(() => {
      const event = generateThreatEvent();
      setThreatEvents((prev) => [event, ...prev].slice(0, 100));

      if (event.suspicious) {
        toast({
          title: `⚠️ Threat Detected`,
          description: `${event.attack_type} from ${event.source_geo.country} → ${event.dest_geo.country}`,
          variant: 'destructive',
        });
      }
    }, Math.random() * 2000 + 1000);

    return () => clearInterval(interval);
  }, [toast]);

  const handleSubmit = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('http://localhost:5000/api/llm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }),
      });
      const data = await res.json();
      if (!res.ok || !data?.response) {
        setResponse('⚠️ AURA AI failed to respond. Please try again.');
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setResponse('❌ Could not connect to AURA AI. Make sure the server is running.');
    }

    setLoading(false);
  };

  const handleExport = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('AURA Threat Analysis Summary', 10, 20);
    pdf.setFontSize(12);
    pdf.text(`Generated at: ${new Date().toLocaleString()}`, 10, 30);
    pdf.text(`Total Events Monitored: ${threatEvents.length}`, 10, 40);
    const suspiciousEvents = threatEvents.filter((e) => e.suspicious);
    pdf.text(`Suspicious Events: ${suspiciousEvents.length}`, 10, 50);
    const criticalEvents = suspiciousEvents.filter((e) => e.severity === 'critical');
    pdf.text(`Critical Threats: ${criticalEvents.length}`, 10, 60);
    if (criticalEvents.length > 0) {
      pdf.text('Top Critical Threats:', 10, 80);
      criticalEvents.slice(0, 3).forEach((e, i) => {
        const text = `${i + 1}. ${e.attack_type} from ${e.source_geo.city} (${e.source_geo.country})`;
        pdf.text(text, 10, 90 + i * 10);
      });
    }
    pdf.save('aura_dashboard_summary.pdf');
  };

  return (
    <div className="h-screen w-full bg-background text-foreground relative overflow-hidden">
      <motion.header className="relative z-10 p-6 border-b border-primary/20 bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              PROJECT AURA
            </h1>
            <div className="text-sm text-muted-foreground">Cyber-Financial Threat Fusion Platform</div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowHeatmap(!showHeatmap)} variant="outline">
              {showHeatmap ? 'Show Globe' : 'Show Heatmap'}
            </Button>
            <Button onClick={handleExport} variant="outline">
              Export to PDF
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">Ask AURA AI</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-background text-foreground">
                <h2 className="text-lg font-semibold mb-2">Ask AURA AI</h2>
                <Input
                  placeholder="What are the top credit risks?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button onClick={handleSubmit} disabled={loading} className="mt-2">
                  {loading ? 'Analyzing...' : 'Submit'}
                </Button>
                {response && (
                  <div className="mt-4 p-4 rounded border border-border bg-muted text-muted-foreground">
                    <h3 className="text-sm font-semibold text-primary">Response:</h3>
                    <p className="whitespace-pre-wrap text-foreground mt-2">{response}</p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-cyber-green' : 'text-destructive'}`}>
              <div
                className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyber-green pulse-glow' : 'bg-destructive'}`}
              />
              <span className="text-sm font-mono">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>
      </motion.header>
      <div className="flex h-[calc(100vh-5rem)]">
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-80 p-6 border-r border-primary/20 bg-background/50 backdrop-blur-md"
        >
          <ThreatStats events={threatEvents} />
        </motion.div>
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
              <Canvas camera={{ position: [0, 0, 300], fov: 60 }} gl={{ antialias: true, alpha: true }}>
                <ThreatGlobe events={threatEvents} />
              </Canvas>
            )}
          </motion.div>
        </div>
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
