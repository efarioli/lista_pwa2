self.addEventListener('install', e => {
    /* console.log('dadaal') */
})

self.addEventListener('activate', e => {
    /* console.log('activate !!!! ') */
})

self.addEventListener('fetch', fetchEvent => {
    const request = fetchEvent.request;
    let response;

    if (request.url.includes('material.indigo-pink')) {
        // lo mismo con el tema de material, es decir, cuando pide el tema la web app, nosotros devolvemos otro tema. (amber-blue en vez indigo-pink)
        response = fetch('https://code.getmdl.io/1.3.0/material.amber-blue.min.css');
    } else if (request.url.includes('logo_super.jpg')) {
        response = fetch('./images/logo_super_invertido.jpg');
    }
    else {
        // caso contrario que busque normalmente el recurso.
        response = fetch(request);
    }
    fetchEvent.respondWith(response);
})
