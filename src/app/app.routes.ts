import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  {
    path: 'parallex',
     loadComponent: () =>
      import('./parallex-test/parallex-test.component').then(c => c.ParallexTestComponent),
  },
  {
    path: 'blog/:slug', //Parameterized URL , parameter is prefixed with semi-colon
    loadComponent: () =>
      import('./blog-post/blog-post.component').then(c => c.BlogPostComponent),
  },
  {
    path: 'blog',
    component: AppComponent,
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
 {
      path: '**',  // Wildcard route - must be last!
      component: NotFoundComponent
  }
];
