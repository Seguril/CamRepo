const codigosRegistrados = {};
const codigosDesdeArchivo = {}; // solo para comparación
let ultimoCodigoLeido = "";
let tiempoUltimoEscaneo = 0;
let contadorOrden = 0;
const LONGITUD_MINIMA = 8;

function iniciarCamara() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector("#camara"),
        constraints: { facingMode: "environment" },
      },
      decoder: { readers: ["code_39_reader"] },
    },
    function (err) {
      if (err) {
        console.error("Error al iniciar Quagga:", err);
        mostrarMensaje("❌ No se pudo acceder a la cámara", "error");
        return;
      }
      Quagga.start();
      mostrarMensaje("📡 Escaneo activo...");
    }
  );

  Quagga.onDetected(procesarCodigo);
}

function procesarCodigo(data) {
  let codigo = data.codeResult.code.replace(/^[A-Za-z]+/, "");
  const ahora = Date.now();

  if (codigo === ultimoCodigoLeido && ahora - tiempoUltimoEscaneo < 3000)
    return;
  ultimoCodigoLeido = codigo;
  tiempoUltimoEscaneo = ahora;

  if (!/^\d+$/.test(codigo)) {
    mostrarMensaje(`❌ Código ignorado (no numérico): ${codigo}`, "error");
    return;
  }

  if (codigo.length < LONGITUD_MINIMA) {
    mostrarMensaje(`❌ Código demasiado corto: ${codigo}`, "error");
    return;
  }

  if (codigosDesdeArchivo[codigo]) {
    const { fecha, ubicacion } = codigosDesdeArchivo[codigo];
    mostrarMensaje(
      `⚠️ ${codigo} ya registrado el ${fecha} (${ubicacion})`,
      "warn"
    );
  } else if (codigosRegistrados[codigo]) {
    const { fecha, ubicacion } = codigosRegistrados[codigo];
    mostrarMensaje(
      `⚠️ ${codigo} ya escaneado el ${fecha} (${ubicacion})`,
      "warn"
    );
  } else {
    agregarContenedor(codigo);
    codigosDesdeArchivo[codigo] = {
      fecha: codigosRegistrados[codigo].fecha,
      ubicacion: codigosRegistrados[codigo].ubicacion,
    };
    mostrarMensaje(`✅ ${codigo} agregado correctamente`, "ok");
  }
}

function agregarContenedor(codigo, fecha = null, ubicacion = null) {
  const fechaRegistro = fecha || new Date().toLocaleString();
  const ubicacionActual =
    ubicacion || document.getElementById("ubicacion").value || "Sin ubicación";

  codigosRegistrados[codigo] = {
    fecha: fechaRegistro,
    ubicacion: ubicacionActual,
    orden: ++contadorOrden,
  };

  recargarTabla();
}

function recargarTabla() {
  const tabla = document.querySelector("#tablaContenedores tbody");
  tabla.innerHTML = "";

  const ordenados = Object.entries(codigosRegistrados).sort((a, b) => {
    return b[1].orden - a[1].orden;
  });

  ordenados.forEach(([codigo, data], i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
      <td>${data.fecha}</td>
      <td><input type="text" value="${
        data.ubicacion
      }" onchange="actualizarUbicacion('${codigo}', this.value)"></td>
      <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });
}

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

function eliminarCodigo(codigo) {
  delete codigosRegistrados[codigo];
  recargarTabla();
  mostrarMensaje(`🗑️ Código eliminado`, "warn");
}

function descargarArchivoDat() {
  const contenido = Object.entries(codigosDesdeArchivo)
    .map(([codigo, data]) => `${codigo}|${data.fecha}|${data.ubicacion}`)
    .join("\n");

  const blob = new Blob([contenido], { type: "text/plain" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "contenedores_actualizados.dat";
  enlace.click();
}

function cargarArchivoDat() {
  const archivo = document.getElementById("archivoDat").files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    const lineas = e.target.result.split(/\r?\n/);
    let cargados = 0;

    lineas.forEach((linea) => {
      if (!linea.trim()) return;
      const [codigoRaw, fechaRaw, ubicacionRaw] = linea.split("|");
      const codigo = codigoRaw?.trim();
      const fecha = fechaRaw?.trim();
      const ubicacion = ubicacionRaw?.trim();

      if (
        codigo &&
        /^\d+$/.test(codigo) &&
        codigo.length >= LONGITUD_MINIMA &&
        !codigosDesdeArchivo[codigo]
      ) {
        codigosDesdeArchivo[codigo] = {
          fecha: fecha || "--/--/----, --:--:-- --.",
          ubicacion: ubicacion || "Sin ubicación",
        };
        cargados++;
      }
    });

    mostrarMensaje(
      `📂 Archivo cargado para comparación (${cargados} registros)`,
      "ok"
    );
  };

  lector.readAsText(archivo);
}

let ultimoColorVerde = false;
function mostrarMensaje(texto, tipo = "info") {
  const mensaje = document.getElementById("mensajeCamara");
  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.style.background = "rgba(0,0,0,0.7)";
  mensaje.style.transition = "color 0.4s ease";

  if (tipo === "ok") {
    const color = ultimoColorVerde ? "#1E90FF" : "#00FF7F";
    ultimoColorVerde = !ultimoColorVerde;
    mensaje.style.color = color;
  } else if (tipo === "warn") {
    mensaje.style.color = "#FFD700";
  } else if (tipo === "error") {
    mensaje.style.color = "#FF6347";
  } else {
    mensaje.style.color = "#FFFFFF";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarCamara();
  const btnCargar = document.getElementById("btnCargar");
  const inputArchivo = document.getElementById("archivoDat");
  if (btnCargar && inputArchivo) {
    btnCargar.addEventListener("click", () => inputArchivo.click());
    inputArchivo.addEventListener("change", cargarArchivoDat);
  }
});
