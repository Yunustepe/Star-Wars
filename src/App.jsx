import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [homeworld, setHomeworld] = useState(null);
  const [films, setFilms] = useState([]);
  const [filmsMap, setFilmsMap] = useState({});
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [imageRetries, setImageRetries] = useState({});

  const turkceFilmOzetleri = {
    1: "Ticaret Federasyonu'nun Naboo gezegenini ablukaya almasıyla başlayan olaylar...",
    2: "Klon Savaşları başlarken, Anakin Skywalker Jedi eğitimine devam etmektedir...",
    3: "Jedi Düzeni'nin çöküşü ve Galaktik İmparatorluk'un yükselişi...",
    4: "Genç Luke Skywalker, R2-D2 ve C-3PO ile birlikte İmparatorluk'a karşı isyana katılır...",
    5: "İmparatorluk isyancılara acımasızca saldırırken, Luke Skywalker Dagobah'ta eğitim alır...",
    6: "Luke Skywalker, babası Darth Vader'ı karanlık taraftan kurtarmak için son bir hamle yapar..."
  };

  
  const MALE_CHARACTER_IMAGES = {
    "Luke Skywalker": [
      "https://static.wikia.nocookie.net/starwars/images/2/20/LukeTLJ.jpg",
    ],
    "C-3PO": [
      "https://upload.wikimedia.org/wikipedia/en/5/5c/C-3PO_droid.png"
    ],
    "R2-D2": [
      "https://static.wikia.nocookie.net/starwars/images/e/eb/ArtooTFA2-Fathead.png",
      "https://upload.wikimedia.org/wikipedia/en/3/39/R2-D2_Droid.png"
    ],
    "Darth Vader": [
      "https://lumiere-a.akamaihd.net/v1/images/Darth-Vader_6bda9114.jpeg",
    ],
    "Owen Lars": [
    "/images/images2/2.png"
    ],
    "R5-D4": [
      "https://static.wikia.nocookie.net/starwars/images/c/cb/R5-D4_Sideshow.png",
      "https://lumiere-a.akamaihd.net/v1/images/r5-d4-main-image_66aeafc5.jpeg"
    ],
    "Biggs Darklighter": [
      "https://static.wikia.nocookie.net/starwars/images/0/00/BiggsHS-ANH.png",
      "https://lumiere-a.akamaihd.net/v1/images/databank_biggsdarklighter_01_169_9df6815b.jpeg"
    ],
    "Obi-Wan Kenobi": [
      "https://static.wikia.nocookie.net/starwars/images/4/4e/ObiWanHS-SWE.jpg",
      "https://upload.wikimedia.org/wikipedia/en/3/32/Ben_Kenobi.png"
    ],
    "Anakin Skywalker": [
      "https://static.wikia.nocookie.net/starwars/images/6/6f/Anakin_Skywalker_RotS.png",
      "https://upload.wikimedia.org/wikipedia/en/7/74/Anakin-Jedi.jpg"
    ],
    "Wilhuff Tarkin": [
      "https://static.wikia.nocookie.net/starwars/images/c/c1/Tarkininfobox.jpg",
      "https://lumiere-a.akamaihd.net/v1/images/tarkin-main_ce5da8c6.jpeg"
    ],
    "Chewbacca": [
      "https://static.wikia.nocookie.net/starwars/images/4/48/Chewbacca_TLJ.png",
      "https://upload.wikimedia.org/wikipedia/en/6/6d/Chewbacca-2-.jpg"
    ],
    "Han Solo": [
      "https://upload.wikimedia.org/wikipedia/en/b/be/Han_Solo_depicted_in_promotional_image_for_Star_Wars_%281977%29.jpg"
    ],
    "Greedo": [
  "https://static.wikia.nocookie.net/starwars/images/c/c6/Greedo.jpg",
  "https://lumiere-a.akamaihd.net/v1/images/greedo-main_a4c8ff74.jpeg"
],
"Wedge Antilles": [
  "/images/images2/3.png"
],
"Jek Tono Porkins": [
  "/images/images2/5.png"
],
"Yoda": [
  "/images/images2/4..png"
] 
  };

  
  const FEMALE_CHARACTER_IMAGES = {
    "Leia Organa": [
      "https://static.wikia.nocookie.net/starwars/images/f/fc/Leia_Organa_TLJ.png",
      "https://upload.wikimedia.org/wikipedia/en/1/1b/Princess_Leia%27s_characteristic_hairstyle.jpg",
      "https://lumiere-a.akamaihd.net/v1/images/leia-organa-feature-image_d0f5e953.jpeg"
    ],
    "Beru Whitesun Lars": [
      "/images/images2/11.png",
    ],
    "Mon Mothma": [
     "/images/images2/16.png"
    ],
    "Padmé Amidala": [
      "https://static.wikia.nocookie.net/starwars/images/b/b2/Padmegreenscrshot.jpg",
      "https://upload.wikimedia.org/wikipedia/en/4/4c/Padme_Amidala.jpg",
      "https://lumiere-a.akamaihd.net/v1/images/padme-amidala_04d7c9e0.jpeg"
    ],
    "Shmi Skywalker": [
     "/images/images2/17.png" 
    ],
    "Ayla Secura": [
     "/images/images2/13.png" 
    ],
    "Adi Gallia": [
     "/images/images2/12.png" 
    ],
    "Cordé": [
     "/images/images2/aaa.png"
    ],
    "Luminara Unduli": [
     "/images/images2/15.png" 
    ],
    "Barriss Offee": [
      "https://static.wikia.nocookie.net/starwars/images/3/37/Barrisprofile2.jpg",
      "https://lumiere-a.akamaihd.net/v1/images/databank_barrissoffee_01_169_6cd7a325.jpeg",
      "https://static.wikia.nocookie.net/starwars/images/1/18/BarrissOffeeHS-SWE.jpg"
    ],
    "Dormé": [
      "/images/images2/18.png"
    ],
    "Zam Wesell": [
      "https://static.wikia.nocookie.net/starwars/images/7/7d/Zam-Wesell.jpg",
      "https://lumiere-a.akamaihd.net/v1/images/databank_zamwesell_01_169_8a5b1e6c.jpeg",
      "https://static.wikia.nocookie.net/starwars/images/0/00/Zamwesellhead.jpg"
    ],
    "Taun We": [
      "https://static.wikia.nocookie.net/starwars/images/5/54/TaunWe.jpg",
      "https://lumiere-a.akamaihd.net/v1/images/databank_taunwe_01_169_8a1f3d0a.jpeg",
      "https://static.wikia.nocookie.net/starwars/images/9/9e/Taun_We.png"
    ]
  };

  const FILM_POSTER_SOURCES = {
    1: [
      'https://m.media-amazon.com/images/I/81RZipc6yOL._AC_UF1000,1000_QL80_.jpg',
      'https://upload.wikimedia.org/wikipedia/tr/4/40/Star_Wars_Phantom_Menace_poster.jpg'
    ],
    2: [
      "/images/images2/film2.png"
    ],
    3: [
      'https://m.media-amazon.com/images/I/81g8vEs4ixL._AC_UF1000,1000_QL80_.jpg',
      'https://upload.wikimedia.org/wikipedia/tr/9/93/Star_Wars_Revenge_of_the_Sith_poster.jpg'
    ],
    4: [
      'https://m.media-amazon.com/images/I/81aA7hEEykL._AC_UF1000,1000_QL80_.jpg',
      'https://upload.wikimedia.org/wikipedia/tr/1/1c/Star_Wars_Episode_IV_A_New_Hope.jpg'
    ],
    5: [
     "/images/images2/film5.png"
    ],
    6: [
      "/images/images2/film6.png"
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peopleRes, filmsRes] = await Promise.all([
          axios.get('https://swapi.info/api/people'),
          axios.get('https://swapi.info/api/films')
        ]);
        
        setPeople(peopleRes.data);
        
        const filmsObj = {};
        filmsRes.data.forEach(film => {
          filmsObj[film.url] = film;
        });
        setFilmsMap(filmsObj);
        setFilms(filmsRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Veri alınırken hata:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchHomeworld = async (url) => {
    try {
      const response = await axios.get(url);
      setHomeworld(response.data);
    } catch (error) {
      console.error('Ana gezegen bilgisi alınırken hata:', error);
    }
  };

 
  const getCharacterImage = (characterName, characterUrl, retryCount = 0) => {
    try {
     
      if (FEMALE_CHARACTER_IMAGES[characterName]) {
        const sources = FEMALE_CHARACTER_IMAGES[characterName];
        return sources[retryCount % sources.length];
      }
      
      
      if (MALE_CHARACTER_IMAGES[characterName]) {
        const sources = MALE_CHARACTER_IMAGES[characterName];
        return sources[retryCount % sources.length];
      }
      
      
      const characterId = characterUrl.split('/').filter(part => part).pop();
      return `https://starwars-visualguide.com/assets/img/characters/${characterId}.jpg`;
    } catch {
      return 'https://starwars-visualguide.com/assets/img/placeholder.jpg';
    }
  };

 
  const getFilmPoster = (episodeId, retryCount = 0) => {
    const sources = FILM_POSTER_SOURCES[episodeId] || [];
    const sourceIndex = Math.min(retryCount, sources.length - 1);
    return sources[sourceIndex] || 'https://via.placeholder.com/200x300?text=Film+Posteri';
  };

  
  const handleImageError = (e, type = 'character', id, characterName) => {
    const key = `${type}_${id || characterName}`;
    const currentRetry = imageRetries[key] || 0;
    const newRetry = currentRetry + 1;
    
    setImageRetries(prev => ({ ...prev, [key]: newRetry }));
    
    if (type === 'character') {
      e.target.src = getCharacterImage(characterName, id, newRetry);
    } else {
      e.target.src = getFilmPoster(id, newRetry);
    }
  };

  const handlePersonClick = (person) => {
    setSelectedPerson(person);
    if (person.homeworld) {
      fetchHomeworld(person.homeworld);
    } else {
      setHomeworld(null);
    }
  };

  const handleFilmClick = (film) => {
    setSelectedFilm(film);
  };

  const closeFilmModal = () => {
    setSelectedFilm(null);
  };

  const filteredPeople = people.filter(person => {
    if (filter === 'all') return true;
    if (filter === 'male') return person.gender === 'male';
    if (filter === 'female') return person.gender === 'female';
    if (filter === 'other') return person.gender !== 'male' && person.gender !== 'female';
    return true;
  });

  return (
    <div className="app">
      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>
      
      <h1 className="main-title">Star Wars</h1>
      
      <div className="container">
        <div className="sidebar">
          <div className="filter-buttons">
            <button onClick={() => setFilter('all')}>Tümü</button>
            <button onClick={() => setFilter('male')}>Erkek</button>
            <button onClick={() => setFilter('female')}>Kadın</button>
            <button onClick={() => setFilter('other')}>Diğer</button>
          </div>
          
          <div className="categories">
            <h2>Karakterler</h2>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul>
                {filteredPeople.map((person) => (
                  <li 
                    key={person.name} 
                    onClick={() => handlePersonClick(person)}
                    className={selectedPerson?.name === person.name ? 'active' : ''}
                  >
                    {person.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="main-content">
          {selectedPerson ? (
            <div className="person-details">
              <div className="character-header">
                <img 
                  src={getCharacterImage(selectedPerson.name, selectedPerson.url)} 
                  alt={selectedPerson.name}
                  className="character-image"
                  onError={(e) => handleImageError(e, 'character', selectedPerson.url, selectedPerson.name)}
                  loading="lazy"
                  key={`char_${selectedPerson.url}_${imageRetries[`character_${selectedPerson.url}`] || 0}`}
                />
                <div className="character-info">
                  <h2>{selectedPerson.name}</h2>
                  <table>
                    <tbody>
                      <tr>
                        <td>Boy:</td>
                        <td>{selectedPerson.height} cm</td>
                      </tr>
                      <tr>
                        <td>Doğum Yılı:</td>
                        <td>{selectedPerson.birth_year}</td>
                      </tr>
                      <tr>
                        <td>Cinsiyet:</td>
                        <td>
                          {selectedPerson.gender === 'male' ? 'Erkek' : 
                           selectedPerson.gender === 'female' ? 'Kadın' : 
                           'Belirtilmemiş'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedPerson.films?.length > 0 && (
                <div className="films-section">
                  <h3>Yer Aldığı Filmler</h3>
                  <div className="films-grid">
                    {selectedPerson.films.map(filmUrl => {
                      const film = filmsMap[filmUrl];
                      return film && (
                        <div 
                          key={film.url} 
                          className="film-card"
                          onClick={() => handleFilmClick(film)}
                        >
                          <img 
                            src={getFilmPoster(film.episode_id)} 
                            alt={film.title}
                            className="film-poster"
                            onError={(e) => handleImageError(e, 'film', film.episode_id)}
                            loading="lazy"
                            key={`film_${film.episode_id}_${imageRetries[`film_${film.episode_id}`] || 0}`}
                          />
                          <div className="film-info">
                            <h4>{film.title}</h4>
                            <p>Bölüm {film.episode_id}</p>
                            <p>{new Date(film.release_date).getFullYear()}</p>
                            <p>Yönetmen: {film.director}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {homeworld && (
                <div className="homeworld-info">
                  <h3>Ana Gezegen: {homeworld.name}</h3>
                  <div className="homeworld-details">
                    <p><strong>Nüfus:</strong> {homeworld.population}</p>
                    <p><strong>İklim:</strong> {homeworld.climate}</p>
                    <p><strong>Yerçekimi:</strong> {homeworld.gravity}</p>
                    <p><strong>Arazi:</strong> {homeworld.terrain}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="welcome-message">
              <p>Detaylarını görmek için listeden bir karakter seçin</p>
            </div>
          )}
        </div>
      </div>

      {selectedFilm && (
        <div className="modal-overlay" onClick={closeFilmModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={closeFilmModal}>
              &times;
            </button>
            <h2>{selectedFilm.title}</h2>
            <div className="modal-body">
              <div className="modal-poster">
                <img 
                  src={getFilmPoster(selectedFilm.episode_id)} 
                  alt={selectedFilm.title}
                  onError={(e) => handleImageError(e, 'film', selectedFilm.episode_id)}
                />
              </div>
              <div className="modal-details">
                <p><strong>Bölüm:</strong> {selectedFilm.episode_id}</p>
                <p><strong>Yayın Tarihi:</strong> {new Date(selectedFilm.release_date).toLocaleDateString('tr-TR')}</p>
                <p><strong>Yönetmen:</strong> {selectedFilm.director}</p>
                <p><strong>Yapımcı:</strong> {selectedFilm.producer}</p>
                <div className="film-summary">
                  <h3>Özet</h3>
                  <p>{turkceFilmOzetleri[selectedFilm.episode_id] || selectedFilm.opening_crawl}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;