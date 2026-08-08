#!/usr/bin/env python3
import os
import re
from bs4 import BeautifulSoup

page_order = [
    'Leiden-Lsingel-mm.html',  # 0
    'Leiden-L1-singel-mm-1vraag.html',  # 1
    'Leiden-L1-singel-mm-2punt.html',  # 2
    'Leiden-L1-singel-mm-2vraag.html',  # 3
    'Leiden-L1-singel-mm-3punt.html',  # 4
    'Leiden-L1-singel-mm-3vraag.html',  # 5
    'Leiden-L1-singel-mm-4punt.html',  # 6
    'Leiden-L1-singel-mm-4vraag.html',  # 7
    'Leiden-L1-singel-mm-5punt.html',  # 8
    'Leiden-L1-singel-mm-5vraag.html',  # 9
    'Leiden-L1-singel-mm-6punt.html',  # 10
    'Leiden-L1-singel-mm-6vraag.html',  # 11
    'Leiden-L1-singel-mm-7punt.html',  # 12
    'Leiden-L1-singel-mm-7vraag.html',  # 13
    'Leiden-L1-singel-mm-8punt.html',  # 14
    'Leiden-L1-singel-mm-8vraag.html',  # 15
    'Leiden-L1-singel-mm-9punt.html',  # 16
    'Leiden-L1-singel-mm-9vraag.html',  # 17
    'Leiden-L1-singel-mm-10punt.html',  # 18
    'Leiden-L1-singel-mm-10vraag.html',  # 19
    'Leiden-L1-singel-mm-11punt.html',  # 20
    'Leiden-L1-singel-mm-11vraag.html',  # 21
    'Leiden-L1-singel-mm-12punt.html',  # 22
    'Leiden-L1-singel-mm-12vraag.html',  # 23
    'Leiden-L1-singel-mm-13punt.html',  # 24
    'Leiden-L1-singel-mm-13vraag.html',  # 25
    'Leiden-L1-singel-mm-14punt.html',  # 26
    'Leiden-L1-singel-mm-14vraag.html',  # 27
    'Leiden-L1-singel-mm-15punt.html',  # 28
    'Leiden-L1-singel-mm-15vraag.html',  # 29
    'Leiden-L1-singel-mm-ontknoping.html',  # 30
    'Leiden-L1-singel-mm-fout.html',  # 31
    'Leiden-L1-singel-mm-foutwapen.html',  # 32
    'Leiden-L1-singel-mm-goed.html',  # 33
    'Leiden-L1-singel-mm-goedwapen.html',  # 34
]

pages_data = {}
html_files = [f for f in os.listdir('.') if f.endswith('.html') and f != 'Leiden-Lsingel-mm-combined.html']

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    body = soup.body
    
    for script in body.find_all('script'):
        script.decompose()
    
    # Haal ALLEEN de verdachten-grid WEG, LAAT nav-buttons zitten!
    verdachten_grid = body.find('div', {'id': 'verdachtenGrid', 'class': 'verdachten-grid'})
    if verdachten_grid:
        verdachten_grid.decompose()
    
    body_html = str(body.decode_contents()) if body else ""
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else filename
    
    pages_data[filename] = {
        'title': title,
        'body': body_html.strip(),
    }

html_output = '''<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leiden Singel Moordmysterie</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        /* Verberg alle pagina's behalve de actieve */
        .page { display: none; }
        .page.active { display: block; }
        
        /* Container structuur */
        .container {
            width: 90%;
            max-width: 500px;
            margin: 0 auto;
            flex-direction: column;
            align-items: center;
            display: flex;
        }
        
        /* Globale elementen */
        #globalElements {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        /* Globale verdachten-grid */
        #globalVerdachtenGrid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            width: calc(100% - 40px);
            justify-content: center;
            max-width: 400px;
            margin: 0 auto 0;
        }
        
        /* Stijl voor verdachten in globale grid */
        #globalVerdachtenGrid .verdachte {
            aspect-ratio: 3 / 4;
            height: auto;
            border: 2px solid green;
            border-radius: 2px;
            color: white;
            font-size: 0.75rem;
            background-color: #03002A;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            gap: 2px;
            padding: 4px;
            transition: all 0.2s ease;
        }
        #globalVerdachtenGrid .verdachte img {
            width: 50%;
        }
        #globalVerdachtenGrid .verdachte.afgestreept {
            border-color: red;
            opacity: 0.5;
        }
        #globalVerdachtenGrid .verdachte.afgestreept img {
            filter: grayscale(100%);
        }
        
        @media (max-width: 900px) {
            #globalVerdachtenGrid .verdachte {
                font-size: 0.65rem;
                padding: 2px;
            }
        }
        
        /* Globale nav-buttons */
        #globalNavButtons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin: 15px auto 20px;
            padding: 0;
            width: 100%;
        }
        
        /* Verberg de verdachten-grid in de pagina's zelf */
        .page .verdachten-grid { display: none !important; }
        
        /* Verberg nav-buttons in pagina's (we hebben globale) */
        .page .nav-buttons { display: none !important; }
        
        /* Zorg dat de intro-pagina de startTimerButton toont */
        #page-0 .nav-buttons { display: flex !important; }
    </style>
</head>
<body class="spelpagina">

    <div class="container">
        <div id="page-content-wrapper">
'''

