/* ══════════════════════════════════════
   PARTICLES
══════════════════════════════════════ */
const particleCanvas = document.getElementById('particle-canvas');
const particleContext = particleCanvas ? particleCanvas.getContext('2d') : null;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let particleFrameId = null;
let particlePool = [];

function resizeParticleCanvas() {
    if (!particleCanvas || !particleContext) return;
    const ratio = window.devicePixelRatio || 1;
    particleCanvas.width = Math.floor(window.innerWidth * ratio);
    particleCanvas.height = Math.floor(window.innerHeight * ratio);
    particleContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticles() {
    if (!particleContext || prefersReducedMotion) return;
    const count = window.innerWidth < 768 ? 14 : 24;
    particlePool = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.22,
        radius: Math.random() * 1.9 + 0.7,
        alpha: Math.random() * 0.45 + 0.15,
        hue: Math.random() > 0.5 ? 160 : 190
    }));
}

function renderParticles() {
    if (!particleContext || prefersReducedMotion) return;

    particleContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particlePool.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = window.innerWidth + 20;
        if (particle.x > window.innerWidth + 20) particle.x = -20;
        if (particle.y < -20) particle.y = window.innerHeight + 20;
        if (particle.y > window.innerHeight + 20) particle.y = -20;

        particleContext.beginPath();
        particleContext.fillStyle = `hsla(${particle.hue}, 100%, 72%, ${particle.alpha})`;
        particleContext.shadowBlur = 18;
        particleContext.shadowColor = `hsla(${particle.hue}, 100%, 70%, 0.55)`;
        particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleContext.fill();

        for (let j = index + 1; j < particlePool.length; j++) {
            const other = particlePool[j];
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 140) {
                particleContext.beginPath();
                particleContext.strokeStyle = `rgba(52, 211, 153, ${0.08 * (1 - distance / 140)})`;
                particleContext.lineWidth = 1;
                particleContext.moveTo(particle.x, particle.y);
                particleContext.lineTo(other.x, other.y);
                particleContext.stroke();
            }
        }
    });

    particleFrameId = requestAnimationFrame(renderParticles);
}

function startParticles() {
    if (!particleContext || prefersReducedMotion) return;
    resizeParticleCanvas();
    createParticles();
    if (particleFrameId) cancelAnimationFrame(particleFrameId);
    renderParticles();
}

window.addEventListener('resize', () => {
    if (!particleContext || prefersReducedMotion) return;
    resizeParticleCanvas();
    createParticles();
});

startParticles();

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
const sideButtons = document.querySelectorAll('.side-btn');
const toolSections = document.querySelectorAll('.tool-section');
const sectionOrder = ['home-section', 'cgpa-section', 'attendance-section', 'bunk-section'];
const drawerOverlay = document.getElementById('drawer-overlay');
const moreOverlay = document.getElementById('more-overlay');
const sidebarWrapper = document.getElementById('sidebar-wrapper');
const hamburgerBtn = document.getElementById('hamburger-btn');
const moreDrawer = document.getElementById('more-drawer');
const moreToggle = document.getElementById('bnav-more');
const floatingActionBtn = document.getElementById('floating-action-btn');
const pageTransition = document.getElementById('page-transition');
const mainContent = document.getElementById('main-content');

function flashPageTransition() {
    if (!pageTransition || prefersReducedMotion) return;
    pageTransition.classList.add('active');
    window.clearTimeout(flashPageTransition.timeoutId);
    flashPageTransition.timeoutId = window.setTimeout(() => {
        pageTransition.classList.remove('active');
    }, 260);
}

function closeSidebar() {
    if (!sidebarWrapper || !drawerOverlay) return;
    sidebarWrapper.classList.remove('drawer-open');
    drawerOverlay.classList.remove('visible');
    if (hamburgerBtn) hamburgerBtn.classList.remove('open');
}

function openSidebar() {
    if (!sidebarWrapper || !drawerOverlay) return;
    sidebarWrapper.classList.add('drawer-open');
    drawerOverlay.classList.add('visible');
    if (hamburgerBtn) hamburgerBtn.classList.add('open');
}

function toggleSidebar() {
    if (!sidebarWrapper) return;
    if (sidebarWrapper.classList.contains('drawer-open')) closeSidebar();
    else openSidebar();
}

