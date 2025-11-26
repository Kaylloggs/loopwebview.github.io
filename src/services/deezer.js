/**
 * Deezer API Service using JSONP to bypass CORS
 */

let callbackId = 0;

export const searchDeezer = (query) => {
    return new Promise((resolve, reject) => {
        if (!query) {
            resolve([]);
            return;
        }

        const callbackName = `deezerJsonpCallback_${Date.now()}_${callbackId++}`;

        // Create the script element
        const script = document.createElement('script');
        const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp&callback=${callbackName}&limit=20`;

        script.src = url;

        // Define the global callback function
        window[callbackName] = (data) => {
            // Cleanup
            delete window[callbackName];
            document.body.removeChild(script);

            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.data || []);
            }
        };

        // Handle errors (script loading failure)
        script.onerror = () => {
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('Deezer API request failed'));
        };

        // Append script to body to trigger request
        document.body.appendChild(script);
    });
};
