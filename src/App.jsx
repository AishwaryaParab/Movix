import { useEffect } from "react";
import { fetchDataFromApi } from "./utils/api";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/homeSlice";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import { all } from "axios";

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration")
        .then((response) => {
          const url = {
            backdrop: response.images.secure_base_url+"original",
            poster: response.images.secure_base_url+"original",
            profile: response.images.secure_base_url+"original"
          }
          dispatch(getApiConfiguration(url));
        })
  }

  const genresCall = async () => {
    let promises = [];
    let endpoints = ['tv', 'movie'];
    let allGenres = {};

    endpoints.forEach((endpoint) => {
      promises.push(fetchDataFromApi(`/genre/${endpoint}/list`));
    })

    const data = await Promise.all(promises);
    data.map(({genres}) => {
      return genres.map((item) => (
        allGenres[item.id] = item
      ))
    })

    dispatch(getGenres(allGenres));
  }

  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="movix/" element={<Home />} />
          <Route path="movix/:mediaType/:id" element={<Details />} />
          <Route path="movix/search/:query" element={<SearchResult />} />
          <Route path="movix/explore/:mediaType" element={<Explore />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