function closeMoreDrawer() {
    if (!moreDrawer || !moreOverlay) return;
    moreDrawer.classList.remove('open');
    moreOverlay.classList.remove('visible');
}

function openMoreDrawer() {
    if (!moreDrawer || !moreOverlay) return;
    moreDrawer.classList.add('open');
    moreOverlay.classList.add('visible');
}

function toggleMoreDrawer() {
    if (!moreDrawer) return;
    if (moreDrawer.classList.contains('open')) closeMoreDrawer();
    else openMoreDrawer();
}

function getActiveSectionIndex() {
    const activeSection = document.querySelector('.tool-section.active-section');
    return Math.max(0, sectionOrder.indexOf(activeSection?.id || 'home-section'));
}

function goToAdjacentSection(direction) {
    const currentIndex = getActiveSectionIndex();
    const nextIndex = Math.min(sectionOrder.length - 1, Math.max(0, currentIndex + direction));
    if (nextIndex === currentIndex) return;
    switchSection(sectionOrder[nextIndex]);
}

function switchSection(sectionId) {
    const targetBtn = document.querySelector(`[data-target="${sectionId}"]`);
    if (!targetBtn) return;
    
    sideButtons.forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
    
    /* Update bottom nav active state */
    const bnavButtons = document.querySelectorAll('.bnav-btn[data-target]');
    bnavButtons.forEach(btn => btn.classList.remove('active'));
    const activeBnavBtn = document.querySelector(`.bnav-btn[data-target="${sectionId}"]`);
    if (activeBnavBtn) {
        activeBnavBtn.classList.add('active');
    }
    
    toolSections.forEach(s => {
        s.classList.remove('active-section');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    
    localStorage.setItem('activeSection', sectionId);

    flashPageTransition();
    if (window.innerWidth < 769) {
        closeSidebar();
        closeMoreDrawer();
    }

    window.requestAnimationFrame(() => {
        const mainTarget = document.getElementById(sectionId);
        if (mainTarget) {
            mainTarget.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
    });
}

sideButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        switchSection(target);
    });
});

/* Restore previous section on page load */
window.addEventListener('DOMContentLoaded', () => {
    const savedSection = localStorage.getItem('activeSection') || 'home-section';
    switchSection(savedSection);
});

/* Bottom nav buttons */
const bnavButtons = document.querySelectorAll('.bnav-btn[data-target]');
bnavButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        switchSection(target);
    });
});

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleSidebar);
}

if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeSidebar);
}

if (moreToggle) {
    moreToggle.addEventListener('click', toggleMoreDrawer);
}

if (moreOverlay) {
    moreOverlay.addEventListener('click', closeMoreDrawer);
}

if (floatingActionBtn) {
    floatingActionBtn.addEventListener('click', () => {
        toggleMoreDrawer();
    });
}

if (moreDrawer) {
    moreDrawer.addEventListener('touchstart', (event) => {
        moreDrawer.dataset.touchStartY = String(event.touches[0].clientY);
    }, { passive: true });

    moreDrawer.addEventListener('touchend', (event) => {
        const startY = parseFloat(moreDrawer.dataset.touchStartY || '0');
        const endY = event.changedTouches[0].clientY;
        if (startY && endY - startY > 60) {
            closeMoreDrawer();
        }
    }, { passive: true });
}

if (mainContent) {
    let touchStartX = 0;
    let touchStartY = 0;

    mainContent.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }, { passive: true });

    mainContent.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;
        if (deltaX < 0) goToAdjacentSection(1);
        else goToAdjacentSection(-1);
    }, { passive: true });
}

/* Get Started button */
const getStartedBtn = document.getElementById('get-started-btn');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        const cgpaBtn = document.querySelector('[data-target="cgpa-section"]');
        if (cgpaBtn) cgpaBtn.click();
    });
}

/* ══════════════════════════════════════
   CGPA CALCULATOR
   Grade points: S=10, A=9, B=8, C=7, D=6, E=5
══════════════════════════════════════ */
let gradeChart = null;

