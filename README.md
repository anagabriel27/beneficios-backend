# Reto Técnico - Sistema de Evaluación de Elegibilidad para Beneficios Sociales

## Descripción
Este proyecto implementa un servicio externo en Node.js + Express para evaluar la elegibilidad de solicitudes de beneficios sociales.

## Tecnologías usadas
- Node.js
- Express
- CORS
- Render

## Ejecución local
1. Clonar el repositorio
2. Instalar dependencias:
   npm install
3. Ejecutar el proyecto:
   npm start

## Endpoint principal
POST /api/beneficio/evaluar

## Ejemplo de entrada
```json
{
  "solicitudId": "SOL-001",
  "tipoBeneficio": "Vivienda",
  "ingresosMensuales": 900000,
  "estrato": 1,
  "nucleoFamiliar": 5,
  "fechaNacimiento": "1960-05-12"
}