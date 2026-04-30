import { WebsiteType } from '../types';

export const SMART_PAGES: Record<WebsiteType, string[]> = {
  Business: ['Home', 'About Us', 'Services', 'Contact'],
  'E-commerce': ['Home', 'Shop', 'Categories', 'Product Page', 'Cart', 'Checkout', 'Contact'],
  Portfolio: ['Home', 'Portfolio Gallery', 'About Me', 'Contact'],
  SaaS: ['Home', 'Features', 'Pricing', 'Documentation', 'Contact', 'Sign Up/Login'],
  Custom: ['Home', 'About', 'Contact'],
};

export const SMART_FEATURES: Record<WebsiteType, string[]> = {
  Business: ['Contact Form', 'SEO Optimization', 'Mobile Responsive'],
  'E-commerce': ['Payment Gateway', 'Inventory Management', 'User Accounts', 'Order Tracking'],
  Portfolio: ['Image Gallery', 'Animations', 'Social Links'],
  SaaS: ['User Authentication', 'Subscription Billing', 'Dashboard', 'Admin Panel'],
  Custom: ['SEO Optimization', 'Mobile Responsive'],
};

export const ALL_AVAILABLE_FEATURES = [
  'Contact Form',
  'SEO Optimization',
  'Mobile Responsive',
  'Payment Gateway',
  'Inventory Management',
  'User Accounts',
  'Order Tracking',
  'Image Gallery',
  'Animations',
  'Social Links',
  'User Authentication',
  'Subscription Billing',
  'Dashboard',
  'Admin Panel',
  'WhatsApp Integration',
  'Email/SMS Notifications',
  'Search/Filter',
  'Reviews/Testimonials',
  'Blog System',
];