function updateGradeChart(grades) {
    const chartCanvas = document.getElementById('grade-distribution-chart');
    if (!chartCanvas) return;
    
    if (gradeChart) {
        gradeChart.destroy();
    }
    
    const ctx = chartCanvas.getContext('2d');
    gradeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['S (10)', 'A (9)', 'B (8)', 'C (7)', 'D (6)', 'E (5)'],
            datasets: [{
                label: 'Subjects',
                data: [grades.s.val, grades.a.val, grades.b.val, grades.c.val, grades.d.val, grades.e.val],
                backgroundColor: ['#10b981', '#3b82f6', '#6366f1', '#f59e0b', '#ea580c', '#ef4444'],
                borderRadius: 8,
                hoverBackgroundColor: ['#059669', '#1d4ed8', '#4f46e5', '#d97706', '#dc2626', '#dc2626']
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { beginAtZero: true, max: 10 }
            }
        }
    });
}

function updateGradeStats(grades) {
    const gradeValues = Object.values(grades).map(g => g.val);
    const totalSubjects = gradeValues.reduce((a, b) => a + b, 0);
    
    const maxGrades = [
        { grade: 'S', val: grades.s.val, weight: 10 },
        { grade: 'A', val: grades.a.val, weight: 9 },
        { grade: 'B', val: grades.b.val, weight: 8 },
        { grade: 'C', val: grades.c.val, weight: 7 },
        { grade: 'D', val: grades.d.val, weight: 6 },
        { grade: 'E', val: grades.e.val, weight: 5 },
    ];
    
    let highestGrade = '--';
    for (let i = 0; i < maxGrades.length; i++) {
        if (maxGrades[i].val > 0) {
            highestGrade = maxGrades[i].grade;
            break;
        }
    }
    
    const totalPoints = Object.values(grades).reduce((s, g) => s + g.val * g.pts, 0);
    const avgGrade = totalSubjects > 0 ? (totalPoints / totalSubjects).toFixed(2) : '--';
    
    document.getElementById('total-subjects').textContent = totalSubjects;
    document.getElementById('highest-grade').textContent = highestGrade;
    document.getElementById('avg-grade').textContent = avgGrade;
}

document.getElementById('calc-cgpa').addEventListener('click', () => {
    const grades = {
        s: { val: parseInt(document.getElementById('grade-s').value) || 0, pts: 10 },
        a: { val: parseInt(document.getElementById('grade-a').value) || 0, pts: 9 },
        b: { val: parseInt(document.getElementById('grade-b').value) || 0, pts: 8 },
        c: { val: parseInt(document.getElementById('grade-c').value) || 0, pts: 7 },
        d: { val: parseInt(document.getElementById('grade-d').value) || 0, pts: 6 },
        e: { val: parseInt(document.getElementById('grade-e').value) || 0, pts: 5 },
    };

    const totalSubjects = Object.values(grades).reduce((s, g) => s + g.val, 0);
    if (totalSubjects === 0) { alert('Please enter at least one grade.'); return; }

    const totalPoints = Object.values(grades).reduce((s, g) => s + g.val * g.pts, 0);
    const cgpa = (totalPoints / totalSubjects).toFixed(2);

    let desc = '';
    if (cgpa >= 9.5) desc = '🏆 Outstanding – First Class with Distinction!';
    else if (cgpa >= 8.5) desc = '🌟 Excellent – First Class!';
    else if (cgpa >= 7.5) desc = '✅ Very Good – Keep it up!';
    else if (cgpa >= 6.5) desc = '👍 Good – You can do better!';
    else if (cgpa >= 5.5) desc = '⚠️ Average – Time to study harder!';
    else desc = '❌ Below Average – Serious attention needed!';

    document.getElementById('cgpa-result').textContent = cgpa;
    document.getElementById('cgpa-desc').textContent = desc;
    
    const barWidth = (cgpa / 10) * 100;
    document.getElementById('cgpa-bar').style.width = barWidth + '%';

    document.getElementById('cgpa-empty-state').classList.add('hidden');
    const resultState = document.getElementById('cgpa-result-state');
    resultState.classList.remove('hidden');
    
    updateGradeChart(grades);
    updateGradeStats(grades);
    
    // Re-trigger animation
    resultState.style.animation = 'none';
    resultState.offsetHeight;
    resultState.style.animation = '';
});

