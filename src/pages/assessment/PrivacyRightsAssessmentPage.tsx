import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import PrivacyRightsAssessment from '../../components/assessment/PrivacyRightsAssessment';
import Button from '../../components/common/Button';

const PrivacyRightsAssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleComplete = (results: any) => {
    // Store results in localStorage for dashboard access
    localStorage.setItem('assessment-results', JSON.stringify({
      type: 'rights',
      data: results,
      timestamp: new Date().toISOString()
    }));
    
    // Navigate to results page with the assessment results
    navigate('/assessment/results', { 
      state: { 
        results,
        type: 'rights'
      }
    });
  };

  // Matrix animation setup
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
    
    // Matrix effect
    class MatrixColumn {
      x: number;
      y: number;
      fontSize: number;
      speed: number;
      opacity: number;
      length: number;
      chars: string[];
      charColors: number[];
      
      constructor(x: number, fontSize: number) {
        this.x = x;
        this.fontSize = fontSize;
        this.reset();
      }
      
      reset() {
        this.y = Math.random() * -1000;
        this.speed = Math.random() * 2 * 0.5 + 1;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.length = Math.floor(Math.random() * 15 + 5);
        this.chars = [];
        
        // Generate random characters for this column
        for (let i = 0; i < this.length; i++) {
          const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
          this.chars.push(randomChar);
        }
        
        // Determine character colors
        this.charColors = [];
        for (let i = 0; i < this.length; i++) {
          const alpha = i === 0 ? 0.8 : (1 - i / this.length) * this.opacity;
          this.charColors.push(alpha);
        }
      }
      
      update() {
        this.y += this.speed;
        
        // Randomly change the first character
        if (Math.random() > 0.95) {
          this.chars[0] = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        
        // Reset when it goes off screen
        if (this.y > canvas.height + 200) {
          this.reset();
        }
      }
      
      draw() {
        if (!ctx) return;
        
        for (let i = 0; i < this.length; i++) {
          const y = this.y - (i * this.fontSize);
          
          // Skip if off-screen
          if (y < -this.fontSize || y > canvas.height) continue;
          
          // Determine color based on position
          let color;
          if (i === 0) {
            // First character is brighter
            color = `rgba(0, 255, 170, ${this.charColors[i]})`;
          } else {
            // Trailing characters fade
            color = `rgba(0, 255, 170, ${this.charColors[i]})`;
          }
          
          ctx.font = `${this.fontSize}px monospace`;
          ctx.fillStyle = color;
          ctx.fillText(this.chars[i], this.x, y);
        }
      }
    }
    
    // Digital rain effect (vertical drops)
    class DigitalDrop {
      x: number;
      y: number;
      length: number;
      speed: number;
      width: number;
      alpha: number;
      color: string;
      
      constructor() {
        this.reset();
      }
      
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.length = Math.random() * 50 + 20;
        this.speed = Math.random() * 3 * 0.5 + 1;
        this.width = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.3 + 0.1;
        this.color = Math.random() > 0.9 ? 'primary' : 'matrix';
      }
      
      update() {
        this.y += this.speed;
        
        // Reset when it goes off screen
        if (this.y > canvas.height) {
          this.reset();
        }
      }
      
      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.length);
        
        if (this.color === 'primary') {
          gradient.addColorStop(0, `rgba(255, 107, 53, ${this.alpha})`);
          gradient.addColorStop(1, `rgba(255, 107, 53, 0)`);
        } else {
          gradient.addColorStop(0, `rgba(0, 255, 170, ${this.alpha})`);
          gradient.addColorStop(1, `rgba(0, 255, 170, 0)`);
        }
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }
    
    // Node class for network visualization
    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      color: string;
      
      constructor() {
        this.radius = Math.random() * 2 + 1;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.alpha = Math.random() * 0.5 + 0.1;
        
        // Determine color based on probability
        if (Math.random() > 0.9) {
          this.color = 'rgba(255, 107, 53, ' + this.alpha + ')'; // Accent color
        } else if (Math.random() > 0.8) {
          this.color = 'rgba(74, 144, 226, ' + this.alpha + ')'; // Secondary color
        } else {
          this.color = 'rgba(255, 255, 255, ' + this.alpha + ')';
        }
      }
      
      update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges with some randomness
        if (this.x < 0 || this.x > canvas.width) {
          this.vx = -this.vx * (0.8 + Math.random() * 0.2);
          if (Math.random() > 0.95) this.vy += (Math.random() - 0.5) * 0.5;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.vy = -this.vy * (0.8 + Math.random() * 0.2);
          if (Math.random() > 0.95) this.vx += (Math.random() - 0.5) * 0.5;
        }
        
        // Random direction changes occasionally
        if (Math.random() > 0.99) {
          this.vx += (Math.random() - 0.5) * 0.3;
          this.vy += (Math.random() - 0.5) * 0.3;
          
          // Limit velocity
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          if (speed > 1.5) {
            this.vx = (this.vx / speed) * 1.5;
            this.vy = (this.vy / speed) * 1.5;
          }
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
    
    // Initialize elements
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    const matrixColumns: MatrixColumn[] = [];
    for (let i = 0; i < columns; i++) {
      if (Math.random() > 0.7) { // Only show columns in ~30% of available positions
        matrixColumns.push(new MatrixColumn(i * fontSize, fontSize));
      }
    }
    
    const nodes: Node[] = [];
    const nodeCount = Math.floor(canvas.width * canvas.height / 15000); // Responsive node count
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node());
    }
    
    const digitalDrops: DigitalDrop[] = [];
    const dropCount = Math.floor(canvas.width / 30); // Responsive drop count
    for (let i = 0; i < dropCount; i++) {
      digitalDrops.push(new DigitalDrop());
    }
    
    // Connection parameters
    const maxDist = 150;
    
    // Animation loop
    let lastTime = 0;
    function animate(timestamp = 0) {
      if (!ctx) return;
      
      // Limit frame rate to reduce CPU usage
      if (timestamp - lastTime < 33) { // ~30fps instead of 60fps
        requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw digital drops
      digitalDrops.forEach(drop => {
        drop.update();
        drop.draw();
      });
      
      // Update and draw matrix columns
      matrixColumns.forEach(column => {
        column.update();
        column.draw();
      });
      
      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });
      
      // Draw connections between nodes
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.2;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Translation helpers
  const getTranslatedTitle = () => {
    return "Privacy Rights Assessment";
  };

  const getTranslatedSubtitle = () => {
    return "Evaluate your understanding and exercise of privacy rights across platforms";
  };

  const getTranslatedBackToAssessment = () => {
    return "Back to Assessments";
  };

  return (
    <PageLayout
      title={getTranslatedTitle()}
      subtitle={getTranslatedSubtitle()}
      heroBackground={false}
      breadcrumbs={[
        { label: 'Assessment', path: '/assessment' },
        { label: 'Privacy Rights', path: '/assessment/privacy-rights' }
      ]}
    >

      <Section>
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/assessment')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {getTranslatedBackToAssessment()}
          </Button>
        </div>
        
        <PrivacyRightsAssessment onComplete={handleComplete} />
      </Section>
    </PageLayout>
  );
};

export default PrivacyRightsAssessmentPage;