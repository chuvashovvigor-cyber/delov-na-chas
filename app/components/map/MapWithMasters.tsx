// вверху файла
import L from 'leaflet';

const masterIcon = new L.Icon({
  iconUrl: '/markers/master.svg',      // или .png
  iconRetinaUrl: '/markers/master.svg',
  iconSize: [40, 40],                  // подправь под макет
  iconAnchor: [20, 40],                // «носик» метки
  popupAnchor: [0, -36],
  className: 'master-marker',
});

// ...в рендере маркеров:
<Marker key={id} position={[lat, lon]} icon={masterIcon}>
  <Popup>Мастер {id}</Popup>
</Marker>
