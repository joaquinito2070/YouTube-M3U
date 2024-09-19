const fs = require('fs');
const { Innertube } = require('youtubei.js');

const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB in bytes
let currentChunk = 1;
let currentSize = 0;
let playlist = '#EXTM3U\n';

async function generateM3UPlaylist() {
  const youtube = await Innertube.create({ clientType: 'IOS' });
  let continuation = undefined;

  while (true) {
    const search = await youtube.search('', { continuation });
    continuation = search.continuation;

    for (const video of search.videos) {
      try {
        const info = await youtube.getInfo(video.id);
        const hlsManifest = info.streaming_data?.hls_manifest_url;

        if (hlsManifest) {
          const entry = `#EXTINF:-1,${video.title}\n${hlsManifest}\n`;
          
          if (currentSize + Buffer.byteLength(entry) > CHUNK_SIZE) {
            // Save current chunk and start a new one
            fs.writeFileSync(`index_${currentChunk}.m3u`, playlist);
            currentChunk++;
            currentSize = 0;
            playlist = '#EXTM3U\n';
          }

          playlist += entry;
          currentSize += Buffer.byteLength(entry);
        }
      } catch (error) {
        console.error(`Error processing video ${video.id}: ${error.message}`);
      }
    }

    if (!continuation) break;
  }

  // Save the last chunk
  if (playlist !== '#EXTM3U\n') {
    fs.writeFileSync(`index_${currentChunk}.m3u`, playlist);
  }

  console.log(`Generated ${currentChunk} M3U playlist files.`);
}

generateM3UPlaylist().catch(console.error);

