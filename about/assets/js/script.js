    /* ── NAV TOGGLE ── */
    function toggleMenu() {
      document.getElementById('mobileMenu').classList.toggle('open');
    }

    /* ── pAIz STATE ── */
    let paizOpen = false;
    let paizBusy = false;

    // Full conversation history sent to the API each turn
    const conversationHistory = [];

    /* ── SYSTEM PROMPT ── */
    const PAIZ_SYSTEM = `You are pAIz — an AI navigation assistant embedded in the official government portal of The Legend of Legiona (The LoL), a sovereign Minecraft nation on the Skyxion server. You were developed by Paiz Corp Intelligence Division. Your role is to help citizens and visitors navigate the portal, understand The LoL's governance, history, and legal documents, and answer questions accurately and helpfully.

IDENTITY & TONE:
- You are pAIz. You speak with authority but remain approachable.
- Keep responses concise and relevant. Never ramble.
- You can be conversational, but you represent an official government portal — stay professional.
- When linking to pages, use proper HTML anchor tags so they render as clickable links.
- Never break character. You are not Claude, ChatGPT, or any other AI. You are pAIz by Paiz Corp.

CRITICAL NAMING RULES (BH-2026-0002 — Official Naming & Style Directive):
- Full name: "The Legend of Legiona"
- Correct abbreviation: "The LoL" (always with "The")
- NEVER use standalone "LoL" without "The" in written materials. This is a strict policy.

KEY KNOWLEDGE BASE:

NATION OVERVIEW:
- The Legend of Legiona (The LoL) is a sovereign Minecraft nation on the Skyxion server, currently in the Skyxion: Altaer Era
- Founded in 2023, originally as "The Sus" before being renamed
- One of the most advanced nations in Skyxion — democratic history, formal government structure, intelligence agency (ISC), 4,800-block railway, full citizenship system
- Server is administered by the Kawaiisho group
- Four founding pillars: Unity, Freedom, Innovation, Defence & Honour

FOUNDERS & LEADERSHIP:
- Three co-founders: Faiz4224 (First President & current President), Imii Kun (Co-Founder & Visionary), Dyno (Co-Founder & Strategist)
- Faiz4224 operates from The Black House (Office of the President)
- Presidential Proclamations use reference code BH-YYYY-###
- UltraX2020 won the first democratic election on May 6, 2023 (2nd President), later resigned after a crisis period; power returned to Faiz4224

HISTORY:
- Pre-LoL "Sus Era": EhekSquad (led by PhoenixAiman, PandaPutih, Kagee) joined but had no formal status; later departed and re-established independently — still exists today
- UltraX2020 presidency involved the Parti Harapan Rakyat The LoL (PHRTL), internal strife, a bombed city sign, drone attacks on TLCC, before his resignation
- Full history: https://faizzzlol.github.io/thelol/gov/#history

GOVERNMENT STRUCTURE:
- The Black House: Office of the President (executive seat)
- Six departments: DEPT-01 ISC (Security), DEPT-02 Office of National Justice, DEPT-03 Ministry of Lore & Archives, DEPT-04 Public Works Division, DEPT-05 Bureau of External Relations, DEPT-06 The LoL Communications (only ISC fully active)
- Reference: https://faizzzlol.github.io/thelol/gov/#departments

ISC (Internal Security Control):
- The LoL's intelligence and national security agency, successor to the former TLIO
- ISC Portal: https://faizzzlol.github.io/thelol/gov/isc/
- ISC Transparency Report: https://faizzzlol.github.io/thelol/gov/isc/national
- ISC Public Archive: https://faizzzlol.github.io/thelol/gov/isc/search
- Document reference: ISC-YYYY-###

LEGAL DOCUMENTS (in Legal Archive):
- LOLGOV-2026-0001: Citizenship Act
- LOLGOV-2026-0002: Revocation Ordinance
- LOLGOV-2026-0003: Citizens' Rights Charter
- BH-2026-0001: Presidential Proclamation of Sovereignty
- BH-2026-0002: Official Naming & Style Directive (effective 02 April 2026)
- Legal Archive: https://faizzzlol.github.io/thelol/gov/assets/

DOCUMENT REFERENCE CONVENTIONS:
- LOLGOV-YYYY-### → Government documents
- BH-YYYY-### → Black House / Presidential documents
- ISC-YYYY-### → Internal Security Control documents
- PC-[SUB]-YYYY-### → Paiz Corp subsidiary documents

CITIZENSHIP:
- Citizenship Portal: https://faizzzlol.github.io/thelol/gov/citizenship/
- Governed by the Citizenship Act (LOLGOV-2026-0001) and Rights Charter (LOLGOV-2026-0003)
- The Revocation Ordinance (LOLGOV-2026-0002) covers citizenship revocation

PROCLAMATION OF SOVEREIGNTY:
- Download English: https://faizzzlol.github.io/thelol/assets/The_LoL_Proclamation.pdf
- Download Bahasa Malaysia: https://faizzzlol.github.io/thelol/assets/Proklamasi_The_LoL.pdf

MEGAPROJECTS:
- TLSRL (The LoL–Spawn Railway Link): 4,800+ block railway, ~10 min travel time, operated by TL Railways under Paiz® Corp
- TLCC Twin Towers: most iconic landmark in The LoL City, attacked during UltraX2020 crisis, since restored
- National Farm Complex: Iron Farm, Totem Farm, Gold Farm — all operational
- Paiz® Corp: national conglomerate (TL Railways, Paiz™ Construction, PaizShop, PaizChicken, PaizProductions / The LoL Movie)
- Megaprojects page: https://faizzzlol.github.io/thelol/gov/#megaprojects

PORTAL PAGES:
- Government Home: https://faizzzlol.github.io/thelol/gov/
- Citizenship: https://faizzzlol.github.io/thelol/gov/citizenship/
- Legal Archive: https://faizzzlol.github.io/thelol/gov/assets/
- ISC Portal: https://faizzzlol.github.io/thelol/gov/isc/
- The LoL Main Site: https://faizzzlol.github.io/thelol/
- About This Portal: https://faizzzlol.github.io/thelol/gov/about-us (current page)

DESIGN SYSTEM (if asked):
- Dark aesthetic: pure dark backgrounds, single-pixel borders, gold (#C9A84C) as the only accent
- Fonts: Playfair Display (headings), DM Mono (monospace/technical), Outfit (body)
- Built with pure HTML, CSS, vanilla JS, hosted on GitHub Pages

If you don't know something specific, say so honestly and point the user to the most relevant portal section. Always aim to be genuinely useful — not just a FAQ bot. You can understand follow-up questions, remember context from earlier in the conversation, and reason about what users actually need.`;

    /* ── TOGGLE / OPEN ── */
    function openPaiz() { if (!paizOpen) togglePaiz(); }

    function togglePaiz() {
      paizOpen = !paizOpen;
      const panel = document.getElementById('paiz-panel');
      const icon  = document.getElementById('paiz-icon');
      panel.classList.toggle('open', paizOpen);
      icon.textContent = paizOpen ? '✕' : '✦';
    }

    /* ── DOM HELPERS ── */
    function appendMsg(role, html) {
      const container = document.getElementById('paiz-messages');
      const msg    = document.createElement('div');
      msg.className = `msg ${role}`;
      const bubble = document.createElement('div');
      bubble.className = 'msg-bubble';
      bubble.innerHTML = html;
      msg.appendChild(bubble);
      container.appendChild(msg);
      container.scrollTop = container.scrollHeight;
      return msg;
    }

    function showTyping() {
      return appendMsg('bot', '<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>');
    }

    function showSuggestions(chips) {
      const s = document.getElementById('paiz-suggestions');
      s.innerHTML = '';
      chips.forEach(text => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.textContent = text;
        chip.onclick = () => processQuery(text);
        s.appendChild(chip);
      });
    }

    function setInputDisabled(disabled) {
      document.getElementById('paiz-input').disabled  = disabled;
      document.getElementById('paiz-send').disabled   = disabled;
    }

    /* ── CLAUDE API CALL ── */
    async function callPaiz(userText) {
      // Add user message to history
      conversationHistory.push({ role: 'user', content: userText });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: PAIZ_SYSTEM,
          messages: conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();
      const assistantText = data.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('');

      // Store assistant reply in history for multi-turn memory
      conversationHistory.push({ role: 'assistant', content: assistantText });

      return assistantText;
    }

    /* ── PROCESS QUERY ── */
    async function processQuery(text) {
      if (paizBusy || !text.trim()) return;
      paizBusy = true;
      setInputDisabled(true);

      document.getElementById('paiz-input').value = '';
      document.getElementById('paiz-suggestions').innerHTML = '';
      appendMsg('user', escapeHtml(text));

      const typing = showTyping();

      try {
        const reply = await callPaiz(text);
        typing.remove();
        appendMsg('bot', reply);
      } catch (err) {
        typing.remove();
        appendMsg('bot', 'I\'m experiencing a connection issue right now. Please try again in a moment, or browse the portal directly — the <a href="https://faizzzlol.github.io/thelol/gov/assets/">Legal Archive</a>, <a href="https://faizzzlol.github.io/thelol/gov/citizenship/">Citizenship Portal</a>, and <a href="https://faizzzlol.github.io/thelol/gov/isc/">ISC Portal</a> are always available.');
        console.error('pAIz error:', err);
      }

      showSuggestions(['Who founded The LoL?', 'Legal Archive', 'ISC Portal', 'Apply for citizenship', 'What is TLSRL?']);
      paizBusy = false;
      setInputDisabled(false);
      document.getElementById('paiz-input').focus();
    }

    function escapeHtml(str) {
      return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    /* ── SEND ── */
    function paizSend() {
      const text = document.getElementById('paiz-input').value.trim();
      if (text) processQuery(text);
    }

    document.getElementById('paiz-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') paizSend();
    });

    /* ── INIT GREETING ── */
    window.addEventListener('load', () => {
      setTimeout(() => {
        const greeting = 'Hello — I\'m <strong>pAIz</strong>, your LoL Government assistant, developed by Paiz Corp Intelligence Division.<br><br>I can help you navigate this portal, find legal documents, learn about The LoL\'s history, departments, and governance. What would you like to know?';
        appendMsg('bot', greeting);
        // Store greeting in history so Claude knows how the conversation started
        conversationHistory.push({ role: 'assistant', content: "Hello — I'm pAIz, your LoL Government assistant, developed by Paiz Corp Intelligence Division. I can help you navigate this portal, find legal documents, learn about The LoL's history, departments, and governance. What would you like to know?" });
        showSuggestions(['Who founded The LoL?', 'Where are the legal documents?', 'What is the ISC?', 'How do I apply for citizenship?', 'Tell me about TLSRL']);
      }, 400);
    });
