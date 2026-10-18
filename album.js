/* Album ảnh độc lập: tự chuyển, tạm dừng, phím mũi tên và vuốt trên điện thoại. */
(() => {
  'use strict';
  const normalize = value => String(value ?? '').normalize('NFC');
  const validPosition = value => /^\d{1,3}%\s+\d{1,3}%$/.test(String(value)) ? String(value) : '50% 50%';
  window.GiftAlbum = class {
    constructor(config, reducedMotion = false) {
      this.config = config;
      this.$ = id => document.getElementById(id);
      this.seconds = Math.max(3, Math.min(12, Number(config.slideshowSeconds) || 5.8));
      this.visible = false; this.hovered = false; this.focused = false;
      this.paused = false; this.reduced = reducedMotion;
      this.timer = null; this.generation = 0; this.active = 0; this.items = [];
      this.viewport = this.$('albumViewport');
      this.viewport.dataset.transition = ['dissolve', 'drift', 'dreamy'].includes(config.transition) ? config.transition : 'dreamy';
      this.$('albumTime').style.setProperty('--slide-duration', this.seconds + 's');
      const source = Array.isArray(config.photos) && config.photos.length ? config.photos : config.photo ? [{ src: config.photo, caption: config.photoCaption, position: config.photoPosition }] : [];
      const photos = source.slice(0, 12).map((item, index) => typeof item === 'string' ? { src: item, caption: config.photoCaption, position: config.photoPosition } : item).filter(item => item && typeof item.src === 'string' && item.src.trim()).map(item => ({ src: item.src, caption: normalize(item.caption || config.photoCaption), position: validPosition(item.position || config.photoPosition) }));
      this.mount(photos.length ? photos : this.illustrations(), !photos.length);
      this.bind();
    }
    illustrations() {
      return [
        { src: './assets/dream-heart.svg', caption: this.config.photoCaption || 'Một chút dịu dàng, chỉ dành riêng cho em.', position: '50% 50%' },
        { src: './assets/moon-garden.svg', caption: 'Mong những ngày của em luôn có một góc bình yên.', position: '50% 50%' },
        { src: './assets/pink-garden.svg', caption: 'Một chút ngọt ngào, cho một ngày thật xinh.', position: '50% 50%' }
      ];
    }
    mount(photos, illustrated = false) {
      this.stop(); this.generation++; const generation = this.generation;
      this.illustrated = illustrated; this.active = 0;
      this.$('albumSlides').replaceChildren();
      this.items = photos.map((photo, index) => {
        const element = document.createElement('div'); element.className = 'memory-slide' + (illustrated ? ' illustration' : '');
        const image = document.createElement('img'); image.alt = photo.caption || 'Ảnh ' + (index + 1) + ' trong món quà'; image.draggable = false;
        image.decoding = 'async'; image.style.objectPosition = photo.position;
        element.append(image); this.$('albumSlides').append(element);
        const item = { ...photo, element, image, status: 'waiting' };
        image.addEventListener('load', () => { if (generation !== this.generation) return; item.status = 'ready'; this.updateFallback(); });
        image.addEventListener('error', () => {
          if (generation !== this.generation) return;
          item.status = 'failed'; element.classList.add('is-broken');
          const available = this.available();
          if (!available.length) {
            if (!this.illustrated) { this.mount(this.illustrations(), true); return; }
            this.stop(); this.$('albumTools').hidden = true; this.$('albumCount').textContent = '';
          } else {
            this.navigation();
            if (this.items[this.active].status === 'failed') this.show(available[0]);
            else this.updateCount();
          }
          this.updateFallback();
        });
        return item;
      });
      this.navigation(); this.show(0);
    }
    available() { return this.items.map((item, i) => item.status !== 'failed' ? i : -1).filter(i => i !== -1); }
    navigation() {
      const dots = this.$('albumDots'); dots.replaceChildren();
      this.items.forEach((item, index) => {
        if (item.status === 'failed') return;
        const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-label', 'Xem ảnh ' + (index + 1));
        dot.setAttribute('aria-current', String(index === this.active)); dot.addEventListener('click', () => this.show(index, true));
        dot.dataset.photoIndex = String(index); dots.append(dot);
      });
      this.$('albumTools').hidden = this.available().length <= 1;
      this.updatePauseButton();
    }
    updateCount() {
      const valid = this.available(), position = valid.indexOf(this.active) + 1;
      this.$('albumCount').textContent = position > 0 ? String(position).padStart(2, '0') + ' / ' + String(valid.length).padStart(2, '0') : '';
    }
    updateFallback() { this.$('photoFallback').hidden = this.items[this.active]?.status === 'ready'; }
    preload(index) {
      const item = this.items[index];
      if (item && item.status === 'waiting') { item.status = 'loading'; item.image.src = item.src; }
    }
    show(index, manual = false) {
      const item = this.items[index]; if (!item || item.status === 'failed') return;
      const previous = this.active; this.active = index;
      this.preload(index);
      const valid = this.available();
      this.preload(valid[(valid.indexOf(index) + 1) % valid.length]);
      this.items.forEach((entry, i) => {
        entry.element.classList.toggle('was-active', i === previous && i !== index);
        entry.element.classList.toggle('is-active', i === index);
        entry.element.setAttribute('aria-hidden', String(i !== index));
      });
      const caption = document.createElement('span'); caption.textContent = item.caption || this.config.photoCaption || '';
      this.$('photoCaption').replaceChildren(caption);
      Array.from(this.$('albumDots').children).forEach(dot => dot.setAttribute('aria-current', String(Number(dot.dataset.photoIndex) === index)));
      this.updateCount(); this.updateFallback(); this.start();
      if (manual) this.$('albumAnnouncement').textContent = 'Ảnh ' + (this.available().indexOf(index) + 1) + '. ' + caption.textContent;
    }
    step(direction, manual = false) {
      const valid = this.available(); if (valid.length < 2) return;
      const position = valid.indexOf(this.active);
      this.show(valid[(position + direction + valid.length) % valid.length], manual);
    }
    stop() {
      clearTimeout(this.timer); this.timer = null;
      this.$('albumTime').classList.remove('running'); this.$('albumTime').replaceChildren();
    }
    start() {
      this.stop();
      if (!this.visible || this.paused || document.hidden || this.available().length < 2) return;
      const fill = document.createElement('i'); this.$('albumTime').append(fill); this.$('albumTime').classList.add('running');
      this.timer = setTimeout(() => { this.timer = null; this.step(1); }, this.seconds * 1000);
    }
    setVisible(visible) { if (this.visible === visible) return; this.visible = visible; if (visible) this.start(); else this.stop(); }
    reset() { this.hovered = false; this.focused = false; this.show(this.available()[0] ?? 0); }
    updatePauseButton() {
      const button = this.$('pauseAlbum'); button.textContent = this.paused ? '▷' : 'Ⅱ';
      button.setAttribute('aria-pressed', String(this.paused)); button.setAttribute('aria-label', this.paused ? 'Tiếp tục chuyển ảnh tự động' : 'Tạm dừng chuyển ảnh');
    }
    bind() {
      const frame = this.$('albumFrame');
      this.$('previousPhoto').addEventListener('click', () => this.step(-1, true));
      this.$('nextPhoto').addEventListener('click', () => this.step(1, true));
      this.$('pauseAlbum').addEventListener('click', () => { this.paused = !this.paused; this.focused = false; this.updatePauseButton(); this.start(); });
      frame.addEventListener('pointerenter', event => { if (event.pointerType === 'touch') return; this.hovered = true; });
      frame.addEventListener('pointerleave', () => { this.hovered = false; frame.style.setProperty('--tilt-x', '0deg'); frame.style.setProperty('--tilt-y', '0deg'); });
      frame.addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); this.step(event.key === 'ArrowRight' ? 1 : -1, true); } });
      let touchStart = null;
      this.viewport.style.touchAction = 'pan-y pinch-zoom';
      this.viewport.addEventListener('pointerdown', event => { touchStart = { x: event.clientX, y: event.clientY }; });
      this.viewport.addEventListener('pointercancel', () => { touchStart = null; });
      this.viewport.addEventListener('pointerup', event => {
        if (!touchStart) return; const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y; touchStart = null;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.3) this.step(dx < 0 ? 1 : -1, true);
      });
      if (!this.reduced && this.config.effectLevel !== 'quiet' && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let pending = false, tiltX = 0, tiltY = 0;
        frame.addEventListener('pointermove', event => {
          if (event.pointerType === 'touch') return;
          const rect = frame.getBoundingClientRect();
          tiltX = Math.max(-2.5, Math.min(2.5, (event.clientY - rect.top - rect.height / 2) / rect.height * -5));
          tiltY = Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) / rect.width * 6));
          if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; if (!this.hovered) return; frame.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg'); frame.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg'); }); }
        });
      }
      document.addEventListener('visibilitychange', () => this.start());
    }
  };
})();
