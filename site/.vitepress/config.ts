import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/secure_openclaw_blog/',
  title: 'OpenClaw Security',
  description: 'A Comprehensive Analysis of AI Agent Security — 14 Attack Surfaces, 8 Defense Categories, and the Path Forward',
  lang: 'en-US',
  appearance: false,
  cleanUrls: true,
  ignoreDeadLinks: true,
  lastUpdated: true,

  head: [
    ['meta', { name: 'theme-color', content: '#e53e3e' }],
    ['meta', { property: 'og:title', content: 'Securing OpenClaw: Every Defense Fails' }],
    ['meta', { property: 'og:description', content: '14 attack surfaces. 7 defense categories. 0 security guarantees. A comprehensive analysis of AI agent security.' }],
    ['meta', { property: 'og:type', content: 'article' }],
    ['link', { rel: 'icon', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛡️</text></svg>' }],
  ],

  themeConfig: {
    siteTitle: '🛡️ OpenClaw Security',

    nav: [],

    sidebar: [
      {
        text: 'Position Paper',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Part 1: Threat Landscape', link: '/#part-1-the-threat-landscape' },
          { text: 'Part 2: The Defense Landscape', link: '/#part-2-the-defense-landscape' },
          { text: 'Part 3: The Path Forward', link: '/#part-3-the-path-forward' },
          { text: 'References', link: '/#references' },
        ]
      }
    ],

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    footer: {
      message: 'Security research for the AI agent ecosystem',
      copyright: 'March 2026 — All proof-of-concept examples are conceptual'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: '#',
      text: 'Suggest improvements'
    },

    lastUpdated: {
      text: 'Last updated',
      formatOptions: { dateStyle: 'medium' }
    }
  }
})
