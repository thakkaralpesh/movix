import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import "./style.scss";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import useFetch from "../../../hooks/useFetch";
import Genres from "../../../components/genres/Genres";
import CircleRating from "../../../components/circleRating/CircleRating";
import Img from "../../../components/lazyLoadImage/Img.jsx";
import PosterFallback from "../../../assets/no-poster.png";
import { PlayIcon } from "../Playbutton";
import VideoPopup from "../../../components/videoPopup/VideoPopup";

const DetailsBanner = ({ video, crew }) => {
  const { mediaType, id } = useParams();
  const { response, loading } = useFetch(`/${mediaType}/${id}`);
  const { url } = useSelector((state) => state.home);
  const _genres = response?.data?.genres?.map((g) => g.id);
  const director = crew?.filter((f)=>f.job === "Director" );
  const writer = crew?.filter((f)=>f.job === "Screenplay" || f.job === "Story" || f.job === "Writer");
  const [show,setShow] = useState(false);
  const [videoId,setVideoId] = useState(null);

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  return (
    <div className="detailsBanner">
      {!loading ? (
        <>
          {!!response && (
            <React.Fragment>
              <div className="backdrop-img">
                <Img src={url.backdrop + response.data.backdrop_path} />
              </div>
              <div className="opacity-layer"></div>
              <ContentWrapper>
                <div className="content">
                  <div className="left">
                    {response.data.poster_path ? (
                      <Img
                        className="posterImg"
                        src={url.backdrop + response.data.poster_path}
                      />
                    ) : (
                      <Img className="posterImg" src={PosterFallback} />
                    )}
                  </div>
                  <div className="right">
                    <div className="title">
                      {`${response.data.name || response.data.title} (${dayjs(
                        response.data.release_date
                      ).format("YYYY")})`}
                    </div>
                    <div className="subtitle">{response.data.tagline}</div>

                    <Genres data={_genres} />

                    <div className="row">
                      <CircleRating
                        rating={response.data.vote_average.toFixed(1)}
                      />
                      <div className="playbtn"  onClick={() => {
                        setShow(true)
                        setVideoId(video.key)
                        }}>
                        <PlayIcon />
                        <span className="text">
                          Watch Trailer
                        </span>
                      </div>
                    </div>
                    <div className="overview">
                      <div className="heading">Overview</div>
                      <div className="description">
                        {response.data.overview}
                      </div>
                    </div>
                    
                    <div className="info">
                        {response.data.status && (
                            <div className="infoItem">
                                <span className="text bold">
                                    Status:{" "}
                                </span>
                                <span className="text">
                                    {response.data.status}
                                </span>
                            </div>
                        )}

                        {response.data.release_date && (
                            <div className="infoItem">
                                <span className="text bold">
                                    Release Date:{" "}
                                </span>
                                <span className="text">
                                    {dayjs(response.data.release_date).format("MMM D, YYYY")}
                                </span>
                            </div>
                        )}

                        {response.data.runtime && (
                            <div className="infoItem">
                                <span className="text bold">
                                    Runtime:{" "}
                                </span>
                                <span className="text">
                                    {toHoursAndMinutes(response.data.runtime)}
                                </span>
                            </div>
                        )}
                    </div>

                    {director?.length > 0  && (
                        <div className="info">
                          <span className="text bold">
                            Director:{""}
                          </span>
                          <span className="text">
                            {director?.map((d,i)=>(
                              <span key={i}>
                                {d.name}
                                {director.length - 1 !== i && ", "}
                                </span>
                            ))}
                          </span>
                        </div>
                    )}

                      {writer?.length > 0  && (
                        <div className="info">
                          <span className="text bold">
                          Writer:{""}
                          </span>
                          <span className="text">
                            {writer?.map((d,i)=>(
                              <span key={i}>
                                {d.name}
                                {writer.length - 1 !== i && ", "}
                                </span>
                            ))}
                          </span>
                        </div>
                    )}

                    {response?.data?.created_by?.length > 0  && (
                        <div className="info">
                          <span className="text bold">
                          Creater:{""}
                          </span>
                          <span className="text">
                            {response?.data?.created_by?.map((d,i)=>(
                              <span key={i}>
                                {d.name}
                                {response?.data?.created_by?.length - 1 !== i && ", "}
                                </span>
                            ))}
                          </span>
                        </div>
                    )}
                  </div>
                </div>
                <VideoPopup show = {show} setShow={setShow} videoId={videoId} setVideoId={setVideoId}/>
              </ContentWrapper>
            </React.Fragment>
          )}
        </>
      ) : (
        <div className="detailsBannerSkeleton">
          <ContentWrapper>
            <div className="left skeleton"></div>
            <div className="right">
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
              <div className="row skeleton"></div>
            </div>
          </ContentWrapper>
        </div>
      )}
    </div>
  );
};

export default DetailsBanner;
