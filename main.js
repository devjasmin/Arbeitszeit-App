const arbeitszeiten = JSON.parse(localStorage.getItem("arbeitszeiten")) || [];

const dateOfDayInput = document.getElementById("date");
const beginnInput = document.getElementById("beginnWork");
const startMittagsPauseInput = document.getElementById("beginnBreak");
const endMittagsPauseInput = document.getElementById("endBreak");
const endInput = document.getElementById("endWork");

function save() {
  const zeiten = {
    Datum: dateOfDayInput.value,
    Arbeitsbeginn: beginnInput.value,
    Pausenstart: startMittagsPauseInput.value,
    Pausenende: endMittagsPauseInput.value,
    Arbeitsende: endInput.value,
  };

  // Arbeitszeiten berechnen und ins Objekt speichern
  zeiten.Arbeitsdauer = calculate(
    zeiten.Arbeitsbeginn,
    zeiten.Pausenstart,
    zeiten.Pausenende,
    zeiten.Arbeitsende
  );

  console.log(zeiten);

  arbeitszeiten.push(zeiten);
  localStorage.setItem("arbeitszeiten", JSON.stringify(arbeitszeiten));

  // Felder leeren
  dateOfDayInput.value = "";
  beginnInput.value = "";
  startMittagsPauseInput.value = "";
  endMittagsPauseInput.value = "";
  endInput.value = "";

  // auch die alte Ausgabe leeren
  document.getElementById("output").innerHTML = "";
}

function calculate() {
  // hole die zuletzt eingegebenen Zeiten (oder aus dem Array)
  const dateOfDayInput = document.getElementById("date");
  const beginnInput = document.getElementById("beginnWork").value;
  const startMittagsPauseInput = document.getElementById("beginnBreak");
  const endMittagsPauseInput = document.getElementById("endBreak");
  const endInput = document.getElementById("endWork").value;

  if (!beginnInput || !endInput) {
    document.getElementById("output").innerHTML =
      "Bitte Arbeitsbeginn und Arbeitsende eingeben";
    return;
  }

  // kleine Hilfsfunktion: HH:00 -> Date
  function toDate(time) {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return new Date(0, 0, 0, h, m);
  }

  const startDate = toDate(beginnInput);
  const endeDate = toDate(endInput);

  // Grunddauer in Minuten
  let minuten = (endeDate - startDate) / 60000;
  if (minuten < 0) minuten += 24 * 60; // falls über Mitternacht

  // Pause abziehen (falls vorhanden)
  if (pausenStart && pausenEnde) {
    const pauseS = toDate(pausenStart);
    const pauseE = toDate(pausenEnde);
    let pauseMin = (pauseE - pauseS) / 60000;
    if (pauseMin < 0) pauseMin += 24 * 60; // theoretisch, falls Pause über Mitternacht
    minuten -= pauseMin;
  }

  if (minuten < 0) minuten = 0; // Sicherheit

  const stunden = Math.floor(minuten / 60);
  const restMinuten = Math.round(minuten % 60);

  document.getElementById(
    "output"
  ).innerHTML = `Arbeiten: ${stunden}h ${restMinuten}min`;
}
function print() {
  const daten = JSON.parse(localStorage.getItem("arbeitszeiten")) || [];
  let html = "<table border='2' cellspacing='0' cellpadding='5'>";
  html +=
    "<tr><th>Datum</th><th>Arbeitsbeginn</th><th>Pausenstart</th><th>Pausenende</th><th>Arbeitsende</th><th>Arbeitsdauer</th</tr>";

  // Hilfsfunktion für Zeit zu Date
  function toDate(time) {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return new Date(0, 0, 0, h, m);
  }

  arbeitszeiten.forEach((eintrag) => {
    html += `<tr>
      <td>${eintrag.Datum}</td>
      <td>${eintrag.Arbeitsbeginn}</td>
      <td>${eintrag.Pausenstart}</td>
      <td>${eintrag.Pausenende}</td>
      <td>${eintrag.Arbeitsende}</td>
      <td>${eintrag.Arbeitsdauer}</td>
    </tr>`;
  });

  html += "</table>";
  document.getElementById("printArea").innerHTML = html;

  // Druckdialog öffnen
  window.print();
}
