'use strict';

dayjs.extend(dayjs_plugin_customParseFormat);
dayjs.extend(dayjs_plugin_duration);
dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_timezone);
dayjs.locale('es');

// ==================================================
// PUNTO 1: EDAD EN COSAS RARAS
// ==================================================

const fechaIntroducida = document.getElementById("nacimiento");
const formulario1 = document.getElementById("form-edad");
const errorEdad = document.getElementById("error-edad");
const resultadoEdad = document.getElementById("resultado-edad");

const diasEdadEl = document.getElementById("dias-edad");
const horasEdadEl = document.getElementById("horas-edad");
const segundosEdadEl = document.getElementById("segundos-edad");
const diaSemanaEl = document.getElementById("dia-semana");
const viernesEl = document.getElementById("viernes");
const instanteCalculoEl = document.getElementById("instante-calculo");



function contarViernes13(fechaInicio, fechaFin) {
  let contador = 0;
  let actual = fechaInicio.startOf('month');

  while (actual.isBefore(fechaFin) || actual.isSame(fechaFin, 'month')) {
    const dia13 = actual.date(13);

    const enRango = (dia13.isAfter(fechaInicio) || dia13.isSame(fechaInicio, 'day')) &&
                    (dia13.isBefore(fechaFin) || dia13.isSame(fechaFin, 'day'));

    if (enRango && dia13.day() === 5) {
      contador++;
    }

    actual = actual.add(1, 'month');
  }

  return contador;
}



function calcularEdad(fechaNacimiento) {
  const ahora = dayjs();

  return {
    dias: ahora.diff(fechaNacimiento, 'day'),
    horas: ahora.diff(fechaNacimiento, 'hour'),
    segundos: ahora.diff(fechaNacimiento, 'second'),
    diaSemana: fechaNacimiento.format('dddd'),
    viernes13: contarViernes13(fechaNacimiento, ahora),
    instante: ahora.format('DD/MM/YYYY HH:mm:ss')
  };
}



function mostrarEdad(datos) {
  diasEdadEl.textContent = datos.dias.toLocaleString('es-ES');
  horasEdadEl.textContent = datos.horas.toLocaleString('es-ES');
  segundosEdadEl.textContent = datos.segundos.toLocaleString('es-ES');
  diaSemanaEl.textContent = datos.diaSemana;
  viernesEl.textContent = datos.viernes13;
  instanteCalculoEl.textContent = `Cálculo realizado el ${datos.instante}`;

  resultadoEdad.removeAttribute("hidden");
  errorEdad.textContent = "";
}

function procesarFormularioEdad(event) {
  event.preventDefault();

  const valorInput = fechaIntroducida.value;

  if (!valorInput) {
    errorEdad.textContent = "Por favor, introduce una fecha de nacimiento válida.";
    resultadoEdad.setAttribute("hidden", "true");
    return;
  }

  const fechaNacimiento = dayjs(valorInput).startOf('day');
  const ahora = dayjs();

  if (!fechaNacimiento.isValid()) {
    errorEdad.textContent = "La fecha introducida no es válida.";
    resultadoEdad.setAttribute("hidden", "true");
    return;
  }

  if (fechaNacimiento.isAfter(ahora)) {
    errorEdad.textContent = "La fecha de nacimiento no puede ser futura.";
    resultadoEdad.setAttribute("hidden", "true");
    return;
  }

  const datosCalculados = calcularEdad(fechaNacimiento);
  mostrarEdad(datosCalculados);
}

function iniciarEdad() {
  if (formulario1) {
    formulario1.addEventListener("submit", procesarFormularioEdad);
  }
}

// ==================================================
// PUNTO 2: CUENTA ATRÁS
// ==================================================

const contador = document.getElementById("contador");
const fechaEvento = document.getElementById("fecha-evento");

const ahora = dayjs();
const proximoAno = ahora.year() + 1;
const fechaAnoNuevo = dayjs(`${proximoAno}-01-01T00:00:00`);

function descomponerDuracion(milisegundos) {
  const duracion = dayjs.duration(milisegundos);

  return {
    dias: Math.floor(duracion.asDays()),
    horas: duracion.hours(),
    minutos: duracion.minutes(),
    segundos: duracion.seconds()
  };
}

function actualizarCuentaAtras() {
  const ahora = dayjs();
  const diferenciaMs = fechaAnoNuevo.diff(ahora);

  if (diferenciaMs <= 0) {
    contador.textContent = "¡El evento ha llegado!";
    return;
  }

  const { dias, horas, minutos, segundos } = descomponerDuracion(diferenciaMs);
  contador.textContent = `Faltan ${dias} días, ${horas} horas, ${minutos} minutos y ${segundos} segundos para Año Nuevo (${proximoAno}).`;
}

function iniciarCuentaAtras() {
  if (fechaEvento) {
    fechaEvento.textContent = `Fecha objetivo: 01/01/${proximoAno} 00:00:00`;
  }
  actualizarCuentaAtras();
}



// ==================================================
// PUNTO 3: ZONAS HORARIAS
// ==================================================

const horaLocal = document.getElementById("hora-local");
const horaTokyo = document.getElementById("hora-tokio");
const horaNY = document.getElementById("hora-nueva-york");
const horaSidney = document.getElementById("hora-sidney");

function actualizarZonasHorarias() {
  
  horaLocal.textContent = dayjs().format("DD/MM/YYYY HH:mm:ss");
  horaTokyo.textContent = dayjs().tz("Asia/Tokyo").format("DD/MM/YYYY HH:mm:ss");
  horaNY.textContent = dayjs().tz("America/New_York").format("DD/MM/YYYY HH:mm:ss");
  horaSidney.textContent = dayjs().tz("Australia/Sydney").format("DD/MM/YYYY HH:mm:ss");
}

// ==================================================
// INICIO Y ACTUALIZACIÓN COMÚN
// ==================================================

function actualizarRelojes() {
  actualizarCuentaAtras();
  actualizarZonasHorarias();
}

iniciarEdad();
iniciarCuentaAtras();

// Ejecutamos la función nada más empezar y creamos un intervalo
actualizarRelojes();
// Un intervalo permite ejecutar una función cada x segundos (1000ms == 1seg)
setInterval(actualizarRelojes, 1000);
