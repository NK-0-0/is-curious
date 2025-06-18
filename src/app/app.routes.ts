import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {BlogPostComponent} from '../blog-post/blog-post.component'

export const routes: Routes = [
    {path: '',
    component: AppComponent},
    {
        path: 'blog/:slug',
        component: BlogPostComponent
    },
    {
        path: 'blog',
        component:AppComponent,
    }, 
    {
        path: '**',
        redirectTo:''
    }
];
