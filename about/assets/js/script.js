/* ════════════════════════════════════════════════════════
   pAIz — Local Navigation Assistant
   Paiz Corp Intelligence Division
   No external API · Pure JS knowledge base · Instant
════════════════════════════════════════════════════════ */

/* ─── NAV TOGGLE ─── */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

/* ─── pAIz STATE ─── */
let paizOpen  = false;
let paizBusy  = false;
let lastTopic = null;

/* ════════════════════════════════════════════════════════
   RESPONSE LIBRARY
   Each entry: { text: HTML string, chips: string[] }
════════════════════════════════════════════════════════ */
const RESPONSES = {

  greeting: {
    text: `Hello — I'm <strong>pAIz</strong>, your navigation assistant for The LoL Government Portal, developed by Paiz Corp Intelligence Division.<br><br>I can help you find pages, documents, and learn about The Legend of Legiona's history, governance, and more. What would you like to know?`,
    chips: ['Who founded The LoL?', 'Apply for citizenship', 'Legal Archive', 'What is the ISC?']
  },

  help: {
    text: `Here's what I can help you with:<br><br>
<strong>Navigation</strong> — find any page on this portal<br>
<strong>History</strong> — The LoL's founding, elections, crises, and the current era<br>
<strong>Founders</strong> — Faiz4224, Imii Kun, and Dyno<br>
<strong>Citizenship</strong> — how to apply, your rights, and revocation<br>
<strong>Documents</strong> — locate any official legal document<br>
<strong>Departments</strong> — all six branches of government<br>
<strong>ISC</strong> — The LoL's intelligence and security agency<br>
<strong>Megaprojects</strong> — TLSRL railway, TLCC towers, farms, Paiz® Corp<br><br>
Just ask — I'll point you in the right direction.`,
    chips: ['The LoL history', 'Government departments', 'Legal documents', 'Navigate the portal']
  },

  founders: {
    text: `The Legend of Legiona was co-founded by three individuals:<br><br>
<strong>Faiz4224</strong> — First President &amp; Founding Leader. Currently serving as President, operating from <em>The Black House</em> (Office of the President).<br><br>
<strong>Imii Kun</strong> — Co-Founder &amp; Visionary. A foundational pillar of The LoL's unity and community spirit.<br><br>
<strong>Dyno</strong> — Co-Founder &amp; Strategist. Whose early wisdom shaped the nation's direction and future.<br><br>
All three are signatories of the <a href="https://drive.google.com/file/d/1yzijC8JZ6EztSOtOHyiTrRJEo7obxBPH/view" target="_blank">Proclamation of Sovereignty →</a>`,
    chips: ['The LoL history', 'Read the Proclamation', 'What is The Black House?', 'Government departments']
  },

  history: {
    text: `The Legend of Legiona's history spans several distinct eras:<br><br>
<strong>The Sus Era (24 Dec 2021)</strong> — Founded as a WhatsApp group by Faiz4224, ItzDynozz, and Imii Kun under the name "The Sus". EhekSquad (led by PhoenixAiman, PandaPutih, Kagee) joined but held no formal status, later departing independently.<br><br>
<strong>Renaming &amp; Expansion (Late 2021)</strong> — Renamed to "The Legend of Legiona" later that same year and rapidly became the most advanced nation in Skyxion.<br><br>
<strong>First Election (6 May 2023)</strong> — UltraX2020 and the PHRTL party won The LoL's first democratic election, becoming the 2nd President.<br><br>
<strong>Crisis Era (2023)</strong> — Internal strife: The LoL City sign was bombed, the TLCC was attacked with TNT. UltraX2020 eventually resigned, returning power to Faiz4224.<br><br>
<strong>Rebuilding (Nov 2023)</strong> — Faiz4224 resumed leadership. TLIO (now ISC) was established. Infrastructure expanded.<br><br>
<strong>Skyxion: Altaër Era (Current)</strong> — TLIO reborn as the ISC, full citizenship system live, National ID Portal launched.<br><br>
<a href="/gov/#history">→ Full timeline on Government Home</a>`,
    chips: ['The first election', 'UltraX2020 crisis', 'What is the ISC?', 'Current era']
  },

  election: {
    text: `The LoL's <strong>first democratic election</strong> was held on <strong>6 May 2023</strong>.<br><br>
<strong>UltraX2020</strong>, running under the <strong>Parti Harapan Rakyat The LoL (PHRTL)</strong>, won and became the <strong>2nd President</strong> of The Legend of Legiona — a significant milestone in The LoL's democratic governance.<br><br>
His presidency later descended into crisis: internal strife, the bombing of The LoL City sign, and a TNT attack on the TLCC Twin Towers. UltraX2020 resigned, returning power to <strong>Faiz4224</strong>.`,
    chips: ['UltraX2020 crisis', 'Who is Faiz4224?', 'The LoL history', 'Government departments']
  },

  crisis: {
    text: `The <strong>UltraX2020 Crisis</strong> was one of the most turbulent periods in The LoL's history.<br><br>
During his presidency, significant internal strife emerged. Key events included:<br><br>
• The <strong>bombing of The LoL City sign</strong><br>
• A <strong>TNT attack on the TLCC Twin Towers</strong> — The LoL's most iconic landmark<br>
• Political conflict that fractured governance<br><br>
UltraX2020 ultimately resigned. Power returned to <strong>Faiz4224</strong>, who led the post-chaos rebuilding phase — restoring the TLCC and establishing TLIO (now the ISC) to prevent future threats.`,
    chips: ['What is the ISC?', 'TLCC Twin Towers', 'The LoL history', 'Rebuilding era']
  },

  proclamation: {
    text: `The <strong>Proclamation of Sovereignty</strong> is the founding document of The Legend of Legiona, signed by all three co-founders.<br><br>
It proclaims The LoL as a sovereign, unified nation built on <em>"unity, legacy, and glory"</em> — with justice, prosperity, and fellowship as guiding values.<br><br>
<strong>Download the Proclamation:</strong><br>
<a href="https://drive.google.com/file/d/1yzijC8JZ6EztSOtOHyiTrRJEo7obxBPH/view" target="_blank">→ English version (PDF)</a><br><br>
It is also catalogued in the <a href="/gov/systems/archives/">Legal Archive</a> as DOC-001 (EN) and DOC-002 (BM).`,
    chips: ['Legal Archive', 'The LoL pillars', 'Who are the founders?', 'Policy Framework']
  },

  pillars: {
    text: `The Legend of Legiona is built on <strong>four founding pillars</strong>, as decreed in the original Proclamation of Sovereignty:<br><br>
<strong>01 — Unity</strong>: Where all players — builders, warriors, and adventurers — stand as one, striving for collective greatness.<br><br>
<strong>02 — Freedom</strong>: Ensuring the right of every citizen to explore, create, and thrive within The LoL's borders.<br><br>
<strong>03 — Innovation</strong>: Harnessing the limitless possibilities of Minecraft to build a nation unlike any other.<br><br>
<strong>04 — Defence &amp; Honour</strong>: Protecting The LoL's lands while holding true to fairness and principle.`,
    chips: ['Read the Proclamation', 'Citizenship obligations', 'Government departments', 'The LoL history']
  },

  departments: {
    text: `The LoL Government is structured across <strong>six departments</strong>:<br><br>
<strong>DEPT-01 — Internal Security Control (ISC)</strong> — Intelligence &amp; national security. The only fully active department. <a href="/isc/">Visit ISC Portal →</a><br><br>
<strong>DEPT-02 — Office of National Justice</strong> — Internal disputes &amp; national law enforcement. <em>Coming soon.</em><br><br>
<strong>DEPT-03 — Ministry of Lore &amp; Archives</strong> — National history &amp; document preservation. <em>Coming soon.</em><br><br>
<strong>DEPT-04 — Public Works Division</strong> — Infrastructure: TLSRL, TLCC, farms. <em>Coming soon.</em><br><br>
<strong>DEPT-05 — Bureau of External Relations</strong> — Diplomatic ties across Skyxion. <em>Coming soon.</em><br><br>
<strong>DEPT-06 — The LoL Communications</strong> — National broadcasting &amp; news. <em>Coming soon.</em><br><br>
<a href="/gov/#departments">→ View all departments on Government Home</a>`,
    chips: ['What is the ISC?', 'The Black House', 'Navigate the portal', 'Government home']
  },

  black_house: {
    text: `<strong>The Black House</strong> is the Office of the President of The Legend of Legiona — the executive seat of government.<br><br>
Currently occupied by <strong>Faiz4224</strong>, The LoL's founding and current President.<br><br>
Official documents issued from The Black House use the reference format <code>BH-YYYY-###</code>. For example:<br>
• <strong>BH-2026-0001</strong> — Presidential Proclamation of Sovereignty<br>
• <strong>BH-2026-0002</strong> — Official Naming &amp; Style Directive<br><br>
<a href="/gov/#founders">→ View founding leadership</a>`,
    chips: ['Who is Faiz4224?', 'Official documents', 'Naming directive', 'Government departments']
  },

  isc: {
    text: `The <strong>Internal Security Control (ISC)</strong> is The LoL's intelligence and national security agency — the only fully active government department.<br><br>
It is the successor to <strong>TLIO</strong> (The LoL Intelligence Organisation), formed during the post-crisis rebuilding phase of 2023.<br><br>
The ISC handles:<br>
• National intelligence &amp; threat assessment<br>
• Security mandate enforcement<br>
• Public transparency reporting<br><br>
Documents use the reference format <code>ISC-YYYY-###</code>.<br><br>
<a href="/isc/">→ Visit the ISC Portal</a>`,
    chips: ['ISC transparency report', 'ISC public archive', 'Government departments', 'The LoL history']
  },

  citizenship: {
    text: `Citizenship in The Legend of Legiona is the formal declaration of membership and allegiance within The LoL's sovereign territory on Skyxion.<br><br>
Key facts:<br>
• <strong>Temporary</strong> — era-bound; expires automatically on server reset<br>
• <strong>Renewable</strong> — past citizens in good standing may submit a renewal<br>
• <strong>Revocable</strong> — The Black House may revoke at any time, without notice<br><br>
Applications for the <strong>Skyxion: Altaër Era</strong> are currently open.<br><br>
<a href="/gov/systems/citizenship/">→ Citizenship Portal</a><br>
<a href="/gov/systems/citizenship/apply">→ Apply Now</a><br>
<a href="/gov/systems/citizenship/status">→ Check Application Status</a>`,
    chips: ['How to apply', 'Citizen rights', 'Citizenship Act', 'Revocation ordinance']
  },

  apply: {
    text: `To apply for citizenship in The Legend of Legiona:<br><br>
<strong>Step 1</strong> — Confirm you're eligible: 16+ IRL, active Skyxion player, clean server record<br>
<strong>Step 2</strong> — Complete the form: call name, Minecraft IGN (case-sensitive), contact details<br>
<strong>Step 3</strong> — Accept all declarations honestly — false information means instant rejection<br>
<strong>Step 4</strong> — Submit and save your reference number (<code>THELOL-CTZN-YYYY-####</code>)<br>
<strong>Step 5</strong> — The Office of the President reviews your application<br><br>
<a href="/gov/systems/citizenship/apply">→ New Application Form</a><br>
<a href="/gov/systems/citizenship/apply?type=renew">→ Renewal Form</a>`,
    chips: ['Check application status', 'Citizenship eligibility', 'Citizen rights', 'Citizenship Act']
  },

  renew: {
    text: `If you were previously a citizen of The Legend of Legiona, you can submit a <strong>renewal application</strong>.<br><br>
Renewals follow the same process as new applications but are treated as a separate type — your history with The LoL is taken into consideration during review.<br><br>
You'll need your Minecraft IGN and contact details. Make sure you're currently active on the Skyxion server in the Altaër Era.<br><br>
<a href="/gov/systems/citizenship/apply?type=renew">→ Submit Renewal Application</a>`,
    chips: ['Check application status', 'Citizen rights', 'Citizenship Act', 'Citizenship Portal']
  },

  status: {
    text: `To check your citizenship application status, you need your <strong>reference number</strong> (format: <code>THELOL-CTZN-YYYY-####</code>) — issued at the time of submission.<br><br>
<a href="/gov/systems/citizenship/status">→ Check Application Status</a><br><br>
If approved, your <strong>The LoL National ID</strong> will also appear on the status page once issued by The Black House.`,
    chips: ['Apply for citizenship', 'What is the National ID?', 'Citizenship Portal', 'Citizen rights']
  },

  rights: {
    text: `The <strong>Citizen Rights &amp; Responsibilities Charter</strong> (DOC-008, 29 March 2026) enumerates the fundamental rights and duties of all The LoL citizens.<br><br>
Key obligations include:<br>
• Following all Skyxion server rules at all times<br>
• Not causing chaos, griefing, or hostility<br>
• Respecting all other nations and squads<br>
• Practising mutual tolerance and inclusion<br>
• Renewing citizenship after each server reset<br><br>
<a href="https://drive.google.com/file/d/15_uhF4AtnEgzm6EBqear4qNtDO0_CgUZ/view" target="_blank">→ Read the Rights Charter (PDF)</a><br>
<a href="/gov/systems/archives/">→ Legal Archive</a>`,
    chips: ['Citizenship Act', 'Revocation ordinance', 'Apply for citizenship', 'Legal Archive']
  },

  revocation: {
    text: `The <strong>Citizenship Revocation &amp; Suspension Ordinance</strong> (DOC-009, 29 March 2026) defines the conditions under which citizenship can be ended.<br><br>
The Office of the President holds the <strong>unconditional right</strong> to revoke citizenship at any time, from anywhere, without prior notice. Grounds include:<br>
• Violation of Skyxion server rules<br>
• Acts of hostility or terrorism against The LoL or its citizens<br>
• Conduct deemed unbecoming of a citizen<br>
• Any act threatening The LoL's stability, reputation, or integrity<br><br>
Citizens may appeal in writing to The Black House — the President's decision is final.<br><br>
<a href="https://drive.google.com/file/d/1lQoYuyexc5gcOgYhUsX7N6rU3wEJxX7_/view" target="_blank">→ Read the Ordinance (PDF)</a>`,
    chips: ['Citizen rights', 'Citizenship Act', 'Apply for citizenship', 'Legal Archive']
  },

  citizenship_act: {
    text: `The <strong>The LoL Citizenship Act</strong> (DOC-007, effective 29 March 2026) is the primary legislation governing citizenship in The Legend of Legiona.<br><br>
It defines eligibility, the admission process, citizen rights, and the legal framework for national membership. Key provisions include the 16+ age requirement and the era-bound nature of all citizenships.<br><br>
<a href="https://drive.google.com/file/d/1Wm2S_fShn2nM1zVSt51FC5neLia5VxOK/view" target="_blank">→ Read the Citizenship Act (PDF)</a><br>
<a href="/gov/systems/archives/">→ Legal Archive</a>`,
    chips: ['Apply for citizenship', 'Citizen rights', 'Revocation ordinance', 'Legal Archive']
  },

  legal_archive: {
    text: `The <strong>Legal Archive</strong> is the official repository of all The LoL sovereign records — proclamations, acts, decrees, and policy documents.<br><br>
Current documents include:<br>
• Proclamation of Sovereignty (EN &amp; BM)<br>
• Government Policy Framework<br>
• Official Naming &amp; Style Directive (BH-2026-0002)<br>
• The LoL Citizenship Act<br>
• Citizen Rights &amp; Responsibilities Charter<br>
• Citizenship Revocation &amp; Suspension Ordinance<br>
• Presidential Proclamation on Citizenship<br>
• The Landen Accord <em>(pending upload)</em><br>
• TLIO Declaration of Establishment <em>(archived)</em><br><br>
<a href="/gov/systems/archives/">→ Open Legal Archive</a>`,
    chips: ['Citizenship Act', 'Proclamation of Sovereignty', 'Policy Framework', 'Naming directive']
  },

  policy_framework: {
    text: `The <strong>Government Policy Framework</strong> (DOC-003, 2026) is the primary governing document of The Legend of Legiona.<br><br>
It covers:<br>
• Territorial administration (The Landen Accord)<br>
• Civil rights<br>
• National security — the ISC mandate<br>
• Neutrality doctrine and diplomacy<br>
• Closing declaration<br><br>
<a href="https://drive.google.com/file/d/1csjE7ptfQfGiueJVecn8rGOgd60_Djk5/view" target="_blank">→ Open Government Policy Framework (PDF)</a><br>
<a href="/gov/systems/archives/">→ Legal Archive</a>`,
    chips: ['Legal Archive', 'ISC mandate', 'Citizenship Act', 'Landen Accord']
  },

  naming_directive: {
    text: `<strong>BH-2026-0002 — Official Naming &amp; Style Directive</strong> is a presidential directive effective 02 April 2026.<br><br>
It establishes that:<br>
• The full name is <strong>"The Legend of Legiona"</strong><br>
• The correct abbreviation is <strong>"The LoL"</strong> — always with "The"<br>
• Standalone <strong>"LoL"</strong> without "The" is <strong>strictly prohibited</strong> in all written materials<br><br>
<a href="https://drive.google.com/file/d/1mw-Mzgnq3h0ZgdO2jyUSAf-VgXtl96OL/view" target="_blank">→ Read BH-2026-0002 (PDF)</a>`,
    chips: ['Legal Archive', 'The Black House', 'Government documents', 'Policy Framework']
  },

  landen: {
    text: `The <strong>Landen Accord</strong> (DOC-005) is the formal agreement establishing <strong>Landen</strong> as a Special Administrative Territory (SAT) of The Legend of Legiona.<br><br>
Under the accord, Landen is granted localised autonomy, administered by <strong>ikanuwu</strong> and <strong>ImanHafizz</strong>, while remaining sovereign territory of The LoL.<br><br>
The full document is pending upload to the <a href="/gov/systems/archives/">Legal Archive</a>.`,
    chips: ['Legal Archive', 'Policy Framework', 'Government departments', 'National ID']
  },

  megaprojects: {
    text: `The LoL's national megaprojects stand as proof of what a united people can build:<br><br>
<strong>TLSRL</strong> — The LoL–Spawn Railway Link. 4,800+ block railway. ~10 min travel time. Operated by TL Railways under Paiz® Corp.<br><br>
<strong>TLCC Twin Towers</strong> — The most iconic landmark in The LoL City. Attacked with TNT during the UltraX2020 crisis, fully restored.<br><br>
<strong>National Farm Complex</strong> — Iron Farm, Totem Farm, and Gold Farm — all operational.<br><br>
<strong>Paiz® Corp</strong> — The national conglomerate behind construction and transport infrastructure.<br><br>
<a href="/gov/#megaprojects">→ View all megaprojects on Government Home</a>`,
    chips: ['TLSRL railway', 'TLCC Twin Towers', 'Paiz® Corp', 'National farms']
  },

  tlsrl: {
    text: `The <strong>TLSRL (The LoL–Spawn Railway Link)</strong> is The LoL's crown jewel infrastructure project.<br><br>
• <strong>4,800+ blocks</strong> in length<br>
• <strong>~10 minutes</strong> travel time from The LoL to Spawn<br>
• Operated by <strong>TL Railways</strong>, a subsidiary of Paiz® Corp<br>
• Multiple service types: regular, express, and cargo<br><br>
It is one of the most ambitious construction projects in Skyxion's history, connecting The LoL directly to the server spawn.`,
    chips: ['Paiz® Corp', 'National megaprojects', 'TLCC Twin Towers', 'National farms']
  },

  tlcc: {
    text: `The <strong>TLCC Twin Towers</strong> (The LoL Convention Centre) are the most iconic landmark in The LoL City.<br><br>
During the <strong>UltraX2020 crisis</strong>, the towers were attacked with TNT — one of the most dramatic events in The LoL's history. Following Faiz4224's return to power, the towers were fully restored and stand today as a symbol of national resilience.<br><br>
<a href="/gov/#megaprojects">→ Megaprojects on Government Home</a>`,
    chips: ['UltraX2020 crisis', 'National megaprojects', 'The LoL history', 'TLSRL railway']
  },

  farms: {
    text: `The <strong>National Farm Complex</strong> forms the backbone of The LoL's economy, consisting of three automated resource facilities — all fully operational:<br><br>
• <strong>Iron Farm</strong> — Automated iron production<br>
• <strong>Totem Farm</strong> — Totem of Undying production<br>
• <strong>Gold Farm</strong> — Gold resource generation<br><br>
<a href="/gov/#megaprojects">→ View on Government Home</a>`,
    chips: ['National megaprojects', 'TLSRL railway', 'Paiz® Corp', 'Citizenship']
  },

  paiz_corp: {
    text: `<strong>Paiz® Corp</strong> is The Legend of Legiona's national conglomerate, responsible for the nation's construction and transport infrastructure.<br><br>
Its five subsidiaries are:<br>
• <strong>TL Railways</strong> — National rail operator (TLSRL)<br>
• <strong>Paiz™ Construction</strong> — National construction division<br>
• <strong>PaizShop</strong> — Retail and commerce<br>
• <strong>PaizChicken</strong> — Food service<br>
• <strong>PaizProductions</strong> — Media and The LoL Movie<br><br>
Paiz® Corp also built and maintains this government portal.`,
    chips: ['TLSRL railway', 'National megaprojects', 'About this portal', 'Government home']
  },

  national_id: {
    text: `The <strong>National Identification System (NIS)</strong> assigns every approved citizen a unique <strong>The LoL National ID</strong>.<br><br>
Format: <code>THELOL-YYYY-#####</code> (e.g. THELOL-2026-00001)<br><br>
Your National ID is the key to all government services, including the <strong>TL$ Digital Wallet</strong> (coming soon). IDs are issued by The Black House after citizenship approval.<br><br>
<a href="/gov/systems/id/">→ National ID Portal</a><br>
<a href="/gov/systems/id/id-card">→ View Your Digital ID Card</a><br>
<a href="/gov/systems/id/registry">→ Citizen Registry</a>`,
    chips: ['Apply for citizenship', 'Check application status', 'Citizenship Portal', 'The Black House']
  },

  about_portal: {
    text: `This portal exists to make The LoL's governance <strong>visible, accessible, and permanent</strong>.<br><br>
Key reasons it was built:<br>
• <strong>Transparency</strong> — all proclamations, history, and legal documents published publicly<br>
• <strong>Permanent record</strong> — Discord messages get buried; this portal outlasts any server era<br>
• <strong>Legitimacy</strong> — demonstrates that The LoL is a real institution with real governance<br>
• <strong>Accessibility</strong> — citizens can access official information at any time, from any device<br>
• <strong>Central hub</strong> — connects all branches of government under one domain<br><br>
Built and maintained by <strong>Faiz4224</strong> under Paiz® Corp's digital infrastructure mandate.<br><br>
<a href="/gov/about/">→ Full About Page</a>`,
    chips: ['How was this built?', 'Navigate the portal', 'Paiz® Corp', 'Government home']
  },

  design_tech: {
    text: `The LoL Government Portal is built with:<br><br>
<strong>Technologies:</strong> Pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no dependencies.<br><br>
<strong>Hosting:</strong> GitHub Pages — free, fast, and reliable.<br><br>
<strong>Design system:</strong><br>
• Pure dark backgrounds<br>
• Gold (<code>#C9A84C</code>) as the sole accent colour<br>
• Single-pixel borders throughout<br>
• Fonts: Playfair Display (headings), DM Mono (technical), Outfit (body)<br><br>
<strong>pAIz</strong> is a local knowledge base with intent matching — no external API, no data sent anywhere, instant responses.`,
    chips: ['About this portal', 'Paiz® Corp', 'Navigate the portal', 'Government home']
  },

  navigate: {
    text: `Full portal directory:<br><br>
<a href="/gov/">→ Government Home</a> — Proclamation, history, departments, megaprojects, founders<br>
<a href="/gov/systems/citizenship/">→ Citizenship Portal</a> — Apply, renew, rights, obligations<br>
<a href="/gov/systems/archives/">→ Legal Archive</a> — All official sovereign documents<br>
<a href="/isc/">→ ISC Portal</a> — Intelligence &amp; national security agency<br>
<a href="/gov/systems/id/">→ National ID Portal</a> — NIS, ID card, citizen registry<br>
<a href="/main/">→ The LoL Main Site</a> — National homepage<br>
<a href="/gov/about/">→ About This Portal</a> — Purpose, credits, and pAIz`,
    chips: ['Citizenship Portal', 'Legal Archive', 'ISC Portal', 'Government home']
  },

  thanks: {
    text: `You're welcome! If you need anything else about The LoL or this portal, just ask.`,
    chips: ['Navigate the portal', 'Government home', 'Citizenship Portal', 'Legal Archive']
  },

  fallback: {
    text: `I don't have specific information on that. Here are the most useful sections to explore:<br><br>
<a href="/gov/">→ Government Home</a> — History, departments, and proclamation<br>
<a href="/gov/systems/archives/">→ Legal Archive</a> — All official documents<br>
<a href="/gov/systems/citizenship/">→ Citizenship Portal</a> — Membership and rights<br>
<a href="/isc/">→ ISC Portal</a> — National security information<br><br>
Try rephrasing your question and I'll do my best to help.`,
    chips: ['What can you help with?', 'Navigate the portal', 'The LoL history', 'Legal documents']
  }

};

