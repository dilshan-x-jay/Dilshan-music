
/**
 * SonicPulse Edge Worker - Unified Backend
 * Handles:
 * - D1 Metadata API (/api/songs, /api/artists)
 * - R2 File Proxy (GET for public access, PUT for secure uploads)
 */

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Custom-Auth-Key',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const secret = request.headers.get('X-Custom-Auth-Key');

    try {
      // --- API ROUTES (D1 DATABASE) ---

      if (path === '/api/songs' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          "SELECT * FROM songs ORDER BY id DESC"
        ).all();
        return new Response(JSON.stringify(results || []), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      if (path === '/api/artists' && request.method === 'GET') {
        const { results } = await env.DB.prepare(
          "SELECT * FROM artists ORDER BY name ASC"
        ).all();
        return new Response(JSON.stringify(results || []), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      if (path === '/api/songs' && request.method === 'POST') {
        if (secret !== env.UPLOAD_SECRET) {
          return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        }
        const s = await request.json();
        // Updated INSERT to include the 'year' column
        await env.DB.prepare(
          `INSERT INTO songs (
            title, artist, artistId, album, genre, year, description, 
            lyrics, bpm, song_key, albumArtUrl, downloadUrl, youtubeUrl
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          s.title, 
          s.artist, 
          s.artistId || null, 
          s.album || '', 
          s.genre || 'Pop', 
          s.year || new Date().getFullYear().toString(),
          s.description || '', 
          s.lyrics || '', 
          s.bpm || 120, 
          s.key || '', 
          s.albumArtUrl, 
          s.downloadUrl, 
          s.youtubeUrl || ''
        ).run();
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      if (path === '/api/artists' && request.method === 'POST') {
        if (secret !== env.UPLOAD_SECRET) {
          return new Response('Unauthorized', { status: 401, headers: corsHeaders });
        }
        const a = await request.json();
        await env.DB.prepare(
          "INSERT INTO artists (name, type, imageUrl, description) VALUES (?, ?, ?, ?)"
        ).bind(
          a.name, 
          a.type, 
          a.imageUrl, 
          a.description || ''
        ).run();
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      const key = decodeURIComponent(path.slice(1));
      if (!key || path.startsWith('/api/')) {
         return new Response('Resource Not Found', { status: 404, headers: corsHeaders });
      }

      if (request.method === 'GET') {
        const bucket = env.MUSIC_BUCKET || env.MY_BUCKET;
        if (!bucket) return new Response('R2 Bucket not bound', { status: 500, headers: corsHeaders });

        const object = await bucket.get(key);
        if (!object) return new Response('File Not Found', { status: 404, headers: corsHeaders });
        
        const headers = new Headers(corsHeaders);
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        
        const lowKey = key.toLowerCase();
        if (lowKey.endsWith('.mp3')) headers.set('Content-Type', 'audio/mpeg');
        else if (lowKey.endsWith('.jpg') || lowKey.endsWith('.jpeg')) headers.set('Content-Type', 'image/jpeg');
        else if (lowKey.endsWith('.png')) headers.set('Content-Type', 'image/png');

        return new Response(object.body, { headers });
      }

      if (request.method === 'PUT') {
        if (secret !== env.UPLOAD_SECRET) {
          return new Response('Unauthorized: Invalid Secret Key', { status: 401, headers: corsHeaders });
        }
        
        const bucket = env.MUSIC_BUCKET || env.MY_BUCKET;
        if (!bucket) return new Response('R2 Bucket not bound', { status: 500, headers: corsHeaders });

        await bucket.put(key, request.body, { 
          httpMetadata: { 
            contentType: request.headers.get('Content-Type') || 'application/octet-stream' 
          } 
        });
        
        const publicUrl = `${url.origin}/${key}`;
        return new Response(JSON.stringify({ url: publicUrl }), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }
  }
};
