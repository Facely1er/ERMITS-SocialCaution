import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Database, FileText, List, BookOpen, Lock, Eye, ArrowRight, Check, Wrench, PenTool as Tool } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ToolkitNav from '../components/navigation/ToolkitNav';
const ToolkitPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'guides' | 'checklists' | 'tools'>('all');
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
    
    // Toolkit-related particles
    class ToolkitParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      type: 'tool' | 'wrench' | 'shield' | 'book';
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
        this.type = ['tool', 'wrench', 'shield', 'book'][Math.floor(Math.random() * 4)] as any;
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
        
        // Draw different toolkit symbols based on type
        switch (this.type) {
          case 'tool':
            this.drawTool();
            break;
          case 'wrench':
            this.drawWrench();
            break;
          case 'shield':
            this.drawShield();
            break;
          case 'book':
            this.drawBook();
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
      
      drawBook() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Book cover
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        
        // Book spine
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size/6, size);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
        
        // Book pages
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/2 + size/10);
        ctx.lineTo(size/2 - size/10, -size/2 + size/10);
        ctx.lineTo(size/2 - size/10, size/2 - size/10);
        ctx.lineTo(-size/3, size/2 - size/10);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();
        
        // Book lines
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(-size/3 + size/10, -size/2 + size/10 + i * size/4);
          ctx.lineTo(size/2 - size/5, -size/2 + size/10 + i * size/4);
          ctx.strokeStyle = 'rgba(10, 25, 41, 0.3)';
          ctx.lineWidth = size/20;
          ctx.stroke();
        }
      }
    }
    
    // Create toolkit particles
    const particles: ToolkitParticle[] = [];
    for (let i = 0; i < 15; i++) {
      particles.push(new ToolkitParticle());
    }
    
    // Animation loop
    function animate() {
      if (!ctx) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw toolkit particles
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

  // Define tools
  const tools = [
    {
      id: 'digital-footprint',
      title: 'Digital Footprint Analyzer',
      description: 'Discover and analyze your online presence across the internet.',
      icon: Eye,
      path: '/resources/tools/digital-footprint'
    },
    {
      id: 'cookie-tracker',
      title: 'Cookie & Tracker Scanner',
      description: 'Discover what trackers are monitoring your activity on any website.',
      icon: Search,
      path: '/resources/tools/cookie-tracker'
    },
    {
      id: 'data-broker-removal',
      title: 'Data Broker Removal Tool',
      description: 'Remove your personal information from data broker sites that sell your data',
      icon: Database,
      path: '/resources/tools/data-broker-removal'
    },
    {
      id: 'personal-data-inventory',
      title: 'Personal Data Inventory',
      description: 'Catalog where your personal information is stored and shared',
      icon: FileText,
      path: '/resources/tools/personal-data-inventory'
    },
    {
      id: 'privacy-assessment',
      title: 'Privacy Assessment Tool',
      description: 'Get your personalized privacy score and recommendations',
      icon: Shield,
      path: '/resources/tools/privacy-assessment'
    },
    {
      id: 'privacy-simulator',
      title: 'Privacy Simulator',
      description: 'Test different privacy settings and see their impact on your protection',
      icon: Lock,
      path: '/resources/tools/privacy-simulator'
    }
  ];

  // Define guides
  const guides = [
    {
      id: 'understanding-privacy',
      title: 'Understanding Your Privacy Rights',
      description: 'Learn about your digital footprint and how to protect your personal information online.',
      icon: BookOpen,
      path: '/resources/guides/understanding-privacy'
    },
    {
      id: 'social-media-security',
      title: 'Social Media Security Guide',
      description: 'Comprehensive guide to securing your social media accounts and protecting your online presence.',
      icon: BookOpen,
      path: '/resources/guides/social-media-security'
    },
    {
      id: 'password-management',
      title: 'Password Management Guide',
      description: 'Learn how to create, store, and manage secure passwords effectively.',
      icon: BookOpen,
      path: '/resources/guides/password-management'
    }
  ];

  // Define checklists
  const checklists = [
    {
      id: 'home-network-security',
      title: 'Home Network Security Checklist',
      description: 'Essential steps to secure your home network and protect your connected devices.',
      icon: List,
      path: '/resources/checklists/home-network-security'
    },
    {
      id: 'social-media-privacy',
      title: 'Social Media Privacy Checklist',
      description: 'Protect your privacy across social media platforms with these essential steps.',
      icon: List,
      path: '/resources/checklists/social-media-privacy'
    },
    {
      id: 'password-security',
      title: 'Password Security Checklist',
      description: 'Essential steps to create and maintain secure passwords.',
      icon: List,
      path: '/resources/checklists/password-security'
    }
  ];

  // Filter items based on search
  const filteredTools = tools.filter(tool => 
    searchTerm === '' || 
    tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredGuides = guides.filter(guide => 
    searchTerm === '' || 
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredChecklists = checklists.filter(checklist => 
    searchTerm === '' || 
    checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    checklist.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showTools = selectedType === 'all' || selectedType === 'tools';
  const showGuides = selectedType === 'all' || selectedType === 'guides';
  const showChecklists = selectedType === 'all' || selectedType === 'checklists';

  // Title and description helpers
  const getTranslatedTitle = () => {
    return 'Privacy Toolkit';
  };

  const getTranslatedSubtitle = () => {
    return 'Comprehensive Privacy Protection Tools';
  };

  const getTranslatedDescription = () => {
    return 'Access all our privacy tools, guides, and checklists in one place';
  };

  const getTranslatedSearchPlaceholder = () => {
    return "Search for privacy tools...";
  };

  const getTranslatedWhyUseTitle = () => {
    return "Why Use Our Privacy Tools";
  };

  const getTranslatedHowToUseTitle = () => {
    return "How to Use Our Privacy Toolkit";
  };

  const getTranslatedFaqTitle = () => {
    return "Frequently Asked Questions";
  };

  const getTranslatedCtaTitle = () => {
    return "Ready to Take Control of Your Privacy?";
  };

  const getTranslatedCtaDescription = () => {
    return "Start with our comprehensive Privacy Assessment to get a personalized action plan for protecting your digital privacy.";
  };

  const getTranslatedCtaButton = () => {
    return "Start Free Privacy Assessment";
  };

  const getTranslatedWhyUseItems = () => {
    return {
      comprehensive: {
        title: "Comprehensive Protection",
        description: "Our tools work together to provide complete coverage of your digital privacy needs, from assessment to action."
      },
      privacyFirst: {
        title: "Privacy-First Design",
        description: "All tools process your data locally in your browser. We never store or transmit your personal information."
      },
      actionable: {
        title: "Actionable Results",
        description: "Every tool provides clear, step-by-step guidance on how to address the privacy issues it identifies."
      }
    };
  };

  const getTranslatedHowToUseSteps = () => {
    return {
      assess: {
        title: "Assess Your Privacy",
        description: "Start with the Privacy Assessment Tool to get a baseline understanding of your current privacy posture."
      },
      analyze: {
        title: "Analyze Your Exposure",
        description: "Use the Digital Footprint Analyzer and Data Broker Removal Tool to identify and address your online exposure."
      },
      implement: {
        title: "Implement Protection",
        description: "Use the Privacy Settings Simulator and Personal Data Inventory to strengthen your privacy protections."
      }
    };
  };

  const getTranslatedFaqQuestions = () => {
    return {
      free: {
        question: "Are these tools free to use?",
        answer: "Yes, all basic versions of our privacy tools are free to use. Premium subscribers get access to enhanced features, more detailed analysis, and additional protection options."
      },
      frequency: {
        question: "How often should I use these tools?",
        answer: "We recommend running a full privacy assessment every 3 months. The Digital Footprint Analyzer and Data Broker Removal Tool should be used monthly to catch new exposures. The Personal Data Inventory should be updated whenever you create new accounts or share information with new services."
      },
      dataSafety: {
        question: "Is my data safe when using these tools?",
        answer: "Absolutely. All of our tools process your data locally in your browser. We never store or transmit your personal information to our servers. Your privacy is our top priority, which is why we've designed our tools with a privacy-first approach."
      },
      family: {
        question: "Can I use these tools for my family members?",
        answer: "Yes, our Family plan allows you to use all privacy tools for up to 5 family members. This is especially useful for protecting children's privacy and helping less tech-savvy family members manage their digital footprint."
      }
    };
  };

  const whyUseItems = getTranslatedWhyUseItems();
  const howToUseSteps = getTranslatedHowToUseSteps();
  const faqQuestions = getTranslatedFaqQuestions();

  return (
    <PageLayout
      title={getTranslatedTitle()}
      subtitle={getTranslatedSubtitle()}
      description={getTranslatedDescription()}
      heroBackground={false}
      backgroundType="toolkit"
      breadcrumbs={[
        { label: 'Toolkit', path: '/toolkit' }
      ]}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
      <Section>
        <div className="flex flex-col lg:flex-row gap-8">
          <ToolkitNav />
          
          <div className="flex-1">
            <div className="max-w-4xl mx-auto mb-12">

          {/* Search Bar */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="toolkit-search"
              name="search"
              placeholder={getTranslatedSearchPlaceholder()}
              className="w-full py-3 pl-10 pr-4 border border-gray-300 dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-card text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedType('all')}
              className={`text-sm py-1 px-3 rounded-full transition-colors ${
                selectedType === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-card-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accent/20'
              }`}
            >
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                All Resources
              </div>
            </button>
            <button
              onClick={() => setSelectedType('tools')}
              className={`text-sm py-1 px-3 rounded-full transition-colors ${
                selectedType === 'tools'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-card-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accent/20'
              }`}
            >
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-1" />
                Tools
              </div>
            </button>
            <button
              onClick={() => setSelectedType('guides')}
              className={`text-sm py-1 px-3 rounded-full transition-colors ${
                selectedType === 'guides'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-card-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accent/20'
              }`}
            >
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                Guides
              </div>
            </button>
            <button
              onClick={() => setSelectedType('checklists')}
              className={`text-sm py-1 px-3 rounded-full transition-colors ${
                selectedType === 'checklists'
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 dark:bg-card-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-accent/20'
              }`}
            >
              <div className="flex items-center">
                <List className="h-4 w-4 mr-1" />
                Checklists
              </div>
            </button>
          </div>

          {/* Privacy Tools Section */}
          {showTools && filteredTools.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Privacy Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
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
                        <div className="flex items-start mb-4">
                          <div className="p-2 bg-accent/10 rounded-full mr-3">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <h3 className="text-lg font-semibold text-primary dark:text-white">{tool.title}</h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{tool.description}</p>
                        
                        <div className="mt-auto">
                          <Badge variant="primary">
                            <div className="flex items-center">
                              <Tool className="h-3 w-3 mr-1" />
                              Tool
                            </div>
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Privacy Guides Section */}
          {showGuides && filteredGuides.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Privacy Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGuides.map((guide) => {
                  const Icon = guide.icon;
                  return (
                    <Link
                      key={guide.id}
                      to={guide.path}
                      className="block"
                    >
                      <Card
                        animate
                        className="p-6 flex flex-col h-full hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start mb-4">
                          <div className="p-2 bg-accent/10 rounded-full mr-3">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <h3 className="text-lg font-semibold text-primary dark:text-white">{guide.title}</h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{guide.description}</p>
                        
                        <div className="mt-auto">
                          <Badge variant="secondary">
                            <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Guide
                            </div>
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Privacy Checklists Section */}
          {showChecklists && filteredChecklists.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">Privacy Checklists</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChecklists.map((checklist) => {
                  const Icon = checklist.icon;
                  return (
                    <Link
                      key={checklist.id}
                      to={checklist.path}
                      className="block"
                    >
                      <Card
                        animate
                        className="p-6 flex flex-col h-full hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start mb-4">
                          <div className="p-2 bg-accent/10 rounded-full mr-3">
                            <Icon className="h-5 w-5 text-accent" />
                          </div>
                          <h3 className="text-lg font-semibold text-primary dark:text-white">{checklist.title}</h3>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{checklist.description}</p>
                        
                        <div className="mt-auto">
                          <Badge variant="secondary">
                            <div className="flex items-center">
                              <List className="h-3 w-3 mr-1" />
                              Checklist
                            </div>
                          </Badge>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Why Use Our Privacy Tools */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{getTranslatedWhyUseTitle()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-accent/10 rounded-full mr-3">
                    <Shield className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{whyUseItems.comprehensive.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{whyUseItems.comprehensive.description}</p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-accent/10 rounded-full mr-3">
                    <Lock className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{whyUseItems.privacyFirst.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{whyUseItems.privacyFirst.description}</p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-accent/10 rounded-full mr-3">
                    <Check className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{whyUseItems.actionable.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{whyUseItems.actionable.description}</p>
              </Card>
            </div>
          </div>

          {/* How to Use Our Privacy Toolkit */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{getTranslatedHowToUseTitle()}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent text-white rounded-full mr-3">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{howToUseSteps.assess.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{howToUseSteps.assess.description}</p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent text-white rounded-full mr-3">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{howToUseSteps.analyze.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{howToUseSteps.analyze.description}</p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent text-white rounded-full mr-3">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary dark:text-white">{howToUseSteps.implement.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{howToUseSteps.implement.description}</p>
              </Card>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{getTranslatedFaqTitle()}</h2>
            <div className="space-y-4">
              <Card className="p-6">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="font-semibold text-primary dark:text-white">{faqQuestions.free.question}</h3>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    {faqQuestions.free.answer}
                  </div>
                </details>
              </Card>
              
              <Card className="p-6">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="font-semibold text-primary dark:text-white">{faqQuestions.frequency.question}</h3>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    {faqQuestions.frequency.answer}
                  </div>
                </details>
              </Card>
              
              <Card className="p-6">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="font-semibold text-primary dark:text-white">{faqQuestions.dataSafety.question}</h3>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    {faqQuestions.dataSafety.answer}
                  </div>
                </details>
              </Card>
              
              <Card className="p-6">
                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer list-none">
                    <h3 className="font-semibold text-primary dark:text-white">{faqQuestions.family.question}</h3>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                  </summary>
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    {faqQuestions.family.answer}
                  </div>
                </details>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-accent/5 dark:bg-accent/10 p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-primary dark:text-white mb-4">{getTranslatedCtaTitle()}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              {getTranslatedCtaDescription()}
            </p>
            <Link to="/assessment">
              <Button 
                variant="primary" 
                className="text-lg px-8 py-3"
              >
                {getTranslatedCtaButton()}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
            </div>
          </div>
        </div>
      </Section>
      </motion.div>
    </PageLayout>
  );
};

export default ToolkitPage;