const videos = [
  {
    id: 1,
    title: "Beautiful Nature",
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    description: "Enjoy the breathtaking views of nature's beauty",
    thumbnail: "./src/images/imagew.png",
    nextVideo: 2,
  },
  {
    id: 2,
    title: "City Life",
    src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    description: "Experience the vibrant energy of city life",
    thumbnail: "./src/images/image.png",
    nextVideo: 3,
  },
  {
    id: 3,
    title: "Ocean Wonders",
    src: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    description: "Dive into the mysterious world under the sea",
    thumbnail: "./src/images/eee.png",
    nextVideo: 1,
  },
];

const videoElement = document.getElementById("mainVideo");
const canvas = document.getElementById("videoCanvas");
const ctx = canvas.getContext("2d");
const videoDescription = document.getElementById("videoDescription");
const playlistItems = document.getElementById("playlistItems");
const upcomingVideos = document.getElementById("upcomingVideos");

function init() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  videos.forEach((video) => {
    const item = document.createElement("div");
    item.className = "playlist-item";
    item.textContent = video.title;
    item.style.backgroundImage = `url(${video.thumbnail})`;
    item.style.backgroundSize = "cover";
    item.style.backgroundPosition = "center";
    item.dataset.id = video.id;
    item.addEventListener("click", () => playVideo(video.id));
    playlistItems.appendChild(item);
  });

  videoElement.addEventListener("ended", handleVideoEnd);
  videoElement.addEventListener("timeupdate", handleTimeUpdate);

  playVideo(1);
}

function playVideo(id) {
  const video = videos.find((v) => v.id === id);
  if (!video) return;

  document.querySelectorAll(".playlist-item").forEach((item) => {
    item.classList.toggle("active", parseInt(item.dataset.id) === id);
  });

  showCanvasAnimation(video);
}

function showCanvasAnimation(video) {
  canvas.style.display = "block";
  videoElement.style.display = "none";

  videoDescription.textContent = "";
  upcomingVideos.style.display = "none";

  let progress = 0;
  const duration = 2000;
  const startTime = Date.now();

  function animate() {
    const elapsed = Date.now() - startTime;
    progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = `rgba(0, 100, 255, ${1 - progress})`;
    const maxRadius =
      Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) /
      2;
    const radius = maxRadius * progress;

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    ctx.fill();

    if (progress > 0.5) {
      const fontSize = 16 + (progress - 0.5) * 20;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(video.description, canvas.width / 2, canvas.height / 2);
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      startVideoPlayback(video);
    }
  }

  animate();
}

function startVideoPlayback(video) {
  //   canvas.style.display = "none";
  videoElement.style.display = "block";

  videoElement.src = video.src;
  videoDescription.textContent = video.description;
  videoDescription.style.fontSize = "24px";

  videoElement.play();

  setTimeout(() => {
    videoDescription.style.fontSize = "16px";
  }, 1000);
}

function handleVideoEnd() {
  const currentVideo = videos.find((v) => v.src === videoElement.src);
  if (currentVideo && currentVideo.nextVideo) {
    playVideo(currentVideo.nextVideo);
  }
}

function handleTimeUpdate() {
  const currentVideo = videos.find((v) => v.src === videoElement.src);
  if (!currentVideo) return;

  if (videoElement.duration - videoElement.currentTime <= 2) {
    showUpcomingVideos(currentVideo.nextVideo);
  }
}

function showUpcomingVideos(nextVideoId) {
  const nextVideo = videos.find((v) => v.id === nextVideoId);
  const currentVideo = videos.find((v) => v.src === videoElement.src);
  const previousVideoId = currentVideo
    ? currentVideo.id - 1 || videos.length
    : null;
  const previousVideo = videos.find((v) => v.id === previousVideoId);

  upcomingVideos.innerHTML = "";
  upcomingVideos.style.display = "flex";

  if (previousVideo) {
    const prevThubcon = document.createElement("div");
    prevThubcon.className = "thumbnail-container";

    const prevThumbnail = document.createElement("img");
    prevThubcon.appendChild(prevThumbnail);
    upcomingVideos.appendChild(prevThubcon);

    prevThumbnail.className = "upcoming-thumbnail";
    prevThumbnail.src = previousVideo.thumbnail;
    prevThumbnail.alt = previousVideo.title;
    prevThumbnail.title = previousVideo.title;
    prevThumbnail.addEventListener("click", () => playVideo(previousVideo.id));
    upcomingVideos.appendChild(prevThumbnail);
  }

  if (nextVideo) {
    const nextThubcon = document.createElement("div");
    nextThubcon.className = "thumbnail-container";

    const nextThumbnail = document.createElement("img");
    nextThubcon.appendChild(nextThumbnail);
    upcomingVideos.appendChild(nextThubcon);

    nextThumbnail.className = "upcoming-thumbnail";
    nextThumbnail.src = nextVideo.thumbnail;
    nextThumbnail.alt = nextVideo.title;
    nextThumbnail.title = nextVideo.title;
    nextThumbnail.addEventListener("click", () => playVideo(nextVideo.id));
    upcomingVideos.appendChild(nextThumbnail);
  }
}

window.addEventListener("load", init);
