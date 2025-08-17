let arbeitszeiten = [];

function save() {
  let zeiten = {
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
}
