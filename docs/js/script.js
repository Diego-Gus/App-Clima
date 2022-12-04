import climaActual from "./climaActual.js";
import mapa, { redireccion } from "./map.js";    
import pronostico from "./pronostico.js";
import menu from "./menu.js";

const d = document;
        
let $temp = d.querySelector('.temp__grado'),
    $ubicacion = d.querySelector('.datos-locales'),
    $estado = d.querySelector('.estado'),
    $humedad = d.querySelector('.humedad'),
    $viento = d.querySelector('.viento'),
    map, grados = ['metric','°C'],
    $template = d.getElementById("pronostico-template").content,
    $fragmento = d.createDocumentFragment();

const getAll = () => {
            
    const mostrarPosicion = async (position) => {
        const lat = position.coords.latitude,        
              lon = position.coords.longitude;
        let ciudad;

        map = mapa(lat, lon, 14);
        try{
            let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d80bebf10af73a02aeaac083e98b70ae&units=metric&lang=sp`);
            let json = await res.json();
                
            if(!res.ok) throw {status: res.status, statusText: res.statusText};
            ciudad = json.name;           
            climaActual(json, $ubicacion, $temp, $estado, $humedad, $viento, '°C');
        }
        catch (error) {
            let message = error.statusText || "Ocurrió un error en obtener el clima actual (geolocalizacion)";
            alert( `<b>Error ${error.status}: ${message}</b> `);
        }

        try {
            let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=d80bebf10af73a02aeaac083e98b70ae&units=metric&lang=sp`);
            let json2 = await res.json();
        
            if(!res.ok) throw {status: res.status, statusText: res.statusText};
                    
            pronostico(json2, $template, $fragmento, '°C', loader);

        } catch (error) {
            let message = error.statusText || "Ocurrió un error en obtener el pronostico (geolocalizacion)";
                alert( `<b>Error ${error.status}: ${message}</b> `);
        }

        let unidades = d.querySelectorAll('.unidades > div');

        unidades.forEach(elem => {
            d.addEventListener('click', e =>{
                if(e.target.matches(`.${elem.classList.value}`)){
                    unidad(elem.classList.value, lat, lon);
                }
            });
        });


    }

    const mostrarError = (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert('Permiso denegado por el usuario, revise sus configuraciones y permita el acceso a su ubicación'); 
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

const unidad = async function(g, lat, lon){
    let unid, $unid2;

    if(g == 'unidades--celcius'){
        unid = 'metric'; 
        $unid2 = '°C'   
    }else{
        unid = 'imperial'
        $unid2 = '°F'
    }

    try{
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d80bebf10af73a02aeaac083e98b70ae&units=${unid}&lang=sp`);
        let json = await res.json();
            
        if(!res.ok) throw {status: res.status, statusText: res.statusText};
                    
        climaActual(json, $ubicacion, $temp, $estado, $humedad, $viento, $unid2);
    }
    catch (error) {
        let message = error.statusText || "Ocurrió un error en obtener el clima actual (geolocalizacion)";
        alert( `<b>Error ${error.status}: ${message}</b> `);
    }

    try {
        let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=La%20Paz&appid=d80bebf10af73a02aeaac083e98b70ae&units=${unid}&lang=sp`);
        let json2 = await res.json();
    
        if(!res.ok) throw {status: res.status, statusText: res.statusText};
        
        d.querySelectorAll('.pronostico-contenedor .pronostico').forEach(el => {
            el.remove();
        });
        
        pronostico(json2, $template, $fragmento, $unid2, loader);

        (unid == 'metric') ? d.querySelector('.p-grados').textContent = '°C' : d.querySelector('.p-grados').textContent = '°F'

    } catch (error) {
        let message = error.statusText || "Ocurrió un error en obtener el pronostico (geolocalizacion)";
            alert( `<b>Error ${error.status}: ${message}</b> `);
    }

    grados.splice(0,2,unid,$unid2);
}

d.addEventListener('DOMContentLoaded', getAll);

menu('.p-grados','.config-meteorologica');

const loader = d.querySelector('.loader-container');
loader.classList.add('loader--animacion');

d.addEventListener('submit', e => {
    if(e.target.matches('.search')){
        e.preventDefault();

        const TemperaturaActual = async (ciudad) => {
            try {
            
                let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=d80bebf10af73a02aeaac083e98b70ae&units=${grados[0]}&lang=sp`);
                let json = await res.json();
                
                if(!res.ok) throw {status: res.status, statusText: res.statusText};

                e.target.region.value = "";

                $ubicacion.querySelector('h1').textContent= json.name;
                $temp.textContent = `${json.main.temp} ${grados[1]}`;
                $estado.querySelector('h3').textContent =  json.weather[0].description;
                $estado.querySelector('img').src = `./Imagenes/${json.weather[0].icon}.png`;
                $humedad.textContent = `${json.main.humidity} %`;
                $viento.textContent = `${json.wind.speed} m/s`;

                redireccion(map, json.coord.lat, json.coord.lon);
                
            } catch (error) {
                let message = error.statusText || "Ocurrió un error en el clima actual de busqueda";
                alert( `<b>Error ${error.status}: ${message}</b> `);
            }
        }
        
        const pronosticos = async (ciudad) => {
            try {
                let res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${ciudad}&appid=d80bebf10af73a02aeaac083e98b70ae&units=${grados[0]}&lang=sp`);
                let json = await res.json();
    
                if(!res.ok) throw {status: res.status, statusText: res.statusText};
                
                d.querySelectorAll('.pronostico-contenedor .pronostico').forEach(el => {
                    el.remove();
                });

                pronostico(json, $template, $fragmento, grados[1], loader);

            } catch (error) {
                let message = error.statusText || "Ocurrió un error en el pronostico de busqueda";
                    alert( `<b>Error ${error.status}: ${message}</b> `);
            }
        }
        pronosticos(e.target.region.value);
        TemperaturaActual(e.target.region.value)
    }
});