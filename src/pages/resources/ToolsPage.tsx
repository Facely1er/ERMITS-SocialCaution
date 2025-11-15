import React, { useRef, useEffect } from 'react';
import { Shield, Database, FileText, Lock, Eye, Search } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';
import ToolTypeIndicator from '../../components/common/ToolTypeIndicator';
import { Link } from 'react-router-dom';
const ToolsPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animation for the background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.offsetHeight || 500;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Tool-related particles
    class ToolParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      type: 'tool' | 'wrench' | 'cog' | 'shield';
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.type = ['tool', 'wrench', 'cog', 'shield'][Math.floor(Math.random() * 4)] as any;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        
        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        
        // Random direction changes
        if (Math.random() > 0.99) {
          this.speedX = (Math.random() - 0.5) * 1;
          this.speedY = (Math.random() - 0.5) * 1;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // Draw different tool symbols based on type
        switch (this.type) {
          case 'tool':
            this.drawTool();
            break;
          case 'wrench':
            this.drawWrench();
            break;
          case 'cog':
            this.drawCog();
            break;
          case 'shield':
            this.drawShield();
            break;
        }
        
        ctx.restore();
      }
      
      drawTool() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Tool handle
        ctx.beginPath();
        ctx.rect(-size/12, -size/2, size/6, size);
        ctx.fill();
        
        // Tool head
        ctx.beginPath();
        ctx.rect(-size/3, -size/2, size/1.5, size/3);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
      }
      
      drawWrench() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Wrench body
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/2);
        ctx.lineTo(size/3, size/2);
        ctx.lineTo(size/6, size/2);
        ctx.lineTo(-size/2, -size/2);
        ctx.closePath();
        ctx.fill();
        
        // Wrench holes
        ctx.beginPath();
        ctx.arc(-size/3, -size/3, size/6, 0, Math.PI * 2);
        ctx.arc(size/4, size/3, size/6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 25, 41, 0.5)';
        ctx.fill();
      }
      
      drawCog() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Cog outer circle
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Cog teeth
        const teethCount = 8;
        for (let i = 0; i < teethCount; i++) {
          const angle = (i / teethCount) * Math.PI * 2;
          const innerX = Math.cos(angle) * (size/2);
          const innerY = Math.sin(angle) * (size/2);
          const outerX = Math.cos(angle) * (size/1.5);
          const outerY = Math.sin(angle) * (size/1.5);
          
          ctx.beginPath();
          ctx.moveTo(innerX, innerY);
          ctx.lineTo(outerX, outerY);
          ctx.lineWidth = size/6;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.stroke();
        }
        
        // Cog inner circle
        ctx.beginPath();
        ctx.arc(0, 0, size/4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 25, 41, 0.5)';
        ctx.fill();
      }
      
      drawShield() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Shield shape
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(size/2, -size/4);
        ctx.lineTo(size/2, size/3);
        ctx.quadraticCurveTo(size/2, size/2, 0, size/2);
        ctx.quadraticCurveTo(-size/2, size/2, -size/2, size/3);
        ctx.lineTo(-size/2, -size/4);
        ctx.closePath();
        ctx.fill();
        
        // Shield detail
        ctx.beginPath();
        ctx.moveTo(0, -size/4);
        ctx.lineTo(size/4, 0);
        ctx.lineTo(0, size/4);
        ctx.lineTo(-size/4, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(10, 25, 41, 0.5)';
        ctx.fill();
      }
    }
    
    // Create tool particles
    const particles: ToolParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push(new ToolParticle());
    }
    
    // Animation loop
    function animate() {
      if (!ctx) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw tool particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const tools = [
    {
      id: 'digital-footprint',
      title: 'Digital Footprint Analyzer',
      description: 'Discover and analyze your online presence across the internet.',
      icon: Eye,
      path: '/resources/tools/digital-footprint',
      type: 'real' as const,
      features: [
        'Online presence analysis',
        
        'Risk assessment',
        
        'Privacy recommendations']
    },
    {
      id: 'cookie-tracker',
      title: 'Cookie & Tracker Scanner',
      description: 'Discover what trackers are monitoring your activity on any website.',
      icon: Search,
      path: '/resources/tools/cookie-tracker',
      type: 'real' as const,
      features: [
        'Cookie analysis',
        'Tracker detection',
        'Scan history with localStorage']
    },
    {
      id: 'data-broker-removal',
      title: 'Data Broker Removal Tool',
      description: 'Remove your data from data brokers and take back control of your personal information.',
      icon: Database,
      path: '/resources/tools/data-broker-removal',
      type: 'real' as const,
      features: [
        'Removal request tracking',
        'Ongoing monitoring',
        'Verification reminders'
      ]
    },
    {
      id: 'personal-data-inventory',
      title: 'Personal Data Inventory',
      description: 'Create a comprehensive inventory of your personal data to better understand what is collected and shared.',
      icon: FileText,
      path: '/resources/tools/personal-data-inventory',
      type: 'real' as const,
      features: [
        'Data mapping',
        'Sensitivity assessment',
        'Protection planning'
      ]
    },
    {
      id: 'privacy-assessment',
      title: 'Privacy Assessment Tool',
      description: 'Assess your privacy protection level and get personalized recommendations.',
      icon: Shield,
      path: '/resources/tools/privacy-assessment',
      type: 'educational' as const,
      features: [
        'Privacy scoring',
        'Detailed analysis',
        'Personalized recommendations'
      ]
    },
    {
      id: 'privacy-simulator',
      title: 'Privacy Simulator',
      description: 'Simulate different privacy scenarios to understand the impact of your settings.',
      icon: Lock,
      path: '/resources/tools/privacy-simulator',
      type: 'simulator' as const,
      features: [
        'Scenario simulation',
        'Interactive guidance',
        'Impact visualization'
      ]
    },
    {
      id: 'password-strength',
      title: 'Password Strength Checker',
      description: 'Check and improve your password security with real-time analysis.',
      icon: Lock,
      path: '/resources/tools/password-strength',
      type: 'real' as const,
      features: [
        'Real-time strength analysis',
        'Password generator',
        'Check history with localStorage'
      ]
    }
  ];

  return (
    <PageLayout
      title="Privacy Tools"
      subtitle="Interactive tools to help you protect and manage your privacy"
      description="Discover and use our comprehensive suite of privacy tools designed to help you assess, protect, and manage your digital privacy effectively."
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' },
        { label: 'Tools', path: '/resources/tools' }
      ]}
    >
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                className="block"
              >
                <Card
                  animate
                  className="p-6 flex flex-col h-full hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-accent/10 rounded-full mr-3">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-semibold text-text dark:text-white">{tool.title}</h3>
                    </div>
                    <ToolTypeIndicator type={tool.type} />
                  </div>
                  
                  <p className="text-text-secondary dark:text-gray-300 mb-4 flex-grow">{tool.description}</p>
                  
                  <ul className="space-y-2">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-text-secondary dark:text-gray-300">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 text-center">
          <p>Note: Some tools require initial setup</p>
          <p>Follow the provided instructions for each tool to get started.</p>
        </div>
      </Section>
    </PageLayout>
  );
};

export default ToolsPage;