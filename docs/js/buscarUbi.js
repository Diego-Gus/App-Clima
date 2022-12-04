   
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