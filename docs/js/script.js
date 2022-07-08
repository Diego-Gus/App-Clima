    
    const d = document;
        
    let $temp = d.querySelector('.temp__grado'),
        $ubicacion = d.querySelector('.datos-locales')
        $estado = d.querySelector('.estado'),
        $humedad = d.querySelector('.humedad'),
        $viento = d.querySelector('.viento'),
        $template = d.getElementById("pronostico-template").content,
        $fragmento = d.createDocumentFragment();
        $principal = d.querySelector('.principal');

    const llenarPronostico = function(json){
        console.log(json);

        json.list.every((el, indice) => {
                        
            if(indice%2 == 0){
                let dt = new Date(`${el.dt_txt} UTC`);
                $template.querySelector('.pronostico .pronostico__fecha').firstChild.textContent = dt.toLocaleDateString();
                $template.querySelector('.pronostico .pronostico__fecha').lastChild.textContent = dt.toLocaleTimeString();
                $template.querySelector('.pronostico__img img').src = `./Imagenes/${el.weather[0].icon}.png`;
                $template.querySelector('.pronostico .pronostico__temp').firstChild.textContent = `${el.main.temp} ºC`;
                $template.querySelector('.pronostico .pronostico__temp').lastChild.textContent = el.weather[0].description;
                
                let $clone = d.importNode($template, true)
                $fragmento.appendChild($clone);
            }

            d.querySelector(".pronostico-contenedor").appendChild($fragmento);
            
            if(indice > 12){
                return false
            }

            return true;
        });
    }

    const getAll = () => {
            
            const mostrarPosicion = async (position) => {
                const lat = position.coords.latitude,
                      lon = position.coords.longitude;
                try{
                    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d80bebf10af73a02aeaac083e98b70ae&units=metric&lang=sp`);
                    let json = await res.json();

                    if(!res.ok) throw {status: res.status, statusText: res.statusText};

                    let fecha = new Date();
                    $ubicacion.querySelector('h1').textContent= json.name;
                    $ubicacion.querySelector('p').textContent = fecha.toLocaleDateString();
                    $temp.textContent = `${json.main.temp} ºC`;
                    $estado.querySelector('h3').textContent =  json.weather[0].description;
                    $estado.querySelector('img').src = `./Imagenes/${json.weather[0].icon}.png`;
                    $humedad.textContent = `${json.main.humidity} %`;
                    $viento.textContent = `${json.wind.speed} m/s`;

                    let regex = new RegExp('^(..n)$');
                    if(regex.test(json.weather[0].icon)){
                        $principal.classList.add('principal--noche');
                    }else{
                        $principal.classList.remove('principal--noche')
                    }

                }
                catch (error) {
                    let message = error.statusText || "Ocurrió un error";
                        alert( `<b>Error ${error.status}: ${message}</b> `);
                }

                try {
                    let res = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=La%20Paz&appid=d80bebf10af73a02aeaac083e98b70ae&units=metric&lang=sp');
                    let json = await res.json();
        
                    if(!res.ok) throw {status: res.status, statusText: res.statusText};
                    llenarPronostico(json);
                } catch (error) {
                    let message = error.statusText || "Ocurrió un error";
                        alert( `<b>Error ${error.status}: ${message}</b> `);
                }
            }

            const mostrarError = (error) => {
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('Permiso denegado por el usuario'); 
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Posición no disponible');
                        break; 
                    case error.TIMEOUT:
                        alert('Tiempo de espera agotado');
                        break;
                    default:
                        alert('Error de Geolocalización desconocido :' + error.code);
                }
            }
            const opciones =  {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 1000
            }

            if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(mostrarPosicion, mostrarError, opciones);
            }else{
                alert("Tu navegador no soporta la geolocalización, actualiza tu navegador.")
            }
    }

    d.addEventListener('DOMContentLoaded', getAll);

    d.addEventListener('submit', e => {
        if(e.target.matches('.search')){
            e.preventDefault();
            console.log(e.target.region.value);

            const TemperaturaActual = async (ciudad) => {
                try {
                
                    let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=d80bebf10af73a02aeaac083e98b70ae&units=metric&lang=sp`);
                    let json = await res.json();
                    
                    if(!res.ok) throw {status: res.status, statusText: res.statusText};
    
                    e.target.region.value = "";
    
                    $ubicacion.querySelector('h1').textContent= json.name;
                    $temp.textContent = `${json.main.temp} ºC`;
                    $estado.querySelector('h3').textContent =  json.weather[0].description;
                    $estado.querySelector('img').src = `./Imagenes/${json.weather[0].icon}.png`;
                    $humedad.textContent = `${json.main.humidity} %`;
                    $viento.textContent = `${json.wind.speed} m/s`;
                    
                } catch (error) {
                    let message = error.statusText || "Ocurrió un error";
                    alert( `<b>Error ${error.status}: ${message}</b> `);
                }
            }
            
            const pronosticos = async (ciudad) => {
                try {
                    let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=d80bebf10af73a02aeaac083e98b70ae&units=metric&lang=sp`);
                    let json = await res.json();
        
                    if(!res.ok) throw {status: res.status, statusText: res.statusText};
                    
                    d.querySelectorAll('.pronostico-contenedor .pronostico').forEach(el => {
                        el.remove();
                    });

                    llenarPronostico(json);

                } catch (error) {
                    let message = error.statusText || "Ocurrió un error";
                        alert( `<b>Error ${error.status}: ${message}</b> `);
                }
            }
            pronosticos(e.target.region.value);
            TemperaturaActual(e.target.region.value)
        }
    });