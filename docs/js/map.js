
export default function mapa (latitud, longitud, zoom){
    let map = L.map('map').setView([latitud,longitud],zoom);
    /* ===== obtenemos los graficos de openstreetmap ===== */
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    /* ===== Anadimos el punto de ubicacion ===== */
    let marker = L.marker([latitud, longitud]).addTo(map);
    
    /* ===== Dibujamos el radio de distancia de 1000 de la ubicacion ===== */
    let circle = L.circle([latitud, longitud], {
        color: 'cyan',
        fillColor: '#00AAE4',
        fillOpacity: 0.4,
        radius: 1000
    }).addTo(map);
    
    return map;
}

export function redireccion(mapa,latitud, longitud){
    mapa.flyTo([latitud, longitud], 10)
    /* mapa.panTo(new L.LatLng(latitud, longitud)); */
    let marker = L.marker([latitud, longitud]).addTo(mapa);
}