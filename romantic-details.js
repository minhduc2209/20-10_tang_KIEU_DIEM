/* Tim, cánh hoa và ánh sao ở vùng trang trí. Không đổi ảnh hoặc nội dung thư. */
(() => {
  'use strict';
  const MAX_MOMENT_PARTICLES = 64;
  const HEART_PATH = 'M200 325C178 305 50 225 62 132C75 35 170 42 200 112C230 42 325 35 338 132C350 225 222 305 200 325Z';

  window.GiftRomance = class {
    constructor(config, reduced = false) {
      this.config = config; this.reduced = reduced;
      this.$ = id => document.getElementById(id);
      this.nodes = new Set(); this.timers = new Set();
      this.progress = this.$('letterProgress'); this.segments = [];
      if (this.progress) {
        this.progress.replaceChildren();
        for (let i = 0; i < 12; i++) {
          const segment = document.createElement('span');
          segment.setAttribute('aria-hidden', 'true');
          this.progress.append(segment); this.segments.push(segment);
        }
      }
      this.mountAtmosphere();
      const visibility = () => {
        document.body.dataset.tabHidden = String(document.hidden);
        if (document.hidden) this.clear();
      };
      document.addEventListener('visibilitychange', visibility);
      this.$('surpriseDialog').addEventListener('close', () => this.clear());
      visibility();
    }

    mountAtmosphere() {
      // Một lần tạo, CSS tự chạy vòng lặp. Không thêm vòng requestAnimationFrame.
      const quiet = this.config.effectLevel === 'quiet';
      const dreamy = this.config.effectLevel === 'dreamy';
      const counts = quiet ? [6, 8] : dreamy ? [28, 38] : [20, 28];
      for (const [index, id] of ['globalAtmosphere', 'letterAtmosphere'].entries()) {
        const field = this.$(id); if (!field) continue;
        field.replaceChildren(); if (this.reduced) continue;
        if (index === 1) {
          const orbit = document.createElement('div'); orbit.className = 'dream-heart-orbit';
          orbit.innerHTML = '<svg viewBox="0 0 400 400" focusable="false" aria-hidden="true">' +
            '<path class="dream-heart-thread" d="' + HEART_PATH + '"/>' +
            '<path class="dream-heart-comet" d="' + HEART_PATH + '" pathLength="1"/>' +
            '<path class="dream-heart-comet dream-heart-comet--second" d="' + HEART_PATH + '" pathLength="1"/>' +
            '</svg>';
          field.append(orbit);
          for (let i = 0; i < 3; i++) {
            const haze = document.createElement('span'); haze.className = 'dream-haze';
            haze.style.setProperty('--haze-i', i); field.append(haze);
          }
        }
        for (let i = 0; i < counts[index]; i++) {
          const mote = document.createElement('span');
          const kind = i % 11 === 10 ? 'bubble' : i % 7 === 6 ? 'flower' : i % 5 === 4 ? 'star' : 'heart';
          mote.className = 'dream-mote dream-mote--' + kind;
          mote.setAttribute('aria-hidden', 'true');
          mote.textContent = kind === 'bubble' ? '' : kind === 'flower' ? '✿' : kind === 'star' ? '✧' : i % 3 === 0 ? '♥' : '♡';
          const x = index === 0 ? (i % 2 ? 96 + i % 3 : 1 + i % 3) : (i * 29 + 7) % 95;
          mote.style.setProperty('--dream-x', x + '%');
          mote.style.setProperty('--dream-size', (index === 0 ? 13 + i % 5 * 3 : 14 + i % 5 * 4) + 'px');
          mote.style.setProperty('--dream-drift', ((i % 2 ? 1 : -1) * (6 + i % 4 * 7)) + 'px');
          mote.style.setProperty('--dream-duration', (index === 0 ? 20 + i % 6 * 2 : 15 + i % 5 * 2) + 's');
          mote.style.setProperty('--dream-delay', (-i * 2.37 - 2) + 's');
          mote.style.setProperty('--dream-alpha', String(kind === 'heart' ? .23 + i % 4 * .045 : .18));
          mote.style.setProperty('--dream-turn', (i % 2 ? 24 : -27) + 'deg');
          field.append(mote);
        }
      }
    }

    setProgress(state) {
      if (!this.progress) return;
      const count = state.mode === 'invitation' ? 12 : Math.max(0, Math.min(12, state.completed.size));
      this.progress.setAttribute('aria-valuenow', String(count));
      this.progress.setAttribute('aria-valuetext', count + ' trong 12 lá thư đã đọc');
      this.segments.forEach((segment, i) => {
        segment.dataset.read = String(i < count);
        segment.dataset.current = String(state.mode !== 'invitation' && i === state.index);
      });
    }

    celebrate(kind = 'letter') {
      if (this.reduced || document.hidden) return;
      const dialog = this.$('surpriseDialog');
      const layer = dialog.open ? this.$('loveMoment') : this.$('romanceLayer'); if (!layer) return;
      const skin = dialog.open ? dialog.dataset.skin : '';
      let count = this.config.effectLevel === 'quiet' ? 6 : this.config.effectLevel === 'dreamy' ? 24 : 16;
      if (kind === 'reply' || kind === 'garden') count = Math.round(count * 1.5);
      const glyphs = kind === 'garden' ? ['♡', '♥', '✿', '♡', '✿'] :
        skin === 'stars' || skin === 'moon' ? ['♡', '♥', '✧', '♡', '✦'] :
        skin === 'music' ? ['♡', '♥', '♪', '♡', '✧'] : ['♡', '♥', '♡', '✿', '♡', '✧'];
      for (let i = 0; i < count && this.nodes.size < MAX_MOMENT_PARTICLES; i++) {
        const heart = document.createElement('span');
        const delay = i % 7 * .06, life = kind === 'reply' ? 3.15 : 2.6 + i % 3 * .12;
        heart.className = 'romance-particle'; heart.dataset.kind = kind; heart.textContent = glyphs[i % glyphs.length];
        heart.setAttribute('aria-hidden', 'true');
        heart.style.setProperty('--heart-x', (i % 2 ? 96 - i % 4 : 2 + i % 4) + '%');
        heart.style.setProperty('--heart-rise', (150 + i % 6 * 36) + 'px');
        heart.style.setProperty('--heart-drift', ((i % 2 ? -1 : 1) * (8 + i % 4 * 8)) + 'px');
        heart.style.setProperty('--heart-delay', delay + 's'); heart.style.setProperty('--heart-life', life + 's');
        heart.style.setProperty('--heart-turn', (i % 2 ? 32 : -37) + 'deg');
        heart.style.setProperty('--heart-size', (14 + i % 5 * 4) + 'px');
        layer.append(heart); this.nodes.add(heart);
        const timer = setTimeout(() => {
          heart.remove(); this.nodes.delete(heart); this.timers.delete(timer);
        }, Math.ceil((life + delay + .15) * 1000));
        this.timers.add(timer);
      }
    }

    clear() {
      this.timers.forEach(clearTimeout); this.timers.clear();
      this.nodes.forEach(node => node.remove()); this.nodes.clear();
    }
  };
})();
