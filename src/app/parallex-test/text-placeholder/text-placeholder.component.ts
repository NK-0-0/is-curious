import { NgFor } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-text-placeholder',
  imports: [NgFor],
  templateUrl: './text-placeholder.component.html',
  styleUrl: './text-placeholder.component.scss'
})
export class TextPlaceholderComponent {

   @ViewChildren('textElement') textElements!: QueryList<ElementRef>;

     phrases: string[] = [
    "Los Flamencos National Reserve",
    "is a nature reserve located",
    "in the commune of San Pedro de Atacama",
    "The reserve covers a total area",
    "of 740 square kilometres (290 sq mi)"
  ];

   ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger);
  
   // Animate each text element individually with stagger
   const elementRefs : ElementRef<any>[]= this.textElements.toArray();

   elementRefs.forEach((element: ElementRef<any>, index:number) => {
      gsap.fromTo(element.nativeElement, 
        {
          opacity: 0,
          x: -200
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          delay: index * 0.1, 
          scrollTrigger: {
            trigger: element.nativeElement,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            toggleActions: "play none none reverse"
          }
        }
      );});

    
  }
}
