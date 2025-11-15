import React, { useRef, useEffect } from 'react';

interface CanvasAnimationProps {
  type: 'privacy' | 'matrix' | 'particles' | 'help' | 'roadmap';
  className?: string;
}

/**
 * Standardized canvas animation component for consistent hero backgrounds
 */
export const CanvasAnimation: React.FC<CanvasAnimationProps> = ({ type, className = '' }) => {
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
    class BaseParticle {
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
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
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
        
        // Draw based on type
        this.drawTypeSpecific();
        
        ctx.restore();
      }
      
      drawTypeSpecific() {
        // Override in subclasses
      }
    }
    
    // Privacy-themed particles
    class PrivacyParticle extends BaseParticle {
      type: 'lock' | 'shield' | 'eye' | 'data';
      
      constructor() {
        super();
        this.type = ['lock', 'shield', 'eye', 'data'][Math.floor(Math.random() * 4)] as any;
      }
      
      drawTypeSpecific() {
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
      }
      
      drawLock() {
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
      }
      
      drawEye() {
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
      }
      
      drawData() {
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
      }
    }
    
    // Matrix particles
    class MatrixParticle extends BaseParticle {
      drawTypeSpecific() {
        const size = this.size;
        ctx.fillStyle = 'rgba(0, 255, 170, 0.8)';
        ctx.font = `${size}px monospace`;
        ctx.fillText(String.fromCharCode(33 + Math.floor(Math.random() * 94)), 0, 0);
      }
    }
    
    // Simple particles
    class SimpleParticle extends BaseParticle {
      drawTypeSpecific() {
        const size = this.size;
        ctx.beginPath();
        ctx.arc(0, 0, size/2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }
    }
    
    // Create particles based on type
    const particles: BaseParticle[] = [];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      switch (type) {
        case 'privacy':
          particles.push(new PrivacyParticle());
          break;
        case 'matrix':
          particles.push(new MatrixParticle());
          break;
        case 'particles':
        case 'help':
        case 'roadmap':
        default:
          particles.push(new SimpleParticle());
          break;
      }
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
  }, [type]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full z-0 ${className}`}
    />
  );
};

export default CanvasAnimation;

