import React from 'react'
import './style.scss';
import useFetch from "../../hooks/useFetch";
import { useParams } from 'react-router-dom';
import DetailsBanner from './detailsBanner/DetailsBanner';
import Cast from './cast/Cast';
import VideosSection from './videoSection/VideoSection';
import Similar from './carousels/Similar';
import Recommendation from './carousels/Recommendation';

const Details = () => {
  const {mediaType,id} = useParams();
  const {response,loading} = useFetch(`/${mediaType}/${id}/videos`);
  const {response : credits,loading : creditsLoading} = useFetch(`/${mediaType}/${id}/credits`);
  
  return (
    <div>
      <DetailsBanner video = {response?.data?.results[0]} crew = {credits?.data?.crew}/>
      <Cast data={credits?.data?.cast} loading={creditsLoading}/>
      <VideosSection data={response?.data} loading={loading}/>
      <Similar mediaType={mediaType} id={id}/>
      <Recommendation mediaType={mediaType} id={id}/>
    </div>
  )
}

export default Details
