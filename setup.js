(() => {
  'use strict';
  const $ = id => document.getElementById(id), form = $('setupForm'), config = { ...window.GIFT_CONFIG };
  if(!config.from||config.from==='Đức')config.from='Minh Đức';
  if(!config.musicTitle||config.musicTitle==='Giải cứu thế giới')config.musicTitle='Tâm tư của anh';
  const textKeys = ['to', 'from', 'eyebrow', 'title', 'message', 'photoCaption', 'letterTitle', 'letter', 'closing', 'musicTitle'];
  for (const name of textKeys) form.elements.namedItem(name).value = config[name] || '';
  const welcomeKeys=['welcomeTitle','welcomeHighlight','welcomeMessage','welcomeButton'];
  for(const name of welcomeKeys)form.elements.namedItem(name).value=typeof config[name]==='string'&&config[name].trim()?config[name]:window.GIFT_WELCOME_DEFAULTS[name];
  const partyKeys=['partyTitle','partyMessage','partyTime','partyPlace','partyDress'];
  for(const name of partyKeys)form.elements.namedItem(name).value=typeof config[name]==='string'&&(config[name].trim()||!['partyTitle','partyMessage'].includes(name))?config[name]:window.GIFT_PARTY_DEFAULTS[name];
  const invitationSettings=window.GIFT_INVITATION_PHOTO(config);
  form.elements.namedItem('invitationPhotoCaption').value=invitationSettings.caption;form.elements.namedItem('invitationPhotoPosition').value=invitationSettings.position;
  $('partyReadDelay').value=Math.max(.6,Math.min(3,Number(config.invitationTransitionSeconds)||window.GIFT_PARTY_DEFAULTS.invitationTransitionSeconds));
  for (const [key, allowed, fallback] of [['theme', ['rose','lavender','peach'], 'rose'], ['effectLevel', ['quiet','balanced','dreamy'], 'balanced'], ['transition', ['dissolve','drift','dreamy'], 'dreamy']]) form.elements.namedItem(key).value = allowed.includes(config[key]) ? config[key] : fallback;
  $('setupVolume').value = Math.round(Math.max(0, Math.min(1, Number.isFinite(Number(config.volume)) ? Number(config.volume) : .55)) * 100);
  $('slideshowSpeed').value = Math.max(3, Math.min(12, Number(config.slideshowSeconds) || 5.8));
  const normalize = value => String(value ?? '').normalize('NFC');
  const initial = Array.isArray(config.photos) && config.photos.length ? config.photos : config.photo ? [{ src: config.photo, caption: config.photoCaption, position: config.photoPosition }] : [];
  let photos = initial.slice(0,12).filter(item => typeof item === 'string' || (item && typeof item.src === 'string')).map(item => typeof item === 'string' ? { src:item, caption:config.photoCaption || '', position:'50% 50%' } : { src:item.src, caption:item.caption || config.photoCaption || '', position:item.position || '50% 50%' });
  let busy = false, readingInvitation=false,invitationPhoto=invitationSettings.src,previewTimer = null, previewIndex = -1, previewVersion = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bytes = source => source.startsWith('data:') ? Math.ceil(source.length * .75) : 0;
  const totalBytes = () => photos.reduce((total,p) => total + bytes(p.src), 0);
  const defaultCaption = () => form.elements.namedItem('photoCaption').value;
  function status(message, error = false) { $('photoStatus').textContent = message; $('photoStatus').classList.toggle('error', error); }
  function previewPhotos() {
    if (photos.length && !$('useIllustrations').checked) return photos;
    return [{src:'./assets/dream-heart.svg',caption:defaultCaption(),position:'50% 50%'},{src:'./assets/moon-garden.svg',caption:'Một chút bình yên, gửi riêng cho em.',position:'50% 50%'},{src:'./assets/pink-garden.svg',caption:'Mong hôm nay của em thật ngọt ngào.',position:'50% 50%'}];
  }
  function showPreview(index = 0) {
    clearTimeout(previewTimer); previewTimer = null;
    const items = previewPhotos(), version = ++previewVersion;
    previewIndex = ((index % items.length) + items.length) % items.length;
    const photo = items[previewIndex], slide = document.createElement('div'), image = document.createElement('img');
    slide.className = 'studio-preview-slide'; image.alt = 'Ảnh xem trước của món quà'; image.style.objectPosition = photo.position;
    slide.append(image); $('studioPreview').append(slide);
    const ready = () => {
      if (version !== previewVersion) { slide.remove(); return; }
      for (const old of Array.from($('studioPreview').children)) if (old !== slide) { old.classList.remove('active'); setTimeout(() => old.remove(), 1100); }
      slide.classList.add('active'); $('studioCaption').textContent = photo.caption || defaultCaption();
    };
    image.addEventListener('load', ready);
    image.addEventListener('error', () => { if (version !== previewVersion) return; if (image.dataset.fallback === 'true') { slide.remove(); return; } image.dataset.fallback = 'true'; image.src = './assets/dream-heart.svg'; image.alt = 'Minh họa trái tim khi ảnh chưa tải được'; });
    image.src = photo.src;
    if (!reduced && !document.hidden && items.length > 1) previewTimer = setTimeout(() => showPreview(previewIndex + 1), Number($('slideshowSpeed').value) * 1000);
  }
  function themePreview() {
    document.body.dataset.theme = form.elements.namedItem('theme').value;
    document.body.dataset.effects = form.elements.namedItem('effectLevel').value;
    $('studioRecipient').textContent = 'Gửi ' + (form.elements.namedItem('to').value || 'cô gái đáng yêu');
    $('speedValue').textContent = Number($('slideshowSpeed').value).toFixed(1) + ' giây';
    $('setupVolumeValue').textContent = $('setupVolume').value + '%';
    $('partyReadValue').textContent=Number($('partyReadDelay').value).toFixed(1)+' giây';
    $('invitationPreviewCaption').textContent=form.elements.namedItem('invitationPhotoCaption').value;
    $('invitationPhotoPreview').style.objectPosition=form.elements.namedItem('invitationPhotoPosition').value;
  }
  function editField(card, title, type, value, callback) {
    const label = document.createElement('label'); label.textContent = title;
    const input = document.createElement(type === 'select' ? 'select' : 'input');
    if (type === 'select') for (const [value,text] of [['50% 50%','Chính giữa'],['50% 25%','Gần phía trên'],['50% 0%','Sát phía trên'],['50% 75%','Gần phía dưới']]) { const option = document.createElement('option'); option.value=value; option.textContent=text; input.append(option); }
    else { input.type='text'; input.maxLength=200; }
    input.value = value; input.disabled = busy;
    input.addEventListener(type === 'select' ? 'change' : 'input', () => callback(input.value)); label.append(input); card.append(label); return input;
  }
  function renderEditor() {
    $('photoEditor').replaceChildren();$('gardenMappingStatus').textContent=photos.length+' / 12 ảnh trong album và những lá thư. '+(photos.length<12?'Khung ảnh còn thiếu dùng tranh minh họa có sẵn.':'Đủ 12 ảnh: tất cả ảnh được giữ lại theo đúng thứ tự đang hiển thị.'); $('photoTotal').textContent = photos.length ? photos.length + ' ảnh · ' + (totalBytes()/1024/1024).toFixed(1) + ' MB' : 'Chưa có ảnh — đang xem tranh minh họa';
    $('clearPhotos').disabled = busy || !photos.length; $('saveConfig').disabled = busy||readingInvitation;
    $('invitationPhotoFile').disabled=busy||readingInvitation;$('removeInvitationPhoto').disabled=!invitationPhoto||busy||readingInvitation;
    photos.forEach((photo,index) => {
      const card = document.createElement('div'); card.className='editor-card';
      const preview=document.createElement('div'); preview.className='editor-card-preview'; preview.dataset.number=String(index+1).padStart(2,'0');
      const image=document.createElement('img'); image.loading='lazy'; image.src=photo.src; image.alt='Ảnh '+(index+1); image.style.objectPosition=photo.position;
      image.addEventListener('error',()=>{image.hidden=true;preview.classList.add('is-error');}); preview.append(image);card.append(preview);
      editField(card,'Một lời nhắn dưới ảnh','text',photo.caption,value=>{photo.caption=value; if(previewIndex===index)$('studioCaption').textContent=value||defaultCaption();});
      editField(card,'Vị trí khuôn mặt','select',photo.position,value=>{photo.position=value;image.style.objectPosition=value;if(previewIndex===index)showPreview(index);});
      const actions=document.createElement('div');actions.className='editor-actions';
      const button=(label,text,fn,disabled=false)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);b.disabled=busy||disabled;b.addEventListener('click',fn);actions.append(b);return b;};
      button('Đưa ảnh '+(index+1)+' lên trước','↑',()=>{[photos[index-1],photos[index]]=[photos[index],photos[index-1]];renderEditor();showPreview(index-1);},index===0);
      button('Đưa ảnh '+(index+1)+' ra sau','↓',()=>{[photos[index+1],photos[index]]=[photos[index],photos[index+1]];renderEditor();showPreview(index+1);},index===photos.length-1);
      button('Xóa ảnh '+(index+1),'×',()=>{photos.splice(index,1);renderEditor();showPreview(Math.min(index,photos.length-1));}).className='delete-photo';
      card.append(actions);$('photoEditor').append(card);
    });
  }
  function readFile(file) { return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=reject;reader.readAsDataURL(file);}); }
  async function addPhotos(files) {
    if (busy || readingInvitation || !files?.length) return;
    busy=true;renderEditor();$('photoFiles').disabled=true;
    let added=0, rejected=0;
    for (const file of Array.from(files)) {
      if (photos.length>=12 || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size>8*1024*1024 || totalBytes()+file.size>24*1024*1024) {rejected++;continue;}
      status('Đang đọc ảnh '+(added+1)+'…');
      try { const source=await readFile(file);photos.push({src:source,caption:defaultCaption(),position:'50% 50%'});added++; } catch {rejected++;}
    }
    busy=false;$('photoFiles').disabled=false;$('photoFiles').value='';
    if(added)$('useIllustrations').checked=false;
    renderEditor();showPreview(0);status('Đã thêm '+added+' ảnh.'+(rejected?' '+rejected+' tệp chưa được thêm vì định dạng, dung lượng hoặc giới hạn 12 ảnh.':''),!added&&rejected>0);
  }
  $('photoFiles').addEventListener('change',event=>addPhotos(event.target.files));
  function renderInvitationPhoto(){
    const image=$('invitationPhotoPreview');image.hidden=!invitationPhoto;$('invitationPreviewPlaceholder').hidden=!!invitationPhoto;if(invitationPhoto&&image.src!==invitationPhoto)image.src=invitationPhoto;
    $('removeInvitationPhoto').disabled=!invitationPhoto||readingInvitation||busy;$('invitationPreviewCaption').textContent=form.elements.namedItem('invitationPhotoCaption').value;image.style.objectPosition=form.elements.namedItem('invitationPhotoPosition').value;
  }
  $('invitationPhotoPreview').addEventListener('error',()=>{$('invitationPhotoPreview').hidden=true;$('invitationPreviewPlaceholder').hidden=false;$('invitationPhotoStatus').textContent='Ảnh này chưa xem trước được. Dữ liệu ảnh vẫn được giữ; bạn có thể chọn lại tệp khác.';});
  $('invitationPhotoFile').addEventListener('change',async event=>{
    const file=event.target.files?.[0];if(!file||busy||readingInvitation)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024){$('invitationPhotoStatus').textContent='Chọn một ảnh JPG, PNG hoặc WEBP không quá 8 MB nhé.';event.target.value='';return;}
    readingInvitation=true;$('saveConfig').disabled=true;$('photoFiles').disabled=true;$('invitationPhotoFile').disabled=true;$('invitationPhotoStatus').textContent='Đang chuẩn bị ảnh riêng cho thiệp mời…';
    try{invitationPhoto=await readFile(file);$('invitationPhotoStatus').textContent='Đã giữ ảnh riêng cho thiệp mời. Album 12 ảnh vẫn được giữ nguyên.';}catch{$('invitationPhotoStatus').textContent='Chưa đọc được tệp ảnh. Bạn chọn lại một lần nữa nhé.';}
    readingInvitation=false;$('photoFiles').disabled=false;$('invitationPhotoFile').disabled=false;$('invitationPhotoFile').value='';renderInvitationPhoto();renderEditor();
  });
  $('removeInvitationPhoto').addEventListener('click',()=>{if(busy||readingInvitation)return;invitationPhoto='';renderInvitationPhoto();$('invitationPhotoStatus').textContent='Đã bỏ ảnh riêng của thiệp mời. Album vẫn được giữ nguyên.';});
  const drop=$('photoDrop');for(const type of ['dragenter','dragover'])drop.addEventListener(type,event=>{event.preventDefault();drop.classList.add('dragging');});
  for(const type of ['dragleave','drop'])drop.addEventListener(type,event=>{event.preventDefault();drop.classList.remove('dragging');if(type==='drop')addPhotos(event.dataTransfer.files);});
  $('clearPhotos').addEventListener('click',()=>{if(busy)return;photos=[];renderEditor();showPreview(0);status('Album đã xóa. Bạn có thể chọn những tấm ảnh mới.');});
  $('useIllustrations').addEventListener('change',()=>showPreview(0));
  form.addEventListener('input',themePreview);form.addEventListener('change',themePreview);
  $('slideshowSpeed').addEventListener('input',()=>{themePreview();showPreview(Math.max(0,previewIndex));});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(previewTimer);previewTimer=null;}else showPreview(Math.max(0,previewIndex));});
  form.addEventListener('submit',event=>{
    event.preventDefault();if(busy||readingInvitation)return;
    const result={...config};
    for(const key of textKeys)result[key]=normalize(form.elements.namedItem(key).value);
    for(const key of welcomeKeys)result[key]=normalize(form.elements.namedItem(key).value);
    for(const key of partyKeys)result[key]=normalize(form.elements.namedItem(key).value);
    result.invitationPhoto=invitationPhoto;result.invitationPhotoCaption=normalize(form.elements.namedItem('invitationPhotoCaption').value);result.invitationPhotoPosition=form.elements.namedItem('invitationPhotoPosition').value;
    result.invitationTransitionSeconds=Number($('partyReadDelay').value);delete result.invitationReadSeconds;
    for(const key of ['theme','effectLevel','transition'])result[key]=form.elements.namedItem(key).value;
    result.photos=$('useIllustrations').checked?[]:photos.map(p=>({src:p.src,caption:normalize(p.caption),position:p.position}));
    result.photo='';result.photoPosition='50% 50%';result.volume=Number($('setupVolume').value)/100;result.slideshowSeconds=Number($('slideshowSpeed').value);result.music=config.music||'./music.mp3';
    const source='// Món quà, album ảnh và lời nhắn đã cá nhân hóa.\nwindow.GIFT_CONFIG = '+JSON.stringify(result,null,2)+';\n';
    const url=URL.createObjectURL(new Blob([source],{type:'text/javascript;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='config.js';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
    $('setupResult').textContent='Đã tạo config.js với '+result.photos.length+' ảnh. Thay file cũ rồi mở lại index.html để xem đầy đủ nhé.';
  });
  renderEditor();themePreview();renderInvitationPhoto();showPreview(0);
})();
