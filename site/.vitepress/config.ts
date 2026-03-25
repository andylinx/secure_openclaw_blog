import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OpenClaw Security',
  description: 'A Comprehensive Analysis of AI Agent Security — 14 Attack Surfaces, 7 Defense Categories, and the Path Forward',
  lang: 'en-US',
  appearance: 'dark',
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

    nav: [
      { text: 'Blog', link: '/blog/' },
      { text: 'Position Paper', link: '/paper/' },
      { text: 'References', link: '/references' },
    ],

    sidebar: {
      '/blog/': [
        {
          text: 'The Attack Surfaces',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/blog/' },
            { text: '1. Prompt Injection', link: '/blog/#_1-prompt-injection-the-root-vulnerability' },
            { text: '2. Memory Poisoning', link: '/blog/#_2-memory-poisoning-making-attacks-permanent' },
            { text: '3. Supply Chain', link: '/blog/#_3-supply-chain-1-in-5-skills-is-malicious' },
            { text: '4. Sandbox Escape', link: '/blog/#_4-sandbox-escape-17-defense-rate' },
            { text: '5. Tool & MCP Abuse', link: '/blog/#_5-tool-mcp-abuse-30-cves-in-year-one' },
            { text: '6. Cross-Agent Escalation', link: '/blog/#_6-cross-agent-escalation-agents-infecting-agents' },
            { text: '7. Cognitive Manipulation', link: '/blog/#_7-cognitive-manipulation-exploiting-the-reasoning-process' },
            { text: '8. NHI Credentials', link: '/blog/#_8-nhi-credential-attacks-the-invisible-attack-surface' },
            { text: '9. Composition Attacks', link: '/blog/#_9-composition-attacks-dos-lateral-movement' },
          ]
        },
        {
          text: 'Why Defenses Fail',
          collapsed: false,
          items: [
            { text: 'Defense Overview', link: '/blog/#part-2-why-every-defense-fails' },
            { text: 'The Scoreboard', link: '/blog/#the-scoreboard' },
          ]
        },
        {
          text: 'The Path Forward',
          collapsed: false,
          items: [
            { text: 'Architectural Redesign', link: '/blog/#part-3-the-path-forward' },
            { text: 'Call to Action', link: '/blog/#the-call-to-action' },
          ]
        }
      ],
      '/paper/': [
        {
          text: 'Position Paper',
          items: [
            { text: 'Full Paper', link: '/paper/' },
          ]
        }
      ]
    },

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
