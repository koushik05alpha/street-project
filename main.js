let viewData = [];
let currentIndex = 0;

function handleFile() {
  const fileInput = document.getElementById("fileInput");
  const msg = document.getElementById("statusMsg");

  if (!fileInput.files.length) {
    msg.textContent = "❌ Please select an XLSX file.";
    return;
  }

  msg.textContent = "⏳ Reading file...";

  const reader = new FileReader();
  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    viewData = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const a = row[0] || "";
      if (typeof a === "string" && a.includes("/img_link/view/")) {
        viewData.push({
          url: a,
          row: i + 1,
          last5: a.slice(-5),
          b: row[1] || "",
          c: row[2] || "",
          d: row[3] || "",
          e: row[4] || "",
        });
      }
    }

    if (viewData.length === 0) {
      msg.textContent = "❌ No valid /view/ links found in Column A.";
      return;
    }

    msg.textContent = "";
    showIframeSlider();
  };

  reader.onerror = function () {
    msg.textContent = "❌ Error reading file.";
  };

  reader.readAsArrayBuffer(fileInput.files[0]);
}

function showIframeSlider() {
  currentIndex = 0;
  document.getElementById("inputSection").style.display = "none";
  document.getElementById("sliderSection").style.display = "block";
  updateIframe();
}

function moveIframe(direction) {
  currentIndex = (currentIndex + direction + viewData.length) % viewData.length;
  updateIframe();
}

function updateIframe() {
  const data = viewData[currentIndex];
  document.getElementById("iframeViewer").src = data.url;
  document.getElementById("row-number").textContent = data.row;
  document.getElementById("url-lest-digit").textContent = data.last5;
  document.getElementById("column-B-data").textContent = data.b;
  document.getElementById("column-C-data").textContent = data.c;
  document.getElementById("column-D-data").textContent = data.d;
  document.getElementById("column-E-data").textContent = data.e;
}

document.addEventListener("keydown", function (e) {
  const visible =
    document.getElementById("sliderSection").style.display === "block";
  if (!visible) return;

  if (e.key === "ArrowLeft") moveIframe(-1);
  if (e.key === "ArrowRight") moveIframe(1);
});
