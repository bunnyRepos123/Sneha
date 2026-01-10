// Mobile-first starter script: countdown, reveal, typewriter, slideshow, audio controls
document.addEventListener('DOMContentLoaded',()=>{
  const countdownEl=document.getElementById('timer');
  const revealSec=document.getElementById('reveal');
  const main=document.getElementById('main');
  const wishEl=document.getElementById('wish');
  const slide=document.getElementById('slide');
  const audio=document.getElementById('bg-audio');
  const playBtn=document.getElementById('play-music');
  const muteBtn=document.getElementById('mute-music');

  // Target: Jan 16 midnight local time
  const target=new Date(2026,0,3,16,3,0).getTime();

  function updateCountdown(){
    const now=Date.now();
    const dist=target-now;
    if(dist<=0){
      clearInterval(timerInterval);
      showReveal();
      return;
    }
    const days=Math.floor(dist/(1000*60*60*24));
    const hours=Math.floor((dist%(1000*60*60*24))/(1000*60*60));
    const minutes=Math.floor((dist%(1000*60*60))/(1000*60));
    const seconds=Math.floor((dist%(1000*60))/1000);
    countdownEl.textContent=`${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  const timerInterval=setInterval(updateCountdown,1000);
  updateCountdown();

  function showReveal(){
    // Hide countdown and show reveal area
    const countdownSection=document.getElementById('countdown');
    countdownSection.classList.add('hidden');
    revealSec.classList.remove('hidden');

    // Apply smooth fade-in to hero and slideshow
    // add .fade-in class in CSS; toggle .visible after a tick
    const hero = document.getElementById('hero');
    const slideshow = document.getElementById('slideshow');
    [hero, slideshow].forEach(el => { if(el) { el.classList.add('fade-in'); } });
    // allow the DOM to paint then add visible
    setTimeout(()=>{ [hero, slideshow].forEach(el => { if(el) { el.classList.add('visible'); } }); }, 30);

    // Start typewriter for wish paragraph
    startTypewriter(wishEl,wishEl.textContent,10);

    // start slideshow (rotate images in assets/images)
    startSlideshow();

    // Spawn floating hearts for a short celebration period
    let heartsSpawned = 0;
    const heartInterval = setInterval(()=>{
      createHeart();
      heartsSpawned++;
      if(heartsSpawned>14) clearInterval(heartInterval);
    }, 500);
    // Confetti burst at reveal
    createConfettiBurst(36);
  }

  function startTypewriter(el,text,speedMs){
    el.textContent='';
    el.classList.add('typing');
    const container=document.createElement('span');container.className='typed-text';el.appendChild(container);
    let i=0;
    function step(){
      if(i<text.length){
        container.textContent+=text.charAt(i);
        i++;
        setTimeout(step,speedMs);
      } else {
        el.classList.remove('typing');
      }
    }
    step();
  }

  // Simple slideshow: load all image filenames from assets/images (placeholder names)
  const slides=[
    'assets/images/placeholder1.jpg',
    'assets/images/placeholder2.jpg',
    'assets/images/placeholder3.jpg'
  ];
  let slideIndex=0;
  function startSlideshow(){
    slide.src=slides[0];
    setInterval(()=>{
      slideIndex=(slideIndex+1)%slides.length;slide.src=slides[slideIndex];
    },3000);
  }

  // Create a floating heart and remove it after animation
  function createHeart(){
    // Create an SVG heart for crisper visuals
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.className = 'floating-heart';

    const path = document.createElementNS(svgNS, 'path');
    // Heart path (simple rounded heart)
    path.setAttribute('d', 'M12 21s-7-4.35-9-7.01C-1.2 9.86 3.3 4 8.5 6.5 10.6 7.8 12 10 12 10s1.4-2.2 3.5-3.5C20.7 4 25.2 9.86 21 13.99 19 16.65 12 21 12 21z');
    path.setAttribute('fill', 'var(--accent)');
    path.setAttribute('opacity', '0.95');
    svg.appendChild(path);

    // random horizontal position within viewport (8% - 92%)
    const left = 8 + Math.random() * 84;
    svg.style.left = left + 'vw';

    // random size
    const size = 14 + Math.random() * 32; // px
    svg.style.width = size + 'px';
    svg.style.height = size + 'px';

    // random animation duration
    const duration = 3000 + Math.random() * 3000;
    svg.style.animationDuration = duration + 'ms';
    svg.style.opacity = '1';
    document.body.appendChild(svg);
    // remove after it's done
    setTimeout(()=>{ svg.remove(); }, duration + 400);
  }

  // Create a single confetti piece
  function createConfettiPiece(){
    const piece = document.createElement('div');
    piece.className = 'confetti';
    // random color palette (including accent)
    const colors = ['#ff4da6','#ffd166','#06d6a0','#4da6ff','#ff8fab','#c77dff'];
    const color = colors[Math.floor(Math.random()*colors.length)];
    piece.style.background = color;

    // random horizontal position
    const left = Math.random() * 100; // vw
    piece.style.left = left + 'vw';

    // random size
    const w = 6 + Math.random()*10;
    const h = 8 + Math.random()*12;
    piece.style.width = w + 'px';
    piece.style.height = h + 'px';

    // random rotation start
    piece.style.transform = 'rotate(' + (Math.random()*360) + 'deg)';

    // random duration
    const duration = 2000 + Math.random()*2200;
    piece.style.animationDuration = duration + 'ms';

    document.body.appendChild(piece);
    setTimeout(()=>{ piece.remove(); }, duration + 400);
  }

  function createConfettiBurst(count=30){
    for(let i=0;i<count;i++){
      // stagger slightly
      setTimeout(()=>createConfettiPiece(), i*15);
    }
  }

  // Gallery lightbox behavior
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryImages = galleryItems.map(b => b.querySelector('img').src);
  let lightbox = null;
  let currentGalleryIndex = 0;
  function openLightbox(index){
    currentGalleryIndex = index;
    if(!lightbox){
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-inner" role="dialog" aria-modal="true" aria-label="Image viewer">
          <button class="lightbox-close" aria-label="Close">✕</button>
          <button class="lightbox-prev" aria-label="Previous image">◀</button>
          <div class="lightbox-content"><img src="" alt=""></div>
          <button class="lightbox-next" aria-label="Next image">▶</button>
        </div>`;
      document.body.appendChild(lightbox);
      lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
      lightbox.querySelector('.lightbox-prev').addEventListener('click', ()=> showImage(currentGalleryIndex-1));
      lightbox.querySelector('.lightbox-next').addEventListener('click', ()=> showImage(currentGalleryIndex+1));
      lightbox.addEventListener('click',(e)=>{ if(e.target===lightbox) closeLightbox(); });
      document.addEventListener('keydown',(e)=>{
        if(!lightbox) return;
        if(e.key==='Escape') closeLightbox();
        else if(e.key==='ArrowLeft') showImage(currentGalleryIndex-1);
        else if(e.key==='ArrowRight') showImage(currentGalleryIndex+1);
      });
    }
    showImage(index);
    lightbox.classList.add('visible');
  }
  function showImage(index){
    if(index<0) index = galleryImages.length-1;
    if(index>=galleryImages.length) index = 0;
    currentGalleryIndex = index;
    const img = lightbox.querySelector('.lightbox-content img');
    img.src = galleryImages[index];
    img.alt = 'Photo ' + (index+1);
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.focus();
  }
  function closeLightbox(){
    if(!lightbox) return;
    lightbox.classList.remove('visible');
    setTimeout(()=>{ const img = lightbox.querySelector('.lightbox-content img'); if(img) img.src=''; },300);
    const btn = document.querySelector('.gallery-item[data-index="'+ currentGalleryIndex +'"]');
    if(btn) btn.focus();
  }
  galleryItems.forEach((btn, idx)=>{ btn.addEventListener('click',()=> openLightbox(idx)); btn.addEventListener('keydown',(e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); openLightbox(idx); } }); });

  // Audio controls
  playBtn.addEventListener('click',()=>{audio.play();});
  muteBtn.addEventListener('click',()=>{audio.muted=!audio.muted;muteBtn.textContent=audio.muted? 'Unmute':'Mute'});

  // Reduce motion toggle: persists in localStorage
  const reduceBtn = document.getElementById('reduce-motion');
  function applyReduceMotion(enabled){
    if(enabled){
      document.body.classList.add('reduced-motion');
      reduceBtn.setAttribute('aria-pressed','true');
      reduceBtn.textContent = 'Reduced motion';
    } else {
      document.body.classList.remove('reduced-motion');
      reduceBtn.setAttribute('aria-pressed','false');
      reduceBtn.textContent = 'Reduce motion';
    }
    try{ localStorage.setItem('surprise-reduce-motion', enabled ? '1' : '0'); }catch(e){}
  }
  // initialize from preference or system
  const stored = (function(){ try{return localStorage.getItem('surprise-reduce-motion');}catch(e){return null;} })();
  if(stored!==null){ applyReduceMotion(stored==='1'); }
  else { // respect prefers-reduced-motion
    const prefers = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    applyReduceMotion(prefers);
  }

  reduceBtn.addEventListener('click', ()=>{ const current = document.body.classList.contains('reduced-motion'); applyReduceMotion(!current); });

  // If countdown already passed (for testing) show immediately
  if(Date.now()>=target) showReveal();
});
