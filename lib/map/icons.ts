// /lib/map/icons.ts
import L from "leaflet";

export const masterIcon = new L.Icon({
  iconUrl: "/icons/master.svg",   // меняй только этот файл — и иконка обновится везде
  iconRetinaUrl: "/icons/master.svg",
  iconSize: [38, 38],
  iconAnchor: [19, 32],
  popupAnchor: [0, -28],
  className: "master-marker",
});
