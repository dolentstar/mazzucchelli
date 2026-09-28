// Orari + "aperto ora" in fuso Europe/Rome. Copia nel sito come orari.js (con <script src="orari.js" defer>).
// Nell'HTML: <table id="orari" data-orari='[[[15,30,19,30]],[[9,0,12,30],[15,30,19,30]],...7 giorni lun→dom, [] = chiuso]'></table>
// Chiusura dopo mezzanotte: [15,30,1,0] = dalle 15:30 all'una di notte (conta anche per "aperto ora" del giorno dopo).
// e ovunque serva lo stato: <span data-stato></span>  (riceve classe .aperto / .chiuso)
(() => {
  const t = document.getElementById('orari'); if (!t) return;
  const H = JSON.parse(t.dataset.orari), G = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  const d = (now.getDay() + 6) % 7, m = now.getHours() * 60 + now.getMinutes(), f = (h, n) => `${h}:${String(n).padStart(2, '0')}`;
  const fine = ([a, b, c, e]) => { const x = c * 60 + e; return x <= a * 60 + b ? x + 1440 : x; };
  const ieri = H[(d + 6) % 7].find(s => fine(s) > 1440 && m < fine(s) - 1440);
  const on = ieri || H[d].find(s => m >= s[0] * 60 + s[1] && m < fine(s)), later = !on && H[d].find(([a, b]) => m < a * 60 + b);
  let next = null; for (let i = 1; i <= 7 && !on && !later && !next; i++) { const g = (d + i) % 7; if (H[g].length) next = [g, H[g][0]]; }
  const txt = on ? `Aperto ora, fino alle ${f(on[2], on[3])}` : later ? `Chiuso ora, apre alle ${f(later[0], later[1])}`
    : next ? `Chiuso ora, riapre ${next[0] === (d + 1) % 7 ? 'domani' : G[next[0]].toLowerCase()} alle ${f(next[1][0], next[1][1])}` : '';
  document.querySelectorAll('[data-stato]').forEach(e => { e.classList.add(on ? 'aperto' : 'chiuso'); e.textContent = txt; });
  t.innerHTML = H.map((s, i) => `<tr${i === d ? ' class="oggi"' : ''}><td>${G[i]}</td><td>${s.length ? s.map(x => f(x[0], x[1]) + '–' + f(x[2], x[3])).join(', ') : 'Chiuso'}</td></tr>`).join('');
})();
