/* Món quà chạy độc lập, không dùng framework hoặc dịch vụ bên ngoài. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const config = { to: 'Cô gái đáng yêu', from: 'Đức', eyebrow: 'CHỈ DÀNH RIÊNG CHO EM', title: 'Chúc em một ngày thật dịu dàng.', message: 'Mong em luôn có thật nhiều lý do để mỉm cười. 🌷', photo: './photo.jpg', photoPosition: '50% 50%', photoCaption: 'Một nụ cười của em, cả ngày bỗng dễ thương hơn.', letterTitle: 'Gửi cô công chúa đáng yêu,', letter: 'Anh mong món quà nhỏ này mang đến cho em một chút niềm vui. 💗', closing: 'Mong em luôn gặp những điều tốt đẹp.', music: './music.mp3', musicTitle: 'Giải cứu thế giới', volume: .55, ...window.GIFT_CONFIG };
  const query = new URLSearchParams(location.search);
  for (const [key, limit] of Object.entries({ to: 80, from: 80, title: 160, message: 1600, letter: 5000, closing: 500 })) {
    if (query.get(key)?.trim()) config[key] = query.get(key).slice(0, limit);
  }
  for (const key of Object.keys(config)) if (typeof config[key] === 'string') config[key] = config[key].normalize('NFC');
  if(!config.from||config.from==='Đức')config.from='Minh Đức';
  if(!config.musicTitle||config.musicTitle==='Giải cứu thế giới')config.musicTitle=$('musicTitle').textContent||'Tâm tư của anh';
  function paragraphs(target, text, delay = 0) {
    const container = $(target);
    container.replaceChildren();
    String(text).split(/\n\s*\n/).forEach((text, index) => {
      const p = document.createElement('p');
      p.textContent = text;
      p.style.animationDelay = (delay + index * .15) + 's';
      container.append(p);
    });
  }
  $('eyebrowText').textContent = config.eyebrow;
  $('recipientName').textContent = config.to;
  $('wishTitle').textContent = config.title;
  paragraphs('wishMessage', config.message, .3);
  $('senderName').textContent = config.from;
  $('photoCaption').textContent = config.photoCaption;
  $('letterTitle').textContent = config.letterTitle;
  paragraphs('letterBody', config.letter, .1);
  $('letterSender').textContent = 'Minh Đức';
  $('closingText').textContent = config.closing;
  $('musicTitle').textContent = config.musicTitle;
  document.title = 'Gửi ' + config.to + ' — một chút dịu dàng ♡';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.body.dataset.theme = ['rose', 'lavender', 'peach'].includes(config.theme) ? config.theme : 'rose';
  document.body.dataset.effects = ['quiet', 'balanced', 'dreamy'].includes(config.effectLevel) ? config.effectLevel : 'balanced';
  const album = new window.GiftAlbum(config, reducedMotion);
  const magic = new window.GiftMagic(config, reducedMotion);
  const surprises = new window.GiftSurprises(config, reducedMotion);
  let letterGarden = null;
  let welcome=null,romance=null,restartBusy=false,restartTimer=null;
  let scene = 'welcome', sceneTimers = [];
  const schedule = (fn, ms) => { const id = setTimeout(fn, ms); sceneTimers.push(id); return id; };
  const scenes = { intro: 'introScene', wish: 'wishScene', letter: 'letterScene', final: 'finalScene' };
  const dots = Array.from($('progress').children);
  function changeScene(next, focus = true) {
    scene = next;
    document.body.dataset.scene = next;
    const albumSlot = { wish: 'wishAlbumSlot', letter: 'letterAlbumSlot', final: 'finalAlbumSlot' }[next];
    if (albumSlot) $(albumSlot).append($('portrait'));
    album.setVisible(next !== 'intro');
    for (const [key, id] of Object.entries(scenes)) $(id).hidden = key !== next;
    const current = ['wish', 'letter', 'final'].indexOf(next);
    dots.forEach((dot, index) => dot.classList.toggle('active', current === index));
    $('progress').setAttribute('aria-label', current < 0 ? 'Món quà đang đến' : 'Phần ' + (current + 1) + ' trong 3');
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus && next !== 'intro') $(scenes[next]).focus({ preventScroll: true });
    magic.setScene(next);
    if(romance&&next==='wish')romance.celebrate('wish');
  }
  function beginStory() {
    sceneTimers.forEach(clearTimeout); sceneTimers = [];
    if(letterGarden)letterGarden.reset();
    $('specialAction').hidden = true;
    $('letterPaper').hidden = true;
    $('openingEnvelope').hidden = false;
    $('openingCaption').hidden = false;
    $('smileNote').textContent = 'Bốn bó hoa, rồi tám điều dịu dàng. Mình đọc thong thả, từng trang một nhé.';
    surprises.resetJourney();
    changeScene('intro', false);
    album.reset();
    schedule(() => { changeScene('wish', false);schedule(() => { $('specialAction').hidden = false; }, 1800); }, 3000);
  }
  $('openSpecial').addEventListener('click', () => {
    if (scene !== 'wish') return;
    changeScene('letter');
    schedule(() => {
      if (scene !== 'letter') return;
      $('openingEnvelope').hidden = true;
      $('openingCaption').hidden = true;
      $('letterPaper').hidden = false;
      magic.refresh();
      if(romance)romance.celebrate('letter');
      $('letterScene').focus({ preventScroll: true });
    }, reducedMotion ? 100 : 1600);
  });
  $('receiveFlowers').addEventListener('click', () => {
    if (scene !== 'letter' || $('letterPaper').hidden) return;
    changeScene('final');
    letterGarden.start();
    schedule(() => { if (scene === 'final') burst(innerWidth / 2, Math.min(innerHeight / 2, 420), 28); }, reducedMotion ? 100 : 650);
  });
  $('replay').addEventListener('click', returnToBeginning);
  $('smileButton').addEventListener('click', () => {if(letterGarden?.ready)surprises.openJourney();});

  // Nhạc bắt đầu từ nút mở quà, trực tiếp trong thao tác click của người nhận.
  const music = $('music');
  let userPaused = false, audioFailed = false, playRequest = null,audioEpoch=0;
  music.src = config.music;
  const defaultVolume = Number.isFinite(Number(config.volume)) ? Number(config.volume) : .55;
  let currentVolume = Math.max(0, Math.min(1, defaultVolume));
  try { const stored = localStorage.getItem('princess-gift-volume'); if (stored !== null && Number.isFinite(Number(stored))) currentVolume = Math.max(0, Math.min(1, Number(stored))); } catch {}
  music.volume = currentVolume;
  function updateAudioUI() {
    const playing = !music.paused;
    $('playPause').setAttribute('aria-label', playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
    $('playPause').setAttribute('aria-pressed', String(playing));
    $('playIcon').setAttribute('d', playing ? 'M6 5h4v14H6zM14 5h4v14h-4z' : 'M8 5v14l11-7z');
    $('musicState').textContent = audioFailed ? 'Chưa tải được bài nhạc' : playing ? 'Đang nghe cùng em' : userPaused ? 'Đang tạm dừng' : 'Chạm để nghe cùng anh nhó';
    const silent = music.muted || music.volume === 0;
    $('muteButton').setAttribute('aria-label', silent ? 'Bật tiếng' : 'Tắt tiếng');
    $('muteButton').setAttribute('aria-pressed', String(silent));
    $('soundWaves').setAttribute('d', silent ? 'M16 9l6 6m0-6-6 6' : 'M16 8q4 4 0 8m3-11q7 7 0 14');
    const amount = Math.round(music.volume * 100);
    $('volume').value = String(amount);
    $('volume').setAttribute('aria-valuetext', amount + '%');
    $('volumeValue').textContent = amount + '%';
  }
  function playMusic() {
    if (playRequest) return playRequest;
    const epoch=++audioEpoch;
    if (audioFailed) { audioFailed = false; music.load(); }
    let result;
    try { result = music.play(); } catch { $('audioFeedback').textContent = 'Em chạm nút phát nhạc để nghe cùng anh nhé.';updateAudioUI();return Promise.resolve(false); }
    playRequest = Promise.resolve(result).then(() => {
      if(epoch!==audioEpoch)return false;
      $('audioFeedback').textContent = ''; updateAudioUI(); return true;
    }).catch(error => {
      if(epoch!==audioEpoch)return false;
      if (error?.name !== 'AbortError') $('audioFeedback').textContent = 'Em chạm nút phát nhạc để nghe cùng anh nhé.';
      updateAudioUI(); return false;
    }).finally(() => { if(epoch===audioEpoch)playRequest = null; });
    return playRequest;
  }
  $('playPause').addEventListener('click', () => {
    if (music.paused) { userPaused = false; playMusic(); }
    else { userPaused = true; music.pause(); }
    updateAudioUI();
  });
  $('muteButton').addEventListener('click', () => {
    if (music.volume === 0) { music.volume = .4; music.muted = false; }
    else music.muted = !music.muted;
    updateAudioUI();
  });
  $('volume').addEventListener('input', event => {
    music.volume = Math.max(0, Math.min(1, Number(event.target.value) / 100));
    if (music.volume > 0) music.muted = false;
    try { localStorage.setItem('princess-gift-volume', String(music.volume)); } catch {}
    updateAudioUI();
  });
  music.addEventListener('play', updateAudioUI);
  music.addEventListener('pause', updateAudioUI);
  music.addEventListener('volumechange', updateAudioUI);
  music.addEventListener('error', () => { audioFailed = true; $('audioFeedback').textContent = 'Bài nhạc chưa tải được. Em vẫn có thể mở món quà nhé.'; updateAudioUI(); });
  updateAudioUI();
  function returnToBeginning(){
    if(restartBusy)return false;restartBusy=true;sceneTimers.forEach(clearTimeout);sceneTimers=[];
    if(welcome){clearTimeout(welcome.timer);welcome.timer=null;}
    if(letterGarden)letterGarden.reset();surprises.resetJourney();if(romance)romance.clear();
    ++audioEpoch;playRequest=null;music.pause();userPaused=false;try{music.currentTime=0;}catch{}updateAudioUI();
    scene='welcome';album.setVisible(false);document.body.dataset.restarting='true';
    restartTimer=setTimeout(()=>{
      restartTimer=null;changeScene('intro',false);album.reset();album.setVisible(false);scene='welcome';magic.setScene('welcome');welcome.reset();
      document.body.dataset.restarting='false';restartBusy=false;window.scrollTo({top:0,behavior:'instant'});$('startGift').focus({preventScroll:true});
    },reducedMotion?0:520);return true;
  }

  // Tim bay khi chạm, cánh hoa rơi nhẹ; tôn trọng cài đặt giảm chuyển động.
  function burst(x, y, count = 8) {
    if (reducedMotion) return;
    if (config.effectLevel === 'quiet') count = Math.ceil(count / 2);
    const layer = $('magicLayer');
    for (let i = 0; i < count; i++) {
      if (layer.children.length > 90) break;
      const heart = document.createElement('span');
      heart.className = 'magic-heart'; heart.textContent = i % 3 === 0 ? '✧' : '♡';
      heart.style.left = x + 'px'; heart.style.top = y + 'px';
      heart.style.fontSize = (12 + Math.random() * 12) + 'px';
      heart.style.setProperty('--dx', ((Math.random() - .5) * (count > 10 ? 440 : 170)) + 'px');
      heart.style.setProperty('--dy', (-60 - Math.random() * 190) + 'px');
      heart.style.setProperty('--rot', ((Math.random() - .5) * 90) + 'deg');
      layer.append(heart); setTimeout(() => heart.remove(), 1550);
    }
  }
  document.addEventListener('pointerdown', event => { if (scene!=='welcome'&&!event.target.closest('input,.music-player')) burst(event.clientX, event.clientY, 6); });
  const canvas = $('sky'), ctx = canvas.getContext('2d'), heartCtx = $('heartCanvas').getContext('2d');
  let width = innerWidth, height = innerHeight, particles = [], previousFrame = 0;
  function resizeSky() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const amount = Math.round((width < 720 ? 34 : 60) * (config.effectLevel === 'quiet' ? .6 : config.effectLevel === 'dreamy' ? 1.35 : 1));
    particles = Array.from({ length: amount }, (_, i) => ({ x: Math.random() * width, y: Math.random() * height, size: i % 6 === 0 ? Math.random() * 4 + 3 : Math.random() * 1.2 + .4, speed: Math.random() * .28 + .1, phase: Math.random() * Math.PI * 2, petal: i % 6 === 0 }));
  }
  const heartPoints = Array.from({ length: 2700 }, () => {
    const t = Math.random() * Math.PI * 2;
    const radius = Math.random() < .32 ? 1 : 1 - Math.min(.92, -.13 * Math.log(Math.max(Math.random(), .0001)));
    return { x: 16 * Math.sin(t) ** 3 * radius * 10.5, y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * radius * 10.5, size: Math.random() * 1.4 + .7, phase: Math.random() * 6.28 };
  });
  function drawFrame(now) {
    requestAnimationFrame(drawFrame);
    if (document.hidden || now - previousFrame < (reducedMotion ? 1000 : 40)) return;
    const delta = previousFrame ? Math.min((now - previousFrame) / 40, 3) : 1; previousFrame = now;
    const t = reducedMotion ? 0 : now / 1000;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!reducedMotion) p.y += p.speed * delta;
        if (p.y > height + 15) { p.y = -15; p.x = Math.random() * width; }
        ctx.save(); ctx.globalAlpha = p.petal ? .18 : .15 + .3 * (.5 + .5 * Math.sin(t * .6 + p.phase)); ctx.fillStyle = '#f3b2ca';
        ctx.translate(p.x + Math.sin(t * .5 + p.phase) * 12, p.y);
        ctx.rotate(t * .3 + p.phase); ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.petal ? p.size * .42 : p.size, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    }
    if (heartCtx && scene === 'wish' && !$('photoFallback').hidden) {
      heartCtx.clearRect(0, 0, 560, 620);
      const pulse = 1 + .035 * Math.sin(t * 3);
      heartCtx.fillStyle = '#f7a6c4';
      for (const p of heartPoints) { heartCtx.globalAlpha = .35 + .5 * (.5 + .5 * Math.sin(t * 1.6 + p.phase)); heartCtx.fillRect(280 + p.x * pulse, 235 + p.y * pulse, p.size, p.size); }
      heartCtx.globalAlpha = 1;
    }
  }
  resizeSky(); addEventListener('resize', resizeSky); requestAnimationFrame(drawFrame);
  letterGarden = new window.GiftLetterGarden(config,{reducedMotion,entries:surprises.entries,onRead:index=>surprises.openAt(index)});
  romance=new window.GiftRomance(config,reducedMotion);
  surprises.onProgress=state=>{letterGarden.sync(state);romance.setProgress(state);};surprises.progressUI();
  surprises.onMoment=kind=>romance.celebrate(kind);letterGarden.onBloom=()=>romance.celebrate('garden');
  if(document.fonts?.ready)document.fonts.ready.then(()=>magic.refresh());
  welcome = new window.GiftWelcome(config, {
    reducedMotion,
    onOpen: () => {
      userPaused = false;music.muted = false;
      if (music.volume === 0) music.volume = defaultVolume > 0 ? Math.min(1, defaultVolume) : .35;
      playMusic();
      romance.celebrate('opening');
    },
    onEnter: () => { beginStory();$('introScene').focus({preventScroll:true});magic.refresh(); }
  });
  surprises.onRestart=returnToBeginning;
  magic.setScene('welcome');
  if (query.get('preview') === 'invitation') {
    welcome.reveal();beginStory();
    sceneTimers.forEach(clearTimeout);sceneTimers=[];
    changeScene('final', false);surprises.openInvitation(true);
  }
})();
