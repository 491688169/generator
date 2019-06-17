const CACHE_NAME = 'learnta-admin-design';

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll();
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;

            // 因为 event.request 流已经在 caches.match 中使用过一次
            // 那么该流是不能再次使用的。我们只能得到它的副本，拿去使用
            const fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(response => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // 如果成功，该 response 一是要拿给浏览器渲染，二是要进行缓存
                // 不过需要记住，由于 caches.put 使用的是文件的响应流，一旦使用
                // 那么返回的 response 就无法访问造成失败，所以，这里需要复制一份
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});
