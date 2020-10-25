import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
// import Leaflet from 'leaflet';

import '../styles/pages/mapa-orfanatos.css';
// import 'leaflet/dist/leaflet.css';

import ImagemMarcadorMapa from '../images/map-marker.svg';

import Localizacao from '../components/Localizacao';
import mapIcon from '../utils/mapIcon';
import api from '../services/api';
import localizacaoPadrao from '../utils/localizacaoPadrao';

// const IconeMapa = Leaflet.icon({
//   iconUrl: ImagemMarcadorMapa,
//   iconSize: [58, 68],
//   iconAnchor: [29, 68],
//   popupAnchor: [170, 2],
// })

interface Orfanato {
  id: number;
  latitude: number;
  longitude: number;
  nome: string;
};

function MapaOrfanatos() {
  const [orfanatos, definirOrfanatos] = useState<Orfanato[]>([]);
  // let orfanatos = [];

  // console.log(orfanatos);

  useEffect(() => {
    api.get('orfanatos').then(resposta => {
      // console.log(resposta.data);
      definirOrfanatos(resposta.data);
    });
  }, []);

  return (
    <div id="pagina-mapa">
      <aside>
        <header>
          <img src={ImagemMarcadorMapa} alt="Happy" />
          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <Localizacao />
        </footer>
      </aside>
      <Map
        center={[localizacaoPadrao.latitude, localizacaoPadrao.longitude]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Open Street Map */}
        {/* <TileLayer url='https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'/> */}
        <TileLayer
          // url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
          url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        // url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
        />

        {orfanatos.map(orfanato => {
          return (
            <Marker
              // icon={IconeMapa}
              icon={mapIcon}
              position={[orfanato.latitude, orfanato.longitude]}
              key={orfanato.id}
            >
              <Popup closeButton={false} minWidth={240} maxwidth={240} className="map-popup">
                {orfanato.nome}
                <Link to={`/orfanatos/${orfanato.id}`}>
                  <FiArrowRight size={20} color="#FFF" />
                </Link>
              </Popup>
            </Marker>
          )
        })}
      </Map>
      <Link to="/orfanatos/criar" className="criar-orfanato">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  );
}

export default MapaOrfanatos;
