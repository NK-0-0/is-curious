import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  imports: [CommonModule],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss',
})
export class NewsletterComponent {
  subscriptionStatus = '';

  onNewsletterSubmit(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector(
      'input[type="email"]'
    ) as HTMLInputElement;
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
}
