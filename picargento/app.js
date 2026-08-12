const C={a:['Chimichurri artesanal 250 g',5400],p:['Chimichurri picante 250 g',5400],d:['Dúo Picargento 250 g + 250 g',10000]};
const Q={a:0,p:0,d:0};
const $=id=>document.getElementById(id);
const fmt=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const items=$('items'),total=$('total'),prep=$('prep'),toast=$('toast'),form=$('form'),dlg=$('dlg');
let last='';
function msg(t){toast.textContent=t;toast.classList.add('on');clearTimeout(msg.t);msg.t=setTimeout(()=>toast.classList.remove('on'),1800)}
function render(){
  const rows=Object.entries(Q).filter(([,q])=>q>0);
  const amount=rows.reduce((s,[id,q])=>s+C[id][1]*q,0);
  items.innerHTML=rows.length?rows.map(([id,q])=>`<div class="line"><b>${C[id][0]}</b><div class="qty"><button type="button" data-id="${id}" data-d="-1">−</button><span>${q}</span><button type="button" data-id="${id}" data-d="1">+</button></div><strong>${fmt(C[id][1]*q)}</strong></div>`).join(''):'<p class="empty">Todavía no agregaste productos.</p>';
  total.textContent=fmt(amount);prep.disabled=!rows.length;
}
document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{Q[b.dataset.add]++;render();msg('Producto agregado');$('pedido').scrollIntoView({behavior:'smooth'})}));
items.addEventListener('click',e=>{const b=e.target.closest('[data-id]');if(!b)return;Q[b.dataset.id]=Math.max(0,Q[b.dataset.id]+Number(b.dataset.d));render()});
prep.addEventListener('click',()=>{
  if(!form.reportValidity())return;
  const rows=Object.entries(Q).filter(([,q])=>q>0);
  const amount=rows.reduce((s,[id,q])=>s+C[id][1]*q,0);
  const code='PIC-'+Date.now().toString().slice(-6);
  const name=$('name').value.trim(),phone=$('phone').value.trim(),course=$('course').value.trim(),comments=$('comments').value.trim();
  last=[`PEDIDO PICARGENTO · ${code}`,`Nombre: ${name}`,`WhatsApp: ${phone}`,course&&`Curso: ${course}`,'',...rows.map(([id,q])=>`${q} × ${C[id][0]} — ${fmt(C[id][1]*q)}`),'',`TOTAL: ${fmt(amount)}`,comments&&`Comentario: ${comments}`,'Pago: a coordinar'].filter(Boolean).join('\n');
  localStorage.setItem('picargento_pedido',last);$('code').textContent=code;$('ms').textContent=last;dlg.showModal();
});
$('copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(last);msg('Resumen copiado')}catch{msg('Copialo manualmente')}});
$('close').addEventListener('click',()=>dlg.close());
$('menu').addEventListener('click',()=>$('links').classList.toggle('open'));
$('links').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>$('links').classList.remove('open')));
render();
