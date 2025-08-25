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
    if (typeof time !== "string") {
      // console.error("Invalid time format:", time);
      return null;
    }
    const [hours, minutes] = time.split(":");
    return new Date(0, 0, 0, parseInt(hours), parseInt(minutes));
  }

  const startDate = toDate(beginnInput);
  const endeDate = toDate(endInput);

  // Grunddauer in Minuten
  let minuten = (endeDate - startDate) / 60000;
  if (minuten < 0) minuten += 24 * 60; // falls über Mitternacht

  // Pause abziehen (falls vorhanden)
  if (startMittagsPauseInput && endMittagsPauseInput) {
    const pauseS = toDate(startMittagsPauseInput);
    const pauseE = toDate(endMittagsPauseInput);
    let pauseMin = (pauseE - pauseS) / 60000;
    if (pauseMin < 0) pauseMin += 24 * 60; // theoretisch, falls Pause über Mitternacht
    minuten -= pauseMin;
  }

  if (minuten < 0) minuten = 0; // Sicherheit

  const stunden = Math.floor(minuten / 60);
  const restMinuten = Math.round(minuten % 60);

  document.getElementById(
    "output"
  ).innerHTML = `gearbeitete Stunden: ${stunden}h ${restMinuten}min`;
}
function print() {
  const arbeitszeiten = JSON.parse(localStorage.getItem("arbeitszeiten")) || [];

  const table = document.createElement("table");
  table.style.border = "2px solid black";
  table.style.borderCollapse = "collapse";
  table.style.padding = "5px";

  const cell = document.createElement("td");
  cell.style.border = "1px solid black";
  cell.style.padding = "5px";

  // Kopfzeile
  const headerRow = document.createElement("tr");
  [
    "Datum",
    "Arbeitsbeginn",
    "Pausenstart",
    "Pausenende",
    "Arbeitsende",
    "Arbeitsdauer",
  ].forEach((label) => {
    const cell = document.createElement("td"); // td statt th, wenn du keine Kopfzeilen willst
    cell.textContent = label;
    headerRow.appendChild(cell);
  });
  table.appendChild(headerRow);

  arbeitszeiten.forEach((eintrag) => {
    const row = document.createElement("tr");
    [
      eintrag.Datum,
      eintrag.Arbeitsbeginn,
      eintrag.Pausenstart,
      eintrag.Pausenende,
      eintrag.Arbeitsende,
      eintrag.Arbeitsdauer,
    ].forEach((val) => {
      const cell = document.createElement("td");
      cell.textContent = val || "";
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  const printArea = document.getElementById("printArea");
  printArea.innerHTML = ""; // alte Tabelle löschen
  printArea.appendChild(table);
}
