import { NgFor, NgOptimizedImage } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import LocomotiveScroll from 'locomotive-scroll';
import { gsap } from 'gsap/gsap-core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlaceholderComponent } from "./text-placeholder/text-placeholder.component";
import { BlogPostComponent } from "../blog-post/blog-post.component";

@Component({
  selector: 'app-parallex-test',
  imports: [NgOptimizedImage, TextPlaceholderComponent, NgFor, BlogPostComponent],
  templateUrl: './parallex-test.component.html',
  styleUrl: './parallex-test.component.scss'
})
export class ParallexTestComponent implements AfterViewInit, OnDestroy{


     @ViewChildren('textElement') textElements!: QueryList<ElementRef>;

     phrases: string[] = [
    "Los Flamencos National Reserve",
    "is a nature reserve located",
    "in the commune of San Pedro de Atacama",
    "The reserve covers a total area",
    "of 740 square kilometres (290 sq mi)"
  ];
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
        markers: false
      },
    });
    
    // Apply animations to the referenced elements
    timeline
      .from(this.background.nativeElement, { clipPath: `inset(15%)` })
      .to(this.introImage.nativeElement, { height: "200px" }, 0);

      const elementRefs : ElementRef<any>[]= this.textElements.toArray();

   elementRefs.forEach((element: ElementRef<any>, index:number) => {
      gsap.fromTo(element.nativeElement, 
        {
          opacity: 0,
          y: -50,
          scale:0.8
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scale:1,
          ease: "power3.out",
          delay: index * 0.1, 
          scrollTrigger: {
            trigger: element.nativeElement,
            start: "top 85%",
            end: "bottom 15%",
            scrub: false,
            toggleActions: "play none none reverse",
            markers:true
          }
        }
      );},100);
  }

    ngOnDestroy(): void {
   if(this.locomotiveScroll){
    //prevent memeory leaks
    this.locomotiveScroll.destroy();
   }

    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }




}
