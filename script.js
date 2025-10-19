//  const codigosEscaneados = []; // Solo códigos nuevos
// const codigosRegistrados = {}; // { codigo: fecha }
 

//     function iniciarCamara() {
//       Quagga.init({
//         inputStream: {
//           name: "Live",
//           type: "LiveStream",
//           target: document.querySelector('#camara'),
//           constraints: {
//             facingMode: "environment"
//           }
//         },
//         decoder: {
//           readers: ["code_39_reader"]
//         }
//       }, function (err) {
//         if (err) {
//           console.error("Error al iniciar Quagga:", err);
//           alert("No se pudo acceder a la cámara.");
//           return;
//         }
//         Quagga.start();
//         document.getElementById('scanResult').textContent = "📡 Escaneo activo...";
//       });
//     }

//     function detenerCamara() {
//       Quagga.stop();
//       document.getElementById('scanResult').textContent = "⏹️ Escaneo detenido";
//     }

//     function agregarContenedor(codigo) {
//       const tabla = document.querySelector('#tablaContenedores tbody');
//       const index = codigosEscaneados.length;
//       codigosEscaneados.push(codigo);

//       const fila = document.createElement('tr');
//       fila.innerHTML = `
//         <td>${index + 1}</td>
//         <td><input type="text" value="${codigo}" onchange="actualizarCodigo(${index}, this.value)"></td>
//         <td><button onclick="editarCodigo(${index})">✏️</button></td>
//         <td><button onclick="eliminarCodigo(${index})">🗑️</button></td>
//       `;
//       tabla.appendChild(fila);
//     }

//     function actualizarCodigo(index, nuevoValor) {
//       codigosEscaneados[index] = nuevoValor;
//       document.getElementById('scanResult').textContent = `✏️ Código actualizado: ${nuevoValor}`;
//     }

//     function editarCodigo(index) {
//       const input = document.querySelectorAll('#tablaContenedores tbody input')[index];
//       input.focus();
//     }

//     function eliminarCodigo(index) {
//       codigosEscaneados.splice(index, 1);
//       const tabla = document.querySelector('#tablaContenedores tbody');
//       tabla.innerHTML = '';
//       codigosEscaneados.forEach((codigo, i) => {
//         const fila = document.createElement('tr');
//         fila.innerHTML = `
//           <td>${i + 1}</td>
//           <td><input type="text" value="${codigo}" onchange="actualizarCodigo(${i}, this.value)"></td>
//           <td><button onclick="editarCodigo(${i})">✏️</button></td>
//           <td><button onclick="eliminarCodigo(${i})">🗑️</button></td>
//         `;
//         tabla.appendChild(fila);
//       });
//       document.getElementById('scanResult').textContent = `🗑️ Código eliminado`;
//     }

//     function descargarArchivoDat() {
//       const contenido = codigosEscaneados.join('\n');
//       const blob = new Blob([contenido], { type: 'text/plain' });
//       const enlace = document.createElement('a');
//       enlace.href = URL.createObjectURL(blob);
//       enlace.download = 'contenedores.dat';
//       enlace.click();
//     }

//     Quagga.onDetected(function (data) {
//       let codigo = data.codeResult.code;
//       const tipo = data.codeResult.format;

//       codigo = codigo.replace(/^[A-Za-z]+/, '');

//       if (/^\d+$/.test(codigo)) {
//         if (!codigosEscaneados.includes(codigo)) {
//           agregarContenedor(codigo);
//           document.getElementById('scanResult').textContent = `✅ Contenedor ${codigo} agregado`;
//         } else {
//           document.getElementById('scanResult').textContent = `⚠️ Contenedor ${codigo} ya escaneado`;
//         }
//       } else {
//         console.warn(`❌ Código ignorado: ${codigo} (${tipo})`);
//       }
//     });


//     function cargarArchivoDat() {
//   const archivo = document.getElementById('archivoDat').files[0];
//   if (!archivo) return;

//   const lector = new FileReader();
//   lector.onload = function (e) {
//     const lineas = e.target.result.split('\n');
//     lineas.forEach(linea => {
//       const [codigo, fecha] = linea.trim().split('|');
//       if (codigo && fecha) {
//         codigosRegistrados[codigo] = fecha;
//         agregarContenedor(codigo, fecha); // Mostrar en tabla
//       }
//     });
//     document.getElementById('scanResult').textContent = `📂 Archivo cargado con ${lineas.length} registros`;
//   };
//   lector.readAsText(archivo);
// }


// function agregarContenedor(codigo, fecha = null) {
//   const tabla = document.querySelector('#tablaContenedores tbody');
//   const index = codigosEscaneados.length + Object.keys(codigosRegistrados).length;

//   const fechaRegistro = fecha || new Date().toLocaleString();
//   if (!fecha) codigosEscaneados.push({ codigo, fecha: fechaRegistro });

