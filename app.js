// Firebase SDK laden
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Deine Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyCDX3qcngbSk9x2j4zXSFZpbZpCWShN-1w",
    authDomain: "leasing-kilometer.firebaseapp.com",
    projectId: "leasing-kilometer",
    storageBucket: "leasing-kilometer.firebasestorage.app",
    messagingSenderId: "772691645141",
    appId: "1:772691645141:web:3fa457cf14c80b5804885c"
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("App geladen!");
    // Firebase Initialisierung (wird nach dem Laden des DOMs ausgeführt)
    const app = initializeApp(firebaseConfig);  // Hier die Konfiguration verwenden
    const db = getFirestore(app);

  // Array für die Fahrzeuge und deren Daten
  let fahrzeugeDaten = [];
  let currentCarIndex = 0;

  // Fahrzeugdaten abrufen
  async function ladeKilometerstaende() {
    console.log("Kilometerstände");
    const fahrzeugeRef = collection(db, "Fahrzeuge");
    const fahrzeugeSnapshot = await getDocs(fahrzeugeRef);

    // Array mit Fahrzeugen befüllen
    fahrzeugeSnapshot.forEach((doc) => {
      const daten = doc.data();
      const maxKilometerstand = berechneErlaubtenKilometerstand(daten);

      // Tausendertrennpunkt hinzufügen
      const maxKilometerstandMitTrennpunkt = maxKilometerstand.toLocaleString();

      fahrzeugeDaten.push({
        id: doc.id,
        kilometerstand: `${maxKilometerstandMitTrennpunkt} km`
      });
    });

    // Zeige das erste Fahrzeug an
    zeigeFahrzeug(currentCarIndex);

    // Button-Events für Fahrzeugwechsel
    document.getElementById("prevBtn").addEventListener("click", () => wechselnFahrzeug(-1));
    document.getElementById("nextBtn").addEventListener("click", () => wechselnFahrzeug(1));
  }

  // Berechnung des erlaubten Kilometerstands
  function berechneErlaubtenKilometerstand(daten) {
    console.log("berechnung");
    const startKilometer = daten.StartKilometerStand;
    const startDatum = daten.StartDatum.toDate();
    const heute = new Date();
    const tageVergangen = (heute - startDatum) / (1000 * 60 * 60 * 24);
    const erlaubteKilometer = (10000 / 365) * tageVergangen;
    return Math.round(startKilometer + erlaubteKilometer);
  }

  // Zeigt das Fahrzeug an
function zeigeFahrzeug(index) {
  if (index < 0) currentCarIndex = fahrzeugeDaten.length - 1;
  if (index >= fahrzeugeDaten.length) currentCarIndex = 0;

  const fahrzeug = fahrzeugeDaten[currentCarIndex];

  // Holt die vorhandenen HTML-Elemente
  const carIdElement = document.getElementById("car-id");
  const carKmElement = document.getElementById("car-km");
  const carBackgroundElement = document.getElementById("car-background");

  if (carIdElement && carKmElement && carBackgroundElement) {
    carIdElement.textContent = fahrzeug.id;
    carKmElement.textContent = fahrzeug.kilometerstand;
    carBackgroundElement.className = "car-background " + fahrzeug.id.toLowerCase();
  } else {
    console.error("Ein Element fehlt im DOM.");
  }
}

  // Fahrzeug wechseln (vorwärts oder rückwärts)
  function wechselnFahrzeug(direction) {
    currentCarIndex += direction;
    zeigeFahrzeug(currentCarIndex);
  }

  // Daten laden
  ladeKilometerstaende();

  // Initialisieren der Anzeige
  console.log("DOM vollständig geladen!");
  
  // Registrierung des Service Workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker registriert'))
      .catch((error) => console.log('Fehler bei der Registrierung des Service Workers:', error));
  }
});