/* ════════════════════════════════════════════════════════
   INTENT MAP
   patterns: keywords/phrases to match (lowercase)
════════════════════════════════════════════════════════ */
const INTENTS = [
  {
    id: 'greeting',
    patterns: ['hello','hi','hey','good morning','good afternoon','good evening','sup','yo','greetings','howdy','hiya','what\'s up','whats up']
  },
  {
    id: 'help',
    patterns: ['help','what can you do','capabilities','commands','what do you know','features','assist','can you','how do you work']
  },
  {
    id: 'founders',
    patterns: ['founder','founders','founded','who made','who created','faiz','imii','dyno','faiz4224','itzdynozz','creator','original','president','leadership','leader','who runs','who leads','three founders','signatories']
  },
  {
    id: 'election',
    patterns: ['election','ultrax','ultra x','ultra2020','phrtl','2nd president','second president','democratic','vote','voting','parti harapan','may 6','may 2023','first election']
  },
  {
    id: 'crisis',
    patterns: ['crisis','chaos','conflict','bombed','bomb','tnt','attack','strife','resign','resigned','unstable','ultrax crisis','sign bombing','rebuilding','rebuild']
  },
  {
    id: 'history',
    patterns: ['history','historical','timeline','past','origin','beginning','the sus','sus era','renamed','renaming','early','2021','2023','old days','background','story','altaer','altaër','current era','skyxion era','when was','how did','what happened','tell me about the lol','whatsapp','whatsapp group']
  },
  {
    id: 'proclamation',
    patterns: ['proclamation','sovereignty','founding document','declaration','download pdf','pdf','download proclamation','proclaim','doc-001','doc-002','bh-2026-0001']
  },
  {
    id: 'pillars',
    patterns: ['pillar','pillars','values','principles','unity','freedom','innovation','defence','defense','honor','honour','founding principle']
  },
  {
    id: 'departments',
    patterns: ['department','departments','branch','branches','ministry','bureau','office','lore','justice','communications','public works','external relations','government structure','six departments','structure']
  },
  {
    id: 'black_house',
    patterns: ['black house','blackhouse','office of the president','executive','bh-','bh2026','presidential office','the executive']
  },
  {
    id: 'isc',
    patterns: ['isc','internal security','intelligence','security agency','tlio','t.l.i.o','mandate','national security','transparency report','isc portal','isc archive','isc public']
  },
  {
    id: 'citizenship',
    patterns: ['citizenship','citizen','membership','join','joining','become a citizen','national membership','what is citizenship']
  },
  {
    id: 'apply',
    patterns: ['apply','application','application form','sign up','register','submit','how to join','how do i join','new citizen','new application','get citizenship']
  },
  {
    id: 'renew',
    patterns: ['renew','renewal','re-apply','reapply','returning','was a citizen','previous citizen','old citizen','returning citizen','existing citizen']
  },
  {
    id: 'status',
    patterns: ['status','application status','check status','track','reference number','thelol-ctzn','my application','pending','approved','rejected']
  },
  {
    id: 'rights',
    patterns: ['rights','charter','rights charter','responsibilities','obligation','duties','freedoms','what are my rights','citizen rights','doc-008']
  },
  {
    id: 'revocation',
    patterns: ['revoke','revocation','revoked','suspend','suspension','ban','kicked out','removed','ordinance','lose citizenship','can they remove','doc-009']
  },
  {
    id: 'citizenship_act',
    patterns: ['citizenship act','act','lolgov','thelolgov','legislation','law of citizenship','doc-007','citizenship law']
  },
  {
    id: 'legal_archive',
    patterns: ['archive','archives','legal','documents','docs','official documents','legal archive','repository','all documents','where are the documents','find documents']
  },
  {
    id: 'policy_framework',
    patterns: ['policy','framework','policy framework','governing document','government policy','doc-003','main document','primary document']
  },
  {
    id: 'naming_directive',
    patterns: ['naming','style directive','bh-2026-0002','the lol abbreviation','name rule','naming rule','correct name','official name','standalone lol','why the lol']
  },
  {
    id: 'landen',
    patterns: ['landen','sat','special administrative','ikanuwu','imanhafizz','territory','accord','landen accord','doc-005']
  },
  {
    id: 'megaprojects',
    patterns: ['megaproject','megaprojects','infrastructure','projects','builds','building','what has been built','achievements','constructions']
  },
  {
    id: 'tlsrl',
    patterns: ['tlsrl','railway','rail','train','spawn link','4800','4,800','transport','tl railways','tl railway','spawn railway']
  },
  {
    id: 'tlcc',
    patterns: ['tlcc','twin towers','convention centre','convention center','towers','landmark','most iconic','convention']
  },
  {
    id: 'farms',
    patterns: ['farm','farms','iron farm','totem farm','gold farm','resource','national farm','farm complex','automated']
  },
  {
    id: 'paiz_corp',
    patterns: ['paiz corp','paiz corporation','paiz®','subsidiary','subsidiaries','tl railways','paizshop','paizchicken','paizproductions','paiz construction','conglomerate','companies']
  },
  {
    id: 'national_id',
    patterns: ['national id','nis','id card','id system','thelol-','digital id','wallet','tl$','registry','citizen registry','id portal','national identification','my id']
  },
  {
    id: 'about_portal',
    patterns: ['about','why this portal','why build','purpose','why exists','about page','who built','mission','portal purpose','about the portal','what is this']
  },
  {
    id: 'design_tech',
    patterns: ['design','design system','tech','technology','stack','how is this built','how built','framework','github pages','font','color','colour','css','html','javascript','gold color','aesthetic','how was this made']
  },
  {
    id: 'navigate',
    patterns: ['navigate','navigation','pages','sitemap','where is','find page','portal pages','links','all pages','full list','directory','where can i find','how do i get to','list of pages']
  },
  {
    id: 'thanks',
    patterns: ['thank','thanks','thank you','cheers','appreciated','great','awesome','perfect','got it','nice','helpful','good answer']
  }
];

