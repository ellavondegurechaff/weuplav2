'use client'

import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, Stack, Badge, Card, Grid, Paper } from '@mantine/core';
import { Shield, Terminal, Zap, User, ChevronDown } from 'lucide-react';
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  const features = [
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "AIMBOT",
      description: "Precision targeting system with customizable smoothness and FOV"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "ESP",
      description: "Advanced wallhack with skeleton tracking and distance indicators"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "MISC",
      description: "Vehicle mods, weather control, and player modifications"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background grid */}
      <div className="fixed inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)] opacity-20">
        {[...Array(400)].map((_, i) => (
          <div 
            key={i} 
            className="border border-white/10"
            style={{
              animation: `pulse ${Math.random() * 3 + 2}s infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <Container size="lg" className="relative py-20 z-10">
        {/* Hero section */}
        <div className="text-center mb-20">
          <Title className="text-8xl font-black mb-4 relative">
            <span className="absolute top-0 left-0 w-full clip-path-glitch animate-glitch-1">AMARI</span>
            <span className="absolute top-0 left-0 w-full clip-path-glitch animate-glitch-2">AMARI</span>
            AMARI
          </Title>
          <Text className="text-xl font-mono tracking-wider text-gray-400 mb-8">
            MACHO BASED FIVEM MENU
          </Text>
          
          {/* Discord Login Button */}
          <Button
            leftSection={<User className="w-4 h-4" />}
            variant="outline"
            size="lg"
            className="font-mono tracking-wider border-white/20 bg-transparent hover:bg-white/5 transform transition-all duration-300 hover:border-white/40"
            onClick={() => signIn('discord')}
            styles={(theme) => ({
              root: {
                backgroundColor: 'transparent',
                color: theme.white,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              },
              inner: {
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
              },
            })}
          >
            LOGIN VIA DISCORD
          </Button>
        </div>

        {/* Feature cards */}
        <Grid gutter="xl" className="mb-20">
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Card
                className={`
                  bg-transparent border border-white/20 p-8
                  transform transition-all duration-300
                  ${hoveredFeature === index ? 'scale-105 border-white' : 'hover:border-white/40'}
                `}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="mb-6 text-white/80">{feature.icon}</div>
                <Title order={3} className="font-mono mb-4 tracking-wider">
                  {feature.title}
                </Title>
                <Text className="text-gray-400 font-mono text-sm">
                  {feature.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        {/* Stats section */}
        <Grid gutter="xl" className="font-mono mb-20">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              className="p-8 relative overflow-hidden group"
              radius="md"
              withBorder
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text className="text-5xl font-bold mb-2">10ms</Text>
              <Text className="text-gray-400">AVERAGE RESPONSE TIME</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              className="p-8 relative overflow-hidden group"
              radius="md"
              withBorder
              style={{
                backgroundColor: 'transparent',
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text className="text-5xl font-bold mb-2">∞</Text>
              <Text className="text-gray-400">POSSIBILITIES</Text>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/50" />
        </div>
      </Container>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full py-4 border-t border-white/10 bg-black/80 backdrop-blur-sm z-20">
        <Container>
          <Text className="text-center font-mono text-sm text-white/50">
            AMARI © 2024 
          </Text>
        </Container>
      </footer>
    </div>
  );
}
