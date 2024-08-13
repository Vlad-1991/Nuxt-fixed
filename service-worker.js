import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';


precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
    '/',
    new NetworkFirst({
        cacheName: 'root-page-cache',
    })
);


registerRoute(
    ({ url }) => url.pathname.startsWith('/about'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/product'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/catalog'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/cart'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/checkout'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/dashboard'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

registerRoute(
    ({ url }) => url.pathname.startsWith('/help'),
    new NetworkFirst({
        cacheName: 'about-page-cache',
    })
);

// Cache API requests with CacheFirst strategy
registerRoute(
    ({ url }) => url.origin === 'https://vue-online-bank-8039a-default-rtdb.firebaseio.com',
    new CacheFirst({
        cacheName: 'firebase-api-cache',
        plugins: [
            {
                cacheableResponse: { statuses: [0, 200] },
            },
        ],
    })
);

registerRoute(
    ({ url }) => url.href.startsWith('https://667aca84bd627f0dcc908b53.mockapi.io/'),
    new CacheFirst({
        cacheName: 'mockapi-cache',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);

registerRoute(
    ({ url }) => url.href.startsWith('https://667c1ab53c30891b865b51cc.mockapi.io/'),
    new CacheFirst({
        cacheName: 'mockapi-cache2',
        plugins: [
            new CacheableResponsePlugin({
                statuses: [0, 200],
            }),
        ],
    })
);