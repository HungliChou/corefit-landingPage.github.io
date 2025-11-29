import { LucideIcon } from "lucide-react";

export type Language = 'en' | 'zh';

export interface SectionContent {
  title: string;
  subtitle?: string;
  description?: string;
}

export interface FeatureItem {
  iconName: string;
  title: string;
  description: string;
}

export interface ContentData {
  nav: {
    features: string;
    download: string;
    langSwitch: string;
  };
  hero: {
    slogan: string;
    headline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: string;
  };
  intro: {
    title: string;
    description: string;
    badges: string[];
  };
  features: {
    title: string;
    subtitle: string;
    categories: {
      ai: { title: string; items: FeatureItem[] };
      resources: { title: string; items: FeatureItem[] };
      management: { title: string; items: FeatureItem[] };
      tracking: { title: string; items: FeatureItem[] };
      social: { title: string; items: FeatureItem[] };
      coach: { title: string; items: FeatureItem[] };
    };
  };
  advantages: {
    title: string;
    items: {
      title: string;
      description: string;
    }[];
  };
  screenshots: {
    title: string;
    subtitle: string;
    captions: string[];
  };
  download: {
    title: string;
    subtitle: string;
    apple: string;
    google: string;
  };
  footer: {
    contact: string;
    business: string;
    social: string;
    copyright: string;
  };
}