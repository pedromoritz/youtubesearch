import React from 'react';

const VideoListItem = (props) => {
    const video = props.video;
    const imageUrl = video.snippet.thumbnails.default.url;

    return (
    <li className="list-group-item">
        <br />
        <div className="video-list media">
              <div className="media-left">
                <img className="media-object" src={imageUrl} alt="youtube video"/>
            </div>
            <div className="media-body">
                <div className="media-heading">{video.snippet.title}</div>
                <div className="media-heading">Duração: { video.snippet.durationMinutes > 0 ? video.snippet.durationMinutes + ' minuto(s)': ' menos de 1 minuto'}</div>
            </div>
        </div>
        <br />
    </li>
    );
};

export default VideoListItem;