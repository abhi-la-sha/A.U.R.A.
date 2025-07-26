import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ThreatEvent } from './AuraDashboard';

interface ThreatGlobeProps {
  events: ThreatEvent[];
}

interface AnimatedEffect {
  id: string;
  position: [number, number, number];
  color: string;
  intensity: number;
  startTime: number;
  type: 'pulse' | 'beam' | 'explosion' | 'scan';
}

// Convert lat/lng to 3D coordinates on sphere
const latLngToVector3 = (lat: number, lng: number, radius: number = 100) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

export const ThreatGlobe: React.FC<ThreatGlobeProps> = ({ events }) => {
  const globeRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const energyRingRef = useRef<THREE.Mesh>(null);
  const [animatedEffects, setAnimatedEffects] = useState<AnimatedEffect[]>([]);
  const [lastEventCount, setLastEventCount] = useState(0);

  // Track new events and create effects
  useEffect(() => {
    if (events.length > lastEventCount) {
      const newEvents = events.slice(0, events.length - lastEventCount);
      
      newEvents.forEach((event, index) => {
        const position = latLngToVector3(event.source_geo.lat, event.source_geo.lng, 110);
        
        const newEffect: AnimatedEffect = {
          id: `${event.id}_${Date.now()}`,
          position: position.toArray() as [number, number, number],
          color: event.suspicious 
            ? (event.severity === 'critical' ? '#ff0040' : '#ff6600')
            : '#00ccff',
          intensity: event.suspicious ? (event.severity === 'critical' ? 1.0 : 0.7) : 0.4,
          startTime: Date.now() + index * 200, // Stagger effects
          type: event.suspicious ? 'explosion' : 'pulse'
        };
        
        setAnimatedEffects(prev => [...prev, newEffect]);
      });
      
      setLastEventCount(events.length);
    }
  }, [events.length, lastEventCount]);

  // Clean up old effects
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedEffects(prev => 
        prev.filter(effect => Date.now() - effect.startTime < 5000)
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Main animation loop
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Rotate the main globe
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.003;
    }
    
    // Animate the central energy core
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.5;
      coreRef.current.rotation.z = time * 0.3;
      const scale = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(scale);
    }
    
    // Animate energy ring
    if (energyRingRef.current) {
      energyRingRef.current.rotation.y = time * 0.8;
      energyRingRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
    }
  });

  return (
    <group>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ccff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6600" />
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />

      {/* Central Energy Core - pulsating sphere at center */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[15, 2]} />
        <meshPhongMaterial
          color="#00ffff"
          transparent
          opacity={0.6}
          emissive="#004444"
          wireframe
        />
      </mesh>

      {/* Energy Ring around core */}
      <mesh ref={energyRingRef}>
        <torusGeometry args={[25, 2, 16, 100]} />
        <meshBasicMaterial
          color="#00ccff"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Main Globe */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[100, 64, 64]} />
        <meshPhongMaterial
          color="#001122"
          transparent
          opacity={0.8}
          emissive="#001111"
        />
      </mesh>

      {/* Globe wireframe overlay with pulsing effect */}
      <mesh>
        <sphereGeometry args={[101, 32, 16]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Data Stream Particles - connecting events to center */}
      {events.slice(0, 10).map((event, index) => {
        const sourcePos = latLngToVector3(event.source_geo.lat, event.source_geo.lng, 105);
        const destPos = latLngToVector3(event.dest_geo.lat, event.dest_geo.lng, 105);
        
        // Create particle stream from source to center
        return (
          <group key={`stream_${event.id}`}>
            {/* Source node */}
            <mesh position={sourcePos.toArray()}>
              <sphereGeometry args={[1.5, 8, 8]} />
              <meshBasicMaterial
                color={event.suspicious ? '#ff0040' : '#00ccff'}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Destination node */}
            <mesh position={destPos.toArray()}>
              <sphereGeometry args={[1.5, 8, 8]} />
              <meshBasicMaterial
                color={event.suspicious ? '#ff6600' : '#00ffff'}
                transparent
                opacity={0.8}
              />
            </mesh>
            
            {/* Energy beam to center */}
            <mesh position={[sourcePos.x * 0.5, sourcePos.y * 0.5, sourcePos.z * 0.5]}>
              <cylinderGeometry args={[0.2, 0.2, sourcePos.length() * 0.5, 8]} />
              <meshBasicMaterial
                color={event.suspicious ? '#ff0040' : '#00ccff'}
                transparent
                opacity={0.3}
              />
            </mesh>
          </group>
        );
      })}

      {/* Animated Effects - responding to new threat events */}
      {animatedEffects.map((effect) => {
        const age = (Date.now() - effect.startTime) / 1000; // Age in seconds
        const maxAge = 5;
        
        if (age < 0 || age > maxAge) return null;
        
        const opacity = Math.max(0, 1 - age / maxAge);
        const scale = effect.type === 'explosion' ? 1 + age * 2 : 1 + Math.sin(age * 4) * 0.3;
        
        return (
          <mesh 
            key={effect.id} 
            position={effect.position}
            scale={[scale, scale, scale]}
          >
            {effect.type === 'explosion' ? (
              <icosahedronGeometry args={[3, 1]} />
            ) : (
              <sphereGeometry args={[2, 16, 16]} />
            )}
            <meshBasicMaterial
              color={effect.color}
              transparent
              opacity={opacity * effect.intensity}
              wireframe={effect.type === 'explosion'}
            />
          </mesh>
        );
      })}

      {/* Orbiting Threat Satellites */}
      {events.filter(e => e.suspicious).slice(0, 8).map((event, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const radius = 130 + Math.sin(angle * 3) * 10; // Varying orbital distances
        const height = Math.sin(angle * 2) * 20; // Varying heights
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={`satellite_${event.id}`} position={[x, height, z]}>
            {/* Main threat indicator */}
            <mesh>
              <octahedronGeometry args={[4, 0]} />
              <meshPhongMaterial
                color={event.severity === 'critical' ? '#ff0040' : '#ff6600'}
                transparent
                opacity={0.9}
                emissive={event.severity === 'critical' ? '#440000' : '#442200'}
              />
            </mesh>
            
            {/* Orbiting mini satellites */}
            <mesh position={[8, 0, 0]}>
              <sphereGeometry args={[1, 6, 6]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        );
      })}

      {/* Scanning Radar Rings - Multiple layers */}
      {[120, 140, 160, 180].map((radius, index) => (
        <mesh key={`radar_${index}`}>
          <ringGeometry args={[radius - 2, radius + 2, 32]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.1 - index * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Data Flow Particles - creating ambient movement */}
      {Array.from({ length: 50 }, (_, i) => {
        const angle = (i / 50) * Math.PI * 2;
        const radius = 80 + Math.sin(i * 0.5) * 20;
        const height = Math.cos(i * 0.3) * 30;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh key={`particle_${i}`} position={[x, height, z]}>
            <sphereGeometry args={[0.5, 6, 6]} />
            <meshBasicMaterial
              color="#00ccff"
              transparent
              opacity={0.4}
            />
          </mesh>
        );
      })}

      {/* Central Holographic Grid */}
      <mesh>
        <sphereGeometry args={[95, 16, 8]} />
        <meshBasicMaterial
          color="#004444"
          transparent
          opacity={0.1}
          wireframe
        />
      </mesh>
    </group>
  );
};