/* ════════════════════════════════════════════════════════
   INTENT MATCHING ENGINE
   Score-based: longer/more specific patterns weight more.
   Tracks lastTopic for follow-up handling.
════════════════════════════════════════════════════════ */
function matchIntent(input) {
  const text = input.toLowerCase().trim();

  // Handle follow-up phrases
  const followUpPhrases = ['tell me more','more info','more information','elaborate','expand','explain more','go on','details','more details','and then','what else','continue'];
  if (followUpPhrases.some(p => text.includes(p)) && lastTopic && lastTopic !== 'fallback') {
    return lastTopic;
  }

  let bestId    = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;
    for (const pattern of intent.patterns) {
      if (text.includes(pattern)) {
        // Weight by pattern specificity: longer patterns = more specific = higher score
        score += pattern.split(' ').length > 1 ? pattern.length : Math.max(pattern.length * 0.6, 2);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestId    = intent.id;
    }
  }

  return bestScore > 0 ? bestId : 'fallback';
}

/* ════════════════════════════════════════════════════════
   UI HELPERS
════════════════════════════════════════════════════════ */
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
  return appendMsg('bot',
    '<div class="typing-indicator">' +
    '<div class="typing-dot"></div>' +
    '<div class="typing-dot"></div>' +
    '<div class="typing-dot"></div>' +
    '</div>'
  );
}

