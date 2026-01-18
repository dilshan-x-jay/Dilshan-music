# Cloudflare R2 & Worker Setup Guide for Your Music App

This guide will walk you through setting up a Cloudflare R2 bucket for storing your MP3 files and a secure Cloudflare Worker to handle uploads and serve downloads.

---

### Part 1: Create Your R2 Bucket

An R2 bucket is where your MP3 files will be stored.

1.  **Log in to your Cloudflare dashboard.**
2.  Navigate to **R2** from the left-hand sidebar.
3.  Click **Create bucket**.
4.  **Bucket name:** Choose a unique name for your bucket (e.g., `cloudwave-music-storage`). Remember this name.
5.  **Location:** Choose a location or leave it as "Automatic".
6.  Click **Create bucket**.

Your bucket is now created. By default, it's private. We will use a Worker to grant access.

---

### Part 2: Create and Configure a Cloudflare Worker

The Worker will act as the secure backend for your application. It will:
1.  Provide a **secure, private endpoint** to upload files to R2.
2.  Provide a **public endpoint** to download files from R2.
3.  Handle CORS so your web app can communicate with it.

#### Step 2.1: Create the Worker

1.  In your Cloudflare dashboard, navigate to **Workers & Pages**.
2.  Click **Create application**.
3.  Select the **"Hello World"** template.
4.  Give your Worker a name (e.g., `cloudwave-music-handler`).
5.  Click **Deploy**.

#### Step 2.2: Bind Your R2 Bucket to the Worker

You need to give your Worker permission to access your R2 bucket.

1.  After deploying, go to your new Worker's dashboard.
2.  Click on the **Settings** tab.
3.  Select **Variables** from the side menu.
4.  Scroll down to **R2 Bucket Bindings** and click **Add binding**.
5.  **Variable name:** Enter `MUSIC_BUCKET`. This must match the name used in the Worker code.
6.  **R2 bucket:** Select the R2 bucket you created in Part 1 (`cloudwave-music-storage`).
7.  Click **Save**.

#### Step 2.3: Add a Secret Key for Uploads

To prevent anyone from uploading files, we'll protect the upload endpoint with a secret key.

1.  While still in the **Settings > Variables** page, scroll up to **Environment Variables** and click **Add variable**.
2.  **Variable name:** Enter `UPLOAD_SECRET`.
3.  **Value:** Enter a strong, random password. You can use a password generator for this. **This is your secret key.**
4.  Click **Encrypt** to keep the value secure.
5.  Click **Save and deploy**.

#### Step 2.4: Add the Worker Code

1.  Go back to your Worker's overview page and click **Edit code**.
2.  Delete the existing "Hello World" code and replace it with the code below. This code handles downloads, secure uploads, and CORS.

```javascript
// This is the code for your Cloudflare Worker (index.js)

export default {
  async fetch(request, env, ctx) {
    // Define CORS headers to allow your web app to call this worker
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*', // For development. In production, lock this down to your app's domain.
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Custom-Auth-Key',
    };

    // Handle CORS preflight requests sent by browsers
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // The filename is the path after the '/'

    // Ensure environment variables are set up correctly in the dashboard
    if (!env.MUSIC_BUCKET) {
      return new Response('R2 bucket binding not configured.', { status: 500 });
    }
    if (!env.UPLOAD_SECRET) {
      return new Response('UPLOAD_SECRET is not set in Worker environment.', { status: 500 });
    }
    
    switch (request.method) {
      // Handle file downloads (publicly accessible)
      case 'GET':
        if (!key) {
          return new Response('Not Found', { status: 404 });
        }
        
        const object = await env.MUSIC_BUCKET.get(key);

        if (object === null) {
          return new Response('Object Not Found', { status: 404 });
        }

        const headers = new Headers(corsHeaders); // Add CORS headers to the response
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        // This header tells the browser to download the file instead of trying to play it
        headers.set('Content-Disposition', `attachment; filename="${key}"`);

        return new Response(object.body, { headers });

      // Handle file uploads (protected by a secret key)
      case 'PUT':
        // Check for the secret authorization header
        const providedSecret = request.headers.get('X-Custom-Auth-Key');
        if (providedSecret !== env.UPLOAD_SECRET) {
          return new Response('Unauthorized: Incorrect secret key.', { status: 401 });
        }

        if (!key) {
           return new Response('Filename must be provided in the URL path.', { status: 400 });
        }
       
        await env.MUSIC_BUCKET.put(key, request.body, {
          httpMetadata: {
            contentType: request.headers.get('Content-Type'),
          },
        });
        
        const publicUrl = `${url.protocol}//${url.hostname}/${key}`;
        
        return new Response(JSON.stringify({ url: publicUrl }), {
            headers: { 
              ...corsHeaders,
              'Content-Type': 'application/json' 
            }
        });

      default:
        return new Response('Method Not Allowed', {
          status: 405,
          headers: {
            ...corsHeaders,
            Allow: 'GET, PUT, OPTIONS',
          },
        });
    }
  },
};
```
3.  Click **Save and deploy**.

---

### Part 3: Connect Your React App

Your Worker is now live at a URL like `https://cloudwave-music-handler.your-username.workers.dev`. You need to configure your React app to use this URL and your secret key.

1.  **Find your Worker URL:** Go to the Worker's overview page in the Cloudflare dashboard.
2.  **Get your Secret Key:** This is the value you created in Step 2.3.
3.  **Update the React Code:** In your React application, open `components/AdminPanel.tsx` and find the `handleSubmit` function. You will need to replace the placeholder values for `workerUrl` and `uploadSecret` with your actual values.

    **Example from `AdminPanel.tsx`:**

    ```typescript
    // IMPORTANT: Replace with your actual Worker URL and secret key.
    const workerUrl = 'https://cloudwave-music-handler.your-username.workers.dev';
    const uploadSecret = 'your-super-secret-key-from-step-2.3'; 

    // ... inside the fetch call ...
    headers: {
        'Content-Type': 'audio/mpeg',
        'X-Custom-Auth-Key': uploadSecret, // This header sends your secret key
    },
    ```

Your app is now fully configured to upload music to your R2 bucket and serve downloads securely!