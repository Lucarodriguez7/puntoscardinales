const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.jsx', 'utf-8');

// Replace constants
content = content.replace(/const WA = 'https:\/\/wa\.me\/5492235901529';/g, "const WA = 'https://wa.me/5492945441507';");
content = content.replace(/Llamar al \+54 223 590-2627/g, "Llamar al +54 9 2945 441507");
content = content.replace(/tel:\+542235902627/g, "tel:+5492945441507");
content = content.replace(/\+54 223 590-1529/g, "+54 9 2945 441507");

// Replace names
content = content.replace(/Latorre Negocios Inmobiliarios/g, 'Puntos Cardinales Bienes Raíces');
content = content.replace(/Inmobiliaria Latorre/g, 'Puntos Cardinales Bienes Raíces');
content = content.replace(/Sr\. Latorre/g, 'equipo de Puntos Cardinales');
content = content.replace(/Latorre/g, 'Puntos Cardinales');

// Replace locations
content = content.replace(/Mar del Plata/g, 'la Patagonia Argentina');
content = content.replace(/MdP/g, 'la Patagonia');
content = content.replace(/Buenos Aires, Argentina/g, 'Argentina');

// Replace locations in search options
content = content.replace(/ubicacion: \['Todos', 'Centro', 'Playa Grande', 'La Perla', 'Güemes', 'Puerto', 'Camet', 'Parque Camet', 'Los Troncos', 'Punta Mogotes', 'Villa Primera', 'Los Pinares'\]/, "ubicacion: ['Todos', 'Comodoro Rivadavia', 'Puerto Madryn', 'Trelew', 'Esquel', 'Bariloche', 'Neuquén', 'San Martín de los Andes', 'Rawson', 'Rada Tilly']");

// Replace types
content = content.replace(/tipo: \['Departamento', 'Casa', 'PH', 'Local', 'Oficina', 'Terreno'\]/, "tipo: ['Terreno', 'Casa', 'Alquiler', 'Chacra', 'Local']");

// URLs
content = content.replace(/Puntos Cardinales_30450031-inmuebles/g, 'puntoscardinales');
content = content.replace(/latorre_30450031-inmuebles/g, 'puntoscardinales');

fs.writeFileSync('src/pages/Home.jsx', content);