//   const fila = document.createElement('tr');
//   fila.innerHTML = `
//     <td>${index}</td>
//     <td><input type="text" value="${codigo}" onchange="actualizarCodigo(${index}, this.value)"></td>
//     <td>${fechaRegistro}</td>
//     <td><button onclick="eliminarCodigo(${codigo})">🗑️</button></td>
//   `;
//   tabla.appendChild(fila);
// }


// Quagga.onDetected(function (data) {
//   let codigo = data.codeResult.code.replace(/^[A-Za-z]+/, '');

//   if (/^\d+$/.test(codigo)) {
//     if (codigosRegistrados[codigo]) {
//       document.getElementById('scanResult').textContent =
//         `⚠️ Contenedor ${codigo} ya registrado el ${codigosRegistrados[codigo]}`;
//     } else {
//       const fecha = new Date().toLocaleString();
//       codigosRegistrados[codigo] = fecha;
//       agregarContenedor(codigo, fecha);
//       document.getElementById('scanResult').textContent = `✅ Contenedor ${codigo} agregado`;
//     }
//   }
// });


// function descargarArchivoDat() {
//   const todos = Object.entries(codigosRegistrados)
//     .map(([codigo, fecha]) => `${codigo}|${fecha}`)
//     .join('\n');

//   const blob = new Blob([todos], { type: 'text/plain' });
//   const enlace = document.createElement('a');
//   enlace.href = URL.createObjectURL(blob);
//   enlace.download = 'contenedores_actualizados.dat';
//   enlace.click();
// }

// function reiniciarEscaneoConRetraso(ms = 5000) {
//   Quagga.stop();
//   setTimeout(() => {
//     Quagga.start();
//     document.getElementById('scanResult').textContent = "📡 Escaneo reanudado...";
//   }, ms);
// }

// Quagga.onDetected(function (data) {
//   let codigo = data.codeResult.code.replace(/^[A-Za-z]+/, '');

//   if (/^\d+$/.test(codigo)) {
//     if (codigosRegistrados[codigo]) {
//       document.getElementById('scanResult').textContent =
//         `⚠️ Contenedor ${codigo} ya registrado el ${codigosRegistrados[codigo]}`;
//     } else {
//       const fecha = new Date().toLocaleString();
//       codigosRegistrados[codigo] = fecha;
//       agregarContenedor(codigo, fecha);
//       document.getElementById('scanResult').textContent = `✅ Contenedor ${codigo} agregado`;
//     }

//     reiniciarEscaneoConRetraso(5000); // ⏳ Espera 5 segundos antes de reanudar
//   } else {
//     console.warn(`❌ Código ignorado: ${codigo} (${data.codeResult.format})`);
//   }
// });



const codigosRegistrados = {}; // { codigo: fecha }

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

function detenerCamara() {
  Quagga.stop();
  document.getElementById('scanResult').textContent = "⏹️ Escaneo detenido";
}

function reiniciarEscaneoConRetraso(ms = 5000) {
  Quagga.stop();
  setTimeout(() => {
    Quagga.start();
    document.getElementById('scanResult').textContent = "📡 Escaneo reanudado...";
  }, ms);
}

function agregarContenedor(codigo, fecha = null) {
  const tabla = document.querySelector('#tablaContenedores tbody');
  const index = tabla.rows.length + 1;
  const fechaRegistro = fecha || new Date().toLocaleString();

  codigosRegistrados[codigo] = fechaRegistro;

  const fila = document.createElement('tr');
  fila.innerHTML = `
    <td>${index}</td>
    <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
    <td>${fechaRegistro}</td>
    <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
  `;
  tabla.appendChild(fila);
}

function actualizarCodigo(codigoAntiguo, nuevoCodigo) {
  const fecha = codigosRegistrados[codigoAntiguo];
  delete codigosRegistrados[codigoAntiguo];
  codigosRegistrados[nuevoCodigo] = fecha;

  const tabla = document.querySelector('#tablaContenedores tbody');
  tabla.innerHTML = '';
  Object.entries(codigosRegistrados).forEach(([codigo, fecha], i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
      <td>${fecha}</td>
      <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });

  document.getElementById('scanResult').textContent = `✏️ Código actualizado: ${nuevoCodigo}`;
}

function eliminarCodigo(codigo) {
  delete codigosRegistrados[codigo];

  const tabla = document.querySelector('#tablaContenedores tbody');
  tabla.innerHTML = '';
  Object.entries(codigosRegistrados).forEach(([codigo, fecha], i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${i + 1}</td>
      <td><input type="text" value="${codigo}" onchange="actualizarCodigo('${codigo}', this.value)"></td>
      <td>${fecha}</td>
      <td><button onclick="eliminarCodigo('${codigo}')">🗑️</button></td>
    `;
    tabla.appendChild(fila);
  });

  document.getElementById('scanResult').textContent = `🗑️ Código eliminado`;
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

// ✅ Único bloque de escaneo con retardo
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