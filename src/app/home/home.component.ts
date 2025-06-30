import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Category } from '../shared/models/category.interface';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { SanityService } from '../sanity.service';
import { CategoriesComponent } from '../categories/categories.component';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../shared/models/blog-post.interface';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ParallexTestComponent } from '../parallex-test/parallex-test.component';
import { NewsletterComponent } from '../newsletter/newsletter.component';
import { formatDate } from '../utils';
import { BlogPostsComponent } from '../blog-posts/blog-posts.component';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollToPlugin);

@Component({
  selector: 'app-home',
  imports: [
    CategoriesComponent,
    CommonModule,
    ParallexTestComponent,
    NewsletterComponent,
    BlogPostsComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('postsContainer', { static: false }) postsContainer!: ElementRef;

  categories: Category[] = [];
  loading = true;
  subscriptionStatus = '';
  catergoryFilter: Category | null = null;
  private scrollListener?: () => void;
  private mouseMoveListener?: (e: MouseEvent) => void;
  private observer?: IntersectionObserver;
  private locomotiveScroll!: LocomotiveScroll;

  constructor(private sanityService: SanityService) {}
  ngAfterViewInit(): void {
    this.locomotiveScroll = new LocomotiveScroll();
  }

  async ngOnInit(): Promise<void> {
    try {
      // Load both posts and categories from Sanity
      await Promise.all([this.loadCategories()]);
    } catch (error) {
      console.error('Error loading data:', error);
      this.loading = false;
    }

    this.setupEventListeners();
    this.initAnimations();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async loadCategories(): Promise<void> {
    try {
      // Use the service to fetch categories
      this.sanityService.fetchCategories().subscribe({
        next: sanityCategories => {
          // Transform Sanity data to match your interface
          this.categories = sanityCategories.map((category: any) => ({
            _id: category._id,
            name: category.title,
            icon: category.icon || '📝', // Default icon if none provided
            count: category.count || 0,
            slug: category.slug?.current || category._id,
          }));

          // If no categories exist, fall back to hardcoded ones
          if (this.categories.length === 0) {
            this.categories = [
              {
                name: 'AI & Machine Learning',
                icon: '🚀',
                count: 0,
                slug: 'ai-ml',
              },
              {
                name: 'Web Development',
                icon: '🌐',
                count: 0,
                slug: 'web-dev',
              },
              { name: 'Mobile Tech', icon: '📱', count: 0, slug: 'mobile' },
              { name: 'Cybersecurity', icon: '🔐', count: 0, slug: 'security' },
              { name: 'Cloud Computing', icon: '☁️', count: 0, slug: 'cloud' },
              { name: 'UI/UX Design', icon: '🎨', count: 0, slug: 'design' },
            ];
          }
        },
        error: error => {
          console.error('Error fetching categories:', error);
          // Use fallback categories
          this.categories = [
            {
              name: 'AI & Machine Learning',
              icon: '🚀',
              count: 0,
              slug: 'ai-ml',
            },
            { name: 'Web Development', icon: '🌐', count: 0, slug: 'web-dev' },
            { name: 'Mobile Tech', icon: '📱', count: 0, slug: 'mobile' },
            { name: 'Cybersecurity', icon: '🔐', count: 0, slug: 'security' },
            { name: 'Cloud Computing', icon: '☁️', count: 0, slug: 'cloud' },
            { name: 'UI/UX Design', icon: '🎨', count: 0, slug: 'design' },
          ];
        },
      });
    } catch (error) {
      console.error('Error loading categories:', error);
      // Use fallback categories
      this.categories = [
        { name: 'AI & Machine Learning', icon: '🚀', count: 0, slug: 'ai-ml' },
        { name: 'Web Development', icon: '🌐', count: 0, slug: 'web-dev' },
        { name: 'Mobile Tech', icon: '📱', count: 0, slug: 'mobile' },
        { name: 'Cybersecurity', icon: '🔐', count: 0, slug: 'security' },
        { name: 'Cloud Computing', icon: '☁️', count: 0, slug: 'cloud' },
        { name: 'UI/UX Design', icon: '🎨', count: 0, slug: 'design' },
      ];
    }
  }

  public filterByCategory(category: Category): void {
    this.catergoryFilter = category;
  }

  // #region Animation

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: 'power2.inOut',
      });
    }
  }

  private setupEventListeners(): void {
    this.setupScrollListener();
    this.setupMouseMoveListener();
  }

  private setupScrollListener(): void {
    let lastScrollY = window.scrollY;

    this.scrollListener = () => {
      const header = document.querySelector('.header') as HTMLElement;
      const scrollY = window.scrollY;

      if (header) {
        if (scrollY > lastScrollY && scrollY > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
      }

      // Parallax effect for hero background
      const heroBackground = document.querySelector('.hero-bg') as HTMLElement;
      if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrollY * 0.5}px)`;
      }

      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  private setupMouseMoveListener(): void {
    this.mouseMoveListener = (e: MouseEvent) => {
      const cards = document.querySelectorAll(
        '.post-card, .category-card'
      ) as NodeListOf<HTMLElement>;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        } else {
          card.style.transform = '';
        }
      });
    };

    document.addEventListener('mousemove', this.mouseMoveListener);
  }

  private initAnimations(): void {
    // Intersection Observer for scroll animations
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    setTimeout(() => {
      const elements = document.querySelectorAll(
        '.section-title, .category-card'
      );
      elements.forEach(el => {
        const element = el as HTMLElement;
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        this.observer?.observe(element);
      });
    }, 100);
  }

  private cleanup(): void {
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener);
    }

    if (this.mouseMoveListener) {
      document.removeEventListener('mousemove', this.mouseMoveListener);
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  //#endregion
  trackByPostId(index: number, post: BlogPost): number {
    return post.id;
  }

  trackByCategorySlug(index: number, category: Category): string {
    return category.slug;
  }
}
