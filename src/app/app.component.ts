import { RouterOutlet } from '@angular/router';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SanityService } from '../sanity.service';
import { NavbarComponent } from "../navbar/navbar.component"; // Adjust path as needed

gsap.registerPlugin(ScrollToPlugin);

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  slug?: string;
  // Add additional Sanity fields as needed
  _id?: string;
  publishedAt?: string;
  body?: any; // For rich text content
  mainImage?: any; // For featured images
}

export interface Category {
  name: string;
  icon: string;
  count: number;
  slug: string;
  _id?: string;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('postsContainer', { static: false }) postsContainer!: ElementRef;

  posts: BlogPost[] = [];
  categories: Category[] = [];
  loading = true;
  subscriptionStatus = '';
  private scrollListener?: () => void;
  private mouseMoveListener?: (e: MouseEvent) => void;
  private observer?: IntersectionObserver;

  constructor(private router: Router, private sanityService: SanityService) {}

  async ngOnInit(): Promise<void> {
    try {
      // Load both posts and categories from Sanity
      await Promise.all([
        this.loadPosts(),
        this.loadCategories()
      ]);
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

  private async loadPosts(): Promise<void> {
    try {
      // Test connection first
      const isConnected = await this.sanityService.testConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Sanity');
      }

      // Fetch posts using the service
      this.sanityService.fetchPosts().subscribe({
        next: (sanityPosts) => {
          // Transform Sanity data to match your interface
          this.posts = sanityPosts.map((post: any, index: number) => ({
            id: index + 1,
            _id: post._id,
            title: post.title || 'Untitled',
            excerpt: post.excerpt || 'No excerpt available',
            author: post.author || 'Anonymous',
            date: this.formatDate(post.publishedAt),
            category: post.category || 'Uncategorized',
            readTime: post.readTime || '5 min read',
            slug: post.slug?.current || post._id,
            mainImage: post.mainImage
          }));

          this.loading = false;
          this.animatePostsIn();
        },
        error: (error) => {
          console.error('Error loading posts:', error);
          this.loading = false;
          // Optionally show fallback content or error message
        }
      });
    } catch (error) {
      console.error('Error connecting to Sanity:', error);
      this.loading = false;
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      // Use the service to fetch categories
      this.sanityService.fetchCategories().subscribe({
        next: (sanityCategories) => {
          // Transform Sanity data to match your interface
          this.categories = sanityCategories.map((category: any) => ({
            _id: category._id,
            name: category.title,
            icon: category.icon || '📝', // Default icon if none provided
            count: category.count || 0,
            slug: category.slug?.current || category._id
          }));

          // If no categories exist, fall back to hardcoded ones
          if (this.categories.length === 0) {
            this.categories = [
              { name: 'AI & Machine Learning', icon: '🚀', count: 0, slug: 'ai-ml' },
              { name: 'Web Development', icon: '🌐', count: 0, slug: 'web-dev' },
              { name: 'Mobile Tech', icon: '📱', count: 0, slug: 'mobile' },
              { name: 'Cybersecurity', icon: '🔐', count: 0, slug: 'security' },
              { name: 'Cloud Computing', icon: '☁️', count: 0, slug: 'cloud' },
              { name: 'UI/UX Design', icon: '🎨', count: 0, slug: 'design' }
            ];
          }
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          // Use fallback categories
          this.categories = [
            { name: 'AI & Machine Learning', icon: '🚀', count: 0, slug: 'ai-ml' },
            { name: 'Web Development', icon: '🌐', count: 0, slug: 'web-dev' },
            { name: 'Mobile Tech', icon: '📱', count: 0, slug: 'mobile' },
            { name: 'Cybersecurity', icon: '🔐', count: 0, slug: 'security' },
            { name: 'Cloud Computing', icon: '☁️', count: 0, slug: 'cloud' },
            { name: 'UI/UX Design', icon: '🎨', count: 0, slug: 'design' }
          ];
        }
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
        { name: 'UI/UX Design', icon: '🎨', count: 0, slug: 'design' }
      ];
    }
  }

  // Method to fetch posts by category
  loadPostsByCategory(categorySlug: string): void {
    this.loading = true;
    
    this.sanityService.fetchPostsByCategory(categorySlug).subscribe({
      next: (sanityPosts) => {
        this.posts = sanityPosts.map((post: any, index: number) => ({
          id: index + 1,
          _id: post._id,
          title: post.title || 'Untitled',
          excerpt: post.excerpt || 'No excerpt available',
          author: post.author || 'Anonymous',
          date: this.formatDate(post.publishedAt),
          category: post.category || 'Uncategorized',
          readTime: post.readTime || '5 min read',
          slug: post.slug?.current || post._id,
          mainImage: post.mainImage
        }));

        this.loading = false;
        this.animatePostsIn();
      },
      error: (error) => {
        console.error('Error fetching posts by category:', error);
        this.loading = false;
      }
    });
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private animatePostsIn(): void {
    setTimeout(() => {
      gsap.from('.post-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, 100);
  }

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    const button = form.querySelector('button') as HTMLButtonElement;
    const email = emailInput.value;

    if (!email) return;

    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    this.subscriptionStatus = 'subscribing';

    // Here you could integrate with Sanity to store newsletter subscriptions
    // or use a third-party service like Mailchimp, ConvertKit, etc.
    setTimeout(() => {
      this.subscriptionStatus = 'success';
      button.textContent = 'Subscribed!';
      
      setTimeout(() => {
        this.subscriptionStatus = '';
        button.textContent = originalText || 'Subscribe';
        button.disabled = false;
        form.reset();
      }, 2000);
    }, 1000);
  }

  navigateToPost(post: BlogPost): void {
    console.log('post slug', post.slug)
    // let actualPost
    // const individualPost: any = this.sanityService.fetchPostBySlug('hello-world').subscribe({
    //   next: (sanityPost) => {
    //     if (sanityPost) {
    //       actualPost = {
    //         id: 1,
    //         _id: sanityPost._id,
    //         title: sanityPost.title || 'Untitled',
    //         excerpt: sanityPost.excerpt || 'No excerpt available',
    //         author: sanityPost.author || 'Anonymous',
    //         date: this.formatDate(sanityPost.publishedAt),
    //         category: sanityPost.category || 'Uncategorized',
    //         readTime: sanityPost.readTime || '5 min read',
    //         slug: sanityPost.slug?.current || sanityPost._id,
    //         mainImage: sanityPost.mainImage,
    //         body: sanityPost.body[0].children[0].text
    //       };
    //       console.log('post', actualPost);
    //       console.log('post title', sanityPost.title);
    //     } else {
    //       //this.error = true;
    //     }
    //     this.loading = false;
    //   },
    //   error: (error) => {
    //     console.error('Error loading post:', error);
    //    // this.error = true;
    //     this.loading = false;
    //   }
    // });;
    // console.log('post', individualPost);
    this.router.navigate(['/blog', post.slug || post.id]);
  }

  filterByCategory(category: Category): void {
    // Load posts for this category using the service
    this.loadPostsByCategory(category.slug);
    // Optionally update the URL
    this.router.navigate(['/blog'], { queryParams: { category: category.slug } });
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power2.inOut"
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
      const cards = document.querySelectorAll('.post-card, .category-card') as NodeListOf<HTMLElement>;
      
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
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
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
      const elements = document.querySelectorAll('.section-title, .category-card');
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

  trackByPostId(index: number, post: BlogPost): number {
    return post.id;
  }

  trackByCategorySlug(index: number, category: Category): string {
    return category.slug;
  }
}