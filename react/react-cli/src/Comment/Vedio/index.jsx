import React, { useState, useEffect,useRef } from "react";
import useVideoCreate from "../../hooks/video";
// import nodeVedio from "../../assets/49 node.js实战.mp4";

import { VideoCss } from './vedioCSS'

export default function VedioCom() {
  const videoRef  = useRef(null)
  useVideoCreate(videoRef);
  return (
    <VideoCss >
      <video-js  ref={videoRef}></video-js>
    </VideoCss>
  );
}
