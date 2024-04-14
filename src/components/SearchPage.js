import React, { useEffect } from 'react';

const SearchPage = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cse.google.com/cse.js?cx=02d8eddf1501844d2";
        script.async = true;
        document.body.appendChild(script);

        const debounce = (func, delay) => {
            let timer;
            return function(...args) {
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        };

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'INPUT' && node.classList.contains('gsc-input')) {
                        const debouncedInputEvent = debounce((event) => {
                            const searchTerm = event.target.value;
                            if (searchTerm) {
                                gtag('event', 'search', {
                                    search_term: searchTerm,
                                });
                            }
                        }, 500); // 500 ms 的延迟

                        node.addEventListener('input', debouncedInputEvent);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.body.removeChild(script);
            observer.disconnect();
        };
    }, []);

    return (
        <div>
            <h1>Search with Google</h1>
            <div className="gcse-search"></div>
        </div>
    );
};

export default SearchPage;
