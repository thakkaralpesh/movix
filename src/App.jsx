import { useEffect } from 'react';
import {fetchDataFromApi} from './utils/Api'
import { useSelector, useDispatch } from 'react-redux'
import { getApiConfiguration,getGenres } from './store/HomeSlice';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Details from './pages/details/Details';
import SearchResult from './pages/searchResult/SearchResult';
import Explore from './pages/exlpore/Explore';
import PageNotFound from './pages/404/PageNotFound';


function App() {

  const dispatch = useDispatch();
  
  useEffect(()=>{
    fetchApiConfig();
    genresCall();
  },[])

  const fetchApiConfig = () =>{
    fetchDataFromApi("/configuration")
            .then((res)=>{
              const url = {
                //original for original size
                backdrop:res.data.images.secure_base_url + "original",
                poster:res.data.images.secure_base_url + "original",
                profile:res.data.images.secure_base_url + "original"
              }
              dispatch(getApiConfiguration(url))
            });
  };

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv","movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const response = await Promise.all(promises);
    response.map(({data})=>{
      return data.genres.map(item => {
        allGenres[item.id] = item
      })
    });

    dispatch(getGenres(allGenres));
  }

  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/:mediaType/:id' element={<Details/>}/>
        <Route path='/search/:query' element={<SearchResult/>}/>
        <Route path='/explore/:mediaType' element={<Explore/>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
    )
}

export default App
