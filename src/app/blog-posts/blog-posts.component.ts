import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { BlogPost } from '../shared/models/blog-post.interface';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SanityService } from '../sanity.service';
import { formatDate } from '../utils';
import { Category } from '../shared/models/category.interface';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);
@Component({
  selector: 'app-blog-posts',
  imports: [CommonModule],
  templateUrl: './blog-posts.component.html',
  styleUrl: './blog-posts.component.scss',
})
export class BlogPostsComponent implements OnChanges, OnInit {
  @Input() catergoryFilter!: Category | null;
  isLoading: boolean = true;
  blogPosts!: BlogPost[];
  constructor(
    readonly router: Router,
    readonly sanityService: SanityService
  ) {}

  ngOnInit(): void {
    this.loadBlogPosts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['catergoryFilter'].previousValue !== null) {
      this.filterByCategory(changes['catergoryFilter'].currentValue);
    }
  }

  private async loadBlogPosts(): Promise<void> {
    try {
      // Test connection first
      const isConnected = await this.sanityService.testConnection();
      if (!isConnected) {
        throw new Error('Unable to connect to Sanity');
      }

      // Fetch posts using the service
      this.sanityService.fetchPosts().subscribe({
        next: sanityPosts => {
          // Transform Sanity data to match your interface
          this.blogPosts = sanityPosts.map((post: any, index: number) => ({
            id: index + 1,
            _id: post._id,
            title: post.title || 'Untitled',
            excerpt: post.excerpt || 'No excerpt available',
            author: post.author || 'Anonymous',
            date: formatDate(post.publishedAt),
            category: post.category || 'Uncategorized',
            readTime: post.readTime || '5 min read',
            slug: post.slug?.current || post._id,
            mainImage: post.mainImage,
          }));

          this.isLoading = false;
          this.animatePostsIn();
        },
        error: error => {
          console.error('Error loading posts:', error);
          this.isLoading = false;
          // Optionally show fallback content or error message
        },
      });
    } catch (error) {
      console.error('Error connecting to Sanity:', error);
      this.isLoading = false;
    }
  }

  private loadPostsByCategory(categorySlug: string): void {
    this.isLoading = true;

    this.sanityService.fetchPostsByCategory(categorySlug).subscribe({
      next: sanityPosts => {
        this.blogPosts = sanityPosts.map((post: any, index: number) => ({
          id: index + 1,
          _id: post._id,
          title: post.title || 'Untitled',
          excerpt: post.excerpt || 'No excerpt available',
          author: post.author || 'Anonymous',
          date: formatDate(post.publishedAt),
          category: post.category || 'Uncategorized',
          readTime: post.readTime || '5 min read',
          slug: post.slug?.current || post._id,
          mainImage: post.mainImage,
        }));

        this.isLoading = false;
        this.animatePostsIn();
      },
      error: error => {
        console.error('Error fetching posts by category:', error);
        this.isLoading = false;
      },
    });
  }

  public filterByCategory(category: Category): void {
    // Load posts for this category using the service
    this.loadPostsByCategory(category.slug);
    // Optionally update the URL
    this.router.navigate(['/blog'], {
      queryParams: { category: category.slug },
    });
    this.catergoryFilter = category;
  }

  public navigateToPost(post: BlogPost) {
    this.router.navigate(['/blog', post.slug || post.id]);
  }

  // #region Animation

  private animatePostsIn(): void {
    setTimeout(() => {
      gsap.from('.post-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, 100);
  }

  // #endregion
}
