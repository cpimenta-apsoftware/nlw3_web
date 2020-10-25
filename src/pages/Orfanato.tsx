import React, { useEffect, useState } from "react";
// import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo, /*FiArrowLeft*/ } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
// import { useHistory } from 'react-router-dom';
// import L from 'leaflet';
import { useParams } from 'react-router-dom';

// import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/orfanato.css';

import BarraLateral from '../components/BarraLateral';
import mapIcon from "../utils/mapIcon";
import api from "../services/api";

// const happyMapIcon = L.icon({
//   iconUrl: mapMarkerImg,

//   iconSize: [58, 68],
//   iconAnchor: [29, 68],
//   popupAnchor: [0, -60]
// })

interface Orfanato {
  latitude: number;
  longitude: number;
  nome: string;
  sobre: string;
  instrucoes: string;
  horario_atendimento: string;
  aberto_fim_semana: boolean;
  imagens: Array<{
    id: number;
    url: string;
  }>
};

interface ParametrosOrfanato {
  id: string;
}

export default function Orfanato() {
  // const { goBack } = useHistory();

  const params = useParams<ParametrosOrfanato>();
  const [orfanato, definirOrfanato] = useState<Orfanato>();
  const [indiceAtivoImagem, definirIndiceAtivoImagem] = useState(0);

  useEffect(() => {
    api.get(`orfanatos/${params.id}`).then(resposta => {
      definirOrfanato(resposta.data);
    });
  }, [params.id]);

  if (!orfanato) {
    //pode ser substituido por um spinner, skeleton screen ou shimmer effect 
    return <p>Carregando...</p>;
  }

  return (
    <div id="page-orphanage">
      {/* <aside>
        <img src={mapMarkerImg} alt="Happy" />

        <footer>
          <button type="button" onClick={goBack}>
            <FiArrowLeft size={24} color="#FFF" />
          </button>
        </footer>
      </aside> */}
      <BarraLateral />
      <main>
        <div className="orphanage-details">
          <img src={orfanato.imagens[indiceAtivoImagem].url} alt={orfanato.nome} />

          <div className="images">
            {/* <button className="active" type="button">
              <img src="https://www.gcd.com.br/wp-content/uploads/2020/08/safe_image.jpg" alt="Lar das meninas" />
            </button>
            <button type="button">
              <img src="https://www.gcd.com.br/wp-content/uploads/2020/08/safe_image.jpg" alt="Lar das meninas" />
            </button>             */}
            {orfanato.imagens.map((imagem, indice) => {
              return (
                <button 
                  className={indice===indiceAtivoImagem ? 'active' : ''}
                  type="button" 
                  key={imagem.id}
                  onClick={() => {
                    definirIndiceAtivoImagem(indice)
                  }}>
                    <img src={imagem.url} alt={orfanato.nome} />
                </button>
              );
            })}
          </div>

          <div className="orphanage-details-content">
            <h1>{orfanato.nome}</h1>
            <p>{orfanato.sobre}</p>

            <div className="map-container">
              <Map
                center={[orfanato.latitude, orfanato.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[orfanato.latitude, orfanato.longitude]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orfanato.latitude},${orfanato.longitude}`}>
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orfanato.instrucoes}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orfanato.horario_atendimento}
              </div>
              {orfanato.aberto_fim_semana ? (
                <div className="open-on-weekends">
                  <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
                </div>
              ) : (
                  <div className="open-on-weekends dont-open">
                    <FiInfo size={32} color="#FF669D" />
                Não atendemos <br />
                fim de semana
                  </div>
                )}
            </div>

            {/* <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}