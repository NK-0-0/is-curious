import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { ParallexTestComponent } from './parallex-test/parallex-test.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'parallex',
    component: ParallexTestComponent,
  },
  {
    //Parameterized URL , parameter is prefixed with semi-colon
    path: 'blog/:slug',
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

  // {
  //     path: '**',  // Wildcard route - must be last!
  //     redirectTo: 'NotFoundComponent'
  // }
];
