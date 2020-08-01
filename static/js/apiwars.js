window.onload = function() {
    fetch('http://swapi.dev/api/planets/')  // set the path; the method is GET by default, but can be modified with a second parameter
    .then((response) => response.json())  // parse JSON format into JS object
    .then((data) => {
        let results = data.results;
        let planets = results.slice(0,3);
        console.log("pl",planets)
        get_table(planets);
        let next_button = get_next_button();
        let previous_button = get_previous_button(next_button);
        next_button.addEventListener('click',get_more_planets);
        previous_button.addEventListener('click',get_more_planets);
        next_button.addEventListener('dblclick',get_planets_once);
        previous_button.addEventListener('dblclick',get_planets_once);
    })
}


function get_table(planets) {
    console.log("get_tavle()",planets)
    let column_names = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population','residents']
    let table = document.createElement('table');
    table.style.border = "1px solid black";
    table.style.width = '100%';
    table.setAttribute('class','display-table');
    document.body.appendChild(table);
    get_headers(column_names,table);
    get_td_in_table(planets,column_names,table);
}


function get_headers(column_names,table) {
    let row_header = document.createElement('tr');
    row_header.style.border = "1px solid black";
    table.appendChild(row_header);
    for ( let index = 0; index < column_names.length; index++) {
        let cell_header = document.createElement('th');
        cell_header.style.border = "1px solid black";
        cell_header.innerHTML = (column_names[index].charAt(0).toUpperCase() + column_names[index].slice(1)).replace('_',' ');
        row_header.appendChild(cell_header);
    }
}

function get_td_in_table(planets,column_names,table) {
    for (let i=0; i < planets.length; i++) {
        let row = document.createElement('tr');
        row.style.border = "1px solid black";
        table.appendChild(row);
        for ( let key in planets[i]) {
            if (column_names.includes(key)) {
                let cell = document.createElement('td');
                cell.style.border = "1px solid black";
                cell.style.textAlign = 'center';
                if (planets[i][key] !== 'unknown') {
                    if (key === 'diameter') {
                        cell.innerHTML = parseInt(planets[i][key]).toLocaleString() + 'km';
                    } else if (key === 'surface_water') {
                        cell.innerHTML = planets[i][key] + ' %';
                    } else if (key === 'population') {
                        cell.innerHTML = parseInt(planets[i][key]).toLocaleString() + ' people';
                    } else if (key === 'residents') {
                        let residents_button = document.createElement('button');
                        residents_button.setAttribute('type','button')
                        residents_button.innerHTML = planets[i]['residents'].length + ' resident(s)';
                        residents_button.setAttribute('data-toggle','modal');
                        residents_button.setAttribute('data-target','#residentsModal' + i.toString());
                        cell.appendChild(residents_button);
                        get_modal_class(i);
                    } else {
                        cell.innerHTML = planets[i][key];
                    }
                } else {
                    cell.innerHTML = 'unknown';
                }
                row.appendChild(cell);
            }
        }
    }
}

function get_next_button() {
    let table = document.getElementsByTagName('table')[0];
    let next_button = document.createElement('button');
    next_button.setAttribute('id','next-button');
    next_button.style.fontSize = '15px';
    next_button.style.width = '20%';
    next_button.style.textAlign = 'center';
    next_button.style.padding = '15px 32px';
    next_button.innerText = 'Next';
    document.body.insertBefore(next_button, table);
    return next_button
}

function get_previous_button(next_button) {
    let previous_button = document.createElement('button');
    previous_button.setAttribute('id','previous-button');
    previous_button.style.fontSize = '15px';
    previous_button.style.width = '20%';
    previous_button.style.textAlign = 'center';
    previous_button.style.padding = '15px 20px';
    previous_button.innerText = 'Previous';
    document.body.insertBefore(previous_button, next_button);
    return previous_button
}

