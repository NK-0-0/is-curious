import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SanityService } from '../sanity.service';
import { Subscription } from 'rxjs';
import { BlogPost } from '../shared/models/blog-post.interface';

@Component({
  selector: 'app-blog-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-post.component.html',
  styleUrl: './blog-post.component.scss',
})
export class BlogPostComponent implements OnInit, OnDestroy {
  protected post: BlogPost | null = null;
  protected isLoading: boolean = true;
  protected error = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanityService: SanityService
  ) {}

  ngOnInit(): void {
    console.log('In the blog post');
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadPost(slug: string): void {
    this.isLoading = true;

    this.error = false;

    // You'll need to add this method to your SanityService
    const sub = this.sanityService.fetchPostBySlug(slug).subscribe({
      next: sanityPost => {
        if (sanityPost) {
          this.post = {
            id: 1,
            _id: sanityPost._id,
            title: sanityPost.title || 'Untitled',
            excerpt: sanityPost.excerpt || 'No excerpt available',
            author: sanityPost.author || 'Anonymous',
            date: this.formatDate(sanityPost.publishedAt),
            category: sanityPost.category || 'Uncategorized',
            readTime: sanityPost.readTime || '5 min read',
            slug: sanityPost.slug?.current || sanityPost._id,
            mainImage: sanityPost.mainImage,
            body: sanityPost.body[0].children[0].text,
          };
        } else {
          this.error = true;
        }
        this.isLoading = false;
      },
      error: error => {
        console.error('Error isLoadingpost:', error);

        this.error = true;
        this.isLoading = false;
      },
    });

    console.log('sub', sub);

    this.subscription.add(sub);
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'No date';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
