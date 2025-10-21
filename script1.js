// const codigosRegistrados = {}; // Almacena código, fecha y ubicación
// let ultimoCodigoLeido = "";
// let tiempoUltimoEscaneo = 0;

// // Inicializa la cámara y Quagga
// function iniciarCamara() {
//   Quagga.init({
//     inputStream: {
//       name: "Live",
//       type: "LiveStream",
//       target: document.querySelector('#camara'),
//       constraints: { facingMode: "environment" }
//     },
//     decoder: { readers: ["code_39_reader"] }
//   }, function (err) {
//     if (err) {
//       console.error("Error al iniciar Quagga:", err);
//       alert("No se pudo acceder a la cámara.");
//       return;
//     }
//     Quagga.start();
//     document.getElementById('scanResult').textContent = "📡 Escaneo activo...";
//   });

//   // Mantener cámara activa y procesar códigos
//   Quagga.onDetected(procesarCodigo);
// }

// // Procesa el código detectado
// function procesarCodigo(data) {
//   let codigo = data.codeResult.code.replace(/^[A-Za-z]+/, '');
//   const ahora = Date.now();

//   if (codigo === ultimoCodigoLeido && ahora - tiempoUltimoEscaneo < 3000) return;
//   ultimoCodigoLeido = codigo;
//   tiempoUltimoEscaneo = ahora;

// if (!/^\d+$/.test(codigo)) {
//   console.warn(`❌ Código ignorado: ${codigo} (${data.codeResult.format})`);
//   return;
// }

// if (codigosRegistrados[codigo]) {
//   const { fecha, ubicacion } = codigosRegistrados[codigo];
//   document.getElementById('scanResult').textContent =
//     `⚠️ Contenedor ${codigo} ya registrado el ${fecha} en (${ubicacion})`;
// } else {
//   agregarContenedor(codigo);
//   const fechaRegistro = codigosRegistrados[codigo].fecha;
//   document.getElementById('scanResult').textContent = 
//     `✅ Contenedor ${codigo} agregado el ${fechaRegistro}`;
// }
// }

// // Agrega un contenedor con código, fecha y ubicación
// function agregarContenedor(codigo, fecha = null, ubicacion = null) {
//   const fechaRegistro = fecha || new Date().toLocaleString();
//   const ubicacionActual = ubicacion || document.getElementById('ubicacion').value || "Sin ubicación";

//   codigosRegistrados[codigo] = { fecha: fechaRegistro, ubicacion: ubicacionActual };
//   recargarTabla();
// }

// // Recarga la tabla con códigos, fecha y ubicación
// function recargarTabla() {
//   const tabla = document.querySelector('#tablaContenedores tbody');
//   tabla.innerHTML = '';

//   Object.entries(codigosRegistrados).reverse().forEach(([codigo, data], i) => {
//     const fila = document.createElement('tr');
//     fila.innerHTML = `
//       <td>${i + 1}</td>
//       <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
//       <td>${data.fecha}</td>
//       <td><input type="text" value="${data.ubicacion}" onchange="actualizarUbicacion('${codigo}', this.value)"></td>
//       <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
//     `;
//     tabla.appendChild(fila);
//   });
// }

// // Edita el código
// function actualizarCodigo(codigoAntiguo, nuevoCodigo) {
//   if (!nuevoCodigo || codigosRegistrados[nuevoCodigo]) return;

//   codigosRegistrados[nuevoCodigo] = codigosRegistrados[codigoAntiguo];
//   delete codigosRegistrados[codigoAntiguo];
//   recargarTabla();

//   document.getElementById('scanResult').textContent = `✏️ Código actualizado: ${nuevoCodigo}`;
// }

// // Edita la ubicación
// function actualizarUbicacion(codigo, nuevaUbicacion) {
//   codigosRegistrados[codigo].ubicacion = nuevaUbicacion || "Sin ubicación";
//   document.getElementById('scanResult').textContent = `📍 Ubicación actualizada: ${nuevaUbicacion}`;
// }

