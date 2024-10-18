const fs = require('fs');
const axios = require('axios');
const { InnertubeClient } = require('youtubei.js');

const DICTIONARY_FILE = 'dictionary.txt';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes
const PLAYLIST_PREFIX = 'youtube_';

async function generateM3U8List() {
    const words = fs.readFileSync(DICTIONARY_FILE, 'utf-8').split('\n').filter(Boolean);
    const client = await InnertubeClient.create({ clientType: 'IOS' });
    
    let currentPlaylist = [];
    let currentSize = 0;
    let playlistCount = 1;

    for (const word of words) {
        try {
            const search = await client.search(word);
            for (const result of search.results) {
                if (result.type === 'video' || result.type === 'live') {
                    const videoDetails = await client.getInfo(result.id);
                    const hlsManifestUrl = videoDetails.streamingData.hlsManifestUrl;
                    
                    if (hlsManifestUrl) {
                        const response = await axios.get(hlsManifestUrl);
                        const m3u8Content = response.data;
                        
                        const entry = `#EXTINF:-1,${result.title}\n${hlsManifestUrl}\n`;
                        
                        if (currentSize + entry.length > MAX_FILE_SIZE) {
                            // Write current playlist to file
                            fs.writeFileSync(`${PLAYLIST_PREFIX}${playlistCount}.m3u`, currentPlaylist.join('\n'));
                            playlistCount++;
                            currentPlaylist = [];
                            currentSize = 0;
                        }
                        
                        currentPlaylist.push(entry);
                        currentSize += entry.length;
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing word "${word}":`, error.message);
        }
    }

    // Write any remaining entries to the last playlist file
    if (currentPlaylist.length > 0) {
        fs.writeFileSync(`${PLAYLIST_PREFIX}${playlistCount}.m3u`, currentPlaylist.join('\n'));
    }

    console.log(`Generated ${playlistCount} M3U8 playlist files.`);
}

generateM3U8List().catch(console.error);










