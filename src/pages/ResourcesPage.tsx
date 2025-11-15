import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Info, Database, FileText, BookOpen, Lock, Globe, Eye, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import Section from '../components/common/Section';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
// import Button from '../components/common/Button';
import ResourcesNav from '../components/navigation/ResourcesNav';
const ResourcesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'guides' | 'checklists' | 'tools'>('all');
  // const [selectedPlatform] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Define platforms (commented out for now)
  // const platforms = ['General', 'Social Media', 'Email', 'Mobile', 'Network', 'Browser'];

  // Define tools (commented out for now)
  // const tools = [
  //   {
  //     id: 'digital-footprint',
  //     title: //            //            'Digital Footprint Analyzer',
  //     description: //                 //                 'Discover and analyze your online presence across the internet.',
  //     icon: Eye,
  //     features: [
  //       //       //       'Online presence analysis',
  //       
  //       //       //       'Risk assessment',
  //       
  //       //       //       'Privacy recommendations'
  //],
  //     path: '/resources/tools/digital-footprint'
  //   },
  //   {
  //     id: 'cookie-tracker',
  //     title: //            //            'Cookie & Tracker Scanner',
  //     description: //                 //                 'Discover what trackers are monitoring your activity on any website.',
  //     icon: Search,
  //     features: [
  //       //       //       'Cookie analysis',
  //       
  //       //       //       'Tracker detection',
  //       
  //       //       //       'Privacy risk assessment'
  //],
  //     path: '/resources/tools/cookie-tracker'
  //   },
  //   {
  //     id: 'data-broker-removal',
  //     title: t('resources.tools.items.dataBroker.title'),
  //     description: t('resources.tools.items.dataBroker.description'),
  //     icon: Database,
  //     features: [
  //       t('resources.tools.items.dataBroker.features.tracking'), 
  //       t('resources.tools.items.dataBroker.features.monitoring'), 
  //       t('resources.tools.items.dataBroker.features.reminders')
  //     ],
  //     path: '/resources/tools/data-broker-removal'
  //   },
  //   {
  //     id: 'personal-data-inventory',
  //     title: t('resources.tools.items.inventory.title'),
  //     description: t('resources.tools.items.inventory.description'),
  //     icon: FileText,
  //     features: [
  //       t('resources.tools.items.inventory.features.mapping'), 
  //       t('resources.tools.items.inventory.features.assessment'), 
  //       t('resources.tools.items.inventory.features.planning')
  //     ],
  //     path: '/resources/tools/personal-data-inventory'
  //   },
  //   {
  //     id: 'privacy-assessment',
  //     title: t('resources.tools.items.assessment.title'),
  //     description: t('resources.tools.items.assessment.description'),
  //     icon: Shield,
  //     features: [
  //       t('resources.tools.items.assessment.features.scoring'), 
  //       t('resources.tools.items.assessment.features.analysis'), 
  //       t('resources.tools.items.assessment.features.recommendations')
  //     ],
  //     path: '/resources/tools/privacy-assessment'
  //   },
  //   {
  //     id: 'privacy-simulator',
  //     title: t('resources.tools.items.simulator.title'),
  //     description: t('resources.tools.items.simulator.description'),
  //     icon: Lock,
  //     features: [
  //       t('resources.tools.items.simulator.features.simulation'), 
  //       t('resources.tools.items.simulator.features.guidance'), 
  //       t('resources.tools.items.simulator.features.visualization')
  //     ],
  //     path: '/resources/tools/privacy-simulator'
  //   }
  // ];

  // Filter tools based on search and selected type/platform
  // const filteredTools = tools.filter(tool => {
  //   const matchesSearch = searchTerm === '' || 
  //     tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    
  //   const matchesType = selectedType === 'all' || selectedType === 'tools';
    
  //   const matchesPlatform = !selectedPlatform || 
  //     (tool.features && tool.features.some(feature => 
  //       feature.toLowerCase().includes(selectedPlatform.toLowerCase())
  //     ));
    
  //   return matchesSearch && matchesType && matchesPlatform;
  // });

  // const showTools = selectedType === 'all' || selectedType === 'tools';
  // const showGuides = selectedType === 'all' || selectedType === 'guides';
  // const showChecklists = selectedType === 'all' || selectedType === 'checklists';

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
    
    // Resource-related icons
    class ResourceIcon {
      x: number;
      y: number;
      size: number;
      type: 'book' | 'file' | 'shield' | 'list';
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 10;
        this.type = ['book', 'file', 'shield', 'list'][Math.floor(Math.random() * 4)] as any;
        this.opacity = Math.random() * 0.3 + 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      }
      
      update() {
        this.rotation += this.rotationSpeed;
        
        // Slow drift
        this.x += Math.sin(Date.now() * 0.001 + this.rotation) * 0.2;
        this.y += Math.cos(Date.now() * 0.001 + this.rotation) * 0.2;
        
        // Wrap around edges
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // Draw different resource icons
        switch (this.type) {
          case 'book':
            this.drawBook();
            break;
          case 'file':
            this.drawFile();
            break;
          case 'shield':
            this.drawShield();
            break;
          case 'list':
            this.drawList();
            break;
        }
        
        ctx.restore();
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
      
      drawFile() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // File shape
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/2);
        ctx.lineTo(size/6, -size/2);
        ctx.lineTo(size/2, -size/6);
        ctx.lineTo(size/2, size/2);
        ctx.lineTo(-size/2, size/2);
        ctx.closePath();
        ctx.fill();
        
        // Folded corner
        ctx.beginPath();
        ctx.moveTo(size/6, -size/2);
        ctx.lineTo(size/6, -size/6);
        ctx.lineTo(size/2, -size/6);
        ctx.fillStyle = 'rgba(10, 25, 41, 0.2)';
        ctx.fill();
        
        // File lines
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(-size/3, -size/3 + i * size/4);
          ctx.lineTo(size/3, -size/3 + i * size/4);
          ctx.strokeStyle = 'rgba(10, 25, 41, 0.3)';
          ctx.lineWidth = size/20;
          ctx.stroke();
        }
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
      
      drawList() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // List background
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        
        // List items
        for (let i = 0; i < 3; i++) {
          // Bullet point
          ctx.beginPath();
          ctx.arc(-size/3, -size/3 + i * size/3, size/10, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
          ctx.fill();
          
          // Line
          ctx.beginPath();
          ctx.moveTo(-size/5, -size/3 + i * size/3);
          ctx.lineTo(size/3, -size/3 + i * size/3);
          ctx.strokeStyle = 'rgba(10, 25, 41, 0.3)';
          ctx.lineWidth = size/20;
          ctx.stroke();
        }
      }
    }
    
    // Connection node class
    class ResourceNode {
      x: number;
      y: number;
      size: number;
      connections: number[];
      color: string;
      pulseSpeed: number;
      pulsePhase: number;
      
      constructor(index: number, totalNodes: number) {
        // Position nodes in a network-like pattern
        const angle = (index / totalNodes) * Math.PI * 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.4 * (0.8 + Math.random() * 0.4);
        
        this.x = canvas.width / 2 + Math.cos(angle) * radius;
        this.y = canvas.height / 2 + Math.sin(angle) * radius;
        this.size = Math.random() * 3 + 2;
        
        // Create connections to other nodes
        this.connections = [];
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < connectionCount; i++) {
          let target;
          do {
            target = Math.floor(Math.random() * totalNodes);
          } while (target === index || this.connections.includes(target));
          this.connections.push(target);
        }
        
        // Visual properties
        const colors = [
          'rgba(255, 107, 53, 0.8)', // Accent orange
          'rgba(74, 144, 226, 0.8)',  // Blue
          'rgba(255, 255, 255, 0.8)'  // White
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }
      
      update() {
        this.pulsePhase += this.pulseSpeed;
        if (this.pulsePhase > Math.PI * 2) this.pulsePhase -= Math.PI * 2;
      }
      
      draw() {
        if (!ctx) return;
        
        // Pulsing effect
        const pulseSize = this.size * (1 + 0.3 * Math.sin(this.pulsePhase));
        
        // Draw node
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      
      drawConnections(nodes: ResourceNode[]) {
        if (!ctx) return;
        
        for (const targetIndex of this.connections) {
          const target = nodes[targetIndex];
          
          // Calculate data packet position
          const dx = target.x - this.x;
          const dy = target.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(target.x, target.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Draw data packets moving along the connection
          const packetCount = Math.floor(distance / 50) + 1;
          for (let i = 0; i < packetCount; i++) {
            const progress = (Date.now() / 2000 + i / packetCount) % 1;
            const packetX = this.x + dx * progress;
            const packetY = this.y + dy * progress;
            
            ctx.beginPath();
            ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
            ctx.fill();
          }
        }
      }
    }
    
    // Create resource icons
    const icons: ResourceIcon[] = [];
    for (let i = 0; i < 20; i++) {
      icons.push(new ResourceIcon());
    }
    
    // Create connection nodes
    const nodeCount = 12;
    const nodes: ResourceNode[] = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new ResourceNode(i, nodeCount));
    }
    
    // Animation loop
    function animate() {
      if (!ctx) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw connection nodes
      nodes.forEach(node => {
        node.update();
      });
      
      // Draw connections first (so they appear behind nodes)
      nodes.forEach((node, _index) => {
        node.drawConnections(nodes);
      });
      
      // Then draw nodes
      nodes.forEach(node => {
        node.draw();
      });
      
      // Update and draw resource icons
      icons.forEach(icon => {
        icon.update();
        icon.draw();
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

  // Get translated title
  const getTranslatedTitle = () => {
    return 'Privacy Resources';
  };

  // Get translated subtitle
  const getTranslatedSubtitle = () => {
    return 'Comprehensive Privacy Protection Resources';
  };

  // Get translated search placeholder
  const getTranslatedSearchPlaceholder = () => {
    return 'Search for privacy resources...';
  };

  // Get translated filter labels
  const getTranslatedFilters = () => {
    return {
      all: 'All',
      guides: 'Guides',
      tools: 'Tools'
    };
  };

  // Get translated section titles
  const getTranslatedSectionTitles = () => {
    return {
      organizations: "Privacy Organizations",
      tools: "Recommended External Tools",
      educational: "Educational Resources",
      news: "Privacy News Sources"
    };
  };

  // Get translated button text
  const getTranslatedButtonText = () => {
    return {
      visit: "Visit Website",
      learn: "Learn More",
      check: "Check Now",
      read: "Read Articles",
      visit_blog: "Visit Blog"
    };
  };

  // Get translated disclaimer
  const getTranslatedDisclaimer = () => {
    return {
      title: "External Resources Disclaimer",
      description: "The external resources listed on this page are provided for informational purposes only. SocialCaution does not endorse or guarantee the accuracy, completeness, or usefulness of any external resource. We encourage you to evaluate the credibility and relevance of any external resource before relying on it."
    };
  };

  const filters = getTranslatedFilters();
  const sectionTitles = getTranslatedSectionTitles();
  const buttonText = getTranslatedButtonText();
  const disclaimer = getTranslatedDisclaimer();

  return (
    <PageLayout
      title={getTranslatedTitle()}
      subtitle={getTranslatedSubtitle()}
      heroBackground={false}
      backgroundType="resources"
      breadcrumbs={[
        { label: 'Resources', path: '/resources' }
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
          <ResourcesNav />
          
          <div className="flex-1">
        {/* Search and Filters */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="resources-search"
              name="search"
              placeholder={getTranslatedSearchPlaceholder()}
              className="w-full py-3 pl-10 pr-4 border border-gray-300 dark:border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent bg-white dark:bg-card text-gray-900 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
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
              {filters.all}
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
              {filters.guides}
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
              <Shield className="h-4 w-4 mr-1" />
              {filters.tools}
            </div>
          </button>
        </div>

        {/* External Privacy Organizations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{sectionTitles.organizations}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Electronic Frontier Foundation</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'The leading nonprofit defending digital privacy, free speech, and innovation.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="primary">
                  {'Organization'}
                </Badge>
                <a 
                  href="https://www.eff.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.visit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Privacy Rights Clearinghouse</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Empowering individuals to protect their privacy through consumer information and advocacy.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="primary">
                  {'Organization'}
                </Badge>
                <a 
                  href="https://privacyrights.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.visit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Privacy International</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Global organization challenging governments and corporations to ensure technology respects privacy.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="primary">
                  {'Organization'}
                </Badge>
                <a 
                  href="https://privacyinternational.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.visit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* External Privacy Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{sectionTitles.tools}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Lock className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Privacy Badger</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Browser extension that automatically learns to block invisible trackers.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'Browser Extension'}
                </Badge>
                <a 
                  href="https://privacybadger.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.learn}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Shield className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Have I Been Pwned</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Check if your email has been compromised in a data breach.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'Web Tool'}
                </Badge>
                <a 
                  href="https://haveibeenpwned.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.check}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Database className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">DuckDuckGo</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Privacy-focused search engine that doesn\'t track your searches.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'Search Engine'}
                </Badge>
                <a 
                  href="https://duckduckgo.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.visit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Educational Resources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{sectionTitles.educational}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Surveillance Self-Defense</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Tips, tools, and how-tos for safer online communications by the Electronic Frontier Foundation.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'Guide'}
                </Badge>
                <a 
                  href="https://ssd.eff.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {'Read Guide'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Privacy Guides</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'A guide to privacy and security-focused tools, services, and knowledge.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'Resource'}
                </Badge>
                <a 
                  href="https://www.privacyguides.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.visit}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Privacy News Sources */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">{sectionTitles.news}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">The Privacy Advisor</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'News and guidance from the International Association of Privacy Professionals.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'News'}
                </Badge>
                <a 
                  href="https://iapp.org/news/privacy-advisor/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.read}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Wired Privacy</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'Privacy and security coverage from Wired magazine.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'News'}
                </Badge>
                <a 
                  href="https://www.wired.com/category/security/privacy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.read}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-accent/10 rounded-full mr-3">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-primary dark:text-white">Krebs on Security</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {'In-depth security news and investigation by Brian Krebs.'}
              </p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary">
                  {'Blog'}
                </Badge>
                <a 
                  href="https://krebsonsecurity.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent-dark flex items-center"
                >
                  {buttonText.visit_blog}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </Card>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-light-blue/10 dark:bg-card-hover p-6 rounded-lg">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-accent mt-1 mr-3" />
            <div>
              <h4 className="font-medium text-primary dark:text-white mb-2">{disclaimer.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {disclaimer.description}
              </p>
            </div>
          </div>
        </div>
          </div>
        </div>
      </Section>
      </motion.div>
    </PageLayout>
  );
};

export default ResourcesPage;