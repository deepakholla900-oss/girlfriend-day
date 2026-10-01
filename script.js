const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const menuToggle = $('#menuToggle');
const nav = $('#nav');
menuToggle.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.textContent = opened ? '×' : '☰';
});
$$('.nav-link').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰';
}));
const sections = $$('main section[id]');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if(entry.isIntersecting) $$('.nav-link').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#'+entry.target.id));
}), {rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section => observer.observe(section));

const reveal = $('#reasonReveal');
$$('.reason-card').forEach(card => card.addEventListener('click', () => {
  $$('.reason-card').forEach(c => c.classList.toggle('selected', c===card));
  reveal.innerHTML = `<span class="reveal-heart">♡</span><p>${card.dataset.message}</p>`;
}));

const cards = $$('.memory-card');
let memoryIndex = 0;
function showMemory(next) {
  memoryIndex = (next + cards.length) % cards.length;
  cards.forEach((card,i)=>card.classList.toggle('active',i===memoryIndex));
  $('#memoryCount').textContent = `${String(memoryIndex+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
}
$('#prevMemory').addEventListener('click',()=>showMemory(memoryIndex-1));
$('#nextMemory').addEventListener('click',()=>showMemory(memoryIndex+1));

const toast = $('#toast');
let toastTimer;
function showToast(message) {
  toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2600);
}
$('#sealButton').addEventListener('click',()=>{showToast('A little kiss, delivered with love. Muah! 💋'); petals(18);});

function petals(count=28) {
  const symbols=['🌹','♥','♡','✿','🌸'];
  for(let i=0;i<count;i++){
    const p=document.createElement('span');p.className='petal';p.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    p.style.left=Math.random()*100+'vw';p.style.animationDuration=(3+Math.random()*4)+'s';p.style.animationDelay=(Math.random()*.8)+'s';p.style.fontSize=(12+Math.random()*15)+'px';
    document.body.appendChild(p);setTimeout(()=>p.remove(),8500);
  }
}
$('#surpriseButton').addEventListener('click',()=>{
  $('#surpriseMessage').textContent='Keerthi, if I had a thousand hearts, every single one would fall for you. ♡';
  $('#foreverHeart').textContent='♥'; petals(55); showToast('Surprise! All my love, just for you. 🌹');
});

// Lightweight synthesized notes: no audio file or external service required.
let audioContext=null, musicPlaying=false, musicTimer=null, noteStep=0;
const melody=[523.25,659.25,783.99,659.25,587.33,698.46,659.25,523.25,440,523.25,587.33,523.25];
function playNote(freq, duration=.32) {
  if(!audioContext) audioContext=new (window.AudioContext||window.webkitAudioContext)();
  const osc=audioContext.createOscillator(), gain=audioContext.createGain();
  osc.type='sine';osc.frequency.value=freq;gain.gain.setValueAtTime(.0001,audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.055,audioContext.currentTime+.03);
  gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);
  osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+duration+.02);
}
$('#musicToggle').addEventListener('click',async()=>{
  const btn=$('#musicLabel');
  if(!musicPlaying){
    try{if(!audioContext)audioContext=new(window.AudioContext||window.webkitAudioContext)();await audioContext.resume();
      musicPlaying=true;btn.textContent='Pause the little tune';playNote(melody[noteStep++%melody.length]);
      musicTimer=setInterval(()=>{if(musicPlaying)playNote(melody[noteStep++%melody.length],.38)},430);
    }catch(e){showToast('Audio is not available in this browser.');}
  }else{musicPlaying=false;clearInterval(musicTimer);btn.textContent='Play a little tune';}
});
