import { NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-parallex-test',
  imports: [NgOptimizedImage ],
  templateUrl: './parallex-test.component.html',
  styleUrl: './parallex-test.component.scss'
})
export class ParallexTestComponent implements AfterViewInit, OnDestroy{

    // Angular equivalent of useRef
  @ViewChild('background', { static: false }) background!: ElementRef<HTMLDivElement>;
  @ViewChild('introImage', { static: false }) introImage!: ElementRef<HTMLDivElement>;


  private locomotiveScroll!:LocomotiveScroll;

  ngAfterViewInit(): void {
    
    this.locomotiveScroll = new LocomotiveScroll();

    this.initializeGSAPAnimations();
  }

    private initializeGSAPAnimations(): void {

        if (!this.background?.nativeElement || !this.introImage?.nativeElement) {
      console.error('ViewChild references not initialized');
      return;
    }
    // Register GSAP plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Create timeline with ScrollTrigger
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement, //then
        scrub: true, //perfectly linked with the scroll bar
        start: "top",
        end: "+=500px",
        markers: true
      },
    });
    
    // Apply animations to the referenced elements
    timeline
      .from(this.background.nativeElement, { clipPath: `inset(15%)` })
      .to(this.introImage.nativeElement, { height: "200px" }, 0);
  }

    ngOnDestroy(): void {
   if(this.locomotiveScroll){
    //prevent memeory leaks
    this.locomotiveScroll.destroy();
   }

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }




}
