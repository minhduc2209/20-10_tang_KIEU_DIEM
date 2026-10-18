/* Bong bóng, tim, hoa bay liên tục và dải ảnh lặp cùng lá thư. */
(() => {
  'use strict';
  window.GiftMagic = class {
    constructor(config, reducedMotion = false) {
      this.config = config; this.reduced = reducedMotion; this.scene = 'intro'; this.last = 0;
      this.canvas = document.getElementById('loveCanvas'); this.ctx = this.canvas.getContext('2d');
      this.colors = config.theme === 'lavender' ? ['#d8b8ec','#f1c7df','#e9d4fa'] : config.theme === 'peach' ? ['#f5b5a8','#f5d3af','#eeb4c6'] : ['#efb2cf','#f0c5db','#eed1b7'];
      this.resize(); this.mountRibbons();
      addEventListener('resize', () => this.resize());
      let pending = false;
      addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(() => { pending = false; this.refresh(); }); } }, { passive: true });
      this.animate = this.animate.bind(this); requestAnimationFrame(this.animate);
    }
    refresh() {
      this.safeAreas = Array.from(document.querySelectorAll('.welcome-copy,.wish-copy,.letter-paper,.header,.special-action,.garden-heading,.garden-after')).map(node => node.getBoundingClientRect()).filter(rect => rect.width && rect.height);
    }
    setScene(scene) { this.scene = scene; this.refresh(); }
    resize() {
      this.width = innerWidth; this.height = innerHeight;
      const dpr = Math.min(devicePixelRatio || 1, 2); this.canvas.width = this.width * dpr; this.canvas.height = this.height * dpr;
      if (this.ctx) this.ctx.setTransform(dpr,0,0,dpr,0,0);
      const base = this.width < 720 ? 28 : 46;
      const count = this.config.effectLevel === 'quiet' ? Math.round(base*.6) : this.config.effectLevel === 'dreamy' ? Math.round(base*1.3) : base;
      this.particles = Array.from({ length: count }, (_,i) => this.newParticle(i, true)); this.refresh();
    }
    newParticle(i, initial = false) {
      const right = i % 2 === 0, lane = this.width < 720 ? .1 : .18;
      const x = (right ? 1-lane+Math.random()*lane : Math.random()*lane)*this.width;
      return { x, y: initial ? Math.random()*this.height : this.height+40+Math.random()*100, size:i%4===0?17+Math.random()*22:8+Math.random()*14, speed:10+Math.random()*15, phase:Math.random()*6.28, kind:i%11===0?'flower':i%7===0?'bubble':'heart', color:this.colors[i%this.colors.length], rotation:Math.random()*6.28 };
    }
    mountRibbons() {
      const source = Array.isArray(this.config.photos) && this.config.photos.length ? this.config.photos : this.config.photo ? [{src:this.config.photo,position:this.config.photoPosition}] : [{src:'./assets/dream-heart.svg'},{src:'./assets/moon-garden.svg'},{src:'./assets/pink-garden.svg'}];
      let photos = source.slice(0,12).map(item=>typeof item==='string'?{src:item}:item).filter(item=>item&&typeof item.src==='string'&&item.src);
      if(!photos.length)photos=[{src:'./assets/dream-heart.svg'}];
      // Ít ảnh thì lặp thêm để dải luôn phủ đủ chiều ngang và nối vòng liền mạch.
      const repeated=[];while(repeated.length<6)repeated.push(...photos);
      const frames=photos.length>=6?photos:repeated;
      for(const ribbon of document.querySelectorAll('[data-photo-ribbon]')) {
        ribbon.replaceChildren();const track=document.createElement('div');track.className='ribbon-track';track.style.setProperty('--ribbon-speed',Math.max(24,frames.length*4)+'s');
        for(let copy=0;copy<2;copy++) {
          const group=document.createElement('div');group.className='ribbon-group';if(copy)group.setAttribute('aria-hidden','true');
          frames.forEach((photo,index)=>{
            const card=document.createElement('figure');card.className='ribbon-card';
            const image=document.createElement('img');image.alt=copy?'':('Một tấm ảnh trong món quà, số '+(index%photos.length+1));image.loading='lazy';image.decoding='async';image.draggable=false;image.style.objectPosition=/^\d{1,3}%\s+\d{1,3}%$/.test(photo.position||'')?photo.position:'50% 50%';
            image.addEventListener('error',()=>{if(image.dataset.fallback){image.hidden=true;return;}image.dataset.fallback='true';image.src='./assets/dream-heart.svg';});image.src=photo.src;
            const heart=document.createElement('span');heart.className='ribbon-heart';heart.textContent='♡';heart.setAttribute('aria-hidden','true');card.append(image,heart);group.append(card);
          });track.append(group);
        }ribbon.append(track);
      }
    }
    opacityAt(x,y,size) {
      return this.safeAreas.some(rect=>x+size>rect.left&&x-size<rect.right&&y+size>rect.top&&y-size<rect.bottom) ? .08 : 1;
    }
    heart(ctx,size) {
      ctx.beginPath();ctx.moveTo(0,size*.48);
      ctx.bezierCurveTo(-size*1.1,-size*.12,-size*.55,-size*.95,0,-size*.4);
      ctx.bezierCurveTo(size*.55,-size*.95,size*1.1,-size*.12,0,size*.48);ctx.closePath();ctx.fill();ctx.stroke();
    }
    animate(time) {
      requestAnimationFrame(this.animate);
      if(!this.ctx||document.hidden||time-this.last<(this.reduced?1200:40))return;
      const delta=this.last?Math.min((time-this.last)/1000,.08):.04;this.last=time;const t=this.reduced?0:time/1000;
      const ctx=this.ctx;ctx.clearRect(0,0,this.width,this.height);
      this.particles.forEach((p,index)=>{
        if(!this.reduced)p.y-=p.speed*delta;
        if(p.y<-p.size*3){this.particles[index]=this.newParticle(index);return;}
        const x=p.x+Math.sin(t*.65+p.phase)*(this.width<720?7:16),fade=this.opacityAt(x,p.y,p.size);
        ctx.save();ctx.translate(x,p.y);ctx.rotate(Math.sin(t*.3+p.phase)*.18);ctx.globalAlpha=(p.kind==='bubble'?.25:.23)*fade;
        ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.lineWidth=.8;
        if(p.kind==='bubble') {
          ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.stroke();
          ctx.globalAlpha=.07*fade;ctx.fill();ctx.globalAlpha=.3*fade;ctx.strokeStyle='#fff0f7';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(-p.size*.18,-p.size*.18,p.size*.63,Math.PI*1.02,Math.PI*1.55);ctx.stroke();
          ctx.globalAlpha=.18*fade;ctx.beginPath();ctx.arc(p.size*.4,p.size*.4,p.size*.14,0,6.28);ctx.fill();
        }else if(p.kind==='flower') {
          ctx.rotate(t*.12+p.phase);for(let petal=0;petal<5;petal++){ctx.rotate(Math.PI*2/5);ctx.beginPath();ctx.ellipse(0,-p.size*.45,p.size*.24,p.size*.45,0,0,6.28);ctx.fill();}ctx.fillStyle='#f3d2a4';ctx.beginPath();ctx.arc(0,0,p.size*.18,0,6.28);ctx.fill();
        }else this.heart(ctx,p.size);
        ctx.restore();
      });
    }
  };
})();
