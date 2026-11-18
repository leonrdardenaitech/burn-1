/**
 * BURN-1 SYSTEMS — TACTILE SCI-FI AUDIO SYNTHESIZER (js/burn1-audio-fx.js)
 * 100% Native Web Audio API — Zero external sound files needed.
 * Features:
 *   - Mechanical Switch Click (Heavy toggle / relay flip)
 *   - Futuristic Terminal Beep (LED / input validation)
 *   - Biometric Scan Hum & Chirp (Laser sweep & passkey confirmation)
 *   - Hydraulic Swipe / Drawer Whoosh (Slide-out UltraBars & modal openings)
 *   - Heavy Industrial Knife Switch Clunk (High-voltage relay & dispatch)
 *   - Mute / Audio Toggle Icon
 */

(function () {
  'use strict';

  class Burn1AudioEngine {
    constructor() {
      this.ctx = null;
      this.isMuted = localStorage.getItem('b1_audio_muted') === 'true';
      this.init();
    }

    init() {
      // Lazy init AudioContext on first user interaction
      const unlockAudio = () => {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };

      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });

      this.injectMuteToggleUI();
      this.bindTactileElements();
    }

    injectMuteToggleUI() {
      // Legacy standalone audio toggle removed.
      // Sound toggle is now directly integrated into the Time Accel Clock Gauge trigger!
      return;
    }

    toggleMute() {
      this.isMuted = !this.isMuted;
      localStorage.setItem('b1_audio_muted', this.isMuted);

      const btn = document.getElementById('b1-audio-toggle-btn');
      if (btn) {
        btn.style.borderColor = this.isMuted ? '#64748b' : '#38bdf8';
        btn.style.color = this.isMuted ? '#64748b' : '#38bdf8';
        btn.style.boxShadow = `0 4px 15px rgba(0,0,0,0.8), 0 0 ${this.isMuted ? '0' : '12px rgba(56, 189, 248, 0.4)'}`;
        btn.innerHTML = `<i class="fa-solid ${this.isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}"></i>`;
      }

      if (!this.isMuted) {
        this.playBeep(880, 0.08); // Confirmation chirp
      }
    }

    // --- SOUND 1: MECHANICAL RELAY / TOGGLE CLICK ---
    playClick() {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
      } catch (e) {}
    }

    // --- SOUND 2: FUTURISTIC TERMINAL BEEP ---
    playBeep(freq = 640, duration = 0.07) {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {}
    }

    // --- SOUND 3: HYDRAULIC SWIPE / WHOOSH (UltraBars & Modals) ---
    playSwipe() {
      if (this.isMuted || !this.ctx) return;
      try {
        const bufferSize = this.ctx.sampleRate * 0.15;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.12);
        filter.Q.value = 3.0;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.14);
      } catch (e) {}
    }

    // --- SOUND 4: BIOMETRIC LASER SCAN HUM & CONFIRMATION ---
    playBioScan() {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(920, this.ctx.currentTime + 0.25);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.28);

        // Success chirp at the end
        setTimeout(() => {
          this.playBeep(1200, 0.1);
        }, 260);
      } catch (e) {}
    }

    // --- SOUND 5: HEAVY INDUSTRIAL KNIFE SWITCH CLUNK ---
    playKnifeSwitch() {
      if (this.isMuted || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {}
    }

    // --- GLOBAL SELECTOR BINDINGS ---
    bindTactileElements() {
      document.addEventListener('click', (e) => {
        const target = e.target.closest('button, input[type="checkbox"], .tactile-switch-housing, .biometric-scanner-pad, .b1-biometric-pad, summary, .flip-card');
        if (!target) return;

        // Don't double sound on the mute button itself
        if (target.id === 'b1-audio-toggle-btn') return;

        if (target.classList.contains('biometric-scanner-pad') || target.classList.contains('b1-biometric-pad') || target.id?.includes('bio')) {
          this.playBioScan();
        } else if (target.closest('.knife-switch-box') || target.innerText?.includes('PULL SWITCH') || target.id?.includes('btnFinalPushHQ')) {
          this.playKnifeSwitch();
        } else if (target.classList.contains('ultrabar-toggle-btn') || target.id?.includes('bot-btn') || target.tagName === 'SUMMARY' || target.classList.contains('flip-card')) {
          this.playSwipe();
        } else if (target.type === 'checkbox' || target.classList.contains('tactile-switch-housing')) {
          this.playClick();
        } else {
          this.playBeep(720, 0.05);
        }
      }, true);
    }
  }

  // Mount globally
  window.addEventListener('DOMContentLoaded', () => {
    window.burn1Audio = new Burn1AudioEngine();
  });
})();
