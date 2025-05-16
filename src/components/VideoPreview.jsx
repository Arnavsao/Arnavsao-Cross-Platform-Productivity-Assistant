import React from 'react';

const VideoPreview = ({ video }) => {
  const { id, title, description, thumbnailUrl, channelTitle, publishedAt } = video;

  return (
    <div className="bg-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
        <img
          src={thumbnailUrl}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-0 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-slate-300 mb-2">{channelTitle}</p>
        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {new Date(publishedAt).toLocaleDateString()}
          </span>
          <a
            href={`https://www.youtube.com/watch?v=${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors duration-200"
          >
            Watch Video
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview; 