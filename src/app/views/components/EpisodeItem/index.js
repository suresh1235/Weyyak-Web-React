import React from "react";
import ImageThumbnail from "app/views/components/ImageThumbnail";
import "./index.scss";

const episodesItem = React.memo(props => {
  const desc = props.descriptionText + props.descriptionText
  return (
    <div className="episode-item">
      <article>
        <ImageThumbnail
          id={props.id}
          type={props.type}
          className="carousel-item"
          imageSrc={props.imageSrc}
          fallback={props.fallback}
          showPlayIcon={false}
          onImageDescText={props.onImageDescText}
          showOnImageDesc={true}
          showDuration={true}
          durationValue={props.durationValue}
        />
        <div className="episode-info">
          <p className="info-text">
            {desc.length > 80
              ? desc.substr(0, 80) + "..."
              : desc}
          </p>
          {props.showDuration === true ? (
            <p className="duration-text">{"--:--"}</p>
          ) : null}
        </div>
      </article>
    </div>
  );
});

export default episodesItem;
