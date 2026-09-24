// src/config/env.ts

const ENV = 'DEMO'; // 'DEMO' | 'LIVE' | 'NEW'

const BASE_URLS = {
  DEMO: 'http://134.209.155.11:5000/',
  LIVE: 'https://chasbas.com',
};

const EXTERNAL_API_URLS = {
  NOMINATIM: 'https://nominatim.openstreetmap.org',
};

// ==========================================
// PROBLEM HISTORY SERVICE
// ==========================================

export const PROBLEM_HISTORY_BASE_URL =
 'https://aireport.mygreenqube.com:9901';
  // 'http://188.166.254.225:9900';

// ==========================================
// WHATSAPP SERVICE
// ==========================================

const WHATSAPP_SERVICE_URLS = {
  DEMO: 'http://127.0.0.1:5000/',
  LIVE: '',
};

export const BASE_URL = BASE_URLS[ENV];
export const CURRENT_ENV = ENV;
export const NOMINATIM_BASE_URL = EXTERNAL_API_URLS.NOMINATIM;

export const WHATSAPP_SERVICE_URL =
  WHATSAPP_SERVICE_URLS[ENV];



console.log('Environment:', CURRENT_ENV);
console.log('Base URL:', BASE_URL);