// // Elimina un contenedor
// function eliminarCodigo(codigo) {
//   delete codigosRegistrados[codigo];
//   recargarTabla();
//   document.getElementById('scanResult').textContent = `🗑️ Código eliminado`;
// }

// // Descarga los códigos como archivo .dat
// function descargarArchivoDat() {
//   const contenido = Object.entries(codigosRegistrados)
//     .map(([codigo, data]) => `${codigo}|${data.fecha}|${data.ubicacion}`)
//     .join('\n');

//   const blob = new Blob([contenido], { type: 'text/plain' });
//   const enlace = document.createElement('a');
//   enlace.href = URL.createObjectURL(blob);
//   enlace.download = 'contenedores_actualizados.dat';
//   enlace.click();
// }

// // Carga códigos desde archivo .dat
// function cargarArchivoDat() {
//   const archivo = document.getElementById('archivoDat').files[0];
//   if (!archivo) return;

//   const lector = new FileReader();
//   lector.onload = function (e) {
//     const lineas = e.target.result.split(/\r?\n/);
//     lineas.forEach(linea => {
//       if (!linea.trim()) return;
//       const [codigoRaw, fechaRaw, ubicacionRaw] = linea.split('|');
//       const codigo = codigoRaw.trim();
//       const fecha = fechaRaw ? fechaRaw.trim() : null;
//       const ubicacion = ubicacionRaw ? ubicacionRaw.trim() : null;

//       if (codigo && !codigosRegistrados[codigo]) {
//         agregarContenedor(codigo, fecha, ubicacion);
//       }
//     });
//     document.getElementById('scanResult').textContent = `📂 Archivo cargado con ${lineas.length} registros`;
//   };

//   lector.readAsText(archivo);
// }

// // Inicializa cámara cuando el DOM está listo
// document.addEventListener('DOMContentLoaded', () => {
//   iniciarCamara();
// });
// const btnCargar = document.getElementById('btnCargar');
//   const inputArchivo = document.getElementById('archivoDat');

//   btnCargar.addEventListener('click', () => {
//     inputArchivo.click(); // abre el selector de archivos
//   });

//   inputArchivo.addEventListener('change', () => {
//     cargarArchivoDat(); // ejecuta tu función al seleccionar el archivo
//   });



const codigosRegistrados = {};
let ultimoCodigoLeido = "";
let tiempoUltimoEscaneo = 0;

// 📸 Inicia la cámara
function iniciarCamara() {
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#camara'),
      constraints: { facingMode: "environment" }
    },
    decoder: { readers: ["code_39_reader"] }
  }, function (err) {
    if (err) {
      console.error("Error al iniciar Quagga:", err);
      mostrarMensaje("❌ No se pudo acceder a la cámara", "error");
      return;
    }
    Quagga.start();
    mostrarMensaje("📡 Escaneo activo...");
  });

  Quagga.onDetected(procesarCodigo);
}

// 🔍 Procesa el código detectado
function procesarCodigo(data) {
  let codigo = data.codeResult.code.replace(/^[A-Za-z]+/, '');
  const ahora = Date.now();

  if (codigo === ultimoCodigoLeido && ahora - tiempoUltimoEscaneo < 3000) return;
  ultimoCodigoLeido = codigo;
  tiempoUltimoEscaneo = ahora;

  if (!/^\d+$/.test(codigo)) {
    mostrarMensaje(`❌ Código ignorado (${data.codeResult.format})`, "error");
    return;
  }

  if (codigosRegistrados[codigo]) {
    const { fecha, ubicacion } = codigosRegistrados[codigo];
    mostrarMensaje(`⚠️ ${codigo} ya registrado el ${fecha} (${ubicacion})`, "warn");
  } else {
    agregarContenedor(codigo);
    mostrarMensaje(`✅ ${codigo} agregado correctamente`, "ok");
  }
}

