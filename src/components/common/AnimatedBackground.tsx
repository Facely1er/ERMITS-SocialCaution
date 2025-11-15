import React, { useRef, useEffect } from 'react';

interface AnimatedBackgroundProps {
  type: 'particles' | 'matrix' | 'network' | 'privacy' | 'pricing' | 'resources' | 'toolkit' | 'blog' | 
        'assessment' | 'personas' | 'tools' | 'contact' | 'about' | 'features' | 'help' | 'legal';
  className?: string;
  color?: string;
  opacity?: number;
  speed?: number;
  density?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  type,
  className = '',
  color = 'rgba(0, 255, 170, 0.8)',
  opacity = 0.15,
  speed = 1,
  density = 0.3
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    
    // Base particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 15 + 5;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
        this.opacity = Math.random() * opacity + 0.1;
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
          this.speedX = (Math.random() - 0.5) * speed;
          this.speedY = (Math.random() - 0.5) * speed;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;
        
        // Draw based on type
        this.drawShape();
        
        ctx.restore();
      }
      
      drawShape() {
        if (!ctx) return;
        
        const size = this.size;
        ctx.fillStyle = color;
        
        switch (type) {
          case 'particles':
            this.drawCircle(size);
            break;
          case 'matrix':
            this.drawMatrixChar();
            break;
          case 'network':
            this.drawNode(size);
            break;
          case 'privacy':
            this.drawPrivacyIcon();
            break;
          case 'pricing':
            this.drawPricingIcon();
            break;
          case 'resources':
            this.drawResourceIcon();
            break;
          case 'toolkit':
            this.drawToolkitIcon();
            break;
          case 'blog':
            this.drawBlogIcon();
            break;
          case 'assessment':
            this.drawAssessmentIcon();
            break;
          case 'personas':
            this.drawPersonaIcon();
            break;
          case 'tools':
            this.drawToolIcon();
            break;
          case 'contact':
            this.drawContactIcon();
            break;
          case 'about':
            this.drawAboutIcon();
            break;
          case 'features':
            this.drawFeatureIcon();
            break;
          case 'help':
            this.drawHelpIcon();
            break;
          case 'legal':
            this.drawLegalIcon();
            break;
          default:
            this.drawCircle(size);
        }
      }
      
      drawCircle(size: number) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      drawMatrixChar() {
        if (!ctx) return;
        const chars = '01';
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.font = `${this.size}px monospace`;
        ctx.fillStyle = color;
        ctx.fillText(char, 0, 0);
      }
      
      drawNode(size: number) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(0, 0, size/3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      drawPrivacyIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw lock icon
        ctx.beginPath();
        ctx.roundRect(-size/2, -size/4, size, size, size/4);
        ctx.fill();
        
        // Lock shackle
        ctx.beginPath();
        ctx.arc(0, -size/4, size/3, Math.PI, 0);
        ctx.lineWidth = size/6;
        ctx.strokeStyle = color;
        ctx.stroke();
      }
      
      drawPricingIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw dollar sign
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Dollar sign
        ctx.beginPath();
        ctx.moveTo(0, -size/3);
        ctx.lineTo(0, size/3);
        ctx.moveTo(-size/4, -size/6);
        ctx.lineTo(size/4, -size/6);
        ctx.moveTo(-size/4, size/6);
        ctx.lineTo(size/4, size/6);
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.lineWidth = size/10;
        ctx.stroke();
      }
      
      drawResourceIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw book icon
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        
        // Book spine
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size/6, size);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
      }
      
      drawToolkitIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw tool icon
        ctx.beginPath();
        ctx.rect(-size/12, -size/2, size/6, size);
        ctx.fill();
        
        // Tool head
        ctx.beginPath();
        ctx.rect(-size/3, -size/2, size/1.5, size/3);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
      }
      
      drawBlogIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw book icon
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size, size);
        ctx.fill();
        
        // Book spine
        ctx.beginPath();
        ctx.rect(-size/2, -size/2, size/6, size);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
      }
      
      drawAssessmentIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw clipboard/checklist icon
        ctx.beginPath();
        ctx.roundRect(-size/3, -size/2, size*2/3, size, size/8);
        ctx.fill();
        
        // Clipboard top
        ctx.beginPath();
        ctx.roundRect(-size/4, -size/2, size/2, size/4, size/12);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
        
        // Checkmark
        ctx.beginPath();
        ctx.moveTo(-size/4, 0);
        ctx.lineTo(-size/8, size/4);
        ctx.lineTo(size/4, -size/4);
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.lineWidth = size/8;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
      
      drawPersonaIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw user profile icon
        ctx.beginPath();
        ctx.arc(0, size/6, size/3, 0, Math.PI * 2);
        ctx.fill();
        
        // User head
        ctx.beginPath();
        ctx.arc(0, -size/3, size/3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      drawToolIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw wrench/settings icon
        ctx.beginPath();
        ctx.arc(0, 0, size/3, 0, Math.PI * 2);
        ctx.fill();
        
        // Gear teeth
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8;
          ctx.beginPath();
          ctx.moveTo(
            Math.cos(angle) * size/3,
            Math.sin(angle) * size/3
          );
          ctx.lineTo(
            Math.cos(angle) * size/2,
            Math.sin(angle) * size/2
          );
          ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
          ctx.lineWidth = size/12;
          ctx.stroke();
        }
      }
      
      drawContactIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw envelope/mail icon
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/3);
        ctx.lineTo(0, 0);
        ctx.lineTo(size/2, -size/3);
        ctx.lineTo(size/2, size/3);
        ctx.lineTo(-size/2, size/3);
        ctx.closePath();
        ctx.fill();
        
        // Mail flap
        ctx.beginPath();
        ctx.moveTo(-size/2, -size/3);
        ctx.lineTo(0, 0);
        ctx.lineTo(size/2, -size/3);
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.lineWidth = size/10;
        ctx.stroke();
      }
      
      drawAboutIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw info icon (circle with 'i')
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // 'i' dot
        ctx.beginPath();
        ctx.arc(0, -size/4, size/8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
        
        // 'i' line
        ctx.beginPath();
        ctx.moveTo(0, -size/8);
        ctx.lineTo(0, size/4);
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.lineWidth = size/10;
        ctx.stroke();
      }
      
      drawFeatureIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw star/sparkle icon
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const x = Math.cos(angle) * size/2;
          const y = Math.sin(angle) * size/2;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fill();
        
        // Inner star
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2 + Math.PI / 5;
          const x = Math.cos(angle) * size/4;
          const y = Math.sin(angle) * size/4;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
      }
      
      drawHelpIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw question mark in circle
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Question mark
        ctx.beginPath();
        ctx.arc(0, -size/6, size/8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.fill();
        
        // Question mark curve
        ctx.beginPath();
        ctx.arc(0, size/12, size/6, Math.PI / 4, Math.PI * 1.5);
        ctx.strokeStyle = 'rgba(255, 107, 53, 0.8)';
        ctx.lineWidth = size/10;
        ctx.stroke();
      }
      
      drawLegalIcon() {
        if (!ctx) return;
        const size = this.size;
        
        // Draw scales of justice
        // Base
        ctx.beginPath();
        ctx.moveTo(-size/2, size/2);
        ctx.lineTo(size/2, size/2);
        ctx.strokeStyle = color;
        ctx.lineWidth = size/8;
        ctx.stroke();
        
        // Center post
        ctx.beginPath();
        ctx.moveTo(0, -size/2);
        ctx.lineTo(0, size/2);
        ctx.stroke();
        
        // Top bar
        ctx.beginPath();
        ctx.moveTo(-size/3, -size/2);
        ctx.lineTo(size/3, -size/2);
        ctx.stroke();
        
        // Left pan
        ctx.beginPath();
        ctx.arc(-size/3, -size/3, size/4, 0, Math.PI);
        ctx.stroke();
        
        // Right pan
        ctx.beginPath();
        ctx.arc(size/3, -size/3, size/4, 0, Math.PI);
        ctx.stroke();
      }
    }
    
    // Create particles
    const particleCount = Math.floor(canvas.width * canvas.height / 10000 * density);
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Animation loop
    function animate() {
      if (!ctx) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 25, 41, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
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
  }, [type, color, opacity, speed, density]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full z-0 ${className}`}
    />
  );
};

export default AnimatedBackground;