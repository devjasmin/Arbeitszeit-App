let arbeitszeiten = JSON.parse(localStorage.getItem("arbeitszeiten")) || [];

function save() {
  const zeiten = {
    Datum: document.getElementById("date").value,
    Arbeitsbeginn: document.getElementById("beginnWork").value,
    Pausenstart: document.getElementById("pausenStart").value,
    Pausenende: document.getElementById("pausenEnde").value,
    Arbeitsende: document.getElementById("endWork").value,
  };

  console.log(zeiten);

  arbeitszeiten.push(zeiten);
  localStorage.setItem("arbeitszeiten", JSON.stringify(arbeitszeiten));

  // Felder leeren
  document.getElementById("date").value = "";
  document.getElementById("beginnWork").value = "";
  document.getElementById("pausenStart").value = "";
  document.getElementById("pausenEnde").value = "";
  document.getElementById("endWork").value = "";

  // auch die alte Ausgabe leeren
  document.getElementById("ausgabe").innerHTML = "";
}

function berechneArbeitsDauer() {
  // hole die zuletzt eingegebenen Zeiten (oder aus dem Array)
  const start = document.getElementById("beginnWork").value;
  const pausenStart = document.getElementById("pausenStart").value;
  const pausenEnde = document.getElementById("pausenEnde").value;
  const ende = document.getElementById("endWork").value;

  if (!start || !ende) {
    document.getElementById("ausgabe").innerHTML =
      "Bitte Arbeitsbeginn und Arbeitsende eingeben";
    return;
  }

  // kleine Hilfsfunktion: HH:00 -> Date
  function toDate(time) {
    if (!time) return null;
    const [h, m] = time.split(":").map(Number);
    return new Date(0, 0, 0, h, m);
  }

  const startDate = toDate(start);
  const endeDate = toDate(ende);

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
    "ausgabe"
  ).innerHTML = `Arbeiten: ${stunden}h ${restMinuten}min`;
}
