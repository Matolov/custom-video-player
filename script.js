const container = document.querySelector('.container');
const videoMain = container.querySelector("video");
const videoTimeline = container.querySelector(".video-timeline");
const progressBar = container.querySelector(".progress-bar");
const playPauseButton = container.querySelector(".pause i");
const backwardsButton = container.querySelector(".skip-backwards");
const forwardButton = container.querySelector(".skip-forwards");
const currentTimeElement = container.querySelector('.current-time');
const videoDurationElement = container.querySelector('.video-duration');
const volumeButton = container.querySelector('.volume');
const volumeIcon = volumeButton.querySelector('i');
const volumeSlider = container.querySelector('.left input');
const themeSwitch = document.getElementById('theme-switch');
const speedButton = document.getElementById('playback-speed');
const speedOptions = document.getElementById('speed-options');
const fullsizeBtn = document.querySelector('.fullscreen');
let darkMode = localStorage.getItem('darkMode');
const picInPic = container.querySelector('.pic-in-pic');
let timer;

const hideControls = () => {
    if(videoMain.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});

const formatTime = (time) => {
  let seconds = Math.floor(time % 60),
      minutes = Math.floor(time / 60);
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${seconds}`;
};

videoMain.addEventListener('loadedmetadata', () => {
  videoDurationElement.textContent = formatTime(videoMain.duration);
});

videoMain.addEventListener("timeupdate", (e) => {
  let { currentTime, duration } = e.target;
  let percent = (currentTime / duration) * 100;
  progressBar.style.width = `${percent}%`;
  currentTimeElement.textContent = formatTime(currentTime);
});

videoMain.addEventListener('loadedmetadata', e => {
    videoMain.innerText = e.target.duration;
  });

const draggableProgressBar = (e) => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    videoMain.currentTime = (e.offsetX / timelineWidth) * videoMain.duration;
};
  
videoTimeline.addEventListener("mousedown", (e) => {
    draggableProgressBar(e);
    
    videoTimeline.addEventListener("mousemove", draggableProgressBar);
    
    document.addEventListener("mouseup", () => {
      videoTimeline.removeEventListener("mousemove", draggableProgressBar);
    }, { once: true });
});

videoTimeline.addEventListener("mousemove", (e) => {
    const progressBar = videoTimeline.querySelector("span");
    let offsetX = e.offsetX;
    progressBar.style.left = `${offsetX}px`;

    let timelineWidth = videoTimeline.clientWidth;
    let percent = (offsetX / timelineWidth) * videoMain.duration;

    progressBar.innerText = formatTime(percent);
});

  
playPauseButton.addEventListener("click", () => {
  videoMain.paused ? videoMain.play() : videoMain.pause();
});

videoMain.addEventListener("pause", () => {
  playPauseButton.classList.replace("bx-pause", "bx-play");
});

videoMain.addEventListener("play", () => {
  playPauseButton.classList.replace("bx-play", "bx-pause");
});

backwardsButton.addEventListener("click", () => {
  videoMain.currentTime -= 10;
});

forwardButton.addEventListener("click", () => {
  videoMain.currentTime += 10;
});

volumeButton.addEventListener("click", () => {
  if (videoMain.muted || videoMain.volume === 0) {
    videoMain.muted = false;
    videoMain.volume = 0.5;
    volumeIcon.classList.replace("bxs-volume-mute", "bxs-volume-full");
  } else {
    videoMain.volume = 0.0;
    videoMain.muted = true;
    volumeIcon.classList.replace("bxs-volume-full", "bxs-volume-mute");
  }
  volumeSlider.value = videoMain.volume;
});

volumeSlider.addEventListener("input", () => {
  videoMain.volume = volumeSlider.value;
  if (videoMain.volume === 0) {
    volumeIcon.classList.replace("bxs-volume-full", "bxs-volume-mute");
  } else {
    volumeIcon.classList.replace("bxs-volume-mute", "bxs-volume-full");
  }
});
const showVolumeSlider = () => {
    volumeSlider.style.opacity = "1";
    volumeSlider.style.pointerEvents = "all";
    leftOptions.classList.remove("hide-volume"); 
    clearTimeout(volumeTimeout); 
};

const hideVolumeSlider = () => {
    volumeTimeout = setTimeout(() => {
        volumeSlider.style.opacity = "0";
        volumeSlider.style.pointerEvents = "none";
        leftOptions.classList.add("hide-volume"); 
    }, 2000); 
};


container.addEventListener("mousemove", showVolumeSlider);


container.addEventListener("mouseleave", hideVolumeSlider);

fullsizeBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    container.requestFullscreen();
  }
});

speedButton.addEventListener("click", () => {
  speedOptions.classList.toggle("show");
});

speedOptions.querySelectorAll("li").forEach(option => {
  option.addEventListener("click", () => {
    videoMain.playbackRate = option.dataset.speed;
    speedOptions.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  });
});

themeSwitch.addEventListener("click", () => {
  document.body.classList.toggle("darkMode");
});

picInPic.addEventListener("click", () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else if (videoMain.requestPictureInPicture) {
    videoMain.requestPictureInPicture();
  }
});