document.getElementById('reset-cgpa').addEventListener('click', () => {
    ['grade-s','grade-a','grade-b','grade-c','grade-d','grade-e'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('cgpa-empty-state').classList.remove('hidden');
    document.getElementById('cgpa-result-state').classList.add('hidden');
    if (gradeChart) {
        gradeChart.destroy();
        gradeChart = null;
    }
});

/* ══════════════════════════════════════
   ATTENDANCE CALCULATOR
══════════════════════════════════════ */
document.getElementById('calc-attendance').addEventListener('click', () => {
    const total    = parseInt(document.getElementById('total-classes').value);
    const attended = parseInt(document.getElementById('attended-classes').value);

    if (!total || !attended || attended > total) {
        alert('Please enter valid class numbers.');
        return;
    }

    const pct = ((attended / total) * 100).toFixed(2);
    const deficit = Math.ceil(0.8 * total) - attended;

    let desc = '';
    if (pct >= 80) {
        const canBunk = Math.floor((attended - 0.8 * total) / (1 - 0.8));
        desc = `✅ You're safe! You can still miss up to ${canBunk} class${canBunk !== 1 ? 'es' : ''}.`;
    } else {
        desc = `⚠️ Below 80%! Attend ${deficit} more class${deficit !== 1 ? 'es' : ''} to recover.`;
    }

    document.getElementById('attendance-result').textContent = pct + '%';
    document.getElementById('att-desc').textContent = desc;
    document.getElementById('att-desc').style.color = pct >= 80 ? '#059669' : '#ea580c';

    document.getElementById('att-empty-state').classList.add('hidden');
    const rs = document.getElementById('att-result-state');
    rs.classList.remove('hidden');
    rs.style.animation = 'none'; rs.offsetHeight; rs.style.animation = '';
});

/* ══════════════════════════════════════
   BUNK CALCULATOR
══════════════════════════════════════ */
document.getElementById('calc-bunk').addEventListener('click', () => {
    const total    = parseInt(document.getElementById('bunk-total').value);
    const attended = parseInt(document.getElementById('bunk-attended').value);

    if (!total || !attended || attended > total) {
        alert('Please enter valid class numbers.');
        return;
    }

    const currentPct = ((attended / total) * 100).toFixed(2);
    const safeBunks = Math.max(0, Math.floor((attended - 0.8 * total) / 0.8));

    document.getElementById('bunk-empty-state').classList.add('hidden');
    const rs = document.getElementById('bunk-result-state');
    rs.classList.remove('hidden');
    rs.style.animation = 'none'; rs.offsetHeight; rs.style.animation = '';

    // Update result card styling based on attendance
    const resultCard = rs.closest('.result-panel');
    if (currentPct >= 80) {
        resultCard.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        resultCard.style.background = 'linear-gradient(160deg, #f0fdf4, #e8f8f5)';
    } else {
        resultCard.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        resultCard.style.background = 'linear-gradient(160deg, #fef2f2, #fff5f5)';
    }

    // Update current attendance display
    const attendanceSpan = document.getElementById('bunk-current-attendance');
    attendanceSpan.textContent = currentPct + '%';
    attendanceSpan.style.color = currentPct >= 80 ? '#10b981' : '#ef4444';

    if (currentPct >= 80) {
        document.getElementById('bunk-title').textContent = 'Safe Bunks Available';
        document.getElementById('bunk-huge').textContent = safeBunks;
        document.getElementById('bunk-huge').style.color = '#10b981';
        
        if (safeBunks > 0) {
            document.getElementById('bunk-desc').textContent = `You can safely skip ${safeBunks} more class${safeBunks !== 1 ? 'es' : ''} while maintaining 80% attendance.`;
            document.getElementById('bunk-desc').style.color = '#059669';
        } else {
            document.getElementById('bunk-desc').textContent = `You're right at 80% attendance. Attend all remaining classes to maintain your standing.`;
            document.getElementById('bunk-desc').style.color = '#f59e0b';
        }
    } else {
        document.getElementById('bunk-title').textContent = 'Below Minimum Attendance';
        document.getElementById('bunk-huge').textContent = '0';
        document.getElementById('bunk-huge').style.color = '#ef4444';
        const neededAttendance = Math.ceil(0.8 * total) - attended;
        document.getElementById('bunk-desc').textContent = `Attend ${neededAttendance} more class${neededAttendance !== 1 ? 'es' : ''} to reach 80% before considering any bunks.`;
        document.getElementById('bunk-desc').style.color = '#dc2626';
    }
});

/* ══════════════════════════════════════
   EXTERNAL LINK BUTTONS — RIPPLE EFFECT
══════════════════════════════════════ */

/* Inject ripple keyframe once */
(function () {
    const s = document.createElement('style');
    s.textContent = `@keyframes rippleAnim { to { transform: scale(2.8); opacity: 0; } }`;
    document.head.appendChild(s);
})();

document.querySelectorAll('.portal-btn, .food-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${e.clientX - rect.left - size / 2}px;
            top: ${e.clientY - rect.top - size / 2}px;
            background: rgba(255, 255, 255, 0.38);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleAnim 0.55s linear forwards;
            pointer-events: none;
            z-index: 5;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

/* ══════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════ */
const htmlElement = document.documentElement;
const themeToggles = [
    document.getElementById('theme-toggle-mobile'),
    document.getElementById('theme-toggle-sidebar'),
    document.getElementById('bnav-theme-toggle')
];
const themeIcons = [
    document.getElementById('theme-icon-mobile'),
    document.getElementById('theme-icon-sidebar')
];

function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
    
    if (gradeChart) {
        const colors = getThemeColors();
        gradeChart.options.plugins.legend.labels.color = colors.textColor;
        gradeChart.options.plugins.tooltip.backgroundColor = 'rgba(0,0,0,0.8)';
        gradeChart.update();
    }
}

function updateThemeIcons(theme) {
    themeIcons.forEach(icon => {
        if (icon) {
            icon.classList.remove('fa-moon', 'fa-sun');
            icon.classList.add(theme === 'dark' ? 'fa-sun' : 'fa-moon');
        }
    });
    
    const themeLabel = document.getElementById('theme-drawer-label');
    if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
    }
    
    const togglePill = document.getElementById('theme-pill');
    if (togglePill) {
        togglePill.classList.toggle('on', theme === 'dark');
    }

    if (pageTransition) {
        pageTransition.style.background = theme === 'dark'
            ? 'radial-gradient(circle at center, rgba(16,185,129,0.24), transparent 45%), linear-gradient(135deg, rgba(3,8,20,0.05), rgba(16,185,129,0.14), rgba(59,130,246,0.08))'
            : 'radial-gradient(circle at center, rgba(16,185,129,0.18), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.18), rgba(16,185,129,0.1), rgba(59,130,246,0.08))';
    }
}

