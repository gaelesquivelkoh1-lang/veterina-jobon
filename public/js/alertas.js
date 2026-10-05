(function () {
  async function verificarStock() {
    try {
      const res = await fetch('/productos/api/alertas');
      if (!res.ok) return;
      const productos = await res.json();

      if (productos.length > 0) {
        mostrarBanner(productos);
        reproducirSonido();
      }
    } catch (error) {
      console.error('Error al verificar stock:', error);
    }
  }

  function mostrarBanner(productos) {
    // Evitar duplicar el banner si ya existe
    if (document.getElementById('alerta-stock-banner')) return;

    const nombres = productos.map(p => `${p.nombre} (${parseFloat(p.stock_kilos).toFixed(1)} kg)`).join(' · ');

    const banner = document.createElement('div');
    banner.id = 'alerta-stock-banner';
    banner.className = 'alerta-stock-banner';
    banner.innerHTML = `
      <div class="alerta-stock-contenido">
        <span class="alerta-stock-icono">⚠️</span>
        <span class="alerta-stock-texto">
          <strong>¡Stock bajo!</strong> ${productos.length} producto${productos.length > 1 ? 's' : ''} necesitan reabastecimiento: ${nombres}
        </span>
      </div>
      <button class="alerta-stock-cerrar" id="alerta-stock-cerrar">✕</button>
    `;

    document.body.prepend(banner);

    document.getElementById('alerta-stock-cerrar').addEventListener('click', () => {
      banner.classList.add('cerrando');
      setTimeout(() => banner.remove(), 300);
    });
  }

  function reproducirSonido() {
    try {
      const contexto = new (window.AudioContext || window.webkitAudioContext)();
      const osc = contexto.createOscillator();
      const gain = contexto.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, contexto.currentTime);
      osc.frequency.setValueAtTime(660, contexto.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, contexto.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(contexto.destination);

      osc.start();
      osc.stop(contexto.currentTime + 0.4);
    } catch (error) {
      // Si el navegador bloquea el sonido automático, no pasa nada grave
      console.log('No se pudo reproducir el sonido de alerta');
    }
  }

  verificarStock();
})();