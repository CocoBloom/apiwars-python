window.onload = function() {
    init();
}

function init() {
   getAllData('http://swapi.dev/api/planets/');
}

function getAllData(url) {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let results = data.results;
            get_table(results);
            addEventListeners(data.previous, data.next);
        })
}

function addEventListeners(prevURL, nextURL) {
    let next_button = document.getElementById('next-button');
    let prev_button = document.getElementById('prev-button');
    prev_button.setAttribute('data-url', prevURL);
    next_button.setAttribute('data-url', nextURL);
    prev_button.addEventListener('click', get_more_planets);
    next_button.addEventListener('click', get_more_planets);
}

function get_table(planets) {
    let table = document.getElementsByClassName('planets')[0];
    let column_names = ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents']
    let headerHTML = get_headers(column_names);
    let bodyHTML = get_td_in_table(planets,column_names);
    table.innerHTML = headerHTML + bodyHTML;
}

function get_headers(column_names) {
    let innerHTML = `<tr >`;
    for (let column of column_names) {
        let column_name = (column.charAt(0).toUpperCase() + column.slice(1)).replace('_',' ');
        innerHTML += `<th class="table-header">${ column_name }</th>`;
    }
    return innerHTML + `</tr>`;
}

function get_td_in_table(planets,column_names) {
    let innerHTML = '';
    for (let planet of planets) {
        innerHTML += `<tr>`;
        for (const key of Object.keys(planet)) {
            if (column_names.includes(key)) {
                innerHTML += `<td>`;
                if (key === 'diameter') {
                    innerHTML += parseInt(planet[key]).toLocaleString() + ' km';
                } else if (key === 'surface_water') {
                    if (planet[key] === 'unknown') {
                        innerHTML += "unknown";
                    } else {
                        innerHTML += planet[key] + ' %';
                    }
                } else if (key === 'population') {
                    if (planet[key] === 'unknown') {
                        innerHTML += "unknown";
                    } else {
                        innerHTML += parseInt(planet[key]).toLocaleString() + ' people';
                    }
                } else if (key === 'residents') {
                    if (planet['residents'].length === 0) {
                        innerHTML += 'Unknown residents';
                    } else {
                        let index = planets.indexOf(planet);
                        innerHTML += `<button class="modal-open" type="button" data-toggle="modal" data-target="#residentsModal${index}">${planet['residents'].length} resident(s)</button>`;
                        innerHTML +=get_modal_class(index, planets);
                    }
                } else {
                    innerHTML += planet[key];
                }
                innerHTML += `</td>`;
            }
        }
        innerHTML += `</tr>`;
    }
    return innerHTML;
}

function get_modal_class(index,planets) {
    let modal_columns = ['name','height','mass','skin_color','hair_color','eye_color','birth_year','gender'];
    let modal_header = get_headers(modal_columns);
    get_tds_in_modalTable(planets[index], index, modal_columns);
    return `
        <div class="modal fade" id="residentsModal${index}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content" id="content">
              <div class="modal-header">
                <h1 class="modal-title" id="exampleModalLabel">Residents of ${planets[index]['name']}</h1>
                <button id='x-button' type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">X</span>
                </button>
              </div>
              <div class="modal-body">
                <table class="modal-table" id="table${index}">
                    ${modal_header}
                </table>
              </div>
            </div>
          </div>
        </div>`
}

function get_tds_in_modalTable(planet, index, column_names) {
   for (let resident of planet['residents']) {
       fetchByResident(resident,index, column_names);
   }
}

function fetchByResident(resident, index, column_names) {
     fetch(resident)
        .then((response) => response.json())
        .then((data) => {
            let innerHTML = '';
            for ( let column of column_names) {
                innerHTML += `<td>`;
                if (column === 'height') {
                    innerHTML += (parseInt(data[column])/100).toString() + ' m';
                } else if (column === 'mass') {
                    innerHTML += data[column] + ' kg';
                } else if (column === 'gender') {
                    if (data[column] === 'female') {
                        innerHTML += `<img src='static/images/female.jpeg' alt="female">`;
                    } else if (data[column] === 'male') {
                        innerHTML += `<img src='static/images/male.png' alt="male">`;
                    } else {
                        innerHTML += data[column];
                    }
                } else {
                    innerHTML += data[column];
                }
                innerHTML += `</td>`;
            }

            let table = document.getElementById(`table${index}`);
            if (table !== null) {
                 table.innerHTML = table.innerHTML + innerHTML;
            }

        })
}

function deleteModals() {
    let modals = document.getElementsByClassName('modal-fade');
    for (let modal of modals) {
        modal.remove();
    }
}

function get_more_planets(e) {
    let id = e.target.id;
    let url = e.target.dataset.url;
    if (url !== 'null') {
        deleteModals();
        getAllData(url);
    } else {
        if (id === 'prev-button') {
            console.log(id)
            let prev_button = document.getElementById('prev-button');
            prev_button.removeEventListener('click', get_more_planets);
        } else {
            let next_button = document.getElementById('next-button');
            next_button.removeEventListener('click', get_more_planets);
        }
    }
}

function get_planets_names(data) {
    let names = [];
    for (i=0; i< data.results.length; i++) {
        names.push(data.results[i]['name'])
    }
    return names
}
