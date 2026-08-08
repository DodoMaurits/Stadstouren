#!/usr/bin/env python3
import os
import re
from bs4 import BeautifulSoup

page_order = [
    'Leiden-Lsingel-mm.html',
    'Leiden-L1-singel-mm-1vraag.html',
    'Leiden-L1-singel-mm-2punt.html',
    'Leiden-L1-singel-mm-2vraag.html',
    'Leiden-L1-singel-mm-3punt.html',
    'Leiden-L1-singel-mm-3vraag.html',
    'Leiden-L1-singel-mm-4punt.html',
    'Leiden-L1-singel-mm-4vraag.html',
    'Leiden-L1-singel-mm-5punt.html',
    'Leiden-L1-singel-mm-5vraag.html',
    'Leiden-L1-singel-mm-6punt.html',
    'Leiden-L1-singel-mm-6vraag.html',
    'Leiden-L1-singel-mm-7punt.html',
    'Leiden-L1-singel-mm-7vraag.html',
    'Leiden-L1-singel-mm-8punt.html',
    'Leiden-L1-singel-mm-8vraag.html',
    'Leiden-L1-singel-mm-9punt.html',
    'Leiden-L1-singel-mm-9vraag.html',
    'Leiden-L1-singel-mm-10punt.html',
    'Leiden-L1-singel-mm-10vraag.html',
    'Leiden-L1-singel-mm-11punt.html',
    'Leiden-L1-singel-mm-11vraag.html',
    'Leiden-L1-singel-mm-12punt.html',
    'Leiden-L1-singel-mm-12vraag.html',
    'Leiden-L1-singel-mm-13punt.html',
    'Leiden-L1-singel-mm-13vraag.html',
    'Leiden-L1-singel-mm-14punt.html',
    'Leiden-L1-singel-mm-14vraag.html',
    'Leiden-L1-singel-mm-15punt.html',
    'Leiden-L1-singel-mm-15vraag.html',
    'Leiden-L1-singel-mm-ontknoping.html',
    'Leiden-L1-singel-mm-fout.html',
    'Leiden-L1-singel-mm-foutwapen.html',
    'Leiden-L1-singel-mm-goed.html',
    'Leiden-L1-singel-mm-goedwapen.html',
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
    
    verdachten_grid = body.find('div', {'id': 'verdachtenGrid', 'class': 'verdachten-grid'})
    if verdachten_grid:
        verdachten_grid.decompose()
    
    nav_buttons = body.find('div', class_='nav-buttons')
    if nav_buttons:
        nav_buttons.decompose()
    
    body_html = str(body.decode_contents()) if body else ""
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else filename
    
    pages_data[filename] = {
        'title': title,
        'body': body_html.strip(),
        'nav_buttons': str(nav_buttons) if nav_buttons else None
    }

html_output = '''<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leiden Singel Moordmysterie</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        .page { display: none; }
        .page.active { display: block; }
        .container {
            width: 90%;
            max-width: 500px;
            margin: 0 auto;
            flex-direction: column;
            align-items: center;
            display: flex;
        }
        .nav-buttons {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin: 15px auto 20px;
            padding: 0;
            width: 100%;
        }
        #globalVerdachtenGrid {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            width: calc(100% - 40px);
            justify-content: center;
            max-width: 400px;
            margin: 0 auto 0;
        }
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
        .page .verdachten-grid, .page .nav-buttons { display: none !important; }
    </style>
</head>
<body class="spelpagina">

    <div class="container">
        <div id="page-content-wrapper">
'''

for idx, filename in enumerate(page_order):
    if filename in pages_data:
        data = pages_data[filename]
        page_id = f"page-{idx}"
        safe_title = data['title'].replace('"', '&quot;')
        nav_html = data.get('nav_buttons', '')
        if nav_html:
            nav_html_escaped = nav_html.replace('"', '&quot;').replace("'", "&#39;")
            html_output += f'            <div id="{page_id}" class="page" data-filename="{filename}" data-title="{safe_title}" data-nav-buttons="{nav_html_escaped}">\n'
        else:
            html_output += f'            <div id="{page_id}" class="page" data-filename="{filename}" data-title="{safe_title}">\n'
        html_output += f'                {data["body"]}\n'
        html_output += f'            </div>\n\n'

html_output += '''        </div>
        
        <div id="globalVerdachtenGrid" class="verdachten-grid"></div>
        <div id="globalNavButtons" class="nav-buttons"></div>
    </div>

    <script>
        (function() {
            const pages = document.querySelectorAll('.page');
            let currentPageIndex = 0;
            
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
                
                updateGlobalNavButtons();
                window.scrollTo(0, 0);
            }
            
            function updateGlobalNavButtons() {
                const globalNavButtons = document.getElementById('globalNavButtons');
                if (!globalNavButtons) return;
                
                const activePage = pages[currentPageIndex];
                if (!activePage) return;
                
                const navHtml = activePage.dataset.navButtons;
                if (navHtml) {
                    globalNavButtons.innerHTML = navHtml;
                    
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
                                navigateTo(1);
                            });
                        }
                        if (link.id === 'closeGameButton') {
                            link.addEventListener('click', (e) => {
                                e.preventDefault();
                                // Clear ALL localStorage for this game
                                localStorage.clear();
                                window.location.href = link.href;
                            });
                        }
                    });
                } else {
                    globalNavButtons.innerHTML = '';
                }
            }
            
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
            
            // Initialize verdachten grid - ONLY if it doesn't exist yet
            // The Leiden-Lsingel-script-combined.js will handle this
            function initGlobalVerdachtenGrid() {
                const globalGrid = document.getElementById('globalVerdachtenGrid');
                if (!globalGrid) return;
                
                // Only initialize if empty (let the main script handle it)
                if (globalGrid.innerHTML.trim() === '') {
                    globalGrid.innerHTML = `
                        <div class="verdachte" data-id="boomverzorger">
                            <img src="../../icons/De_boomverzorger.png" alt="Verdachte">
                            <p><br>De boomverzorger</p></div>
                        <div class="verdachte" data-id="vogeldief">
                            <img src="../../icons/De_vogeldief.png" alt="Verdachte">
                            <p><br>De vogeldief</p></div>
                        <div class="verdachte" data-id="vogelspotter">
                            <img src="../../icons/De_vogelspotter.png" alt="Verdachte">
                            <p><br>De vogelspotter</p></div>
                        <div class="verdachte" data-id="dakloze">
                            <img src="../../icons/De_dakloze.png" alt="Verdachte">
                            <p><br>De dakloze</p></div>
                        <div class="verdachte" data-id="vogelverzorger">
                            <img src="../../icons/De_vogelverzorger.png" alt="Verdachte">
                            <p><br>De vogelverzorger van de volière</p></div>
                        <div class="verdachte" data-id="eigenaar">
                            <img src="../../icons/De_eigenaar.png" alt="Verdachte">
                            <p><br>De eigenaar<br>van de muziektent</p></div>
                        <div class="verdachte" data-id="portier">
                            <img src="../../icons/De_portier.png" alt="Verdachte">
                            <p><br>De portier<br>van de concertzaal</p></div>
                        <div class="verdachte" data-id="schoonmaker">
                            <img src="../../icons/De_schoonmaker.png" alt="Verdachte">
                            <p><br>De schoonmaker<br>van het zwanenbassin</p></div>
                    `;
                }
            }
            
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
                
                if (link.id === 'startTimerButton') {
                    e.preventDefault();
                    localStorage.removeItem('timerStart');
                    localStorage.removeItem('timerEnd');
                    navigateTo(1);
                    return;
                }
                
                if (link.id === 'closeGameButton') {
                    e.preventDefault();
                    localStorage.clear();
                    if (originalHrefDescriptor) {
                        originalHrefDescriptor.set.call(window.location, link.href);
                    } else {
                        window.location.href = link.href;
                    }
                    return;
                }
            }, true);
            
            currentPageIndex = getCurrentPageIndex();
            navigateTo(currentPageIndex);
            initGlobalVerdachtenGrid();
            
            window.addEventListener('popstate', () => {
                currentPageIndex = getCurrentPageIndex();
                navigateTo(currentPageIndex);
            });
            
            window.navigateToPage = navigateTo;
        })();
    </script>
    
    <script src="Leiden-Lsingel-script-combined.js"></script>
    <script src="../../script.js"></script>

</body>
</html>
'''

with open('Leiden-Lsingel-mm-combined.html', 'w', encoding='utf-8') as f:
    f.write(html_output)

print("Fixed: Verdachten-grid klikbaar + close-knop reset localStorage")
