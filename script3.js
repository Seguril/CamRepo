/* ============================================================
   VARIABLES GLOBALES
   ============================================================ */

// Registros cargados manualmente (clave = código base)
const codigosRegistrados = {};

// Registros cargados desde archivo .dat (clave = código base)
const codigosDesdeArchivo = {};

// Contador incremental para ordenar registros
let contadorOrden = 0;

// Longitud mínima permitida para un código
const LONGITUD_MINIMA = 2;

// Alternancia de color para mensajes tipo "ok"
let ultimoColorVerde = false;


/* ============================================================
   NORMALIZAR CÓDIGO
   - Elimina la letra inicial si existe
   ============================================================ */
function normalizarCodigo(codigo) {
  return codigo.trim().replace(/^[A-Za-z]/, "");
}


function normalizarCodigo(codigo) {
  return codigo.trim().replace(/^[A-Za-z]/, "");
}

/* ============================================================
   INICIAR CÁMARA Y ESCANEO
   ============================================================ */
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


let ultimoCodigoLeido = "";
let tiempoUltimaLectura = 0;

function procesarCodigo(result) {
  const codigoDetectado = result.codeResult.code;
  if (!codigoDetectado) return;

  const ahora = Date.now();

  // Evitar lecturas duplicadas en menos de 1 segundo
  if (codigoDetectado === ultimoCodigoLeido && ahora - tiempoUltimaLectura < 1000) {
    return;
  }

  ultimoCodigoLeido = codigoDetectado;
  tiempoUltimaLectura = ahora;

  // Enviar el código EXACTAMENTE igual que si lo escribieras a mano
  procesarCodigoManual(codigoDetectado);
}

/* ============================================================
   PROCESAR CÓDIGO MANUAL
   ============================================================ */
function procesarCodigoManual(codigoOriginal) {
  codigoOriginal = codigoOriginal.trim().replace(/[\r\n\t]/g, "");

  if (!codigoOriginal) {
    mostrarMensaje("❌ Código vacío", "error");
    return;
  }

  if (!/^[A-Za-z]?\d+$/.test(codigoOriginal)) {
    mostrarMensaje(`❌ Código inválido: ${codigoOriginal}`, "error");
    return;
  }

  if (codigoOriginal.length < LONGITUD_MINIMA) {
    mostrarMensaje(`❌ Código demasiado corto: ${codigoOriginal}`, "error");
    return;
  }

  // Normalizar para comparar
  const codigoBase = normalizarCodigo(codigoOriginal);

  // Ya existe en archivo
  if (codigosDesdeArchivo[codigoBase]) {
    mostrarMensaje(
      `⚠️ ${codigoOriginal} ya registrado en archivo`,
      "warn",
      codigoBase
    );
    return;
  }

  // Ya existe en registros manuales
  if (codigosRegistrados[codigoBase]) {
    mostrarMensaje(
      `⚠️ ${codigoOriginal} ya escaneado`,
      "warn",
      codigoBase
    );
    return;
  }

  // Nuevo registro
  agregarContenedor(codigoBase);
  mostrarMensaje(`✅ ${codigoOriginal} agregado correctamente`, "ok");
}


/* ============================================================
   AGREGAR CONTENEDOR
   ============================================================ */
function agregarContenedor(codigoBase, fecha = null, ubicacion = null) {
  const fechaRegistro = fecha || new Date().toLocaleString();
  const ubicacionActual =
    ubicacion || document.getElementById("ubicacion").value || "Sin ubicación";

  codigosRegistrados[codigoBase] = {
    fecha: fechaRegistro,
    ubicacion: ubicacionActual,
    orden: ++contadorOrden,
  };

  // 🔥 Mantener archivo actualizado
  codigosDesdeArchivo[codigoBase] = {
    fecha: fechaRegistro,
    ubicacion: ubicacionActual
  };

  recargarTabla();
}


/* ============================================================
   RECARGAR TABLA
   ============================================================ */
function recargarTabla() {
  const tabla = document.querySelector("#tablaContenedores tbody");
  tabla.innerHTML = "";

  const ordenados = Object.entries(codigosRegistrados)
    .sort((a, b) => b[1].orden - a[1].orden);

  ordenados.forEach(([codigoBase, data], i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${codigoBase}</td>
      <td>${data.fecha}</td>
      <td>${data.ubicacion}</td>
      <td><button onclick="eliminarCodigo('${codigoBase}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });
}


/* ============================================================
   ELIMINAR CÓDIGO
   ============================================================ */
function eliminarCodigo(codigoBase) {
  delete codigosRegistrados[codigoBase];
  recargarTabla();
  mostrarMensaje(`🗑️ Código eliminado`, "warn");
}


/* ============================================================
   CARGAR ARCHIVO .DAT
   ============================================================ */
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
      const codigoOriginal = codigoRaw.trim();
      const codigoBase = normalizarCodigo(codigoOriginal);

      if (
        codigoBase &&
        /^[A-Za-z0-9]+$/.test(codigoBase) &&
        codigoBase.length >= LONGITUD_MINIMA &&
        !codigosDesdeArchivo[codigoBase]
      ) {
        codigosDesdeArchivo[codigoBase] = {
          fecha: fechaRaw?.trim() || "--/--/----, --:--:--",
          ubicacion: ubicacionRaw?.trim() || "Sin ubicación",
        };
        cargados++;
      }
    });

    mostrarMensaje(`📂 Archivo cargado (${cargados} registros)`, "ok");
  };

  lector.readAsText(archivo);
}


