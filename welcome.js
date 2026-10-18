/* Màn chào chỉ bắt đầu khi người nhận chủ động mở quà. */
(() => {
  'use strict';
  window.GIFT_WELCOME_DEFAULTS = Object.freeze({
    welcomeTitle:'Anh đã để dành',
    welcomeHighlight:'một điều cho em.',
    welcomeMessage:'Không biết hôm nay của em thế nào. Nhưng anh mong, từ khoảnh khắc này, ngày của em sẽ có thêm một lý do thật nhỏ để mỉm cười. Có một món quà anh đã chuẩn bị, và người anh muốn gửi đến chính là em.',
    welcomeButton:'Mở món quà của anh nhé'
  });
  window.GiftWelcome = class {
    constructor(config,{reducedMotion=false,onOpen=()=>{},onEnter=()=>{}}={}) {
      this.$=id=>document.getElementById(id);this.started=false;this.reduced=reducedMotion;this.onOpen=onOpen;this.onEnter=onEnter;
      this.scene=this.$('welcomeScene');this.button=this.$('startGift');
      for(const [key,id] of [['welcomeTitle','welcomeHeading'],['welcomeHighlight','welcomeHighlight'],['welcomeMessage','welcomeMessage'],['welcomeButton','welcomeButtonText']]) {
        const value=typeof config[key]==='string'&&config[key].trim()?config[key]:window.GIFT_WELCOME_DEFAULTS[key];
        this.$(id).textContent=value.normalize('NFC');
      }
      this.$('welcomeRecipient').textContent=String(config.to||'cô gái đáng yêu').normalize('NFC');
      this.$('welcomeSender').textContent=String(!config.from||config.from==='Đức'?'Minh Đức':config.from).normalize('NFC');
      this.originalLabel=this.$('welcomeButtonText').textContent;this.timer=null;
      this.scene.hidden=false;this.$('giftPage').hidden=true;document.body.dataset.giftStage='welcome';
      this.button.addEventListener('click',()=>this.open());
    }
    open() {
      if(this.started)return false;this.started=true;this.button.disabled=true;
      this.scene.dataset.phase='opening';document.body.dataset.giftStage='opening';
      this.$('welcomeButtonText').textContent='Đang mở một chút thương…';
      this.$('welcomeStatus').textContent='Món quà đang mở. Mình nghe nhạc cùng nhau nhé.';
      // Gọi đồng bộ trong click để trình duyệt nhận thao tác phát nhạc của người xem.
      this.onOpen();
      this.timer=setTimeout(()=>{this.timer=null;this.reveal();this.onEnter();},this.reduced?0:1000);
      return true;
    }
    reveal() {
      this.started=true;this.button.disabled=true;this.scene.hidden=true;
      this.$('giftPage').hidden=false;this.$('giftPage').dataset.entered='true';
      document.body.dataset.giftStage='story';
    }
    reset(){
      clearTimeout(this.timer);this.timer=null;this.started=false;this.button.disabled=false;this.scene.dataset.phase='waiting';this.scene.hidden=false;
      this.$('welcomeButtonText').textContent=this.originalLabel;this.$('welcomeStatus').textContent='';this.$('giftPage').hidden=true;this.$('giftPage').dataset.entered='false';document.body.dataset.giftStage='welcome';
    }
  };
})();
