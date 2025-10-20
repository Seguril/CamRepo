body {
  font-family: 'Segoe UI', sans-serif;
  background-color: #0a1f2d;
  color: #f5f5dc;
  margin: 0;
  padding: 20px;
}

h1 {
  color: #ffd700;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 10px;
}

#camara {
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 20px auto 0;
  border: 4px solid #cd7f32;
  border-radius: 10px;
  background-color: #1c2e40;
  overflow: hidden;
}

#camara video,
#camara canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

#scanResult {
  text-align: center;
  font-size: 18px;
  margin: 10px 0;
  color: #ffd700;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #1c2e40;
  min-width: 600px;
}

th, td {
  border: 1px solid #cd7f32;
  padding: 10px;
  text-align: center;
  color: #f5f5dc;
  white-space: nowrap;
}

th {
  background-color: #cd7f32;
  color: #fff;
}

input[type="text"] {
  background-color: #0a1f2d;
  color: #f5f5dc;
  border: 1px solid #cd7f32;
  padding: 6px;
  border-radius: 4px;
  width: 100px;
}

.archivo {
  margin-top: 20px;
  text-align: center;
}

.archivo label {
  font-weight: bold;
  margin-right: 10px;
  color: #f0efea;
   background-color: #96724d;
  color: #fff;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px;
  min-width: 140px;
}
.archivo label:hover {
  background-color: #b06a29;
}

.archivo input[type="file"] {
  background-color: #1c2e40;
  color: #f5f5dc;
  border: 1px solid #cd7f32;
  padding: 6px;
  border-radius: 6px;
  font-size: 14px;
  display: none;
}

button {
  background-color: #cd7f32;
  color: #fff;
  border: none;
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  margin: 5px;
  min-width: 140px;
}

button:hover {
  background-color: #b06a29;
}

.boton-flotante {
  position: fixed;
  bottom: 80px; /* altura cómoda en escritorio */
  right: 20px;
  background-color: #0078D4;
  color: white;
  border: none;
  padding: 14px 20px;
  font-size: 18px;
  border-radius: 50px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  cursor: pointer;
  z-index: 999;
}

.boton-flotante:hover {
  background-color: #005A9E;
}
@media (max-width: 700px) {
  h1 {
    font-size: 1.5rem;
  }

  #camara {
    height: 260px;
  }

  button {
    font-size: 14px;
    padding: 8px 12px;
    min-width: 100px;
  }

  th, td {
    font-size: 13px;
    padding: 6px;
  }

  input[type="text"] {
    width: 700px;
    font-size: 13px;
  }

  .boton-flotante {
    bottom: 90px; /* Altura cómoda para el pulgar */
    right: 15px;
    padding: 12px 18px;
    font-size: 16px;
  }
}