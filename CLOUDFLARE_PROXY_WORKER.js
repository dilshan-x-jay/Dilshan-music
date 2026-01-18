/**
 * CLOUDFLARE PROXY WORKER
 * Point your domain (e.g. music.yourdomain.com) to this worker.
 * It will fetch your Vercel site and inject meta tags on the fly.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    // We want to intercept for EVERYONE, not just crawlers, 
    // to ensure the title doesn't "flicker" in the browser tab.
    const isSongPage = url.pathname.startsWith('/song/');

    // 1. Fetch the original response from Vercel
    // Ensure you use the direct Vercel deployment URL here to avoid loops
    const VERCEL_URL = "https://dilshan-music.vercel.app"; 
    const originResponse = await fetch(`${VERCEL_URL}${url.pathname}${url.search}`, {
        headers: request.headers
    });

    if (isSongPage && originResponse.ok) {
      const slug = url.pathname.split('/').pop();
      
      try {
        // 2. Fetch song data from your API (D1 Worker)
        const apiRes = await fetch('https://cloudwave-music-handler.dilshan-music.workers.dev/api/songs');
        const songs = await apiRes.json();
        
        const createSlug = (text) => text.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        const song = songs.find(s => createSlug(s.title) === slug || s.id === slug);

        if (song) {
          let html = await originResponse.text();
          
          const title = `${song.title} - ${song.artist} | Dilshan Music`;
          const desc = song.description || `Stream and download ${song.title} on Dilshan Music.`;
          const image = song.albumArtUrl;
          const absoluteUrl = url.href;

          // 3. Construct the dynamic Meta Tags
          const metaTags = `
    <title>${title}</title>
    <meta name="description" content="${desc}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${image}">
    <meta property="og:url" content="${absoluteUrl}">
    <meta property="og:type" content="music.song">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${desc}">
    <meta name="twitter:image" content="${image}">
`;

          // 4. Injected into the HTML
          // We replace the placeholder <title> and inject after <head>
          html = html.replace(/<title>.*?<\/title>/, ''); // Remove default title
          html = html.replace('<head>', `<head>${metaTags}`);

          return new Response(html, {
            headers: originResponse.headers
          });
        }
      } catch (e) {
        return originResponse; // Fallback
      }
    }

    return originResponse;
  }
}