function showSuggestions(chips) {
  const s = document.getElementById('paiz-suggestions');
  s.innerHTML = '';
  (chips || []).forEach(text => {
    const chip = document.createElement('button');
    chip.className   = 'suggestion-chip';
    chip.textContent = text;
    chip.onclick     = () => processQuery(text);
    s.appendChild(chip);
  });
}

/* ════════════════════════════════════════════════════════
   TOGGLE / OPEN
════════════════════════════════════════════════════════ */
function openPaiz() {
  if (!paizOpen) togglePaiz();
}

function togglePaiz() {
  paizOpen = !paizOpen;
  document.getElementById('paiz-panel').classList.toggle('open', paizOpen);
  document.getElementById('paiz-icon').textContent = paizOpen ? '✕' : '✦';
}

/* ════════════════════════════════════════════════════════
   PROCESS QUERY
   Simulates a short thinking delay for natural feel.
════════════════════════════════════════════════════════ */
function processQuery(text) {
  if (paizBusy || !text.trim()) return;
  paizBusy = true;

  document.getElementById('paiz-input').value = '';
  document.getElementById('paiz-suggestions').innerHTML = '';
  appendMsg('user', escapeHtml(text));

  const typing = showTyping();
  const delay  = 380 + Math.random() * 280; // 380–660ms natural feel

  setTimeout(() => {
    typing.remove();

    const intentId = matchIntent(text);
    const response = RESPONSES[intentId] || RESPONSES.fallback;

    // Update lastTopic for follow-up context (don't store generic intents)
    if (!['greeting', 'thanks', 'help', 'fallback'].includes(intentId)) {
      lastTopic = intentId;
    }

    appendMsg('bot', response.text);
    showSuggestions(response.chips);

    paizBusy = false;
    document.getElementById('paiz-input').focus();
  }, delay);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* ─── SEND ─── */
function paizSend() {
  const text = document.getElementById('paiz-input').value.trim();
  if (text) processQuery(text);
}

document.getElementById('paiz-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') paizSend();
});

/* ─── INIT GREETING ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    appendMsg('bot',
      'Hello — I\'m <strong>pAIz</strong>, your navigation assistant for The LoL Government Portal, ' +
      'developed by Paiz Corp Intelligence Division.<br><br>' +
      'I can help you navigate this portal, find legal documents, and learn about The Legend of Legiona\'s ' +
      'history, departments, and governance. What would you like to know?'
    );
    showSuggestions([
      'Who founded The LoL?',
      'Where are the legal documents?',
      'What is the ISC?',
      'How do I apply for citizenship?'
    ]);
  }, 400);
});