/* ============================================================
   MOSTRAR MENSAJE (TOAST)
   ============================================================ */
function mostrarMensaje(texto, tipo = "info", codigoBase = null) {
  const mensaje = document.getElementById("mensajeCamara");
  if (!mensaje) return;

  mensaje.innerHTML = `<span>${texto}</span>`;
  mensaje.style.position = "fixed";
  mensaje.style.top = "20px";
  mensaje.style.right = "20px";
  mensaje.style.zIndex = "999";
  mensaje.style.background = "rgba(0,0,0,0.85)";
  mensaje.style.padding = "0.75rem 1.25rem";
  mensaje.style.borderRadius = "10px";
  mensaje.style.fontSize = "1rem";
  mensaje.style.fontWeight = "bold";
  mensaje.style.border = "1px solid #cd7f32";
  mensaje.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
  mensaje.style.transition = "color 0.4s ease";
  mensaje.style.maxWidth = "320px";

  // Alternancia de color
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

  // Mostrar detalles si el código ya existe
  if (codigoBase && (texto.includes("ya") || texto.includes("registrado"))) {
    const data =
      codigosRegistrados[codigoBase] || codigosDesdeArchivo[codigoBase];

    if (data) {
      const detalle = document.createElement("div");
      detalle.innerHTML = `
        <p style="margin: 0.5rem 0; font-size: 0.9rem;">
          📅 Fecha: ${data.fecha}<br>
          📍 Ubicación: ${data.ubicacion}
        </p>
      `;
      mensaje.appendChild(detalle);

      const botones = document.createElement("div");
      botones.style.display = "flex";
      botones.style.gap = "0.5rem";

      const btnSi = document.createElement("button");
      btnSi.textContent = "✅ Actualizar";
      btnSi.style.flex = "1";
      btnSi.style.backgroundColor = "#0078d4";
      btnSi.style.color = "white";
      btnSi.style.border = "none";
      btnSi.style.padding = "0.4rem";
      btnSi.style.borderRadius = "6px";
      btnSi.style.cursor = "pointer";
      btnSi.onclick = () => {
        agregarContenedor(codigoBase);

        // 🔥 Actualizar también el archivo cargado
        codigosDesdeArchivo[codigoBase] = {
          fecha: codigosRegistrados[codigoBase].fecha,
          ubicacion: codigosRegistrados[codigoBase].ubicacion
        };

        mostrarMensaje(`✅ ${codigoBase} actualizado`, "ok");
      };

      const btnNo = document.createElement("button");
      btnNo.textContent = "❌ Continuar";
      btnNo.style.flex = "1";
      btnNo.style.backgroundColor = "#444";
      btnNo.style.color = "white";
      btnNo.style.border = "none";
      btnNo.style.padding = "0.4rem";
      btnNo.style.borderRadius = "6px";
      btnNo.style.cursor = "pointer";
      btnNo.onclick = () => {
        mensaje.innerHTML = "";
      };

      botones.appendChild(btnSi);
      botones.appendChild(btnNo);
      mensaje.appendChild(botones);
    }
  }
}


/* ============================================================
   AGREGAR CÓDIGO DESDE INPUT MANUAL
   ============================================================ */
function agregarCodigo() {
  const inputManual = document.getElementById("codigoManual");
  if (inputManual) {
    procesarCodigoManual(inputManual.value);
    inputManual.value = "";
    inputManual.focus();
  }
}


/* ============================================================
   INICIALIZACIÓN DE EVENTOS
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const btnCargar = document.getElementById("btnCargar");
  const inputArchivo = document.getElementById("archivoDat");
  const inputManual = document.getElementById("codigoManual");

  if (btnCargar && inputArchivo) {
    btnCargar.addEventListener("click", () => inputArchivo.click());
    inputArchivo.addEventListener("change", cargarArchivoDat);
  }

  if (inputManual) {
    inputManual.addEventListener("keypress", (e) => {
      if (e.key === "Enter") agregarCodigo();
    });
  }
});


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