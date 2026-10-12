/**
 * silver_clock.js - Burn-1 Systems Smoke & Mirror Kinetic Clock Engine
 * Adapted from silver_mirror_clock.html for Day Mode Ambient Visuals
 */
(function() {
    function initSilverMirrorClock() {
        let container = document.getElementById('clock-mirror-bg');
        if (!container) {
            container = document.createElement('div');
            container.id = 'clock-mirror-bg';
            container.className = 'fixed inset-0 pointer-events-none overflow-hidden z-0 hidden';
            document.body.prepend(container);
        }
        if (container.dataset.initialized) return;
        container.dataset.initialized = "true";

        container.innerHTML = `
            <div class="clock-scene">
                <div class="clock-assembly">
                    <div class="spinning-dial" id="mirror-dial"></div>
                    <div class="stationary-hands">
                        <div class="hand hour-hand"></div>
                        <div class="hand minute-hand"></div>
                        <div class="center-pin"></div>
                    </div>
                </div>
            </div>
        `;

        const dial = document.getElementById('mirror-dial');
        if (!dial) return;

        const random = (min, max) => Math.random() * (max - min) + min;

        function createMirror(type, index, totalInRing, radius) {
            const mirror = document.createElement('div');
            mirror.classList.add('mirror-shard');

            const angleDeg = (index / totalInRing) * 360;
            mirror.style.setProperty('--finalAngle', `${angleDeg}deg`);
            mirror.style.setProperty('--finalRadius', `-${radius}px`);

            const startX = random(-1500, 1500);
            const startY = random(-1500, 1500);
            const startScale = random(3, 8);
            const startRot = random(-720, 720);

            mirror.style.setProperty('--startX', `${startX}px`);
            mirror.style.setProperty('--startY', `${startY}px`);
            mirror.style.setProperty('--startScale', startScale);
            mirror.style.setProperty('--startRot', `${startRot}deg`);
            mirror.style.setProperty('--glint-delay', `${random(0, 5)}s`);

            if (type === 'hour') {
                mirror.style.width = '20px';
                mirror.style.height = '40px';
                mirror.style.marginLeft = '-10px';
                mirror.style.marginTop = '-20px';
                mirror.style.setProperty('--finalSelfRot', '45deg');
                mirror.style.borderRadius = '4px';
            } else if (type === 'minute') {
                mirror.style.width = '8px';
                mirror.style.height = '8px';
                mirror.style.marginLeft = '-4px';
                mirror.style.marginTop = '-4px';
                mirror.style.borderRadius = '50%';
            } else if (type === 'outer-ring') {
                mirror.style.width = '60px';
                mirror.style.height = '15px';
                mirror.style.marginLeft = '-30px';
                mirror.style.marginTop = '-7.5px';
                mirror.style.borderRadius = '2px';
                mirror.style.setProperty('--finalSelfRot', '90deg');
            } else if (type === 'inner-ring') {
                mirror.style.width = '12px';
                mirror.style.height = '12px';
                mirror.style.marginLeft = '-6px';
                mirror.style.marginTop = '-6px';
            }

            return mirror;
        }

        // 1. Outer Frame Ring (36 pieces)
        for (let i = 0; i < 36; i++) {
            dial.appendChild(createMirror('outer-ring', i, 36, 280));
        }

        // 2. Hour Markers (12 pieces)
        for (let i = 0; i < 12; i++) {
            dial.appendChild(createMirror('hour', i, 12, 230));
        }

        // 3. Minute Markers (60 pieces)
        for (let i = 0; i < 60; i++) {
            if (i % 5 !== 0) {
                dial.appendChild(createMirror('minute', i, 60, 230));
            }
        }

        // 4. Middle decorative ring (24 pieces)
        for (let i = 0; i < 24; i++) {
            dial.appendChild(createMirror('inner-ring', i, 24, 160));
        }

        // 5. Deep inner core (12 pieces)
        for (let i = 0; i < 12; i++) {
            dial.appendChild(createMirror('outer-ring', i, 12, 80));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSilverMirrorClock);
    } else {
        initSilverMirrorClock();
    }

    window.initSilverMirrorClock = initSilverMirrorClock;
})();
