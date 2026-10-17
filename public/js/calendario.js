(function () {
  const contenedor = document.getElementById('calendario-historial');
  const popover = document.getElementById('hf-popover');
  const btnAbrir = document.getElementById('hf-abrir');
  if (!contenedor || !popover || !btnAbrir) return;

  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const NOMBRES_DIA = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  const pad = n => String(n).padStart(2, '0');
  const fmt = (y, m, d) => `${y}-${pad(m)}-${pad(d)}`;

  const ahora = new Date();
  const hoy = fmt(ahora.getFullYear(), ahora.getMonth() + 1, ahora.getDate());
  const seleccionada = contenedor.dataset.fecha || '';

  // El calendario abre en el mes de la fecha seleccionada, o en el mes actual
  const inicial = seleccionada || hoy;
  let anio = parseInt(inicial.slice(0, 4), 10);
  let mes = parseInt(inicial.slice(5, 7), 10);

  function irA(fecha) {
    window.location.href = '/ventas/historial?fecha=' + fecha;
  }

  function sumarDias(fecha, n) {
    const [y, m, d] = fecha.split('-').map(Number);
    const f = new Date(y, m - 1, d + n);
    return fmt(f.getFullYear(), f.getMonth() + 1, f.getDate());
  }

  async function dibujar() {
    let dias = {};
    try {
      const res = await fetch(`/ventas/api/dias-con-ventas?mes=${anio}-${pad(mes)}`);
      if (res.ok) dias = await res.json();
    } catch (error) {
      console.error('Error al cargar el calendario:', error);
    }

    const primerDia = new Date(anio, mes - 1, 1).getDay(); // 0 = domingo
    const espacios = (primerDia + 6) % 7;                  // la semana empieza en lunes
    const totalDias = new Date(anio, mes, 0).getDate();

    let html = `
      <div class="hc">
        <div class="hc-header">
          <button type="button" class="hc-nav" id="hc-prev">‹</button>
          <div class="hc-titulo">${MESES[mes - 1]} ${anio}</div>
          <button type="button" class="hc-nav" id="hc-next">›</button>
        </div>
        <div class="hc-grid">
          ${NOMBRES_DIA.map(n => `<div class="hc-nombre">${n}</div>`).join('')}
    `;

    for (let i = 0; i < espacios; i++) {
      html += '<button type="button" class="hc-dia vacio" disabled></button>';
    }

    for (let d = 1; d <= totalDias; d++) {
      const fecha = fmt(anio, mes, d);
      const info = dias[d];
      const futuro = fecha > hoy;
      const clases = ['hc-dia'];
      if (info) clases.push('con-ventas');
      if (fecha === hoy) clases.push('hoy');
      if (fecha === seleccionada) clases.push('seleccionado');
      if (futuro) clases.push('futuro');
      const titulo = futuro
        ? ''
        : (info ? `${info.cantidad} venta(s) · $${info.total.toFixed(2)}` : 'Sin ventas');
      html += `<button type="button" class="${clases.join(' ')}" data-fecha="${fecha}" title="${titulo}" ${futuro ? 'disabled' : ''}>${d}</button>`;
    }

    html += `</div><div class="hc-leyenda">Días con ventas</div></div>`;
    contenedor.innerHTML = html;

    document.getElementById('hc-prev').onclick = () => {
      mes--;
      if (mes < 1) { mes = 12; anio--; }
      dibujar();
    };
    document.getElementById('hc-next').onclick = () => {
      mes++;
      if (mes > 12) { mes = 1; anio++; }
      dibujar();
    };
    contenedor.querySelectorAll('button.hc-dia:not(.vacio):not(.futuro)').forEach(boton => {
      boton.onclick = () => irA(boton.dataset.fecha);
    });
  }

  // Abrir y cerrar el calendario desplegable
  btnAbrir.onclick = () => popover.classList.toggle('abierto');
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.hf-selector')) popover.classList.remove('abierto');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') popover.classList.remove('abierto');
  });

  // Flechas de día anterior / día siguiente
  const btnAnt = document.getElementById('hf-dia-ant');
  const btnSig = document.getElementById('hf-dia-sig');
  if (btnAnt) btnAnt.onclick = () => { if (seleccionada) irA(sumarDias(seleccionada, -1)); };
  if (btnSig) btnSig.onclick = () => { if (seleccionada && seleccionada < hoy) irA(sumarDias(seleccionada, 1)); };

  dibujar();
})();