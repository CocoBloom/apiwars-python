window.onload = function() {
    fetch('http://swapi.dev/api/planets/')  // set the path; the method is GET by default, but can be modified with a second parameter
    .then((response) => response.json())  // parse JSON format into JS object
    .then((data) => {
        get_table(data);
    })
}


function get_table(data) {
    let column_names = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population']
    let table = document.querySelector('table');
    table.style.border = "1px solid black";
    table.style.width = '100%';
    let row_header = document.createElement('tr');
    row_header.style.border = "1px solid black";
    table.appendChild(row_header);
    for ( let index = 0; index < column_names.length; index++) {
        let cell_header = document.createElement('th');
        cell_header.style.border = "1px solid black";
        cell_header.innerHTML = (column_names[index].charAt(0).toUpperCase() + column_names[index].slice(1)).replace('_',' ');
        row_header.appendChild(cell_header);
    }
    for (let i=0; i < (i + 10); i++) {
        let row = document.createElement('tr');
        row.style.border = "1px solid black";
        table.appendChild(row);
        for ( let key in data.results[i]) {
            if (column_names.includes(key)) {
                let cell = document.createElement('td');
                cell.style.border = "1px solid black";
                cell.style.textAlign = 'center';
                if (data.results[i][key] !== 'unknown') {
                    if (key === 'diameter') {
                        cell.innerHTML = parseInt(data.results[i][key]).toLocaleString() + 'km';
                    } else if (key === 'surface_water') {
                        cell.innerHTML = data.results[i][key] + ' %';
                    } else if (key === 'population') {
                        cell.innerHTML = parseInt(data.results[i][key]).toLocaleString() + ' people';
                    } else {
                        cell.innerHTML = data.results[i][key];
                    }
                } else {
                    cell.innerHTML = 'unknown';
                }
                row.appendChild(cell);
            }
        }
    }
}

