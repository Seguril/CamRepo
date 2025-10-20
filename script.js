const codigosRegistrados = {};

function iniciarCamara() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#camara'),
      constraints: {
        facingMode: "environment"
      }
    },
    decoder: {
      readers: ["code_39_reader"]
    }
  }, function (err) {
    if (err) {
      console.error("Error al iniciar Quagga:", err);
      alert("No se pudo acceder a la cámara.");
      return;
    }
    Quagga.start();
    document.getElementById('scanResult').textContent = "📡 Escaneo activo...";
  });
}

function reiniciarEscaneoConRetraso(ms = 5000) {
  Quagga.stop();
  setTimeout(() => {
    Quagga.start();
    document.getElementById('scanResult').textContent = "📡 Escaneo reanudado...";
  }, ms);
}

function agregarContenedor(codigo, fecha = null) {
  const fechaRegistro = fecha || new Date().toLocaleString();
  codigosRegistrados[codigo] = fechaRegistro;

  const tabla = document.querySelector('#tablaContenedores tbody');
  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td></td>
    <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
    <td>${fechaRegistro}</td>
    <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
  `;
  tabla.prepend(fila);
  actualizarNumeracion();
}

function actualizarNumeracion() {
  const filas = document.querySelectorAll('#tablaContenedores tbody tr');
  filas.forEach((fila, i) => {
    fila.cells[0].textContent = i + 1;
  });
}

function actualizarCodigo(codigoAntiguo, nuevoCodigo) {
  const fecha = codigosRegistrados[codigoAntiguo];
  delete codigosRegistrados[codigoAntiguo];
  codigosRegistrados[nuevoCodigo] = fecha;
  recargarTabla();
  document.getElementById('scanResult').textContent = `✏️ Código actualizado: ${nuevoCodigo}`;
}

function eliminarCodigo(codigo) {
  delete codigosRegistrados[codigo];
  recargarTabla();
  document.getElementById('scanResult').textContent = `🗑️ Código eliminado`;
}

function recargarTabla() {
  const tabla = document.querySelector('#tablaContenedores tbody');
  tabla.innerHTML = '';
  Object.entries(codigosRegistrados).reverse().forEach(([codigo, fecha], i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
      <td>${fecha}</td>
      <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });
}

function descargarArchivoDat() {
  const contenido = Object.entries(codigosRegistrados)
    .map(([codigo, fecha]) => `${codigo}|${fecha}`)
    .join('\n');

  const blob = new Blob([contenido], { type: 'text/plain' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = 'contenedores_actualizados.dat';
  enlace.click();
}

function cargarArchivoDat() {
  const archivo = document.getElementById('archivoDat').files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    const lineas = e.target.result.split('\n');
    lineas.forEach(linea => {
      const [codigo, fecha] = linea.trim().split('|');
      if (codigo && fecha && !codigosRegistrados[codigo]) {
        agregarContenedor(codigo, fecha);
      }
    });
    document.getElementById('scanResult').textContent = `📂 Archivo cargado con ${lineas.length} registros`;
  };
  lector.readAsText(archivo);
}
Quagga.onDetected(function (data) {
  let codigo = data.codeResult.code.replace(/^[A-Za-z]+/, '');

  if (/^\d+$/.test(codigo)) {
    if (codigosRegistrados[codigo]) {
      document.getElementById('scanResult').textContent =
        `⚠️ Contenedor ${codigo} ya registrado el ${codigosRegistrados[codigo]}`;
    } else {
      agregarContenedor(codigo);
      document.getElementById('scanResult').textContent = `✅ Contenedor ${codigo} agregado`;
    }

    reiniciarEscaneoConRetraso(5000); // ⏳ Espera 5 segundos antes de reanudar
  } else {
    console.warn(`❌ Código ignorado: ${codigo} (${data.codeResult.format})`);
  }
});