import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements AfterViewInit, OnDestroy{

 @ViewChild('matrixCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  private drops: number[] = [];
  
  codeLines = [
    '> Initializing neural pathways...',
    '> Scanning reality.exe... FAILED',
    '> Error 404: Destination unreachable',
    '> The Matrix has you...',
    '> Wake up, Neo...'
  ];

  constructor(private router: Router) {}


  ngAfterViewInit() {
    this.initMatrixRain();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initMatrixRain() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize drops
    const columns = Math.floor(canvas.width / 20);
    this.drops = Array(columns).fill(1);
    
    this.drawMatrixRain();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const newColumns = Math.floor(canvas.width / 20);
      this.drops = Array(newColumns).fill(1);
    });
  }

  private drawMatrixRain() {
    const canvas = this.canvasRef.nativeElement;
    
    // Semi-transparent black background for trail effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Green text
    this.ctx.fillStyle = '#00ff00';
    this.ctx.font = '16px Courier New';
    
    // Draw characters
    for (let i = 0; i < this.drops.length; i++) {
      const char = this.matrixChars[Math.floor(Math.random() * this.matrixChars.length)];
      const x = i * 20;
      const y = this.drops[i] * 20;
      
      this.ctx.fillText(char, x, y);
      
      // Reset drop when it reaches bottom or randomly
      if (y > canvas.height && Math.random() > 0.975) {
        this.drops[i] = 0;
      }
      
      this.drops[i]++;
    }
    
    this.animationId = requestAnimationFrame(() => this.drawMatrixRain());
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }

  playHoverSound() {
    // Optional: Add audio context for button hover sounds
    // This would require additional audio setup
  }


}
