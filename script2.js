const codigosRegistrados = {};
const codigosDesdeArchivo = {};
let contadorOrden = 0;
const LONGITUD_MINIMA = 2;

//Alfanúmerico

function procesarCodigoManual(codigo) {
  codigo = codigo.trim();

  if (!codigo) {
    mostrarMensaje("❌ Código vacío", "error");
    return;
  }

  // 🔹 Permitir letras y números
  if (!/^[A-Za-z0-9]+$/.test(codigo)) {
    mostrarMensaje(`❌ Código inválido: ${codigo}`, "error");
    return;
  }

  if (codigo.length < LONGITUD_MINIMA) {
    mostrarMensaje(`❌ Código demasiado corto: ${codigo}`, "error");
    return;
  }

  if (codigosRegistrados[codigo]) {
    mostrarMensaje(`⚠️ ${codigo} ya ingresado`, "warn", codigo);
  } else if (codigosDesdeArchivo[codigo]) {
    mostrarMensaje(`⚠️ ${codigo} ya registrado en archivo`, "warn", codigo);
  } else {
    agregarContenedor(codigo);
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

  const ordenados = Object.entries(codigosRegistrados).sort((a, b) => b[1].orden - a[1].orden);

  ordenados.forEach(([codigo, data], i) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td>${codigo}</td>
      <td>${data.fecha}</td>
      <td>${data.ubicacion}</td>
      <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });
}

function eliminarCodigo(codigo) {
  delete codigosRegistrados[codigo];
  recargarTabla();
  mostrarMensaje(`🗑️ Código eliminado`, "warn");
}

function descargarArchivoDat() {
  // Unir registros del archivo y los manuales
  const todos = { ...codigosDesdeArchivo, ...codigosRegistrados };

  const contenido = Object.entries(todos)
    .map(([codigo, data]) => `${codigo}|${data.fecha}|${data.ubicacion}`)
    .join("\n");

  const blob = new Blob([contenido], { type: "text/plain" });
  const enlace = document.createElement("a");
  enlace.href = URL.createObjectURL(blob);
  enlace.download = "Lectura_Palet"; // 🔹 archivo nuevo
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

// Alias para el botón ➕
function agregarCodigo() {
  const inputManual = document.getElementById("codigoManual");
  if (inputManual) {
    procesarCodigoManual(inputManual.value);
    inputManual.value = "";
    inputManual.focus();
  }
}

// Inicialización
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
      if (e.key === "Enter") {
        agregarCodigo();
      }
    });
  }
});

function mostrarMensaje(texto, tipo = "info", codigo = null) {
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
  mensaje.style.color = "#FFFFFF";

  if (tipo === "ok") {
    mensaje.style.color = "#00FF7F";
  } else if (tipo === "warn") {
    mensaje.style.color = "#FFD700";
  } else if (tipo === "error") {
    mensaje.style.color = "#FF6347";
  }

  // Si el código ya existe, mostrar detalles y opciones
  // Si el código ya existe, mostrar detalles y opciones
if ((texto.includes("ya ingresado") || texto.includes("ya registrado")) && codigo) {
  const data = codigosRegistrados[codigo] || codigosDesdeArchivo[codigo];
  if (data) {
    const { fecha, ubicacion } = data;
    const detalle = document.createElement("div");
    detalle.innerHTML = `
      <p style="margin: 0.5rem 0; font-size: 0.9rem;">
        📅 Fecha: ${fecha}<br>
        📍 Ubicación: ${ubicacion}
      </p>
    `;
    mensaje.appendChild(detalle);

    const botones = document.createElement("div");
    botones.style.display = "flex";
    botones.style.justifyContent = "space-between";
    botones.style.gap = "0.5rem";

    const btnSi = document.createElement("button");
    btnSi.textContent = "✅ Actualizar";
    btnSi.style.flex = "1";
    btnSi.style.backgroundColor = "#0078d4";
    btnSi.style.color = "white";
    btnSi.style.border = "none";
    btnSi.style.padding = "0.4rem";
    btnSi.style.fontSize = "0.9rem";
    btnSi.style.borderRadius = "6px";
    btnSi.style.cursor = "pointer";
    btnSi.onclick = () => {
      agregarContenedor(codigo); // sobrescribe con nueva fecha y ubicación
      mostrarMensaje(`✅ ${codigo} actualizado`, "ok");
    };

    const btnNo = document.createElement("button");
    btnNo.textContent = "❌ Continuar";
    btnNo.style.flex = "1";
    btnNo.style.backgroundColor = "#444";
    btnNo.style.color = "white";
    btnNo.style.border = "none";
    btnNo.style.padding = "0.4rem";
    btnNo.style.fontSize = "0.9rem";
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