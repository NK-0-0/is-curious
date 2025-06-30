// sanity.service.ts
import { Injectable } from '@angular/core';
import { createClient, SanityClient } from '@sanity/client';
import { Observable, from, catchError, retry, timeout, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SanityService {
  private client: SanityClient;

  constructor() {
    this.client = createClient({
      projectId: 'r8f29mht', // Replace with your actual project ID
      dataset: 'production', // Replace with your dataset name
      useCdn: true, // Important: set to false for development
      apiVersion: '2024-01-01',
      withCredentials: false,

      // Additional configuration to help with CORS
      requestTagPrefix: 'blog-app',
      timeout: 30000,
    });
  }

  // Method to test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.client.fetch('*[_type == "post"][0]');
      return true;
    } catch (error) {
      console.error('Sanity connection test failed:', error);
      return false;
    }
  }

  // Fetch posts with error handling
  fetchPosts(): Observable<any[]> {
    const query = `
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        "author": author->name,
        publishedAt,
        "category": categories[0]->title,
        readTime,
        mainImage {
          asset-> {
            _id,
            url,
            altText
          }
        }
      }
    `;

    return from(this.client.fetch(query)).pipe(
      timeout(10000), // 10 second timeout
      retry(2), // Retry twice on failure
      catchError(error => {
        console.error('Error fetching posts:', error);
        // Return empty array as fallback
        return of([]);
      })
    );
  }

  // Fetch categories with error handling
  fetchCategories(): Observable<any[]> {
    const query = `
      *[_type == "category"] {
        _id,
        title,
        slug,
        icon,
        "count": count(*[_type == "post" && references(^._id)])
      } | order(count desc)
    `;

    return from(this.client.fetch(query)).pipe(
      timeout(10000),
      retry(2),
      catchError(error => {
        console.error('Error fetching categories:', error);
        // Return empty array as fallback
        return of([]);
      })
    );
  }

  // Fetch posts by category
  fetchPostsByCategory(categorySlug: string): Observable<any[]> {
    const query = `
      *[_type == "post" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        "author": author->name,
        publishedAt,
        "category": categories[0]->title,
        readTime,
        mainImage {
          asset-> {
            _id,
            url,
            altText
          }
        }
      }
    `;

    return from(this.client.fetch(query, { categorySlug })).pipe(
      timeout(10000),
      retry(2),
      catchError(error => {
        console.error('Error fetching posts by category:', error);
        return of([]);
      })
    );
  }

  // Fetch single post by slug
  fetchPostBySlug(slug: string): Observable<any> {
    const query = `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        body,
        "author": author->name,
        publishedAt,
        "category": categories[0]->title,
        readTime,
        mainImage {
          asset-> {
            _id,
            url,
            altText
          }
        }
      }
    `;

    return from(this.client.fetch(query, { slug })).pipe(
      timeout(10000),
      retry(2),
      catchError(error => {
        console.error('Error fetching post by slug:', error);
        return of(null);
      })
    );
  }

  // Helper method to build image URLs
  urlFor(source: any): string {
    if (!source?.asset?._ref) return '';

    const ref = source.asset._ref;
    const [_file, id, extension] = ref.split('-');

    return `https://cdn.sanity.io/images/${this.client.config().projectId}/${this.client.config().dataset}/${id}.${extension}`;
  }

}
