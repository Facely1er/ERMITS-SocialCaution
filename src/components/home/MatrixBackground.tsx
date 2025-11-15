import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  color?: string;
  opacity?: number;
  speed?: number;
  density?: number;
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  color = 'rgba(0, 255, 170, 0.8)',
  opacity = 0.15, 
  speed = 0.5, // Reduced default speed from 1 to 0.5
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
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
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
      
      constructor(x: number, fontSize: number) {
        this.x = x;
        this.fontSize = fontSize;
        this.y = Math.random() * -1000;
        // Reduce speed by half for slower animation
        this.speed = (Math.random() * 1 * speed + 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.length = Math.floor(Math.random() * 15 + 5);
        this.chars = Array.from({length: this.length}, () => 
          String.fromCharCode(33 + Math.floor(Math.random() * 94))
        );
      }
      
      update() {
        this.y += this.speed;
        
        // Reduce frequency of character changes
        if (Math.random() > 0.95) {
          this.chars[0] = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        }
        
        // Reset when it goes off screen
        if (this.y > canvas.height + 200) {
          this.y = Math.random() * -1000;
          // Reduce speed by half for slower animation
          this.speed = (Math.random() * 1 * speed + 0.5) * 0.5;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        for (let i = 0; i < this.length; i++) {
          const y = this.y - (i * this.fontSize);
          
          // Skip if off-screen
          if (y < -this.fontSize || y > canvas.height) continue;
          
          // Determine color based on position
          const alpha = i === 0 ? 1.0 : (1 - i / this.length) * this.opacity;
          ctx.font = `${this.fontSize}px monospace`;
          ctx.fillStyle = color.replace(/[^,]+(?=\))/, (alpha * opacity).toString());
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
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.length = Math.random() * 50 + 20;
        // Reduce speed by half for slower animation
        this.speed = (Math.random() * 1.5 * speed + 0.5) * 0.5;
        this.width = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.color = Math.random() > 0.9 ? 'primary' : 'matrix';
      }
      
      update() {
        this.y += this.speed;
        
        // Reset when it goes off screen
        if (this.y > canvas.height) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * -canvas.height;
          // Reduce speed by half for slower animation
          this.speed = (Math.random() * 1.5 * speed + 0.5) * 0.5;
        }
      }
      
      draw() {
        if (!ctx) return;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.length);
        
        if (this.color === 'primary') {
          gradient.addColorStop(0, `rgba(255, 107, 53, ${this.alpha * opacity})`);
          gradient.addColorStop(1, `rgba(255, 107, 53, 0)`);
        } else {
          gradient.addColorStop(0, color.replace(/[^,]+(?=\))/, (this.alpha * opacity).toString()));
          gradient.addColorStop(1, color.replace(/[^,]+(?=\))/, '0'));
        }
        
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.width;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.stroke();
      }
    }
    
    // Initialize elements
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    
    const matrixColumns: MatrixColumn[] = [];
    for (let i = 0; i < columns; i++) {
      if (Math.random() > (1 - density)) {
        matrixColumns.push(new MatrixColumn(i * fontSize, fontSize));
      }
    }
    
    const digitalDrops: DigitalDrop[] = [];
    const dropCount = Math.floor(canvas.width / 30) * density;
    for (let i = 0; i < dropCount; i++) {
      digitalDrops.push(new DigitalDrop());
    }
    
    // Animation loop
    let animationId: number;
    let lastTime = 0;
    
    function animate(timestamp = 0) {
      // Limit frame rate to reduce CPU usage and slow down animation
      if (timestamp - lastTime < 33) { // ~30fps instead of 60fps
        animationId = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      
      if (!ctx) return;
      
      // Clear canvas with fade effect - slower fade for smoother transitions
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
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animationId = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [color, opacity, speed, density]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      style={{ mixBlendMode: 'normal' }}
    />
  );
};

export default MatrixBackground;