const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const fecha = new Date(fechaNacimiento);

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const diferenciaMes = hoy.getMonth() - fecha.getMonth();

  if (diferenciaMes < 0 || (diferenciaMes === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  return edad;
}

app.get("/", function (req, res) {
  res.send("API de evaluación de beneficios activa");
});

app.post("/api/beneficio/evaluar", function (req, res) {
  const solicitudId = req.body.solicitudId;
  const tipoBeneficio = req.body.tipoBeneficio;
  const ingresosMensuales = req.body.ingresosMensuales;
  const estrato = req.body.estrato;
  const nucleoFamiliar = req.body.nucleoFamiliar;
  const fechaNacimiento = req.body.fechaNacimiento;

  if (
    !solicitudId ||
    !tipoBeneficio ||
    ingresosMensuales === undefined ||
    estrato === undefined ||
    nucleoFamiliar === undefined ||
    !fechaNacimiento
  ) {
    return res.status(400).json({
      error: "Faltan campos requeridos"
    });
  }

  if (ingresosMensuales <= 0) {
    return res.status(400).json({
      error: "ingresosMensuales debe ser mayor que cero"
    });
  }

  if (estrato < 1 || estrato > 6) {
    return res.status(400).json({
      error: "estrato debe estar entre 1 y 6"
    });
  }

  console.log({
    solicitudId: solicitudId,
    timestamp: new Date().toISOString(),
    tipoBeneficio: tipoBeneficio
  });

  const edad = calcularEdad(fechaNacimiento);

  const reglas = [
    {
      nombre: "Ingresos mensuales menores o iguales a 1.000.000",
      cumple: ingresosMensuales <= 1000000,
      puntos: 30
    },
    {
      nombre: "Ingresos mensuales entre 1.000.001 y 2.000.000",
      cumple: ingresosMensuales >= 1000001 && ingresosMensuales <= 2000000,
      puntos: 15
    },
    {
      nombre: "Estrato menor o igual a 2",
      cumple: estrato <= 2,
      puntos: 25
    },
    {
      nombre: "Núcleo familiar mayor o igual a 4",
      cumple: nucleoFamiliar >= 4,
      puntos: 20
    },
    {
      nombre: "Edad mayor a 60 años",
      cumple: edad > 60,
      puntos: 15
    },
    {
      nombre: "Tipo de beneficio Vivienda con estrato menor o igual a 2",
      cumple: tipoBeneficio === "Vivienda" && estrato <= 2,
      puntos: 10
    }
  ];

  let score = 0;
  const detalleReglas = [];

  for (let i = 0; i < reglas.length; i++) {
    if (reglas[i].cumple) {
      score = score + reglas[i].puntos;
      detalleReglas.push("Aplica: " + reglas[i].nombre + " (+" + reglas[i].puntos + ")");
    } else {
      detalleReglas.push("No aplica: " + reglas[i].nombre);
    }
  }

  let estado = "";

  if (score >= 60) {
    estado = "Aprobado";
  } else if (score >= 30 && score <= 59) {
    estado = "En revisión";
  } else {
    estado = "Rechazado";
  }

  const motivoDecision = detalleReglas.join(". ");

  const tiempoEspera = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;

  setTimeout(function () {
    return res.status(200).json({
      solicitudId: solicitudId,
      score: score,
      estado: estado,
      motivoDecision: motivoDecision
    });
  }, tiempoEspera);
});

app.listen(PORT, function () {
  console.log("Servidor corriendo en el puerto " + PORT);
});