themeToggles.forEach(toggle => {
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }
});

/* ══════════════════════════════════════
   EXPORT (IMAGE / PDF) HELPERS
══════════════════════════════════════ */

function captureNodeAsBlob(node) {
    return html2canvas(node, { useCORS: true, backgroundColor: null, scale: Math.min(2, window.devicePixelRatio || 1) })
        .then(canvas => new Promise(resolve => canvas.toBlob(resolve, 'image/png')));
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadNodeImage(selector, filename) {
    const node = document.querySelector(selector);
    if (!node) { alert('Export target not found.'); return; }
    const blob = await captureNodeAsBlob(node);
    if (blob) downloadBlob(blob, filename);
}

async function downloadNodePDF(selector, filename) {
    const node = document.querySelector(selector);
    if (!node) { alert('Export target not found.'); return; }
    const canvas = await html2canvas(node, { useCORS: true, backgroundColor: null, scale: Math.min(2, window.devicePixelRatio || 1) });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf || window.jspdf || {};
    const PdfConstructor = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF ? window.jsPDF : null);
    const pdfLib = PdfConstructor || (typeof jsPDF === 'function' ? jsPDF : null);
    if (!pdfLib) {
        alert('PDF library not available.');
        return;
    }
    const pdf = new pdfLib('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(filename + '.pdf');
}

function makeFilename(base) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${base}_${stamp}`;
}

window.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cgpa-download-img')?.addEventListener('click', () => downloadNodeImage('#cgpa-result-state', makeFilename('CGPA_Report') + '.png'));
    document.getElementById('cgpa-download-pdf')?.addEventListener('click', () => downloadNodePDF('#cgpa-result-state', makeFilename('CGPA_Report')));

    document.getElementById('att-download-img')?.addEventListener('click', () => downloadNodeImage('#att-result-state', makeFilename('Attendance_Report') + '.png'));
    document.getElementById('att-download-pdf')?.addEventListener('click', () => downloadNodePDF('#att-result-state', makeFilename('Attendance_Report')));

    document.getElementById('bunk-download-img')?.addEventListener('click', () => downloadNodeImage('#bunk-result-state', makeFilename('Bunk_Report') + '.png'));
    document.getElementById('bunk-download-pdf')?.addEventListener('click', () => downloadNodePDF('#bunk-result-state', makeFilename('Bunk_Report')));
});

initTheme();