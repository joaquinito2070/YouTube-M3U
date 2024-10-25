const fs = require('fs');
const axios = require('axios');
const { Innertube } = require('youtubei.js');
const SocksProxyAgent = require('socks-proxy-agent');

const DICTIONARY_FILE = 'dictionary.txt';
const PROXY_LIST_URL = 'https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/socks5.txt';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

async function fetchProxies() {
    const response = await axios.get(PROXY_LIST_URL);
    return response.data.split('\n').filter(line => line.trim() !== '');
}

async function getRandomProxy(proxies) {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
}

async function createInnertubeClient(proxy) {
    const agent = new SocksProxyAgent(`socks5://${proxy}`);
    return await Innertube.create({
        clientType: 'IOS',
        fetchOptions: { agent }
    });
}

async function searchYouTube(query, client) {
    try {
        const results = await client.search(query);
        return results.videos;
    } catch (error) {
        console.error(`Error searching for "${query}":`, error.message);
        return [];
    }
}

async function getHLSUrl(videoId, client) {
    try {
        const info = await client.getInfo(videoId);
        const hlsFormat = info.streaming_data?.hls_manifest_url;
        return hlsFormat || null;
    } catch (error) {
        console.error(`Error getting HLS URL for video ${videoId}:`, error.message);
        return null;
    }
}

async function generateM3UPlaylists() {
    const dictionary = fs.readFileSync(DICTIONARY_FILE, 'utf-8').split('\n').filter(word => word.trim() !== '');
    const proxies = await fetchProxies();

    let currentFileContent = '#EXTM3U\n';
    let currentFileSize = 0;
    let fileIndex = 1;

    for (const word of dictionary) {
        const proxy = await getRandomProxy(proxies);
        const client = await createInnertubeClient(proxy);

        const searchResults = await searchYouTube(word, client);

        for (const video of searchResults) {
            const hlsUrl = await getHLSUrl(video.id, client);
            if (hlsUrl) {
                const entry = `#EXTINF:-1,${video.title}\n${hlsUrl}\n`;
                
                if (currentFileSize + Buffer.byteLength(entry) > MAX_FILE_SIZE) {
                    // Write current file and start a new one
                    fs.writeFileSync(`index_${String(fileIndex).padStart(6, '0')}.m3u`, currentFileContent);
                    currentFileContent = '#EXTM3U\n';
                    currentFileSize = 0;
                    fileIndex++;
                }

                currentFileContent += entry;
                currentFileSize += Buffer.byteLength(entry);
            }
        }
    }

    // Write the last file if it has content
    if (currentFileSize > 0) {
        fs.writeFileSync(`index_${String(fileIndex).padStart(6, '0')}.m3u`, currentFileContent);
    }
}

generateM3UPlaylists().catch(console.error);
