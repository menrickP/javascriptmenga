<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tableau de bord Étudiant</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
  <script src="script.js"></script>
</head>
<body>
  <header>
    <h1>Tableau de bord Étudiant</h1>
  </header>
  <nav>
    <a href="student.html" class="active">Étudiant</a>
    <a href="teacher.html">Enseignant</a>
    <a href="admin.html">Administrateur</a>
  </nav>
  <main>
    <h2>Emploi du temps</h2>
    <table id="emploiTable">
      <thead>
        <tr>
          <th>Jour</th>
          <th>Heure</th>
          <th>Matière</th>
        </tr>
      </thead>
      <tbody id="studentTableBody"></tbody>
    </table>
    <button id="downloadButton">📄 Télécharger en PDF</button>
  </main>

  <script>
    const tbodyId = "studentTableBody";

    document.addEventListener('DOMContentLoaded', function() {
      loadTimetable(tbodyId); // Initial load
    });

    document.getElementById("downloadButton").addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("Emploi du temps", 14, 15);
      doc.autoTable({ html: "#emploiTable", startY: 20 });
      doc.save("emploi_du_temps.pdf");
    });
  </script>
</body>
</html>