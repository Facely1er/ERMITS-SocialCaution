import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Eye, 
  Database, 
  User, 
  CreditCard, 
  Network, 
  MapPin, 
  ShoppingCart, 
  Rows as Browser,
  AlertTriangle,
  ArrowRight,
  Lock,
  FileText,
  // Search removed - not used
} from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const PrivacyFocusPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFocusSelect = (_focusId: string) => {
    // In a real implementation, this would store the selection in a state management system
    navigate('/assessment');
  };

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

  const privacyFocuses = [
    {
      id: 'workplace-privacy',
      title: 'Workplace Privacy & Employee Data Protection',
      description: 'Understand how employers collect, use, and protect employee data, and learn about your rights and protections in the workplace.',
      icon: Shield,
      areas: [
        {
          id: 'employer-monitoring',
          title: 'Employer Monitoring',
          description: 'Understanding workplace surveillance and monitoring practices',
          icon: Eye,
          category: 'Workplace',
          risks: [
            'Email and communication monitoring',
            'Computer activity tracking',
            'Video surveillance in workplace',
            'GPS tracking of company devices',
            'Keystroke logging and screen monitoring'
          ],
          recommendations: [
            'Review company monitoring policies',
            'Understand your privacy rights at work',
            'Keep personal activities on personal devices',
            'Be aware of consent requirements',
            'Know what monitoring is legally permitted'
          ]
        },
        {
          id: 'employee-data-collection',
          title: 'Employee Data Collection',
          description: 'What personal data employers collect and how it\'s used',
          icon: Database,
          category: 'Data Collection',
          risks: [
            'Extensive personal information collection',
            'Health and biometric data storage',
            'Background check data retention',
            'Performance tracking data',
            'Social media monitoring'
          ],
          recommendations: [
            'Know what data is being collected',
            'Request access to your employee file',
            'Understand data retention policies',
            'Ask about data sharing with third parties',
            'Review privacy notices and consent forms'
          ]
        },
        {
          id: 'data-protection-measures',
          title: 'Employer Data Protection',
          description: 'How employers should protect employee information',
          icon: Lock,
          category: 'Protection',
          risks: [
            'Data breaches exposing employee information',
            'Inadequate security measures',
            'Unauthorized access to personnel files',
            'Insecure data transfer practices',
            'Lack of encryption for sensitive data'
          ],
          recommendations: [
            'Ask about employer security policies',
            'Verify encryption of sensitive data',
            'Understand breach notification procedures',
            'Check if employer follows data protection laws',
            'Ensure access controls are in place'
          ]
        },
        {
          id: 'employee-rights',
          title: 'Employee Privacy Rights',
          description: 'Your rights regarding workplace data privacy',
          icon: FileText,
          category: 'Rights',
          risks: [
            'Unclear privacy policies',
            'Lack of consent for data use',
            'No right to access personal data',
            'Inability to correct inaccurate information',
            'Data used beyond stated purposes'
          ],
          recommendations: [
            'Know your rights under privacy laws (GDPR, CCPA, etc.)',
            'Request data access and correction',
            'Understand consent and opt-out rights',
            'Be aware of data portability rights',
            'Know how to file privacy complaints',
            'Review employment contracts for privacy clauses'
          ]
        }
      ]
    },
    {
      id: 'digital-exposure',
      title: 'Digital Activity Exposure',
      description: 'Understand and control your digital footprint across different online platforms and services.',
      icon: Eye,
      areas: [
        {
          id: 'social-media',
          title: 'Social Media Activity',
          description: 'Your presence and interactions on social platforms',
          icon: User,
          category: 'Social',
          risks: [
            'Personal information exposure',
            'Unauthorized profile access',
            'Social engineering attacks',
            'Identity theft'
          ],
          recommendations: [
            'Review privacy settings regularly',
            'Limit personal information sharing',
            'Enable two-factor authentication',
            'Monitor account activity'
          ]
        },
        {
          id: 'location',
          title: 'Location Exposure',
          description: 'Your physical location data and tracking',
          icon: MapPin,
          category: 'Location',
          risks: [
            'Real-time location tracking',
            'Location history exposure',
            'Stalking risks',
            'Pattern analysis'
          ],
          recommendations: [
            'Disable location services when not needed',
            'Review app location permissions',
            'Clear location history regularly',
            'Use location spoofing when necessary'
          ]
        },
        {
          id: 'consumer',
          title: 'Consumer Profile',
          description: 'Your shopping habits and preferences data',
          icon: ShoppingCart,
          category: 'Consumer',
          risks: [
            'Purchase history tracking',
            'Behavioral profiling',
            'Targeted advertising',
            'Data broker collection'
          ],
          recommendations: [
            'Use private browsing for shopping',
            'Opt out of data collection',
            'Clear shopping history',
            'Review merchant privacy policies'
          ]
        },
        {
          id: 'browsing',
          title: 'Online Browsing',
          description: 'Your web browsing activities and data collection',
          icon: Browser,
          category: 'Browsing',
          risks: [
            'Browser fingerprinting',
            'Cross-site tracking',
            'Search history exposure',
            'Cookie profiling'
          ],
          recommendations: [
            'Use privacy-focused browsers',
            'Enable tracking protection',
            'Clear browsing data regularly',
            'Install privacy extensions'
          ]
        }
      ]
    },
    {
      id: 'protection-priorities',
      title: 'Protection Priorities',
      description: 'Essential protection measures to safeguard your digital presence and personal information.',
      icon: Shield,
      areas: [
        {
          id: 'identity',
          title: 'Identity Protection',
          description: 'Safeguarding your personal identity and credentials',
          icon: User,
          category: 'Identity',
          risks: [
            'Identity theft',
            'Credential compromise',
            'Social engineering',
            'Impersonation attacks'
          ],
          recommendations: [
            'Use strong unique passwords',
            'Enable two-factor authentication',
            'Monitor credit reports',
            'Use identity monitoring services'
          ]
        },
        {
          id: 'financial',
          title: 'Financial Protection',
          description: 'Securing your payment and financial information',
          icon: CreditCard,
          category: 'Financial',
          risks: [
            'Payment fraud',
            'Financial data theft',
            'Unauthorized transactions',
            'Skimming attacks'
          ],
          recommendations: [
            'Use secure payment methods',
            'Monitor account activity',
            'Enable transaction alerts',
            'Use virtual cards for online purchases'
          ]
        },
        {
          id: 'data',
          title: 'Data Protection',
          description: 'Securing your sensitive information and files',
          icon: Database,
          category: 'Data',
          risks: [
            'Data breaches',
            'Unauthorized access',
            'Data leakage',
            'Ransomware attacks'
          ],
          recommendations: [
            'Encrypt sensitive data',
            'Use secure storage solutions',
            'Regular data backups',
            'Access control implementation'
          ]
        },
        {
          id: 'network',
          title: 'Network Protection',
          description: 'Securing your internet connections and devices',
          icon: Network,
          category: 'Network',
          risks: [
            'Network intrusion',
            'Man-in-the-middle attacks',
            'Malware infection',
            'Device compromise'
          ],
          recommendations: [
            'Use VPN services',
            'Enable firewalls',
            'Update software regularly',
            'Secure device settings'
          ]
        }
      ]
    },
    {
      id: 'workplace-privacy',
      title: 'Workplace Privacy',
      description: 'Understanding and protecting your privacy rights and personal data in professional environments.',
      icon: Database,
      areas: [
        {
          id: 'employee-monitoring',
          title: 'Employee Monitoring',
          description: 'Understanding how employers monitor and track employee activities',
          icon: Eye,
          category: 'Monitoring',
          risks: [
            'Keystroke logging and screen monitoring',
            'Email and communication surveillance',
            'Location tracking and GPS monitoring',
            'Biometric data collection',
            'Web browsing and internet activity tracking'
          ],
          recommendations: [
            'Understand your company\'s monitoring policies',
            'Use personal devices for personal activities',
            'Be aware of what data is being collected',
            'Know your legal rights regarding workplace privacy',
            'Use encrypted communication for sensitive matters'
          ]
        },
        {
          id: 'data-collection',
          title: 'Personal Data Collection',
          description: 'How employers collect, store, and use your personal information',
          icon: Database,
          category: 'Data Collection',
          risks: [
            'Excessive personal data collection',
            'Data sharing with third parties',
            'Inadequate data security measures',
            'Data retention beyond necessary periods',
            'Lack of transparency about data usage'
          ],
          recommendations: [
            'Review your employment contract and privacy policies',
            'Understand what data is collected and why',
            'Request access to your personal data',
            'Ask about data retention policies',
            'Know your rights under data protection laws'
          ]
        },
        {
          id: 'workplace-surveillance',
          title: 'Workplace Surveillance',
          description: 'Physical and digital surveillance in the workplace',
          icon: Camera,
          category: 'Surveillance',
          risks: [
            'Video surveillance in work areas',
            'Audio recording in meetings and calls',
            'Computer activity monitoring',
            'Social media monitoring',
            'Background checks and social media screening'
          ],
          recommendations: [
            'Be aware of surveillance cameras and their locations',
            'Understand policies on recording meetings',
            'Use personal devices for private communications',
            'Be cautious about social media posts',
            'Know your rights regarding workplace surveillance'
          ]
        },
        {
          id: 'data-rights',
          title: 'Employee Data Rights',
          description: 'Your rights regarding personal data in the workplace',
          icon: Shield,
          category: 'Rights',
          risks: [
            'Lack of awareness of data rights',
            'Inability to access personal data',
            'No control over data processing',
            'Limited ability to correct inaccurate data',
            'Difficulty in data portability'
          ],
          recommendations: [
            'Familiarize yourself with data protection laws (GDPR, CCPA, etc.)',
            'Request copies of your personal data',
            'Exercise your right to data correction',
            'Understand data processing purposes',
            'Know how to file complaints about data misuse'
          ]
        }
      ]
    }
  ];

  return (
    <PageLayout
      title="Privacy Focus Areas"
      subtitle="Choose your privacy focus to get personalized recommendations"
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Privacy Focus', path: '/privacy-focus' }
      ]}
    >

      <Section
        title="Privacy Focus Areas"
        subtitle="Select the areas you want to focus on to receive tailored privacy recommendations"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {privacyFocuses.map((focus) => (
            <Card key={focus.id} className="p-6">
              <div className="flex items-start mb-4">
                <div className="p-3 bg-accent/10 rounded-lg mr-4 flex-shrink-0">
                  <focus.icon className="h-8 w-8 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl md:text-2xl font-semibold text-primary dark:text-white break-words">{focus.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{focus.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {focus.areas.map((area) => (
                  <div
                    key={area.id}
                    className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-accent/50 hover:bg-light-blue/50 dark:hover:bg-accent/5 cursor-pointer transition-all ${
                      selectedFocus === focus.id && selectedArea === area.id ? 'border-accent bg-light-blue dark:bg-accent/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedFocus(focus.id);
                      setSelectedArea(area.id);
                    }}
                  >
                    <div className="flex items-start">
                      <div className="p-2 bg-accent/10 rounded-lg mr-3 flex-shrink-0">
                        <area.icon className="h-5 w-5 text-accent" />
                      </div>
                      <h3 className="text-base md:text-lg font-medium text-primary dark:text-white flex-1 min-w-0 break-words">
                        {area.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                      {area.description}
                    </p>

                    {selectedFocus === focus.id && selectedArea === area.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <h4 className="text-sm font-medium text-danger mb-2 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Potential Risks
                          </h4>
                          <ul className="space-y-1">
                            {area.risks.map((risk, i) => (
                              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <div className="w-1.5 h-1.5 bg-danger rounded-full mr-2" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-success mb-2 flex items-center">
                            <Shield className="h-4 w-4 mr-1" />
                            Recommendations
                          </h4>
                          <ul className="space-y-1">
                            {area.recommendations.map((rec, i) => (
                              <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <div className="w-1.5 h-1.5 bg-success rounded-full mr-2" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button
                            variant="primary"
                            onClick={() => handleFocusSelect(focus.id)}
                            className="w-full flex items-center justify-center"
                          >
                            Take Privacy Assessment
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-7xl mx-auto mt-12 text-center"
        >
          <Link to="/assessment">
            <Button
              variant="primary"
              className="inline-flex items-center px-6 py-3 text-lg"
            >
              Take Complete Privacy Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </Section>
    </PageLayout>
  );
};

export default PrivacyFocusPage;