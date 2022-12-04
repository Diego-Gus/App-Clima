const d = document;

const pronostico = function(json, $template, $fragmento, $unid, loader){

    json.list.every((el, indice) => {
                    
        if(indice%2 == 0){
            let dt = new Date(`${el.dt_txt} UTC`);
            
            $template.querySelector('.pronostico .pronostico__fecha').firstChild.textContent = dt.toLocaleDateString();
            $template.querySelector('.pronostico .pronostico__fecha').lastChild.textContent = dt.toLocaleTimeString();
            $template.querySelector('.pronostico__img img').src = `./Imagenes/${el.weather[0].icon}.png`;
            $template.querySelector('.pronostico .pronostico__temp').firstChild.textContent = `${el.main.temp} ${$unid}`;
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
    setTimeout(() => {
        loader.parentElement.remove();
    }, 3000);
}

export default pronostico;