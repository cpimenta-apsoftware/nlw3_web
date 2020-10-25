import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
// import L from 'leaflet';
// import { useHistory } from "react-router-dom";
import { LeafletMouseEvent } from 'leaflet';
import { useHistory } from "react-router-dom";

import { /*FiArrowLeft,*/ FiPlus } from "react-icons/fi";

// import mapMarkerImg from '../images/map-marker.svg';

import '../styles/pages/criar-orfanato.css';

//Componentes customizados
import BarraLateral from '../components/BarraLateral';

//Códigos TypeScript customizados
import mapIcon from '../utils/mapIcon';
import localizacaoPadrao from "../utils/localizacaoPadrao";
import api from "../services/api";


// const happyMapIcon = L.icon({
//   iconUrl: mapMarkerImg,

//   iconSize: [58, 68],
//   iconAnchor: [29, 68],
//   popupAnchor: [0, -60]
// })

export default function CriarOrfanato() {
  const history = useHistory();
  // const { goBack } = useHistory();
  const [posicao, definirPosicao] = useState({ latitude: 0, longitude: 0 });

  //Campos do formulario
  const [nome, definirNome] = useState('');
  const [sobre, definirSobre] = useState('');
  const [instrucoes, definirInstrucoes] = useState('');
  const [horario_atendimento, definirHorarioAtendimento] = useState('');
  const [aberto_fim_semana, definirAbertoFimSemana] = useState(true);
  const [imagens, definirImagens] = useState<File[]>([]);
  const [previsualizacaoImagens, definirPrevisualizacaoImagens] = useState<string[]>([])

  function criarMarcadorMapa(evento: LeafletMouseEvent) {
    // console.log(evento.latlng);
    const {
      lat,
      lng,
    } = evento.latlng;

    definirPosicao({
      latitude: lat,
      longitude: lng
    });
  }

  async function processarEnvio(evento: FormEvent) {
    evento.preventDefault();

    const { latitude, longitude } = posicao;

    const data = new FormData();

    data.append('nome', nome);
    data.append('sobre', sobre);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instrucoes', instrucoes);
    data.append('horario_atendimento', horario_atendimento);
    data.append('aberto_fim_semana', String(aberto_fim_semana));

    imagens.forEach(imagem => {
      data.append('imagens', imagem)
    });

    await api.post('orfanatos', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');
    // console.log({      
    //   nome,
    //   sobre,
    //   latitude,
    //   longitude,
    //   instrucoes,
    //   horario_atendimento,
    //   aberto_fim_semana
    // });
  }

  function armazenarImagensSelecionadas(evento: ChangeEvent<HTMLInputElement>) {
    // console.log(evento.target.files);
    if(!evento.target.files){
      return;
    }
    const loaImagensSelecionadas = Array.from(evento.target.files)

    definirImagens(loaImagensSelecionadas);

    const loaPrevisualizacaoImagensSelecionadas = loaImagensSelecionadas.map(imagem => {
      return URL.createObjectURL(imagem);
    });

    definirPrevisualizacaoImagens(loaPrevisualizacaoImagensSelecionadas);
  }

  return (
    <div id="page-create-orphanage">
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
        <form className="create-orphanage-form" onSubmit={processarEnvio}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[localizacaoPadrao.latitude, localizacaoPadrao.longitude]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={criarMarcadorMapa}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {/* <Marker interactive={false} icon={mapIcon} position={[-27.2092052,-49.6401092]} /> */}
              {posicao.latitude !== 0 && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[posicao.latitude, posicao.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={nome}
                onChange={evento => { definirNome(evento.target.value) }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={sobre}
                onChange={evento => { definirSobre(evento.target.value) }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>
              {/* <div className="uploaded-image"> */}
              <div className="images-container">
                {previsualizacaoImagens.map(imagem => {
                  return (
                    <img key={imagem} src={imagem} alt={imagem}/>
                  )
                })}

                {/* <button className="new-image" type="button">
                  <FiPlus size={24} color="#15b6d6" />
                </button> */}
                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                {/* <input type="file" id="image[]" hidden/> */}
              </div>              
              <input type="file" id="image[]" multiple onChange={armazenarImagensSelecionadas}/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instrucoes}
                onChange={evento => { definirInstrucoes(evento.target.value) }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de Atendimento</label>
              <input
                id="opening_hours"
                value={horario_atendimento}
                onChange={evento => { definirHorarioAtendimento(evento.target.value) }}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={aberto_fim_semana?'active':''}
                  onClick={() => definirAbertoFimSemana(true)}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!aberto_fim_semana?'active':''}
                  onClick={() => definirAbertoFimSemana(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