# Voeg alle pagina's toe (met nav-buttons en zonder verdachten-grid)
for idx, filename in enumerate(page_order):
    if filename in pages_data:
        data = pages_data[filename]
        page_id = f"page-{idx}"
        safe_title = data['title'].replace('"', '&quot;')
        html_output += f'            <div id="{page_id}" class="page" data-filename="{filename}" data-title="{safe_title}">\n'
        html_output += f'                {data["body"]}\n'
        html_output += f'            </div>\n\n'

html_output += '''        </div>
        
        <div id="globalElements">
            <div id="globalVerdachtenGrid" class="verdachten-grid"></div>
            <div id="globalNavButtons" class="nav-buttons"></div>
        </div>
    </div>

    <script>
        // ===== PAGE NAVIGATION SYSTEM =====
        (function() {
            const pages = document.querySelectorAll('.page');
            let currentPageIndex = 0;
            
            // Map old filenames to new page indices
            const pageMap = {
'''

for idx, filename in enumerate(page_order):
    html_output += f'                "{filename}": {idx},\n'

html_output += '''            };
            
            const pageOrder = [
'''

for idx, filename in enumerate(page_order):
    html_output += f'                "{filename}",\n'

html_output += '''            ];
            
            // Get current page index from localStorage or hash (but don't change URL)
            function getCurrentPageIndex() {
                const saved = localStorage.getItem('leiden-lsingel-mm-current-page');
                if (saved !== null && !isNaN(parseInt(saved))) {
                    const idx = parseInt(saved);
                    if (idx >= 0 && idx < pageOrder.length) return idx;
                }
                const hash = window.location.hash.substring(1);
                if (hash && pageMap[hash] !== undefined) return pageMap[hash];
                return 0;
            }
            
            // Navigate to a specific page (without changing URL)
            function navigateTo(pageIndex) {
                if (pageIndex < 0 || pageIndex >= pages.length) return;
                
                pages.forEach((page, idx) => {
                    page.classList.remove('active');
                    if (idx === pageIndex) page.classList.add('active');
                });
                
                currentPageIndex = pageIndex;
                localStorage.setItem('leiden-lsingel-mm-current-page', pageIndex.toString());
                
                const activePage = pages[pageIndex];
                if (activePage) {
                    const title = activePage.dataset.title;
                    if (title) document.title = title + ' - Leiden Singel Moordmysterie';
                }
                
                // Update globale nav-buttons
                updateGlobalNavButtons();
                
                window.scrollTo(0, 0);
            }
            
            // Update globale nav-buttons based on current page
            function updateGlobalNavButtons() {
                const globalNavButtons = document.getElementById('globalNavButtons');
                if (!globalNavButtons) return;
                
                const activePage = pages[currentPageIndex];
                if (!activePage) return;
                
                // Find nav-buttons in the active page
                const navButtons = activePage.querySelector('.nav-buttons');
                if (navButtons) {
                    globalNavButtons.innerHTML = navButtons.innerHTML;
                    
                    // Re-attach click handlers
                    globalNavButtons.querySelectorAll('a').forEach(link => {
                        const href = link.getAttribute('href');
                        if (pageMap[href] !== undefined) {
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                navigateTo(pageMap[href]);
                            });
                        }
                        if (link.id === 'startTimerButton') {
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                localStorage.removeItem('timerStart');
                                localStorage.removeItem('timerEnd');
                                navigateTo(1); // Go to FIRST question (index 1)
                            });
                        }
                        if (link.id === 'closeGameButton') {
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                localStorage.clear();
                                if (originalHrefDescriptor) {
                                    originalHrefDescriptor.set.call(window.location, link.href);
                                } else {
                                    window.location.href = link.href;
                                }
                            });
                        }
                    });
                } else {
                    globalNavButtons.innerHTML = '';
                }
            }
            
            // Override window.location.href for local navigation
            const originalHrefDescriptor = Object.getOwnPropertyDescriptor(Location.prototype, 'href');
            if (originalHrefDescriptor) {
                Object.defineProperty(window.location, 'href', {
                    get: function() { return originalHrefDescriptor.get.call(this); },
                    set: function(newValue) {
                        if (typeof newValue === 'string') {
                            const filename = newValue.split('/').pop();
                            if (pageMap[filename] !== undefined) {
                                navigateTo(pageMap[filename]);
                                return;
                            }
                        }
                        originalHrefDescriptor.set.call(this, newValue);
                    },
                    configurable: true
                });
            }
            
            // Intercept link clicks
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a');
                if (!link) return;
                
                const href = link.getAttribute('href');
                if (!href) return;
                
                if (pageMap[href] !== undefined) {
                    e.preventDefault();
                    navigateTo(pageMap[href]);
                    return;
                }
            }, true);
            
            // Initialize
            currentPageIndex = getCurrentPageIndex();
            navigateTo(currentPageIndex);
            
            // Handle browser back/forward (but don't change URL)
            window.addEventListener('popstate', () => {
                currentPageIndex = getCurrentPageIndex();
                navigateTo(currentPageIndex);
            });
            
            // Expose for other scripts
            window.navigateToPage = navigateTo;
        })();
    </script>
    
    <script src="Leiden-Lsingel-script-combined.js"></script>
    <script src="../../script.js"></script>
    <script>
        // Override homeButton behavior for combined HTML
        document.addEventListener('DOMContentLoaded', function() {
            const homeButton = document.getElementById("homeButton");
            if (homeButton && typeof window.navigateToPage === 'function') {
                homeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    localStorage.clear();
                    navigateToPage(0);
                });
            }
        });
    </script>

</body>
</html>
'''

with open('Leiden-Lsingel-mm-combined.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

print("Correct build: globale nav-buttons onder verdachten-grid, startTimerButton naar stap 1")
