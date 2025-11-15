import React, { useRef, useEffect } from 'react';
// motion removed - not used
import { Shield, Search, Lightbulb, CheckCircle, ArrowRight, Database, Bell, Info, FileText } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';
import PrivacyJourneyMapping from '../components/home/PrivacyJourneyMapping';
const PrivacyJourneyPage: React.FC = () => {
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
    
    // Privacy-related particles
    class PrivacyParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      type: 'lock' | 'shield' | 'eye' | 'data';
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.type = ['lock', 'shield', 'eye', 'data'][Math.floor(Math.random() * 4)] as any;
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
        
        // Draw different privacy symbols based on type
        switch (this.type) {
          case 'lock':
            this.drawLock();
            break;
          case 'shield':
            this.drawShield();
            break;
          case 'eye':
            this.drawEye();
            break;
          case 'data':
            this.drawData();
            break;
        }
        
        ctx.restore();
      }
      
      drawLock() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Lock body
        ctx.beginPath();
        ctx.roundRect(-size/2, -size/4, size, size, size/4);
        ctx.fill();
        
        // Lock shackle
        ctx.beginPath();
        ctx.arc(0, -size/4, size/3, Math.PI, 0);
        ctx.lineWidth = size/6;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.stroke();
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
      
      drawEye() {
        if (!ctx) return;
        
        const size = this.size;
        
        // Eye outline
        ctx.beginPath();
        ctx.ellipse(0, 0, size/2, size/3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        
        // Pupil
        ctx.beginPath();
        ctx.arc(0, 0, size/6, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(10, 25, 41, 0.7)';
        ctx.fill();
        
        // Highlight
        ctx.beginPath();
        ctx.arc(size/12, -size/12, size/12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }
      
      drawData() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Database cylinder
        ctx.beginPath();
        ctx.ellipse(0, -size/3, size/3, size/6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(0, size/3, size/3, size/6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect the cylinders
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/3);
        ctx.lineTo(-size/3, size/3);
        ctx.lineTo(size/3, size/3);
        ctx.lineTo(size/3, -size/3);
        ctx.fill();
        
        // Detail lines
        ctx.beginPath();
        ctx.moveTo(-size/5, 0);
        ctx.lineTo(size/5, 0);
        ctx.strokeStyle = 'rgba(10, 25, 41, 0.5)';
        ctx.lineWidth = size/15;
        ctx.stroke();
      }
    }
    
    // Create privacy particles
    const particles: PrivacyParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push(new PrivacyParticle());
    }
    
    // Animation loop
    function animate() {
      if (!ctx) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw privacy particles
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

  // Get journey steps
  const getTranslatedJourneySteps = () => {
    return [
        {
          id: 'discover',
          title: 'Discover',
          description: 'Identify your privacy vulnerabilities through a comprehensive assessment',
          icon: Search,
          color: 'bg-blue-500'
        },
        {
          id: 'learn',
          title: 'Learn',
          description: 'Understand your privacy rights and options with personalized education',
          icon: Lightbulb,
          color: 'bg-yellow-500'
        },
        {
          id: 'protect',
          title: 'Protect',
          description: 'Implement tailored privacy measures to secure your digital presence',
          icon: Shield,
          color: 'bg-green-500'
        },
        {
          id: 'monitor',
          title: 'Monitor',
          description: 'Stay protected with continuous privacy monitoring and alerts',
          icon: Bell,
          color: 'bg-purple-500'
        }
      ];
  };

  // Get benefits
  const getTranslatedBenefits = () => {
    return [
        {
          title: "Personalized Privacy Roadmap",
          description: "A step-by-step journey tailored to your specific privacy needs and concerns",
          icon: FileText
        },
        {
          title: "Progress Tracking",
          description: "Visualize your privacy improvements and celebrate milestones along the way",
          icon: CheckCircle
        },
        {
          title: "Guided Implementation",
          description: "Clear instructions and assistance for each privacy enhancement action",
          icon: Lightbulb
        },
        {
          title: "Continuous Adaptation",
          description: "Your journey evolves as privacy threats and your digital habits change",
          icon: Database
        }
      ];
  };

  // Get text
  const getTranslatedText = () => {
    return {
        title: "Your Privacy Journey",
        subtitle: "A personalized roadmap to better privacy protection",
        personalizedJourney: "Your Personalized Privacy Journey",
        description: "We've created a step-by-step roadmap to help you improve your privacy protection. Based on your assessment results, we'll guide you through the most important actions to take, track your progress, and celebrate your privacy milestones.",
        startAssessment: "Start Your Assessment",
        viewDashboard: "View Your Dashboard",
        whyJourney: "Why a Privacy Journey?",
        whyJourneyDescription: "Privacy protection isn't a one-time task—it's an ongoing process. Our Privacy Journey approach breaks down complex privacy improvements into manageable steps, provides clear guidance, and helps you maintain your privacy over time.",
        howJourneyWorks: "How Your Privacy Journey Works",
        benefitsTitle: "Benefits of Privacy Journey Mapping",
        readyToStart: "Ready to Start Your Privacy Journey?",
        beginWithAssessment: "Begin with a comprehensive privacy assessment to create your personalized journey map.",
        takeAssessment: "Take Your Privacy Assessment"
    };
  };

  const journeySteps = getTranslatedJourneySteps();
  const benefits = getTranslatedBenefits();
  const text = getTranslatedText();

  return (
    <PageLayout
      title={text.title}
      subtitle={text.subtitle}
      description={text.description}
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Privacy Journey', path: '/privacy-journey' }
      ]}
    >
      <Section>
        {/* Quick Action Buttons */}
        <div className="mb-12 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/assessment">
            <Button variant="primary">
              {text.startAssessment}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">
              {text.viewDashboard}
            </Button>
          </Link>
        </div>

        {/* Why Journey Info Card */}
        <div className="mb-12 max-w-4xl mx-auto">
          <Card className="p-6">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-accent mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">{text.whyJourney}</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {text.whyJourneyDescription}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            {text.howJourneyWorks}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {journeySteps.map((step, index) => (
              <Card key={step.id} className="p-6">
                <div className="relative mb-4">
                  <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center text-white`}>
                    {React.createElement(step.icon, { className: "h-6 w-6" })}
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Journey Mapping Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            {"Track Your Progress"}
          </h2>
          
          <PrivacyJourneyMapping />
        </div>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
            {text.benefitsTitle}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start">
                  <div className="p-3 bg-accent/10 rounded-full mr-4">
                    {React.createElement(benefit.icon, { className: "h-6 w-6 text-accent" })}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary dark:text-white mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="p-8 bg-accent text-white">
            <h2 className="text-2xl font-bold mb-4">{text.readyToStart}</h2>
            <p className="text-lg mb-6">
              {text.beginWithAssessment}
            </p>
            <Link to="/assessment">
              <Button variant="primary" className="bg-white text-accent hover:bg-gray-100 shadow-lg hover:shadow-xl">
                {text.takeAssessment}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </Card>
        </div>
      </Section>
    </PageLayout>
  );
};

export default PrivacyJourneyPage;