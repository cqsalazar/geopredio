// Inicializar mapa centrado en una coordenada genérica
const map = L.map('map').setView([3.4248559, -76.5188715], 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 25
}).addTo(map);

let capaGeometria; // Variable para almacenar la capa dibujada
const API_URL = import.meta.env.API_URL || 'http://localhost:5000';

async function consultarDatos() {
    const codigo = document.getElementById('codigoInput').value;
    if (!codigo) return alert("Por favor ingresa un código");
    try {
const response = await fetch(`${API_URL}/api/consultar/${codigo}`);
if (!response.ok) throw new Error("No se encontró el ID PREDIO");

const data = await response.json();

// 1. Mostrar información en la tabla (accediendo a 'properties')
document.getElementById('tablaInfo').style.display = 'table';
document.getElementById('cuerpoTabla').innerHTML = `
    <tr>
        <td>${data.properties.IDPREDIO}</td>
        <td>${data.properties.DEPAPRED}</td>
        <td>${data.properties.MUNIPRED}</td>
        <td>${data.properties.ZONA}</td>
        <td>${data.properties.SECTOR}</td>
        <td>${data.properties.COMUNA}</td>
        <td>${data.properties.BARRIO}</td>
        <td>${data.properties.MANZANA}</td>
        <td>${data.properties.TERRENO}</td>
        <td>${data.properties.NPN}</td>
        <td>${data.properties.NUMEPRED}</td>
        <td>${data.properties.SHAPE_Area ? parseFloat(data.properties.SHAPE_Area).toFixed(2) : "0.00"}</td>
    </tr>
`;

// 2. Dibujar en el mapa
if (capaGeometria) map.removeLayer(capaGeometria);

// Leaflet
capaGeometria = L.geoJSON(data, {
            style: {
                color: "#b30000",
                weight: 2,
                fillOpacity: 0.2
            },
            onEachFeature: (feature, layer) => {
                const idpredio = feature.properties.IDPREDIO;
                const latitud = feature.properties.LATITUD;
                const longitud = feature.properties.LONGITUD;
                const popupContent = `
                    <div>
                        <b>ID PREDIO:</b> ${idpredio}<br><br>
                        <button onclick="googleMaps(${latitud}, ${longitud})" 
                                style="cursor:pointer; background:#4285F4; color:white; border:none; padding:5px 10px; border-radius:4px;">
                            Google Maps
                        </button>
                    </div>`;

    layer.bindPopup(popupContent);
            }
            }).addTo(map);

// Ajustar vista al polígono
map.fitBounds(capaGeometria.getBounds());

} catch (error) {
    alert(error.message);
}        
}

async function googleMaps(latitud, longitud) {
    const url = `https://maps.google.com/?q=${latitud},${longitud}`;
    window.open(url, '_blank'); 
}