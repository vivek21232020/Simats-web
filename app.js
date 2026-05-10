/* ══════════════════════════════════════
   PARTICLES
══════════════════════════════════════ */
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 12 + 5;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 14 + 10}s;
            animation-delay: ${Math.random() * 12}s;
            opacity: 0;
        `;
        container.appendChild(p);
    }
}
createParticles();

/* ══════════════════════════════════════
   NAVIGATION
══════════════════════════════════════ */
const sideButtons = document.querySelectorAll('.side-btn');
const toolSections = document.querySelectorAll('.tool-section');

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
        
        bnavButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

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

    document.getElementById('cgpa-empty-state').classList.add('hidden');
    const resultState = document.getElementById('cgpa-result-state');
    resultState.classList.remove('hidden');
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
}

themeToggles.forEach(toggle => {
    if (toggle) {
        toggle.addEventListener('click', toggleTheme);
    }
});

initTheme();