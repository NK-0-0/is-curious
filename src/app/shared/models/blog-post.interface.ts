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