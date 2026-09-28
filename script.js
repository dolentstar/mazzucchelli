(() => {
  const S = [
    ['Settore elettrico', ['Terminali e blocchetti', 'Terminali vari', 'Terminali per gruppi di distribuzione', 'Terminali e blocchetti speciali', 'Capicorda preisolati, puntalini e capicorda di potenza', 'Contatti lamellari', 'Spinette, terminali e pagliette', 'Occhielli decimali', 'Fascette stringicavo', 'Accessori per quadristica e impiantistica']],
    ['Componenti auto', ['Rivetti tubolari, semiforati e pieni', 'Distanziali', 'Contatti per fanaleria e illuminazione abitacolo', 'Canotti portalampade E10, BA9 e BA15', 'Portalampade per lampade tuttovetro T5 e T10', 'Portalampade completi e cablati', 'Costampati', 'Pulsanti portiera e antifurto, contattiere', 'Fusibili e portafusibili']],
    ['Minuteria per usi diversi', ['Occhielli e articoli per cartotecnica', 'Occhielli vela', 'Occhielli calottati e rivetti perforanti', 'Bottoni a pressione e rivetti jeans']],
    ['Articoli di fissaggio', ['Rivetti a strappo in alluminio', 'Rivetti a strappo in rame', 'Rivetti a strappo in acciaio e ottone', 'Rivetti a strappo inox e monel', 'Rivetti a strappo ermetici', 'Rivetti a strappo per usi speciali', 'Inserti filettati', 'Utensili e accessori']],
    ['Macchine per l\'applicazione', ['Occhiellatrici', 'Rivettatrici', 'Macchine per bottoni', 'Presse']]
  ];
  const $ = s => document.querySelector(s), box = $('#mobile'), q = $('#q'), ap = $('#aperto');
  let settore = -1, aperto = null;

  $('#settori').innerHTML = ['Tutti', ...S.map(s => s[0])].map((n, i) => `<button type="button" data-s="${i - 1}" aria-pressed="${i === 0}">${n}</button>`).join('');
  box.innerHTML = S.map(([nome, fam], si) => `<div class="colonna" data-s="${si}"><p class="targa">${nome}</p><div class="cassetti">${fam.map((f, fi) => `<button type="button" class="cassetto" data-s="${si}" data-f="${fi}" aria-expanded="false"><span class="cartellino">${f}</span><span class="maniglia" aria-hidden="true"></span></button>`).join('')}</div></div>`).join('');
  const cassetti = [...box.querySelectorAll('.cassetto')];

  function filtra() {
    chiudi();
    const t = q.value.trim().toLowerCase();
    let n = 0;
    box.querySelectorAll('.colonna').forEach(c => {
      const s = +c.dataset.s;
      let vis = 0;
      c.querySelectorAll('.cassetto').forEach(b => {
        const ok = (settore < 0 || settore === s) && (!t || b.textContent.toLowerCase().includes(t) || S[s][0].toLowerCase().includes(t));
        b.hidden = !ok; vis += ok;
      });
      c.hidden = !vis; n += vis;
    });
    $('#vuoto').hidden = n > 0;
  }

  function apri(b) {
    if (aperto) aperto.setAttribute('aria-expanded', 'false');
    if (aperto === b) { chiudi(true); return; }
    aperto = b; b.setAttribute('aria-expanded', 'true');
    const [nome, fam] = S[b.dataset.s], f = fam[b.dataset.f];
    $('#ap-settore').textContent = nome;
    $('#ap-nome').textContent = f;
    const body = `Buongiorno,\nvorrei sapere disponibilità e prezzo per:\n\n${f} (${nome})\nCodice o misura:\nQuantità:\n\nAzienda:\nReferente:\nTelefono:\n`;
    $('#ap-link').href = `mailto:info@maz.it?subject=${encodeURIComponent('Richiesta disponibilità: ' + f)}&body=${encodeURIComponent(body)}`;
    ap.hidden = false;
    const g = b.parentElement, vis = [...g.children].filter(x => x.classList.contains('cassetto') && !x.hidden);
    const cols = getComputedStyle(g).gridTemplateColumns.split(' ').length, i = vis.indexOf(b);
    vis[Math.min(vis.length - 1, Math.floor(i / cols) * cols + cols - 1)].after(ap);
    ap.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function chiudi(fuoco) { if (aperto) { aperto.setAttribute('aria-expanded', 'false'); if (fuoco === true) aperto.focus(); } aperto = null; ap.hidden = true; }

  box.addEventListener('click', e => { const b = e.target.closest('.cassetto'); if (b) apri(b); });
  $('#ap-chiudi').addEventListener('click', () => chiudi(true));
  q.addEventListener('input', filtra);
  $('#settori').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    settore = +b.dataset.s;
    $('#settori').querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    filtra();
  });
})();
