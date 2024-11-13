const BASE_URL = "https://www.googleapis.com/youtube/v3";
const API = "AIzaSyA1gnLdFqba88x2G_Afy45s4p5LTYvsUqw";

const searchQuery = document.getElementById("search_bar_input");
const videoContainer = document.getElementById("video-wrapper");


async function fetchChannelDetails(data) {
  let channelId = data.snippet.channelId;
  const url = `https://www.googleapis.com/youtube/v3/channels?part=brandingSettings&id=${channelId}&key=${API}`;
  try{
    const response = await fetch(url);
    const data = await response.json();

    sessionStorage.setItem("channelbanner", JSON.stringify({
      channelLogo : data.items[0].brandingSettings.image.bannerExternalUrl,
      channelTitle : data.items[0].brandingSettings.channel.title,
    }))
    
  }
  catch (error) {
    console.error("Error fetching channel details:", error);
  }
}

async function fetchVideoPlayer(videoId) {
  const url = ` https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API}&part=snippet,statistics,player&fields=items(id,snippet,statistics,player)`
  try {
    const response = await fetch(url);
    const data = await response.json();

    
    console.log(data);
    
    const embedHtml =  data.items[0].player.embedHtml;
    sessionStorage.setItem("stats", JSON.stringify({
      commentCount : data.items[0].statistics.commentCount,
      likeCount : data.items[0].statistics.likeCount,
      viewCount : data.items[0].statistics.viewCount,
      videoTitle : data.items[0].snippet.title,
      videoDescription : data.items[0].snippet.description,
      videoPublishedAt : data.items[0].snippet.publishedAt,
      videoTags : data.items[0].snippet.tags,
      thumbnail : data.items[0].snippet.thumbnails.default.url
    }))

    sessionStorage.setItem("videoEmbededHtml", embedHtml);
    window.location.href = "videoRender.html";

    
    
  } catch (error) {
    console.error("Error fetching YouTube player and statistics:", error);
  }
}


const makeVideoCard = (data) => {
  const videoCard = document.createElement("div");
  videoCard.classList.add("video");
  videoCard.innerHTML = `
        <div class="video-content">
                <img src="${data.snippet.thumbnails.high.url}" alt="thumbnail" class="thumbnail">
        </div>
        <div class="video-details">
            <div class="channel-logo">
                <img src="${data.channelThumbnail}" alt="channel-icon" class="channel-icon">
            </div>
            <div class="detail">
                <h3 class="title">${data.snippet.title}</h3>
                <div class="channel-name">${data.snippet.channelTitle}</div>
            </div>
        </div>
    `;
  videoContainer.appendChild(videoCard);

  videoCard.addEventListener("click", () => {
    let videoId = data.id.videoId;
    fetchVideoPlayer(videoId);
    fetchChannelDetails(data);

  });
};

async function fetchVideos(searchQuery, maxResults) {
  try {
    const response = await fetch(
      BASE_URL +
        "/search" +
        `?key=${API}` +
        "&part=snippet" +
        `&q=${searchQuery}` +
        `&maxResults=${maxResults}`
    );
    const dataPromise = await response.json();
    let videoList = dataPromise.items;
    videoList.forEach((item) => {
      item.channelThumbnail = item.snippet.thumbnails.default.url;
      makeVideoCard(item);
    });
  } catch (error) {
    console.error("Error fetching video:", error);
  }
}

// This function is attached with search icon with eventListner as change
function results(event) {
  fetchVideos(event.target.value, 10);
}







