export default function (url: string) {
  // regexes
  // const youtubeRegex1 =
  //   /^(?:https?:\/\/)?(?:www\.|m\.|www\.youtube-nocookie\.com\/)?(?:.*(?:\/|v=)|youtu\.be\/)?([^"&?\/\s]{11})/;
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)?|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // const tiktokRegex =
  // /^https?:\/\/(?:www\.)?tiktok\.com\/@([^\/]+)\/video\/(\d+)/;

  // matches
  const youtubeMatch = url.match(youtubeRegex);
  // const tiktokMatch = url.match(tiktokRegex);

  // // tiktok
  // // check for tiktok first
  // if (tiktokMatch) {
  //   // const match = url.match(tiktokRegex);
  //   const username = tiktokMatch![1];
  //   const videoId = tiktokMatch![2];
  //   return `https://www.tiktok.com/embed/v2/${username}/video/${videoId}`;
  // }

  // check if url is a youtube link
  if (youtubeMatch && youtubeMatch[1]) {
    // const match = url.match(youtubeRegex);
    const videoId = youtubeMatch[1];
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } else {
    // if not youtube or tiktok return the url
    return url;
  }
}