// 🧾 Agrega un contenedor con código, fecha y ubicación
function agregarContenedor(codigo, fecha = null, ubicacion = null) {
  const fechaRegistro = fecha || new Date().toLocaleString();
  const ubicacionActual = ubicacion || document.getElementById('ubicacion').value || "Sin ubicación";

  codigosRegistrados[codigo] = { fecha: fechaRegistro, ubicacion: ubicacionActual };
  recargarTabla();
}

// 📋 Recarga la tabla
function recargarTabla() {
  const tabla = document.querySelector('#tablaContenedores tbody');
  tabla.innerHTML = '';

  Object.entries(codigosRegistrados).reverse().forEach(([codigo, data], i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
      <td>${data.fecha}</td>
      <td><input type="text" value="${data.ubicacion}" onchange="actualizarUbicacion('${codigo}', this.value)"></td>
      <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });
}

// ✏️ Editar código o ubicación
function actualizarCodigo(codigoAntiguo, nuevoCodigo) {
  if (!nuevoCodigo || codigosRegistrados[nuevoCodigo]) return;
  codigosRegistrados[nuevoCodigo] = codigosRegistrados[codigoAntiguo];
  delete codigosRegistrados[codigoAntiguo];
  recargarTabla();
  mostrarMensaje(`✏️ Código actualizado: ${nuevoCodigo}`, "ok");
}

function actualizarUbicacion(codigo, nuevaUbicacion) {
  codigosRegistrados[codigo].ubicacion = nuevaUbicacion || "Sin ubicación";
  mostrarMensaje(`📍 Ubicación actualizada: ${nuevaUbicacion}`, "ok");
}

// 🗑️ Eliminar código
function eliminarCodigo(codigo) {
  delete codigosRegistrados[codigo];
  recargarTabla();
  mostrarMensaje(`🗑️ Código eliminado`, "warn");
}

// 💾 Descargar archivo .dat
function descargarArchivoDat() {
  const contenido = Object.entries(codigosRegistrados)
    .map(([codigo, data]) => `${codigo}|${data.fecha}|${data.ubicacion}`)
    .join('\n');

  const blob = new Blob([contenido], { type: 'text/plain' });
  const enlace = document.createElement('a');
  enlace.href = URL.createObjectURL(blob);
  enlace.download = 'contenedores_actualizados.dat';
  enlace.click();
}

// 📂 Cargar archivo .dat
function cargarArchivoDat() {
  const archivo = document.getElementById('archivoDat').files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    const lineas = e.target.result.split(/\r?\n/);
    let cargados = 0;

    lineas.forEach(linea => {
      if (!linea.trim()) return;
      const [codigoRaw, fechaRaw, ubicacionRaw] = linea.split('|');
      const codigo = codigoRaw?.trim();
      const fecha = fechaRaw?.trim();
      const ubicacion = ubicacionRaw?.trim();

      if (codigo && !codigosRegistrados[codigo]) {
        agregarContenedor(codigo, fecha, ubicacion);
        cargados++;
      }
    });

    mostrarMensaje(`📂 Archivo cargado (${cargados} registros)`, "ok");
  };

  lector.readAsText(archivo);
}

// 🎯 Mostrar mensaje sobre la cámara (overlay)
function mostrarMensaje(texto, tipo = "info") {
  const mensaje = document.getElementById('mensajeCamara');
  if (!mensaje) return;

  mensaje.textContent = texto;

  // Colores según tipo
  if (tipo === "ok") mensaje.style.color = "#7CFC00"; // verde claro
  else if (tipo === "warn") mensaje.style.color = "#FFD700"; // dorado
  else if (tipo === "error") mensaje.style.color = "#FF6347"; // rojo suave
  else mensaje.style.color = "#FFD700";

  mensaje.style.background = "rgba(0,0,0,0.7)";
}

// 🚀 Inicializar
document.addEventListener('DOMContentLoaded', () => {
  iniciarCamara();

  const btnCargar = document.getElementById('btnCargar');
  const inputArchivo = document.getElementById('archivoDat');

  if (btnCargar && inputArchivo) {
    btnCargar.addEventListener('click', () => inputArchivo.click());
    inputArchivo.addEventListener('change', cargarArchivoDat);
  }
});
