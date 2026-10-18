/* Mỗi lần mở là một cảnh riêng: hoạt ảnh, nhịp xuất hiện và một lá nhắn dài. */
(() => {
  'use strict';
  window.GIFT_PARTY_DEFAULTS = Object.freeze({
    partyTitle:'Thư mời đến một buổi tiệc nhỏ',
    partyMessage:'Đến đây, em đã mở hết những điều nhỏ xinh anh giấu trong món quà này. Anh còn để dành một điều đặc biệt cho cuộc gặp của hai đứa mình.\n\nEm ra ngoài một chút nhé. Ở đó đang có một chàng trai chờ em, mang theo món quà đặc biệt và sự háo hức muốn nhìn thấy em mỉm cười khi nhận nó.\n\nAnh đã chuẩn bị một buổi tiệc nhỏ thật đáng yêu dành cho em. Mọi thứ đã sẵn sàng, còn phần dễ thương nhất thì anh đang đợi: sự xuất hiện của cô công chúa đang đọc lá thư này.\n\nEm cứ thong thả chuẩn bị, mang theo một tâm trạng thật thoải mái rồi gặp anh nhé. Anh chờ để được trực tiếp chúc em những điều ngọt ngào nhất và cùng em tận hưởng buổi tiệc anh đã chuẩn bị.',
    partyTime:'', partyPlace:'Ra ngoài gặp anh nhé', partyDress:'Mang theo nụ cười của em', invitationTransitionSeconds:1.6
  });
  const NOTES = [
    { id:'stars', kicker:'MỘT KHOẢNG TRỜI NHỎ', title:'Anh gửi em một bầu trời đầy những điều đẹp đẽ.', note:'Có một ngôi sao vừa được thắp lên vì em.', paragraphs:[
      'Nếu có thể gói một bầu trời vào lòng bàn tay, anh sẽ chọn những ngôi sao sáng nhất để gửi em. Mỗi ngôi sao sẽ giữ hộ một điều ước: em luôn bình an, được yêu quý và đủ tự tin để đi về phía những điều mình thích.',
      'Sẽ có những ngày mọi thứ chưa đúng như em mong đợi. Khi ấy, em cứ chậm lại một chút, hít một hơi thật sâu và nhớ rằng những cố gắng âm thầm của mình vẫn có ý nghĩa. Một ngày chưa trọn vẹn cũng xứng đáng được khép lại bằng sự dịu dàng.',
      'Còn ngôi sao bé nhất ở góc kia, anh xin giữ một điều ước riêng: mong anh có thêm nhiều cơ hội khiến em thấy vui. Từng chút một, bằng những điều thật lòng. ✨'
    ]},
    { id:'hug', kicker:'MỘT CÁI ÔM THẬT ÊM', title:'Cho em mượn một chút dịu dàng, khi cần nhé.', note:'Thỏ đã ôm hộ anh một trái tim mềm xíu.', paragraphs:[
      'Nếu hôm nay em hơi mệt, cứ coi chú thỏ nhỏ này là một cái ôm được gửi từ xa. Em có thể ngồi yên một lát, uống chút nước, thả lỏng vai và cho mình được nghỉ. Những việc còn dang dở, mình sẽ lần lượt lo tiếp sau.',
      'Anh mong em được thoải mái là chính mình: vui thì cười thật tươi, buồn thì có người nghe em kể, mệt thì có một nơi để em được dựa vào bằng sự tin tưởng. Em cũng có thể có những ngày chỉ muốn im lặng, và sự im lặng ấy vẫn xứng đáng được thấu hiểu.',
      'Anh gửi kèm cái ôm này một lời nhắc nho nhỏ: chăm sóc cô gái đang đọc những dòng này giúp anh nhé. Anh quý nụ cười ấy, và cũng quý cả những lúc cô ấy cần được dỗ dành. ♡'
    ]},
    { id:'jar', kicker:'CHIẾC LỌ NHỮNG ĐIỀU TỐT LÀNH', title:'Anh để dành cho em những niềm vui rất nhỏ.', note:'Mở nắp ra rồi, những điều tốt lành đang bay đến em.', paragraphs:[
      'Trong chiếc lọ này có một buổi sáng thức dậy thật nhẹ lòng, một món ăn đúng lúc đang thèm, một cơn mưa đến khi em đã về nhà và một tin nhắn khiến em bất giác mỉm cười. Anh chọn toàn những điều nhỏ thôi, vì chúng đủ làm một ngày trở nên dễ chịu hơn nhiều.',
      'Có thêm cả một chút may mắn cho những việc em đang cố gắng, một chút kiên nhẫn khi chờ kết quả và một khoảng thời gian rảnh để em làm điều mình thích. Mong em vừa tiến về phía mong muốn của mình, vừa có thể tận hưởng những ngày đang đi qua.',
      'Điều cuối cùng anh vừa bỏ vào lọ là một lời nhắn: khi có chuyện vui, anh rất muốn được nghe em kể. Và những lúc cần một người lắng nghe, anh cũng sẵn lòng ở đó. 🌷'
    ]},
    { id:'moon', kicker:'CHO NHỮNG BUỔI TỐI THẬT ÊM', title:'Mong em có một góc bình yên để trở về.', note:'Trăng đã lên, những ồn ào có thể ở lại phía xa.', paragraphs:[
      'Anh gửi em một vầng trăng nhỏ và một mặt biển thật êm. Dành cho những buổi tối em đã lo xong việc, đặt điện thoại xuống một lát rồi cho mình được thở chậm. Mong căn phòng của em luôn có cảm giác dễ chịu, còn lòng em có một khoảng lặng thật an yên.',
      'Nếu hôm ấy có điều khiến em bận tâm, mong em nhớ mình đã đi qua rất nhiều việc bằng sự cố gắng của chính mình. Có những câu trả lời cần thêm thời gian. Em có thể nghỉ ngơi trước, rồi đón ngày mới với một chút năng lượng được gom lại.',
      'Và nếu được gửi thêm một lời chúc vào cuối ngày, anh sẽ chúc em ngủ ngon, mơ những giấc mơ đẹp và sáng mai thức dậy thấy cuộc sống đáng yêu hơn một chút. Có một người luôn mong em được bình an. 🌙'
    ]},
    { id:'music', kicker:'MỘT HỘP NHẠC NHO NHỎ', title:'Có những điều, anh gửi cùng một giai điệu.', note:'Hộp nhạc đang quay, còn lời nhắn này là dành cho em.', paragraphs:[
      'Anh thích ý nghĩ rằng khi em mở món quà này, sẽ có một bản nhạc ở bên những dòng chữ. Em cứ chọn âm lượng vừa đủ, để giai điệu đi chậm cùng mình và dành một khoảng thời gian nhỏ cho những điều dễ thương trước mắt.',
      'Anh muốn những lần trò chuyện với em cũng có cảm giác tự nhiên như thế: có thể kể một chuyện vụn vặt, hỏi nhau hôm nay thế nào, hoặc cùng cười vì một điều rất ngớ ngẩn. Từ những điều bình thường ấy, mình có thể hiểu thêm về nhau.',
      'Nếu sau này có một bài nhạc khiến em nhớ đến chiếc website nhỏ này, anh chắc sẽ vui lắm. Vì anh đã gửi vào đây sự quan tâm của mình, theo cách của một người thích làm ra điều gì đó dành riêng cho cô gái mình quý. ♫'
    ]},
    { id:'balloons', kicker:'MỘT CHUYẾN BAY CHO ĐIỀU ƯỚC', title:'Mong những điều em mong đợi sẽ tìm được đường đến.', note:'Những quả bóng đang mang theo vài lời chúc lên cao.', paragraphs:[
      'Anh buộc vào mỗi quả bóng một điều tốt đẹp: công việc thuận lợi hơn, sức khỏe thật tốt, những mối quan hệ ấm áp và những dự định em đang ấp ủ có cơ hội thành hình. Em cứ chọn thêm một điều ước của riêng mình, rồi gửi nó đi cùng những quả bóng này nhé.',
      'Trên đường đến những điều mình muốn, mong em có đủ can đảm để bắt đầu, đủ kiên nhẫn để đi tiếp và cả niềm vui khi nhìn lại những gì mình đã làm được. Mỗi bước nhỏ đều có thể đáng tự hào, nhất là những bước em đã tự mình cố gắng rất nhiều.',
      'Anh mong có một ngày được nghe em kể: điều em từng ước đã thành hiện thực rồi. Khi ấy, anh sẽ rất muốn cùng em ăn mừng, dù chỉ bằng một ly nước ngon và một câu chúc mừng thật vui. 🎈'
    ]},
    { id:'letter', kicker:'MỘT LỜI HẸN NHO NHỎ', title:'Anh để dành một buổi chiều dễ thương, nếu em muốn.', note:'Có một chiếc phong bì vừa mở ra một lời hẹn.', paragraphs:[
      'Anh nghĩ đến một buổi chiều rảnh, mình chọn một chỗ ngồi dễ chịu, gọi món em thích và kể nhau nghe vài chuyện trong ngày. Có thể là một quán nước yên tĩnh, một đoạn đường đi dạo hoặc một nơi em đã muốn ghé từ lâu.',
      'Anh muốn được biết thêm những điều rất đời thường về em: lúc vui em hay làm gì, món nào khiến em thấy dễ chịu hơn và một ngày lý tưởng của em sẽ trông ra sao. Được hiểu em qua những cuộc trò chuyện tự nhiên như thế là điều anh rất mong.',
      'Lời hẹn này cứ nằm ở đây như một tấm thiệp nhỏ. Khi nào em thấy thoải mái và có thời gian, mình có thể chọn một ngày thật đẹp. Còn bây giờ, anh hy vọng món quà này đã góp một chút vui vào ngày của em. 💌'
    ]},
    { id:'clover', kicker:'MỘT CHÚT MAY MẮN CHO EM', title:'Chúc em gặp những người tốt và những ngày thật xinh.', note:'Cỏ bốn lá vừa mở, anh gửi may mắn theo cùng.', paragraphs:[
      'Anh tặng em một chiếc cỏ bốn lá nhỏ. Một lá giữ sức khỏe, một lá giữ bình yên, một lá giữ niềm vui, còn chiếc lá cuối cùng dành cho những dự định em đang nâng niu. Mong em luôn có đủ những điều cần thiết để sống theo cách mình thấy hạnh phúc.',
      'Chúc em gặp người biết trân trọng sự chân thành, được ghi nhận những cố gắng và có nhiều dịp cười thật thoải mái. Những ngày bận rộn vẫn có bữa ăn ngon, những ngày chông chênh vẫn có một lời hỏi han đúng lúc và những ngày đẹp trời có người để cùng chia sẻ.',
      'Anh cũng xin nhận một chút may mắn cho mình: may mắn được biết em, được trò chuyện thêm với em và được tiếp tục làm những điều nho nhỏ khiến em thấy mình được quan tâm. 🍀'
    ]}
  ];
  const FLOWERS = [
    { id:'tulips', kicker:'MỘT BÓ TULIP ĐANG NỞ', title:'Một bó dịu dàng, gửi đến nụ cười của em.', note:'Từng cánh tulip vừa được mở cùng một chút chân thành.', paragraphs:[
      'Anh chọn tulip hồng cho lần mở quà này, vì nhìn chúng có cảm giác nhẹ nhàng và tươi tắn. Mong bó hoa nhỏ khiến em muốn dừng lại một chút, ngắm những cánh hoa và dành cho mình một nụ cười thật xinh.',
      'Anh gửi cùng hoa lời chúc em luôn được yêu quý bằng những điều tử tế, được tự tin với chính mình và có thật nhiều ngày bình yên. Dẫu hôm nay em đang vui hay hơi mệt, mong ở đây luôn có một chút dịu dàng dành sẵn cho em.',
      'Bó hoa được gói bằng những dòng code, còn sự quan tâm anh gửi vào đây thì rất thật. Hy vọng em nhận được cả hai. 🌷'
    ]},
    { id:'roses', kicker:'MỘT BÓ HỒNG VỪA HÉ CÁNH', title:'Có một chút thương đang nở cùng những bông hồng.', note:'Lần này, anh gói cho em những bông hồng phấn.', paragraphs:[
      'Những bông hồng này được mở ra chậm một chút, giống như cách anh muốn tìm hiểu em: lắng nghe nhiều hơn, để ý những điều em thích và dành thời gian cho những cuộc trò chuyện thật lòng.',
      'Anh mong sự quan tâm mình dành cho em sẽ đem lại cảm giác dễ chịu. Một lời hỏi han đúng lúc, một câu chuyện làm em bật cười hay một món quà nhỏ được chuẩn bị cẩn thận, từng điều ấy đều là cách anh muốn tiến lại gần em.',
      'Anh gửi bó hồng này cùng một lời rất đơn giản: anh vui vì được biết em, và anh muốn có thêm nhiều dịp làm em thấy vui. 🌹'
    ]},
    { id:'daisies', kicker:'MỘT BÓ CÚC ĐẦY NẮNG', title:'Anh gửi em một ngày có nắng ở trong lòng.', note:'Một chút vàng, một chút trắng, và rất nhiều niềm vui.', paragraphs:[
      'Bó cúc nhỏ này mang theo những điều trong trẻo: một buổi sáng có năng lượng, một ngày làm việc thuận lợi và một buổi tối được làm điều mình thích. Chúc em luôn tìm được niềm vui từ những điều rất gần quanh mình.',
      'Anh mong em được cười nhiều, được nghỉ ngơi đủ và có thêm những trải nghiệm khiến mình thấy cuộc sống thật đáng yêu. Có thể chỉ là một món ăn ngon, một nơi mới ghé hoặc một câu chuyện được kể với đúng người.',
      'Nếu những bông hoa này khiến em thấy vui hơn một chút, anh sẽ coi như mình vừa gửi thành công một chút nắng đến cô gái anh quý. 🌼'
    ]},
    { id:'lavender', kicker:'MỘT BÓ LAVENDER BÌNH YÊN', title:'Cho em một khoảng dịu lại giữa những ngày bận rộn.', note:'Lavender vừa nở, cùng một lời chúc thật êm.', paragraphs:[
      'Lần này anh chọn một bó lavender, gửi em cảm giác nhẹ nhàng của một khoảng thời gian được nghỉ. Mong những lúc bận rộn, em vẫn nhớ dành cho mình một bữa ăn tử tế, một giấc ngủ đủ và vài phút làm điều khiến bản thân thấy dễ chịu.',
      'Anh mong em có người lắng nghe khi muốn kể chuyện, có những cuộc gặp khiến mình thấy thoải mái và có một góc riêng để gom lại năng lượng. Em xứng đáng được chăm sóc bằng sự dịu dàng trong cả những ngày bình thường nhất.',
      'Anh để lời chúc này bên bó hoa: mong em luôn thấy lòng mình yên, và mong anh được góp một phần nhỏ vào những ngày đẹp của em. 💜'
    ]}
  ];
  const star = '<path d="M0-17L4-4L17 0L4 4L0 17L-4 4L-17 0L-4-4Z"/>';
  function bouquet(kind, prefix) {
    const positions=[[-83,144,-23],[-42,108,-12],[9,93,4],[58,117,17],[97,160,28],[-45,176,-13],[9,159,0],[59,184,14]];
    const flower=kind==='roses'?'<g fill="url(#'+prefix+'-petal)">'+Array.from({length:8},(_,i)=>'<ellipse rx="12" ry="23" cy="-9" transform="rotate('+(i*45)+')"/>').join('')+'<circle r="13" fill="#d581a4"/><path d="M-7 1Q-7-9 3-7T7 4Q0 12-7 1" stroke="#f6bdce" fill="none" stroke-width="2"/></g>':kind==='daisies'?'<g fill="#fff7dc">'+Array.from({length:10},(_,i)=>'<ellipse rx="5.5" ry="16" cy="-13" transform="rotate('+(i*36)+')"/>').join('')+'<circle r="9" fill="#e7b651"/><circle r="4" fill="#f5d780"/></g>':kind==='lavender'?'<g>'+Array.from({length:6},(_,i)=>'<ellipse cx="-5" cy="'+(-i*9)+'" rx="5" ry="8" fill="'+(i%2?'#b49bd0':'#d4b8e5')+'" transform="rotate(-20 -5 '+(-i*9)+')"/><ellipse cx="5" cy="'+(-i*9-4)+'" rx="5" ry="8" fill="#b497cc" transform="rotate(20 5 '+(-i*9-4)+')"/>').join('')+'</g>':'<path d="M0 9C-29 3-32-33-27-52C-13-44-7-48 0-56C7-48 13-44 27-52C32-33 29 3 0 9Z" fill="url(#'+prefix+'-petal)"/><path d="M0 5Q-12-21-10-46M0 5Q12-21 10-46" stroke="#ffe0e7" fill="none" opacity=".65"/>';
    return '<svg viewBox="0 0 440 420" class="surprise-bouquet-art" aria-hidden="true"><defs><linearGradient id="'+prefix+'-petal" x2="1" y2="1"><stop stop-color="'+(kind==='roses'?'#f8c4d1':'#ffb9d0')+'"/><stop offset="1" stop-color="#d382a6"/></linearGradient><linearGradient id="'+prefix+'-paper" x2="1" y2="1"><stop stop-color="#fbe9d7"/><stop offset="1" stop-color="#bf9d9c"/></linearGradient></defs><ellipse cx="220" cy="389" rx="93" ry="12" fill="#e5b6cd18"/>'+positions.map(([x,y,a],i)=>'<g class="growing-stem" style="--bloom-delay:'+(i*.08)+'s"><path d="M220 345Q'+(220+x*.45)+' 240 '+(220+x)+' '+y+'" stroke="#82a18c" stroke-width="4" fill="none"/></g>').join('')+'<g fill="#8fa48e"><path d="M208 300Q127 273 138 213Q191 231 208 300Z"/><path d="M234 290Q291 273 300 216Q247 239 234 290Z"/></g>'+positions.map(([x,y,a],i)=>'<g transform="translate('+(220+x)+' '+y+') rotate('+a+')"><g class="growing-flower" style="--bloom-delay:'+(i*.09+.35)+'s">'+flower+'</g></g>').join('')+'<g class="bouquet-paper"><path d="M116 228L220 357L324 228L280 374L220 391L160 374Z" fill="url(#'+prefix+'-paper)"/><path d="M116 228L220 391L184 285Z" fill="#fff0e2" opacity=".65"/><path d="M324 228L220 391L259 284Z" fill="#b89193" opacity=".4"/></g><g class="bouquet-bow"><path d="M187 335Q220 345 250 335" stroke="#c97e9e" stroke-width="9" fill="none"/><path d="M220 343C184 312 162 337 199 347C173 364 185 371 221 345C257 372 269 359 242 347C279 336 254 312 220 343Z" fill="#e3a0b9"/><path d="M218 347L206 383M224 347L239 383" stroke="#e3a0b9" stroke-width="7" stroke-linecap="round"/></g></svg>';
  }
  function artFor(id) {
    if(id==='stars')return '<div class="star-orbit orbit-one"></div><div class="star-orbit orbit-two"></div><svg class="constellation" viewBox="0 0 360 380"><path class="constellation-line" d="M52 223L109 116L199 171L275 70L312 246L199 171L165 294L52 223" fill="none" stroke="#f2d2ae" stroke-width="1.2"/>'+[[52,223],[109,116],[199,171],[275,70],[312,246],[165,294]].map(([x,y],i)=>'<g class="wish-star" transform="translate('+x+' '+y+')" style="--star-delay:'+(i*.18)+'s" fill="#f8deba">'+star+'</g>').join('')+'</svg><span class="shooting-star"></span>';
    if(id==='hug')return '<div class="hug-wave wave-one"></div><div class="hug-wave wave-two"></div><div class="hug-wave wave-three"></div><img class="hug-bunny" src="./assets/bunny-love.svg" alt=""><span class="hug-heart">♡</span>';
    if(id==='jar')return '<div class="wish-jar"><span class="jar-lid"></span><span class="jar-neck"></span><span class="jar-glass"></span><span class="jar-label">a little<br>happiness ♡</span>'+Array.from({length:12},(_,i)=>'<span class="jar-light" style="--i:'+i+'">'+(i%3?'✧':'♡')+'</span>').join('')+'</div>';
    if(id==='moon')return '<div class="dream-moon"></div><span class="moon-star s-one">✧</span><span class="moon-star s-two">✦</span><span class="moon-star s-three">✧</span><svg class="moon-sea" viewBox="0 0 400 150"><path d="M-60 55Q0 20 60 55T180 55T300 55T420 55T540 55V150H-60Z" fill="#b29bcd33"/><path d="M-60 90Q0 60 60 90T180 90T300 90T420 90T540 90V150H-60Z" fill="#d7b4da33"/></svg><div class="moon-reflection"></div>';
    if(id==='music')return '<div class="music-case"><span class="music-record"></span><span class="record-center">♡</span><span class="record-arm"></span></div>'+Array.from({length:4},(_,i)=>'<span class="music-note note-'+i+'">'+(i%2?'♪':'♫')+'</span>').join('');
    if(id==='balloons')return '<div class="balloon-sun"></div>'+['#df9dbb','#c4afd9','#e9c5a5','#b9cbbd','#efb7c5'].map((color,i)=>'<span class="wish-balloon" style="--i:'+i+';--balloon-color:'+color+'"><b>♡</b><i></i></span>').join('');
    if(id==='letter')return '<div class="little-envelope"><div class="invitation-card">một buổi chiều,<br>mình ngồi cùng nhau nhé? ♡</div><span class="little-envelope-back"></span><span class="little-envelope-front"></span><span class="little-envelope-flap"></span><span class="invitation-seal">♡</span></div><span class="invitation-spark">✧</span>';
    if(id==='clover')return '<div class="lucky-ring"></div><div class="lucky-clover">'+[0,1,2,3].map(i=>'<span class="clover-leaf leaf-'+i+'"></span>').join('')+'<span class="clover-stem"></span></div><span class="lucky-spark lucky-one">✧</span><span class="lucky-spark lucky-two">✦</span><span class="lucky-spark lucky-three">✧</span>';
    if(id==='invitation')return '<div class="party-aura"></div><span class="party-orbit orbit-a">✧</span><span class="party-orbit orbit-b">♡</span><svg class="party-envelope" viewBox="0 0 360 370" aria-hidden="true"><defs><linearGradient id="party-paper" x2="1" y2="1"><stop stop-color="#fff7ec"/><stop offset="1" stop-color="#f0ddcc"/></linearGradient><linearGradient id="party-fold" x2=".5" y2="1"><stop stop-color="#f2cbd0"/><stop offset="1" stop-color="#d39aad"/></linearGradient></defs><ellipse cx="180" cy="333" rx="126" ry="15" fill="#7b536514"/><g class="party-envelope-base"><rect x="38" y="145" width="284" height="174" rx="12" fill="#c58c9f"/><path class="party-envelope-flap" d="M38 148L180 253L322 148Z" fill="#e3afbe"/><g class="party-ticket"><rect x="62" y="139" width="236" height="160" rx="10" fill="url(#party-paper)"/><rect x="72" y="149" width="216" height="140" rx="7" fill="none" stroke="#c3979c" stroke-opacity=".5"/><path d="M180 183C162 165 146 189 180 210C214 189 198 165 180 183Z" fill="#bd7c96"/><path d="M120 232H240M142 246H218M156 260H204" stroke="#c19ca2" stroke-width="2" stroke-linecap="round"/></g><path d="M38 155L180 255L322 155V307Q322 319 310 319H50Q38 319 38 307Z" fill="url(#party-fold)"/><path d="M40 310L137 233M320 310L223 233" stroke="#b67f9560"/><g class="party-wax"><circle cx="180" cy="263" r="24" fill="#a55d7c"/><circle cx="180" cy="263" r="19" fill="none" stroke="#e9bbca" stroke-opacity=".5"/><path d="M180 258C167 247 158 263 180 277C202 263 193 247 180 258Z" fill="#f7d7df"/></g></g><g class="party-bow" fill="none" stroke="#c1889d" stroke-width="5" stroke-linecap="round"><path d="M180 90C142 49 121 85 180 90C218 49 239 85 180 90Z"/><path d="M178 92Q165 110 149 111M183 92Q194 112 210 111"/></g></svg><span class="party-art-caption"></em></span>';
    return bouquet(id,'modal-'+id);
  }
  window.GiftSurprises=class {
    constructor(config,reducedMotion=false){
      this.config=config;this.reduced=reducedMotion;this.$=id=>document.getElementById(id);this.dialog=this.$('surpriseDialog');
      this.entries=[...FLOWERS.map(note=>({note,mode:'flowers'})),...NOTES.map(note=>({note,mode:'sweet'}))];
      this.timers=[];this.cleaned=true;this.oldOverflow='';this.busy=false;this.index=0;this.completed=new Set();this.invitationShown=false;this.mode='flowers';
      this.$('closeSurprise').addEventListener('click',()=>this.close());this.$('backToGift').addEventListener('click',()=>this.close());
      this.$('nextSurprise').addEventListener('click',()=>this.next());this.$('previousSurprise').addEventListener('click',()=>this.previous());
      for(const id of ['openInvitation','restartInvitation'])this.$(id).addEventListener('click',()=>{if(this.onRestart)this.onRestart();});
      this.dialog.addEventListener('close',()=>{if(!this.dialog.open)this.cleanup();});
      this.$('surpriseMusic').addEventListener('click',()=>{const music=this.$('music');if(music.paused){try{const result=music.play();if(result?.catch)result.catch(()=>{});}catch{}}else music.pause();this.audioUI();});
      this.$('music').addEventListener('play',()=>this.audioUI());this.$('music').addEventListener('pause',()=>this.audioUI());this.resetJourney();
    }
    later(fn,ms){const id=setTimeout(fn,ms);this.timers.push(id);return id;}
    clearTimers(){this.timers.forEach(clearTimeout);this.timers=[];}
    get complete(){return this.completed.size===this.entries.length;}
    resetJourney(){this.close();this.index=0;this.completed=new Set();this.invitationShown=false;this.answered=false;this.mode='flowers';this.$('journeyCurtain').hidden=true;this.progressUI();}
    partyValue(key){const value=this.config[key],fallback=window.GIFT_PARTY_DEFAULTS[key];if(typeof value!=='string')return fallback;return(value.trim()||(['partyTitle','partyMessage'].includes(key)?fallback:'')).normalize('NFC');}
    progressUI(){
      this.$('giftJourney').textContent=this.complete?'Đủ mười hai điều anh để dành, còn lời hẹn đang chờ ở ngoài đời.':'Em đã mở '+String(this.completed.size).padStart(2,'0')+' / 12 điều anh để dành.';
      this.$('openInvitation').hidden=!this.complete;this.$('smileButton').hidden=this.complete;this.$('replay').hidden=this.complete;
      this.$('restartInvitation').hidden=this.mode!=='invitation';
      this.$('smileButton').textContent=this.complete?'Mình mở lại lời hẹn nhé ♡':this.completed.size?'Đọc tiếp từ trang '+(this.index+1)+' cùng anh ♡':'Mình đọc từng điều anh muốn gửi nhé ♡';
      this.$('journeyPage').textContent=this.mode==='invitation'?'':'Trang '+String(this.index+1).padStart(2,'0')+' / '+this.entries.length;
      if(this.onProgress)this.onProgress({index:this.index,completed:new Set(this.completed),complete:this.complete,mode:this.mode});
    }
    nextLabel(){return this.mode==='invitation'?'Em ra gặp anh ngay đây ♡':this.index===this.entries.length-1?'Em đã đọc xong, mình đến lời hẹn nhé ♡':'Em đọc xong rồi, mình tiếp nhé ♡';}
    openJourney(){if(this.busy)return false;if(this.complete)return this.openInvitation();this.presentEntry(this.index);return true;}
    openSweet(){return this.openJourney();}
    openBouquet(){return this.openJourney();}
    openAt(index){if(this.busy||!Number.isInteger(index)||index<0||index>Math.min(this.completed.size,this.entries.length-1))return false;this.presentEntry(index);return true;}
    presentEntry(index){this.index=index;const entry=this.entries[index];this.present(entry.note,entry.mode);if(entry.mode==='flowers')this.$('bouquet').innerHTML=bouquet(entry.note.id,'preview-'+entry.note.id);}
    next(){
      if(this.busy)return false;if(this.mode==='invitation'){this.acknowledge();return true;}
      if(this.onMoment)this.onMoment('read');
      this.completed.add(this.entries[this.index].note.id);this.progressUI();
      if(this.index===this.entries.length-1){this.finishReading();return true;}
      this.transitionTo(this.index+1);return true;
    }
    previous(){if(this.busy||this.mode==='invitation'||this.index===0)return false;this.transitionTo(this.index-1);return true;}
    transitionTo(index){
      this.clearTimers();this.index=index;this.busy=true;this.progressUI();this.dialog.dataset.changing='true';this.$('surpriseStage').dataset.phase='closing';this.$('nextSurprise').disabled=true;this.$('previousSurprise').disabled=true;
      this.later(()=>{if(this.dialog.open)this.presentEntry(index);},this.reduced?0:480);
    }
    finishReading(){
      this.clearTimers();this.busy=true;this.dialog.dataset.changing='true';this.$('surpriseStage').dataset.phase='closing';this.$('nextSurprise').disabled=true;this.$('previousSurprise').disabled=true;
      this.$('journeyCurtain').hidden=false;this.$('surpriseStatus').textContent='Những lời nhắn đang khép lại. Một lá thư mời buổi tiệc đang mở ra dành cho em.';
      const seconds=Math.max(.6,Math.min(3,Number(this.config.invitationTransitionSeconds)||1.6));
      this.later(()=>{if(!this.dialog.open)return;this.busy=false;this.openInvitation();},this.reduced?0:seconds*1000);
    }
    openInvitation(preview=false){
      if(this.busy||(!this.complete&&!preview))return false;this.invitationShown=true;this.answered=false;
      this.present({id:'invitation',kicker:'THỰC HIỆN LỜI HẸN VỚI ANH NHA',title:this.partyValue('partyTitle'),paragraphs:this.partyValue('partyMessage').split(/\n\s*\n/),note:'Một buổi tiệc nhỏ đã được chuẩn bị. Có một người đang mong gặp em.'},'invitation');return true;
    }
    acknowledge(){
      if(this.answered)return;this.answered=true;this.$('partyReply').hidden=false;this.$('partyReply').textContent='Vậy anh hẹn gặp cô công chúa ở ngoài nhaaa. Cứ thong thả, anh đang đợi để tự tay trao món quà đặc biệt cho em. ♡';
      this.$('nextSurprise').textContent='Hẹn gặp em, cô công chúa đáng yêu ♡';this.$('nextSurprise').disabled=true;this.dialog.dataset.answered='true';this.$('partyReply').focus({preventScroll:true});this.$('partyReply').scrollIntoView({behavior:this.reduced?'instant':'smooth',block:'nearest'});
      if(this.onMoment)this.onMoment('reply');
    }
    present(note,mode){
      this.clearTimers();this.mode=mode;this.busy=true;this.$('journeyCurtain').hidden=true;
      if(!this.dialog.open){this.cleaned=false;this.returnFocus=document.activeElement;this.oldOverflow=document.body.style.overflow;this.dialog.showModal();document.body.style.overflow='hidden';}
      this.dialog.dataset.skin=note.id;this.dialog.dataset.mode=mode;this.dialog.dataset.answered='false';this.dialog.dataset.changing='false';this.dialog.scrollTop=0;const stage=this.$('surpriseStage');stage.dataset.phase='opening';
      this.$('surpriseOpening').hidden=false;this.$('surpriseOpening').textContent=mode==='invitation'?'Có một người đang chờ gặp em…':mode==='flowers'?'Từng cánh hoa đang mở lời cùng anh…':'Mình đọc một điều anh muốn gửi nhé…';
      this.$('surpriseChapter').textContent=mode==='invitation'?'THƯ MỜI DÀNH RIÊNG CHO EM':'LÁ THƯ '+String(this.index+1).padStart(2,'0')+' / 12 · TỪ MỘT BÔNG HOA NHỎ';
      this.$('surpriseArt').innerHTML=artFor(note.id);this.$('surpriseKicker').textContent=note.kicker;this.$('surpriseTitle').textContent=note.title;
      this.$('surpriseGreeting').textContent='Gửi '+String(this.config.to||'cô công chúa đáng yêu của anh').normalize('NFC')+',';this.$('surpriseMessage').replaceChildren();
      note.paragraphs.forEach((text,i)=>{const p=document.createElement('p');p.textContent=text;p.style.setProperty('--paragraph-delay',(i*.18)+'s');this.$('surpriseMessage').append(p);});
      this.$('surpriseSignature').textContent='Minh Đức';this.$('surpriseVisualNote').textContent=note.note;
      let hasDetails=false;for(const id of ['partyTime','partyPlace','partyDress']){const text=mode==='invitation'?this.partyValue(id):'';this.$(id).textContent=text;this.$(id+'Row').hidden=!text;if(text)hasDetails=true;}this.$('partyDetails').hidden=!hasDetails;
      this.$('partyReply').hidden=true;this.$('partyReply').textContent='';this.$('invitationHint').hidden=mode==='invitation'||this.index!==this.entries.length-1;
      this.$('backToGift').textContent=mode==='invitation'?'Giữ lại lời hẹn, ngắm món quà thêm một chút':'Tạm khép trang, lát nữa mình đọc tiếp';
      this.$('previousSurprise').hidden=mode==='invitation'||this.index===0;this.$('previousSurprise').disabled=true;this.$('nextSurprise').disabled=true;this.$('nextSurprise').textContent=this.nextLabel();
      this.$('surpriseSparkles').replaceChildren();
      if(!this.reduced)for(let i=0;i<20;i++){const spark=document.createElement('span');spark.textContent=mode==='flowers'?(i%3?'✿':'♡'):note.id==='stars'?'✧':i%2?'♡':'✧';spark.style.setProperty('--x',((i*37+13)%100)+'%');spark.style.setProperty('--drift',((i%5-2)*17)+'px');spark.style.setProperty('--delay',(-i*.39)+'s');spark.style.setProperty('--size',(10+i%7)+'px');this.$('surpriseSparkles').append(spark);}
      this.audioUI();this.progressUI();
      this.later(()=>{if(!this.dialog.open)return;stage.dataset.phase='revealed';this.$('surpriseOpening').hidden=true;this.$('surpriseStatus').textContent=note.title;this.$('surpriseTitle').focus({preventScroll:true});if(this.onMoment)this.onMoment(mode==='invitation'?'invitation':'letter');},this.reduced?0:mode==='invitation'?1800:mode==='flowers'?1400:900);
      this.later(()=>{this.busy=false;this.$('nextSurprise').disabled=false;this.$('previousSurprise').disabled=false;},this.reduced?0:mode==='invitation'?2200:mode==='flowers'?1900:1450);
    }
    audioUI(){const playing=!this.$('music').paused;this.$('surpriseMusic').textContent=playing?'Ⅱ ♫':'▷ ♫';this.$('surpriseMusic').setAttribute('aria-label',playing?'Tạm dừng nhạc':'Phát nhạc');this.$('surpriseMusic').setAttribute('aria-pressed',String(playing));}
    close(){if(this.dialog.open){this.dialog.close();this.cleanup();}else this.clearTimers();}
    cleanup(){if(this.cleaned)return;this.cleaned=true;this.clearTimers();this.busy=false;this.$('journeyCurtain').hidden=true;document.body.style.overflow=this.oldOverflow;this.$('surpriseSparkles').replaceChildren();const target=[this.returnFocus,this.$('smileButton')].find(node=>node&&node.isConnected&&node.getClientRects().length);if(target)target.focus({preventScroll:true});}
  };

})();
