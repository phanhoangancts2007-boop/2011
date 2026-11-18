(() => {
const C = window.CONFIG, $ = s => document.querySelector(s), body = document.body;
const stages = ['cover', 'board', 'letter', 'film']; let cur = 0;
const show = n => { cur = n; stages.forEach((id, k) => $('#' + id).classList.toggle('on', k === n)); };

/* nội dung từ config */
$('#t1').innerHTML = C.title.replace('ngày ', 'ngày<br>'); $('#t2').textContent = C.subtitle;
$('#gr').textContent = C.greeting; $('#sg').textContent = C.signature; $('#gt').textContent = C.galleryTitle;
$('#lt').innerHTML = ''; C.letter.forEach(t => { const p = document.createElement('p'); p.textContent = t; $('#lt').appendChild(p); });
[...$('.paper').children].forEach((el, i) => el.style.setProperty('--i', i));
[...$('#lt').children].forEach((el, i) => el.style.setProperty('--i', i + 1));

/* link Google Drive -> link dùng được trong trang */
const driveId = u => { const m = String(u).match(/(?:\/d\/|[?&]id=)([\w-]{20,})/); return m ? m[1] : null; };
const imgUrl = u => { const id = driveId(u); return id ? 'https://drive.google.com/thumbnail?id=' + id + '&sz=w1600' : u; };
const audUrl = u => { const id = driveId(u); return id ? 'https://drive.google.com/uc?export=download&id=' + id : u; };

/* phim ảnh */
const strip = $('#strip'), hues = ['#4f7f6d', '#c27a5a', '#6b7fa8', '#a8738f', '#8a8f4a'];
C.photos.forEach((p, k) => {
  const b = document.createElement('button'); b.className = 'shot'; b.setAttribute('aria-label', 'Xem ảnh ' + (k + 1));
  const img = new Image(); img.className = 'ph'; img.alt = 'Ảnh kỷ niệm ' + (k + 1); img.loading = 'lazy'; img.decoding = 'async'; img.referrerPolicy = 'no-referrer'; img.src = imgUrl(p);
  img.onerror = () => { const d = document.createElement('div'); d.className = 'ph miss'; d.style.setProperty('--c', hues[k % 5]); d.textContent = '♡'; img.replaceWith(d); b.dataset.miss = 1; };
  b.append(img); b.onclick = () => openLb(k); strip.appendChild(b);
});
const shots = () => [...strip.children], total = C.photos.length;
const nearest = () => { const m = strip.scrollLeft + strip.clientWidth / 2; let best = 0, d = 1e9; shots().forEach((s, i) => { const x = Math.abs(s.offsetLeft + s.offsetWidth / 2 - m); if (x < d) { d = x; best = i; } }); return best; };
strip.addEventListener('scroll', () => { $('#cnt').textContent = (nearest() + 1) + ' / ' + total; }, { passive: true });
const goTo = i => { const s = shots()[Math.max(0, Math.min(total - 1, i))]; strip.scrollTo({ left: s.offsetLeft - (strip.clientWidth - s.offsetWidth) / 2, behavior: 'smooth' }); };
$('#pv').onclick = () => goTo(nearest() - 1); $('#nx').onclick = () => goTo(nearest() + 1);
$('#cnt').textContent = '1 / ' + total;

/* phóng to ảnh */
let li = 0; const lb = $('#lb');
function openLb(k) { li = k; const p = C.photos[k], s = shots()[k]; if (s.dataset.miss) return; $('#li').referrerPolicy = 'no-referrer'; $('#li').src = imgUrl(p); lb.hidden = false; }
$('#lx').onclick = () => lb.hidden = true; lb.onclick = e => { if (e.target === lb) lb.hidden = true; };
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lb.hidden = true;
  if (cur === 3 && lb.hidden) { if (e.key === 'ArrowRight') goTo(nearest() + 1); if (e.key === 'ArrowLeft') goTo(nearest() - 1); }
});

/* nhạc: ưu tiên file mp3 của bạn, không có thì dùng giai điệu hộp nhạc tự tạo */
const srcs = [].concat(C.music).filter(Boolean).map(audUrl);
const audio = new Audio(); audio.loop = true; audio.volume = .6; audio.preload = 'auto';
let mode = 'off', ac, timer, step = 0;
const ch = [[261.6, 329.6, 392, 523.3], [220, 261.6, 329.6, 440], [174.6, 220, 261.6, 349.2], [196, 246.9, 293.7, 392]];
const note = (f, t) => { const o = ac.createOscillator(), g = ac.createGain(); o.type = 'triangle'; o.frequency.value = f; o.connect(g); g.connect(ac.destination); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.11, t + .02); g.gain.exponentialRampToValueAtTime(.0005, t + 1.6); o.start(t); o.stop(t + 1.7); };
const tick = () => { const c = ch[Math.floor(step / 8) % 4], t = ac.currentTime + .05; note(c[[0, 1, 2, 3, 2, 1, 3, 2][step % 8]], t); if (step % 8 === 0) note(c[0] / 2, t); step++; };
/* thử phát một nguồn nhạc, tối đa 6 giây; lỗi hoặc quá lâu thì trả về false */
function tryFile(src) {
  return new Promise(res => {
    let done = false;
    const fin = ok => { if (done) return; done = true; clearTimeout(t); audio.removeEventListener('playing', onp); audio.removeEventListener('error', one); res(ok); };
    const onp = () => fin(true), one = () => fin(false), t = setTimeout(() => fin(false), 6000);
    audio.addEventListener('playing', onp); audio.addEventListener('error', one);
    audio.src = src; audio.play().catch(() => fin(false));
  });
}
async function musicOn() {
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) {} /* mở khóa âm thanh ngay lúc chạm */
  mode = 'off';
  for (const s of srcs) { if (await tryFile(s)) { mode = 'file'; break; } audio.pause(); }
  if (mode === 'off' && ac) { clearInterval(timer); timer = setInterval(tick, 430); mode = 'synth'; }
  $('#mus').style.opacity = mode === 'off' ? .5 : 1;
}
function musicOff() { audio.pause(); clearInterval(timer); mode = 'off'; $('#mus').style.opacity = .5; }
$('#mus').onclick = () => mode === 'off' ? musicOn() : musicOff();

/* điều hướng */
const start = () => { body.classList.add('go'); musicOn(); show(1); };
const cv = $('#cover'); cv.onclick = start; cv.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') start(); };
document.querySelectorAll('[data-next]').forEach(b => b.onclick = () => show(cur + 1));
$('#rotskip').onclick = () => body.classList.add('portrait-ok');
})();