function get_more_planets() {
    deleteModals()
    let start_index = 0;
    let end_index = 0;
    let button_name = event.target['id'];
    console.log("buttonnname",button_name)
    fetch('http://swapi.dev/api/planets/')  // set the path; the method is GET by default, but can be modified with a second parameter
    .then((response) => response.json())  // parse JSON format into JS object
    .then((data) => {
        if (data.results.length > 3) {
            let first_planet = document.querySelector('td').innerHTML;
            console.log("table[0]",document.getElementsByClassName('display-table')[0])
            let last_planet = document.getElementsByClassName('display-table')[0].lastChild.firstChild['innerHTML'];
            let planets_names = get_planets_names(data);
            let planet_index_1 = planets_names.indexOf(first_planet);
            let planet_index_2 = planets_names.indexOf(last_planet) + 1;
            console.log("index1,index2",planet_index_1,planet_index_2)
            if (button_name === 'next-button') {
                start_index = planet_index_2;
                if (start_index < data.results.length) {
                    if (planet_index_2 + 3 > data.results.length - 1) {
                        end_index = data.results.length;
                    } else {
                        end_index = planet_index_2 + 3;
                    }
                    let current_planets = data.results.slice(start_index, end_index);
                    let table = document.getElementsByClassName('display-table')[0];
                    table.remove();
                    get_table(current_planets);
                }
            } else if (button_name === 'previous-button') {
                end_index = planet_index_1;
                if (end_index !== 0) {
                    if (planet_index_1 - 3 > 0) {
                        start_index = planet_index_1 - 3;
                    } else {
                        start_index = 0;
                    }
                    let current_planets = data.results.slice(start_index, end_index);
                    let table = document.getElementsByClassName('display-table')[0];
                    table.remove();
                    get_table(current_planets);
                }
            }
        } else {
            console.log("no more as 10.")
        }
    });
}

function get_planets_names(data) {
    let names = [];
    for (i=0; i< data.results.length; i++) {
        names.push(data.results[i]['name'])
    } console.log("planetsnames",names);
    return names
}


function get_planets_once () {
   console.log('this is duoble click',document.getElementById('residentsModal')[0])
   document.getElementById("residentsModal")[0].showModal();
}

function get_modal_class(index) {
    let table = document.getElementsByTagName('table')[0];
    let modal_main = document.createElement('div');
    modal_main.setAttribute('class','modal fade');
    modal_main.setAttribute('id','residentsModal'+ index);
    modal_main.setAttribute('display', 'none');
    modal_main.setAttribute('role','dialog');
    document.body.appendChild(modal_main);
    let modal_dialog = document.createElement('div');
    modal_dialog.setAttribute('class','modal-dialog');
    modal_main.appendChild(modal_dialog);
    let modal_content = document.createElement('div');
    modal_content.setAttribute('class','modal-content');
    modal_dialog.appendChild(modal_content);
    let modal_header = document.createElement('div');
    modal_header.setAttribute('class','modal-header');
    modal_content.appendChild(modal_header);
    let h_1 = document.createElement('h1');
    h_1.innerText = 'Residents';
    modal_header.appendChild(h_1);
    let modal_body = document.createElement('div');
    modal_body.setAttribute('class','modal-body');
    modal_content.appendChild(modal_body);
    let modal_table = document.createElement('table');
    modal_body.appendChild(modal_table);
    let modal_footer = document.createElement('div');
    modal_footer.setAttribute('class','modal-footer');
    modal_content.appendChild(modal_footer);
    let close_modal = document.createElement('button');
    close_modal.setAttribute('type','button');
    close_modal.setAttribute('data-dismiss','modal');
    close_modal.innerText = 'Close';
    modal_footer.appendChild(close_modal);

}

function deleteModals() {
    console.log("start delete modals")
    let modals = document.getElementsByTagName('div');
    for (i=0; i < modals.length; i++) {
        let deleting_modals = document.getElementsByClassName('modal fade');
        console.log('modals[i',modals[i]);
        let index = 0;
        if (modals[i].getAttribute('class') === 'modal fade') {
            console.log('fffade');

            for ( j=0; j < deleting_modals.length; j++) {
                if (modals[i] === deleting_modals[j]) {
                    index = j;
                    console.log('j',j)
                }
            }

        } console.log('index',index)
            deleting_modals[index].remove();
    }
}