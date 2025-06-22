// script.js
function loadTimetable(tbodyId) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) {
    console.error(`Tbody with id ${tbodyId} not found`);
    return;
  }
  const slots = JSON.parse(localStorage.getItem("creneaux")) || [];
  renderTable(slots, tbody);
}

function renderTable(slots, tbody) {
  tbody.innerHTML = ''; // Clear current table
  slots.forEach(slot => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${slot.day}</td>
      <td>${slot.time}</td>
      <td>${slot.subject}</td>
    `;
    tbody.appendChild(row);
  });
}