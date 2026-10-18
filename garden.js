/* 12 bông hoa theo đúng thứ tự lá thư. Ảnh đồng hành luôn được giữ nguyên. */
(() => {
  'use strict';
  const normalize=value=>String(value??'').normalize('NFC');
  const illustrations=[
    {src:'./assets/dream-heart.svg',caption:'Một chút dịu dàng, gửi riêng cho em.'},
    {src:'./assets/moon-garden.svg',caption:'Mong em luôn có một góc bình yên.'},
    {src:'./assets/pink-garden.svg',caption:'Mong những ngày của em đều nở hoa.'}
  ];
  window.GIFT_GARDEN_PHOTOS=config=>{
    const source=Array.isArray(config.photos)&&config.photos.length?config.photos:config.photo?[{src:config.photo,caption:config.photoCaption,position:config.photoPosition}]:[];
    const photos=source.slice(0,12).map(item=>typeof item==='string'?{src:item}:item).map((item,i)=>item&&typeof item.src==='string'&&item.src.trim()?{src:item.src,caption:normalize(item.caption||config.photoCaption||'Một bông hoa, một khoảnh khắc thật xinh của em.'),position:/^\d{1,3}%\s+\d{1,3}%$/.test(item.position||'')?item.position:'50% 50%'}:{...illustrations[i%illustrations.length],position:'50% 50%',illustration:true});
    return Array.from({length:12},(_,i)=>photos[i]||{...illustrations[i%illustrations.length],position:'50% 50%',illustration:true});
  };
  window.GIFT_INVITATION_PHOTO=config=>({src:typeof config.invitationPhoto==='string'?config.invitationPhoto:'',caption:normalize(config.invitationPhotoCaption||'Một khoảnh khắc anh muốn giữ riêng cho lời hẹn này.'),position:/^\d{1,3}%\s+\d{1,3}%$/.test(config.invitationPhotoPosition||'')?config.invitationPhotoPosition:'50% 50%'});
  function flowerArt(index){
    const colors=[['#f6c7d7','#ce8eaf'],['#e7d1f1','#b49acb'],['#f8dac9','#d7a0a3'],['#f7d6de','#ce9cb4']][index%4];
    const prefix='garden-flower-'+index;
    return '<svg class="flower-drawing" viewBox="0 0 180 260" aria-hidden="true"><defs><linearGradient id="'+prefix+'" x2=".7" y2="1"><stop stop-color="'+colors[0]+'"/><stop offset="1" stop-color="'+colors[1]+'"/></linearGradient></defs><ellipse cx="90" cy="253" rx="35" ry="5" fill="#97a48d20"/><g class="flower-stem"><path d="M90 253Q83 179 90 78" fill="none" stroke="#91ac92" stroke-width="3.5" stroke-linecap="round"/><path d="M90 228Q89 181 90 158" fill="none" stroke="#c0cfaa50" stroke-width="1"/></g><g class="flower-leaf leaf-left"><path d="M89 207Q31 195 36 145Q79 158 89 207Z" fill="#829c83"/><path d="M88 204L45 157" fill="none" stroke="#bdc9a755" stroke-width="1"/></g><g class="flower-leaf leaf-right"><path d="M89 171Q139 163 145 116Q106 123 89 171Z" fill="#a4b59c"/><path d="M91 169L135 128" fill="none" stroke="#d4dbb855" stroke-width="1"/></g><g transform="translate(90 78)"><g class="flower-petals">'+Array.from({length:8},(_,i)=>'<path d="M0 6C-35-9-38-51-17-62C4-77 35-50 29-25Q21-5 0 6Z" fill="url(#'+prefix+')" stroke="#ffeef150" stroke-width=".8" transform="rotate('+(i*45)+')"/>').join('')+'<circle r="45" fill="#fae8d6"/></g><g class="flower-bud"><path class="flower-bud-shell" d="M0 23C-34 6-27-31-18-41C-8-32-4-34 0-43C4-34 8-32 18-41C27-31 34 6 0 23Z" fill="url(#'+prefix+')" stroke="#fce6ec77"/><path class="flower-bud-shell" d="M0 17Q-9-5-7-34M0 17Q9-5 7-34" fill="none" stroke="#fff1ee66"/><path d="M-17 13L0 31L17 13L5 19L0 9L-5 19Z" fill="#93aa8b"/></g></g></svg>';
  }
  window.GiftLetterGarden=class {
    constructor(config,{reducedMotion=false,entries=[],onRead=()=>{}}={}){
      this.$=id=>document.getElementById(id);this.reduced=reducedMotion;this.letters=entries;this.onRead=onRead;this.photos=window.GIFT_GARDEN_PHOTOS(config);this.invitationPhoto=window.GIFT_INVITATION_PHOTO(config);this.scene=this.$('letterGardenPanel');this.photoDialog=this.$('gardenPhotoDialog');this.photoCleaned=true;this.timers=[];this.flowers=[];this.state={index:0,completed:new Set(),complete:false};this.started=false;this.ready=false;this.mount();this.previewSource='album';
      this.$('closeGardenPhoto').addEventListener('click',()=>this.closePhoto());this.$('previousGardenPhoto').addEventListener('click',()=>this.showPhoto(this.previewIndex-1,this.previewSource));this.$('nextGardenPhoto').addEventListener('click',()=>this.showPhoto(this.previewIndex+1,this.previewSource));
      this.$('journeyPhoto').addEventListener('click',()=>this.showPhoto(this.state.index));
      this.$('invitationPhotoButton').addEventListener('click',()=>this.showPhoto(0,'invitation'));
      this.$('invitationPhotoCaption').textContent=this.invitationPhoto.caption;this.$('invitationPhotoButton').disabled=!this.invitationPhoto.src;
      this.$('invitationPhotoImage').hidden=!this.invitationPhoto.src;this.$('invitationPhotoPlaceholder').hidden=!!this.invitationPhoto.src;
      if(this.invitationPhoto.src){this.$('invitationPhotoImage').src=this.invitationPhoto.src;this.$('invitationPhotoImage').alt=this.invitationPhoto.caption;this.$('invitationPhotoImage').style.objectPosition=this.invitationPhoto.position;}
      this.$('invitationPhotoImage').addEventListener('error',()=>{this.$('invitationPhotoImage').hidden=true;this.$('invitationPhotoPlaceholder').hidden=false;});
      this.photoDialog.addEventListener('close',()=>{if(!this.photoDialog.open)this.cleanupPhoto();});
      this.photoDialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();this.showPhoto(this.previewIndex+(event.key==='ArrowRight'?1:-1),this.previewSource);}});
      this.$('gardenPhotoFull').addEventListener('error',()=>{this.$('gardenPhotoFull').hidden=true;this.$('gardenPhotoError').hidden=false;});this.$('gardenPhotoFull').addEventListener('load',()=>{this.$('gardenPhotoFull').hidden=false;this.$('gardenPhotoError').hidden=true;});
      this.sync(this.state);
    }
    later(fn,ms){const id=setTimeout(fn,ms);this.timers.push(id);return id;}
    mount(){
      this.$('gardenGrid').replaceChildren();
      for(let i=0;i<12;i++){
        const figure=document.createElement('figure');figure.className='garden-flower';figure.dataset.phase='bud';figure.style.setProperty('--flower-i',i);
        const frame=document.createElement('div');frame.className='flower-frame';frame.innerHTML=flowerArt(i);
        const button=document.createElement('button');button.type='button';button.className='flower-photo-button flower-letter-button';button.disabled=true;button.setAttribute('aria-haspopup','dialog');button.innerHTML='<svg viewBox="0 0 70 70" aria-hidden="true"><rect x="10" y="20" width="50" height="34" rx="4" fill="#e6b2c6"/><path d="M11 22L35 40L59 22" fill="#f2cfda" stroke="#c78da8" stroke-width="1"/><path d="M12 52L27 37M58 52L43 37" stroke="#bc7f9c" stroke-width="1"/><path d="M35 37C27 30 22 39 35 47C48 39 43 30 35 37Z" fill="#ad6488"/></svg>';
        const badge=document.createElement('span');badge.className='garden-letter-number';badge.textContent=String(i+1).padStart(2,'0');button.append(badge);button.addEventListener('click',()=>{if(this.ready&&i<=this.maxReadable())this.onRead(i);});frame.append(button);
        const caption=document.createElement('figcaption'),number=document.createElement('b'),words=document.createElement('span');number.textContent='THƯ '+String(i+1).padStart(2,'0');words.textContent=this.letters[i]?.note.title||'Một lời nhắn anh để dành cho em.';caption.append(number,words);figure.append(frame,caption);this.$('gardenGrid').append(figure);this.flowers.push({figure,button});
      }
    }
    maxReadable(){return Math.min(this.state.completed.size,11);}
    sync(state){
      this.state=state;const max=this.maxReadable();
      this.flowers.forEach((flower,i)=>{const read=state.completed.has(this.letters[i]?.note.id);flower.button.disabled=!this.ready||i>max;flower.figure.dataset.read=String(read);flower.figure.dataset.current=String(i===max&&!state.complete);flower.button.setAttribute('aria-label','Lá thư '+(i+1)+': '+(this.letters[i]?.note.title||'Lời nhắn dành cho em')+(i>max?' — đọc các thư trước để mở':' — chạm để đọc'));});
      this.$('smileButton').disabled=!this.ready;
      this.$('journeyPhoto').hidden=state.mode==='invitation';this.$('invitationPhotoCard').hidden=state.mode!=='invitation';
      const photo=this.photos[Math.max(0,Math.min(11,state.index))];this.$('journeyPhotoImage').src=photo.src;this.$('journeyPhotoImage').alt=photo.caption;this.$('journeyPhotoImage').style.objectPosition=photo.position;this.$('journeyPhotoNumber').textContent='Ảnh '+String(state.index+1).padStart(2,'0')+' · chạm để ngắm ảnh gốc';
      if(this.ready)this.$('gardenNote').textContent=state.complete?'Mười hai lá thư đã khép lại, nhưng những điều anh muốn dành cho em vẫn còn ở phía trước. Anh giữ những bông hoa ở đây, còn lời hẹn của hai đứa mình thì anh đợi được nói cùng em ngoài đời.':'Mỗi bông hoa đang giữ 01 lá thư. Mỗi một lá thư là một lời tâm tư lòng anh á; em đọc hết nhé.';
    }
    start(){
      if(this.started)return false;this.started=true;this.scene.dataset.phase='blooming';
      this.flowers.forEach((flower,i)=>{const start=this.reduced?i*35:120+i*470;this.later(()=>{flower.figure.dataset.phase='growing';},start);this.later(()=>{flower.figure.dataset.phase='blooming';},start+(this.reduced?0:850));this.later(()=>{flower.figure.dataset.phase='bloomed';this.$('gardenCount').textContent='Đã nở '+(i+1)+' / 12 bông hoa';if(i===11){this.ready=true;this.scene.dataset.phase='bloomed';this.sync(this.state);if(this.onBloom)this.onBloom();}},start+(this.reduced?0:1400));});return true;
    }
    reset(){this.closePhoto();this.timers.forEach(clearTimeout);this.timers=[];this.started=false;this.ready=false;this.scene.dataset.phase='waiting';this.flowers.forEach(f=>{f.figure.dataset.phase='bud';f.button.disabled=true;});this.$('gardenCount').textContent='12 nụ hoa đang đợi em…';}
    showPhoto(index,source='album'){
      const items=source==='invitation'?(this.invitationPhoto.src?[this.invitationPhoto]:[]):this.photos;
      if(index<0||index>=items.length)return false;this.previewIndex=index;this.previewSource=source;const photo=items[index];this.$('gardenPhotoFull').hidden=false;this.$('gardenPhotoError').hidden=true;this.$('gardenPhotoFull').src=photo.src;this.$('gardenPhotoFull').alt=photo.caption;this.$('gardenPhotoCaption').textContent=photo.caption;this.$('gardenPhotoTitle').textContent=source==='invitation'?'Một tấm ảnh anh để dành cho lời hẹn này':'Tấm ảnh thứ '+String(index+1).padStart(2,'0')+' trong món quà';this.$('gardenPhotoCount').textContent=source==='invitation'?'Ảnh riêng của thiệp mời':(index+1)+' / 12';
      this.$('previousGardenPhoto').hidden=source==='invitation';this.$('nextGardenPhoto').hidden=source==='invitation';this.$('previousGardenPhoto').disabled=index===0;this.$('nextGardenPhoto').disabled=index===items.length-1;
      if(!this.photoDialog.open){this.photoReturn=document.activeElement||this.$(source==='invitation'?'invitationPhotoButton':'journeyPhoto');this.photoOverflow=document.body.style.overflow;this.photoCleaned=false;this.photoDialog.showModal();document.body.style.overflow='hidden';}return true;
    }
    closePhoto(){if(this.photoDialog.open){this.photoDialog.close();this.cleanupPhoto();}}
    cleanupPhoto(){if(this.photoCleaned)return;this.photoCleaned=true;document.body.style.overflow=this.photoOverflow;if(this.photoReturn)this.photoReturn.focus({preventScroll:true});}
  };

})();
