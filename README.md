<img width="1280" height="640" alt="git (1)" src="https://github.com/user-attachments/assets/8920b256-2ba8-4988-b824-5351134eb4bd" />



# [UNSUBSCRIBABLE] 🎯


## Basic Details
### Team Name: [Solving Nothing]


### Team Members
- Team Lead: [Savio Shejo] - [Sahrdaya College of Engineering & Technology]
- Member 2: [Denil Jeejo] - [Sahrdaya College of Engineering & Technology]

### Project Description
[UNSUBSCRIBABLE is a rage-bait browser game where unsubscribing from a newsletter takes 7 scammy levels instead of 1 click. Fleeing buttons, lying CAPTCHAs, autocorrect hell — and even winning just restarts it harder, forever.]

### The Problem (that doesn't exist)
[Unsubscribing from newsletters is far too easy. One click? Where's the commitment, the drama, the 47 microservices?]

### The Solution (that nobody asked for)
[A 7-stage unsubscribe obstacle course with respawning cookies, guilt-tripping modals, a fleeing button, and a fake deploy pipeline — plus pity systems so you suffer, but never escape.]

## Technical Details
### Technologies/Components Used
For Software:
- [Languages used: HTML, CSS, JavaScript (vanilla, zero dependencies)]
- [Frameworks used: none — 100% static, no backend]
- [Libraries used: none (WebAudio + Canvas + localStorage, all built into the browser)]
- [Tools used: GitHub Pages (hosting), Win+Shift+S (screenshots)]

For Hardware:
- [List main components]
- [List specifications]
- [List tools required]

### Implementation
For Software:
# Installation

Objective
- Build and deploy UNSUBSCRIBABLE, a rage-bait browser game for TinkerHub Useless Projects hackathon — 7 levels of attempting to unsubscribe from a newsletter, with prestige loops, mouse traps, typing chaos, and 3 rage-based endings.
Important Details
- Solo build by Savio Shejo, Sahrdaya College of Engineering & Technology, team name "Solving Nothing"
- Hackathon judging: 60% Creativity, 20% Implementation Complexity, 20% Cross-Disciplinary
- Targeted side quests: best game/interactive media, most over-engineered solution to a non-problem
- Starter repo: github.com/tinkerhub/useless_project_temp — forked to Savio-Shejo/unsubscribable
- Live URL: https://savio-shejo.github.io/unsubscribable/
- User explicitly does not want the Family WhatsApp reskin — kept the newsletter theme
- User explicitly does not want LLM integration — fully static, zero backend
- Git installed via winget at C:\Program Files\Git\bin\git.exe — push works with cached GitHub login
- Python 3.12 installed at $env:LocalAppData\Programs\Python\Python312\python.exe with Pillow for screenshot generation
Work State
Completed
- Full game built: 7 levels (Cookie Hell, Guilt Trip, Dodge Button, Vibe CAPTCHA, Breakup Letter, Password Hell, Hold to Leave) + finale with gaslight
- 3 rage-based endings (ZEN <15 rage, SIKE 15-49, FERAL 50+)
- Prestige loop system — "PSYCH that was the tutorial", harder restarts forever, cumulative rage/timer
- Rage meter: CALM → ANNOYED → FUMING → FERAL → CLIPPY HATER + secret CHEATER rank
- Mouse ragebait pack: proximity flee, ghost cursor, trail taunts, hover tax, rapid-click detector, stay magnet, dodge afterimages, zoomies detector, shy captcha tiles
- Typing chaos engine: WRONG_WORDS dict (the→teh, unsubscribe→subscribe, hate→love, sorry→sowwy, etc.), letter swaps, random SHOUTING, 25% letter deletion
- Spam News ticker under header
- Konami code easter egg (⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA → cheat confetti + CHEATER rank)
- Fullscreen on first interaction (Fullscreen API)
- Global ragequit traps: beforeunload guilt dialog, Esc disabled, rage quit button flees
- Configurable cruelty via CONFIG object in app.js, pity systems ensure beatable in ~3 min
- WebAudio beeps + fanfare (shared AudioContext), canvas confetti
- localStorage best-loop + victims counter
- Sound toggle, level stepper, toasts, reduced-motion support, mobile touch
- Popups are click-through (pointer-events:none) so typing never blocked, fake-X still clickable
- README rewritten to starter template with badges, banner SVG, level table, endings showcase, live link
- JOURNAL.md build log for project-journal side quest
- 3 mock screenshots generated via Python+Pillow: level1-cookies.png, level3-dodge.png, finale-sike.png — need minor text fixes reviewed
- Git repo: all commits pushed to main, HEAD = latest. Desktop copy and cloned repo both have latest files.

# Run
# open directly (no server needed)
start index.html

# or serve locally (needed for clipboard/copy API)
npx serve .

# live: https://savio-shejo.github.io/unsubscribable/

### Project Documentation
For Software:

# Screenshots (Add at least 3)
![Screenshot1]<img width="1917" height="903" alt="435f865f-bea3-4128-a9dd-aeda0aaca09f" src="https://github.com/user-attachments/assets/07185599-2b68-4e8e-8533-c973e1e01da8" />
A satirical “spam newsletter” game screen showing an intentionally annoying email filled with irrelevant content and a tiny, hard-to-find unsubscribe link—designed to frustrate the player into clicking it.

![Screenshot2]<img width="1901" height="1066" alt="768d3091-e62b-4fe9-8b49-6e366149d2ed" src="https://github.com/user-attachments/assets/ba1c1315-1a0f-406e-8ff2-4129ede5f477" />
Level 1 of a deliberately frustrating “Unsubscribable” game, where the player must individually reject five absurdly named cookies while pop-ups and distractions interfere—showing how annoying dark-pattern cookie consent interfaces can be.


![Screenshot3]<img width="1917" height="1076" alt="a103cfd0-204f-4144-a0df-225f614ff957" src="https://github.com/user-attachments/assets/9a3f2d76-2f6b-42b9-8e9d-457bf19a67f0" />
Level 2/7 of the “Unsubscribable” game, where the player faces a manipulative “Are you sure?” prompt. The unsubscribe option is deliberately tiny and hidden while the large green button encourages staying subscribed, with guilt-inducing pop-ups adding even more spam and frustration.


# Diagrams
![Workflow]
<img width="1536" height="1024" alt="bab22754-0668-41c4-9edf-f9d8cd45493f" src="https://github.com/user-attachments/assets/93e43efd-0351-4d15-8080-ee549ff0ee3e" />
The game follows a 7-level rage-bait progression designed to gradually increase player frustration while maintaining a consistent spam-themed experience.

1.Game Start & File Stack Trigger
The game begins with the player interacting with a stack of annoying files/emails. This triggers the main gameplay sequence and starts the progression through the seven levels.
Seven Rage-Bait Levels
2.The player must complete 7 increasingly frustrating levels. Each level introduces a different type of deceptive or annoying interaction, such as misleading buttons, excessive pop-ups, hidden options, and intentionally inconvenient UI elements.
3.Pity Exits & Clippy Interference
Each level provides an apparent “pity exit” or escape option. However, these exits are intentionally unreliable or difficult to use. Clippy continuously appears with unwanted comments, distractions, and guilt-tripping messages, making the player question whether they should quit.
4.Persistent Chaos Systems
Several systems operate throughout the game rather than being limited to a single level:
🖱️ Mouse traps interfere with normal clicking.
⌨️ Typing chaos disrupts or alters player input.
📢 Spam ticker continuously displays ridiculous breaking-news messages.
😡 Rage system tracks the player's frustration and increases as they struggle.
5.85% Finale / Gaslighting Sequence
After reaching approximately 85% completion, the game enters its finale sequence. Instead of simply allowing the player to finish, the game deliberately gaslights the player with misleading feedback, false progress, and deceptive interactions.
6.Three Possible Rage Endings
Once the finale is completed, the game randomly serves one of three rage-based endings. This gives the player different outcomes instead of a single predictable conclusion.
7.Prestige Loop
After reaching an ending, the player can Prestige, which resets the progression but makes the experience harder. The game loops back to the beginning with increased difficulty, creating a replayable cycle:

Start → 7 Rage Levels → 85% Finale → 1 of 3 Endings → Prestige → Harder Loop 🔄

For Hardware:

# Schematic & Circuit
![Circuit](Add your circuit diagram here)
*Add caption explaining connections*

![Schematic](Add your schematic diagram here)
*Add caption explaining the schematic*

# Build Photos
<img width="1917" height="903" alt="435f865f-bea3-4128-a9dd-aeda0aaca09f" src="https://github.com/user-attachments/assets/366269a3-312f-47ee-9a50-88f79ff1f2ef" />
Cookie #1: Emotional Support Pixel. Cookie #2: Vibe Harvester 3000. Cookie #3: Premium Ultra Stalker. Plus one smug paperclip.


![Build]
<img width="1901" height="1066" alt="768d3091-e62b-4fe9-8b49-6e366149d2ed" src="https://github.com/user-attachments/assets/9adcc65b-5d83-4fb2-b39f-b1fe045845e8" />
Build step 1: Make the button flee. Step 2: Add a ghost cursor. Step 3: Watch the human suffer. Step 4: Ship it on a Friday.


![Final]
<img width="1536" height="1024" alt="Unsubscribable_ The Rage-Bait Game Workflow" src="https://github.com/user-attachments/assets/5fcd1184-a37e-43ea-a07c-1e3393fe39b4" />
The final product: Subscribed twice, 87 rage clicks, and the Prestige loop engaged. HR is impressed.


### Project Demo
# Video
[https://drive.google.com/file/d/1jUbVLoCVNhRbYSdzT46gaEPnD2RAq0k2/view?usp=sharing]
The video demonstrates the gameplay of Unsubscribable from start to finish. It shows the player progressing through multiple rage-bait levels, including rejecting cookies, dealing with guilt-tripping prompts and distracting pop-ups, avoiding moving unsubscribe buttons, and completing a confusing CAPTCHA. As the game progresses, the rage meter increases while spam messages and Clippy interruptions make the experience increasingly frustrating.

# Additional Demos
[full video:- https://drive.google.com/file/d/1t9jzO8T-oNS1Yap7IyIdIT3DVdPewRqP/view?usp=sharing]

## Team Contributions
- [Savio Shejo]: [Game development, level design, interactive mechanics, UI implementation, rage system, and overall project integration.]
- [Denil Jeejo]: [Gameplay testing, debugging, identifying interaction issues, and checking level progression and pop-up behavior.]

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--26-26?link=https%3A%2F%2Ftinkerhub.org%2Fevents%2F1M8ORET9A1%2Fuseless-projects-3.0)



