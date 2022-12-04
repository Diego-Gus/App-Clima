const d = document;

const climaActual =  (json, $ubicacion, $temp, $estado, $humedad, $viento, $unid) => {
        
    let fecha = new Date();
    d.querySelector('.p-pais').textContent = json.sys.country;
    $ubicacion.querySelector('h1').textContent= json.name;
    $ubicacion.querySelector('p').textContent = fecha.toLocaleDateString();
    $temp.textContent = `${json.main.temp} ${$unid}`;
    $estado.querySelector('h3').textContent =  json.weather[0].description;
    $estado.querySelector('img').src = `./Imagenes/${json.weather[0].icon}.png`;
    $humedad.textContent = `${json.main.humidity} %`;
    $viento.textContent = `${json.wind.speed} m/s`;
}

export default climaActual;