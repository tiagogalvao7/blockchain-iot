async function loadData() {
  try {
    const res = await fetch(
      "http://localhost:4000/api/sensor-data/with-etherscan"
    );
    const data = await res.json();

    const tbody = document.querySelector("#data-table tbody");
    tbody.innerHTML = "";

    data.forEach((item) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${new Date(item.createdAt).toLocaleString()}</td>
        <td>${item.temperature}</td>
        <td>${item.humidity}</td>
        <td>${item.hash.slice(0, 10)}...</td>
        <td>${item.txHash ? item.txHash.slice(0, 10) + "..." : "-"}</td>
        <td>
          ${
            item.etherscanLink
              ? `<a href="${item.etherscanLink}" target="_blank">Check on Etherscan</a>`
              : "Not yet sent"
          }
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Erro a carregar dados:", err);
  }
}

loadData();

// Automatically updates every 10 seconds
setInterval(loadData, 10000);
