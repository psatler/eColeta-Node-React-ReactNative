import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { Map, TileLayer, Marker } from 'react-leaflet'
import axios from 'axios'
import { LeafletMouseEvent } from 'leaflet'

import api from '../../services/api'

import './styles.css';

import logo from '../../assets/logo.svg'
import Dropzone from '../../components/Dropzone';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGE_UF_Response {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const CreatePoint: React.FC = () => {
  const history = useHistory()

  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('0');
  const [formInputs, setFormInputs] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const [initialMapPosition, setInitialMapPosition] = useState<[number, number]>([0, 0]);
  const [selectedMapPosition, setSelectedMapPosition] = useState<[number, number]>([0, 0]);

  const [selectedFile, setSelectedFile] = useState<File>()

  useEffect(
    function loadInitialCoordinatesOnMap() {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setInitialMapPosition([latitude, longitude])
      })
    }
  , [])

  useEffect(
    function loadItemsOnComponentMount() {
      api.get('items').then(response => {
        setItems(response.data)
      })
    }
  , [])

  useEffect(
    function loadStates() {
      axios.get<IBGE_UF_Response[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
          const ufInitials = response.data.map(uf => uf.sigla)
          setUfs(ufInitials);
        });
    }
  , []);

  useEffect(
    function loadCitiesBasedOnSelectedState() {
      if (selectedUf === '0') {
        return;
      }

      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
          const cityNames = response.data.map(city => city.nome);
          setCities(cityNames);
        });

    }
  , [selectedUf]);

  // this is an event to change the value of an HTML select element
  const handleSelectedUf = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const uf = event.target.value;
    setSelectedUf(uf);
  }, [])
  
  const handleSelectedCity = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    const city = event.target.value;
    setSelectedCity(city);
  }, [])

  const handleMapClick = useCallback((event: LeafletMouseEvent) => {
    const latitude = event.latlng.lat;
    const longitude = event.latlng.lng;
    setSelectedMapPosition([latitude, longitude]);
  }, [])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormInputs({...formInputs, [name]: value })
  }, [formInputs])

  const handleSelectItem = useCallback((itemId: number) => {
    const isItemAlreadySelected = selectedItems.findIndex(item => item === itemId);
    
    if (isItemAlreadySelected >= 0) {
      const filteredItems = selectedItems.filter(item => item !== itemId);
      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  }, [selectedItems])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formInputs;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedMapPosition;
    const items = selectedItems;

    // using multi part form data, as the backend accepts this
    const data = new FormData()

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', uf);
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));

    if(selectedFile) {
      data.append('image', selectedFile)
    }
   
    await api.post('points', data)

    // TODO: create a modal show this message!
    alert(`Ponto de coleta ${name} criado!`)
    history.push('/');
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Eco Waste Collection"/>

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile} />

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input 
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input 
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
                // minLength={11}
                maxLength={11}
                // placeholder="Insira o seu telefone"
                // pattern="[0-9]{11}"
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map
            // center={[-20.289852, -40.2906825]}
            center={initialMapPosition}
            zoom={15}
            onclick={handleMapClick}
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={selectedMapPosition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF) </label>
              <select 
                name="uf"
                id="uf"
                value={selectedUf}
                onChange={handleSelectedUf}
              >
                <option value="0">Selecione uma UF</option>
                { 
                  ufs.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))
                }
              </select>
            </div>
            <div className="field">
              <label htmlFor="city"> Cidade </label>
              <select 
                name="city" 
                id="city"
                value={selectedCity}
                onChange={handleSelectedCity}  
              >
                <option value="0">Selecione uma cidade</option>
                { 
                  cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))
                }
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Itens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            {
              items.map(item => (
                <li 
                  key={item.id}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                  onClick={() => handleSelectItem(item.id)}  
                >
                  <img src={item.image_url} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))
            }
          </ul>
        </fieldset>

        <button type="submit">
          Cadastrar ponto de coleta
        </button>
      </form>
    </div>
  )
}

export default CreatePoint;