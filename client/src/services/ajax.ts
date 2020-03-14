interface IOptions {
    method: string;
    url: string;
    body: object;
}

export default function myAjax(options: IOptions) {
    const baseUrl = "http://localhost:3001";
    const { method, url, body } = options;
    const request = new XMLHttpRequest();

    if (url.match(/^[https|http]/)) {
        request.open(method, url);
    } else {
        request.open(method, baseUrl + url);
    }

    request.send(JSON.stringify(body));
    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    resolve(request.responseText);
                } else if (request.status >= 400) {
                    reject(request);
                }
            }
        }
    });
}
