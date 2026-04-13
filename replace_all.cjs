const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  var files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const files = walkSync('src');
files.push('index.html');

for (const file of files) {
   let content = fs.readFileSync(file, 'utf8');
   const orig = content;
   
   // Mar del Plata -> Patagonia Argentina
   content = content.replace(/Mar del Plata/gi, 'la Patagonia Argentina');
   content = content.replace(/MdP/gi, 'la Patagonia');
   content = content.replace(/Buenos Aires, Argentina/gi, 'Argentina');
   
   // Latorre -> Puntos Cardinales Bienes Raíces
   content = content.replace(/Latorre Negocios Inmobiliarios/gi, 'Puntos Cardinales Bienes Raíces');
   content = content.replace(/Inmobiliaria Latorre/gi, 'Puntos Cardinales Bienes Raíces');
   content = content.replace(/Sr\. Latorre/gi, 'equipo de Puntos Cardinales');
   content = content.replace(/Latorre/gi, 'Puntos Cardinales');
   
   // Phones
   content = content.replace(/5492235901529/g, "5492945441507");
   content = content.replace(/\+54 223 590-2627/g, "+54 9 2945 441507");
   content = content.replace(/tel:\+542235902627/g, "tel:+5492945441507");
   content = content.replace(/\+54 223 590-1529/g, "+54 9 2945 441507");

   // Emails
   content = content.replace(/admin@inmobiliarialatorre\.com/g, "contacto@puntoscardinales.com");

   // Specific in AdminPanel
   if (file.includes('AdminPanel')) {
       content = content.replace(/\[-38\.0055, -57\.5426\]/, "[-41.1335, -71.3103]");
       content = content.replace(/Güemes 3000, la Patagonia Argentina/g, "Mitre 100, Bariloche");
       content = content.replace(/const viewbox = '-57\.65,-38\.20,-57\.40,-37\.90';/g, "const viewbox = '-75.0,-55.0,-63.0,-35.0';"); // approx patagonia
   }
   
   // Specific in Properties/Catalog dropdowns if any
   content = content.replace(/ubicacion: \['Todos', 'Centro', 'Playa Grande', 'La Perla', 'Güemes', 'Puerto', 'Camet', 'Parque Camet', 'Los Troncos', 'Punta Mogotes', 'Villa Primera', 'Los Pinares'\]/g, "ubicacion: ['Todos', 'Comodoro Rivadavia', 'Puerto Madryn', 'Trelew', 'Esquel', 'Bariloche', 'Neuquén', 'San Martín de los Andes', 'Rawson', 'Rada Tilly']");
   content = content.replace(/tipo: \['Departamento', 'Casa', 'PH', 'Local', 'Oficina', 'Terreno'\]/g, "tipo: ['Terreno', 'Casa', 'Alquiler', 'Chacra', 'Local']");
   
   content = content.replace(/const SEARCH_OPTIONS = {[\s\S]*?};/g, (match) => {
      // Re-apply if missed
      return match.replace(/Centro.*Los Pinares'\]/, "Comodoro Rivadavia', 'Puerto Madryn', 'Trelew', 'Esquel', 'Bariloche', 'Neuquén', 'San Martín de los Andes', 'Rawson', 'Rada Tilly']")
                  .replace(/Departamento.*Terreno'\]/, "Terreno', 'Casa', 'Alquiler', 'Chacra', 'Local']");
   });

   if (orig !== content) {
      fs.writeFileSync(file, content);
      console.log('Updated:', file);
   }
}
