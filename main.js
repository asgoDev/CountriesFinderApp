// console.log((/^[a-zA-Z\ áéíóúÁÉÍÓÚñÑ\s]*$/.test(' ')))
// console.log((/[\d\s]/.test('')))

const restContriesUrl = `https://restcountries.com/v3.1/name/`
const searchBoxInput = document.querySelector('.search-box__input')
const searchBoxButton = document.querySelector('.search-box__button')
const infoContainer = document.querySelector(".info-container")
const inputPatternOk = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; //expresion regular que devuelve true ante numeros
const patternNumAndSpace = /\d/


const testInput = (inputValue) => {
  if (inputPatternOk.test(inputValue) ) {
    if(inputValue.length <= 3){
      console.log('Cadena de texto corta. Si tu resultado no es el esperado intenta escribir un poco mas');
    }
   return true
  } if(patternNumAndSpace.test(inputValue)){
    throw ('No debe contener numeros')
  } if(inputValue === "") {
    throw ('Debes ingresar un algun nombre o parte de el');
  }
}

const getData = async () => {
  let CountryToSearch = searchBoxInput.value
  let endpoint = restContriesUrl + CountryToSearch

  try {

    if(testInput(CountryToSearch)) {
      let response = await fetch (endpoint, {cache: 'no-cache'})
      if(response.ok) {
        let responseJson = await response.json()
        console.log(responseJson[0])
        printData(responseJson[0])
      } else {
        throw 'No se consiguió el pais'
      }
    } 
  } catch(e){
    alert(e);
  }
  
}

const firstPropertyValue = (obj) => { // devuelve la primera propiedad
  let props = Object.keys(obj) 
  let firstProp = props[0]
  return obj[firstProp]
}

const getCurrenciesInfo = (obj) => {
  let info = firstPropertyValue(obj)
  return `${info.name} (${info.symbol})`
}

const getNativeName = ({nativeName}) => {
  return firstPropertyValue(nativeName).official
}


const printData = (countrydata) => {
  
  let {name, flags, capital, currencies, population, continents, languages, maps, latlng, borders} = countrydata

  infoContainer.innerHTML = `
 
    <header class="info-container__header">
    <img src="${flags.png}" alt="${name.common}" class="info-container__img">
    <div class="info-container__title-box">
      <h2 class="title-box__title">${name.common}</h2>
      <p class="title-box__subtitle">(${getNativeName(name)})</p>
    </div>
    </header>
    <p class="item">Nombre Oficial: ${name.official}</p>
    <p class="item">Capital: ${capital}</p>
    <p class="item">Idioma: ${firstPropertyValue(languages)}</p>
    <p class="item">Población: ${population}</p>
    <p class="item">Moneda: ${getCurrenciesInfo(currencies)}</p>
    <p class="item">Continente: ${continents[0]}</p>
    <p class="item">Fronteras: ${borders}</p>
    <p class="item">Coordenadas: Lat: ${latlng[0]} / Lng: ${latlng[1]} <br><a href=${maps.googleMaps} target="_blank">¡Miralo en Maps!</a></p>  
  `
  cleanInput()

}

const cleanInput = () => {
  searchBoxInput.value = ""
}


//Asignar el mismo Event Listener al enter
searchBoxButton.addEventListener('click', getData)
searchBoxInput.addEventListener('keyup', (e)=> {
  (e.code === 'Enter') ? getData() : null
})
