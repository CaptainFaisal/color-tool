const addRow = (mode) => {
    const thead = document.querySelectorAll('.input-table > thead')[mode-1];
    const tbody = document.querySelectorAll('.input-table > tbody')[mode-1];
    const newRow = tbody.insertRow(tbody.rows.length);
    const cells = [];
    const cols = thead.rows[0].cells.length;
    for (let i = 0; i < cols; i++) {
        cells[i] = newRow.insertCell(i);
        cells[i].innerHTML = i < cols - 3 ? "<input type='text' class='form-control' value='0'  onClick='this.setSelectionRange(0, this.value.length)'>" : "";
    }
}

const removeRow = (mode) => {
    const tbody = document.querySelectorAll('.input-table > tbody')[mode-1];
    if (tbody.rows.length > 0) {
        tbody.deleteRow(tbody.rows.length - 1);
    }
}
const makeNotNaN = (elements) => elements.map(element => isNaN(element) ? 0 : element);

const data = [
    [],
    []
];
const calculate = (mode) => {
    data[mode-1].length = 0;
    const table  = document.querySelectorAll('.input-table')[mode-1];
    const rows = table.rows;
    Array.from(rows).slice(1).forEach(row => {
        const cells = row.cells;
        const cols = cells.length;
        const digits = 3;
        const [R, G, B] = makeNotNaN(Array.from(cells).slice(0, cols - 3).map(cell => parseFloat(cell.children[0].value)));
        console.log(R, G, B)
        const delta = Math.max(R, G, B) - Math.min(R, G, B);
        const H_prime = delta === 0 ? 0 : (R === Math.max(R, G, B) ? 60 * (((G - B) / delta) % 6) : (G === Math.max(R, G, B) ? 60 * (((B - R) / delta) + 2) : 60 * (((R - G) / delta) + 4)));
        const H = H_prime < 0 ? H_prime+360;
        const Cmax = Math.max(R, G, B);
        const Cmin = Math.min(R, G, B);
        if(mode === 1) {
            const V = Cmax;
            const S = Cmax === 0 ? 0 : delta / Cmax;
            cells[cols - 3].innerHTML = H.toFixed(digits);
            cells[cols - 2].innerHTML = S.toFixed(digits);
            cells[cols - 1].innerHTML = V.toFixed(digits);
            data[0].push({R, G, B, H, S, V})
        }else{
            const L = (Cmax + Cmin) / 2;
            const S = delta === 0 ? 0 : delta / (1 - Math.abs(2 * L - 1));
            cells[cols - 3].innerHTML = H.toFixed(digits);
            cells[cols - 2].innerHTML = S.toFixed(digits);
            cells[cols - 1].innerHTML = L.toFixed(digits);
            data[1].push({R, G, B, H, S, L})
        }
        console.log(data);
    });
}
const generateTable = (mode) => {
    const table = document.querySelectorAll(".result")[mode-1];
    const tbody = document.querySelectorAll(".result > tbody")[mode-1];
    table.classList.remove('hide');
    tbody.innerHTML = "";
    data[mode-1].forEach((row, index) => {
        const cols = Object.keys(row).length;
        const tr = document.createElement("tr");
        for(let i = 0; i < cols; i++) {
            const td = document.createElement("td");
            td.innerHTML = Object.values(row)[i].toFixed(3);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
}

const removeTable = (mode) => {
    const table = document.querySelectorAll(".result")[mode-1];
    table.classList.add("hide");
}
