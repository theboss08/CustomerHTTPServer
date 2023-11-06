const net = require("net");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
    console.log("client connected");

    socket.on("close", () => {
        socket.end();
        server.close();
    });

    socket.on("data", (data) => {
        let firstLine = data.toString().split('\r\n')[0];
        let headerMap = new Map();
        data.toString().split('\r\n').forEach(line => {
            if (line.split(' ')[0][line.split(' ')[0].length - 1] === ':') {
                headerMap.set(line.split(' ')[0], line.split(' ').slice(1).join(''));
            }
        });
        let path = firstLine.split(' ')[1];
        if(path.match(/\/echo\/(.*)/) && path.match(/\/echo\/(.*)/)[1] != '') {
            let response = path.match(/\/echo\/(.*)/)[1];
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${response.length}\r\n\r\n${response}`);
        }
        else if (path.length === 1 && path === '/') {
            socket.write('HTTP/1.1 200 OK\r\n\r\n');
        }
        else if (path === '/user-agent') {
            let response = headerMap.get('User-Agent:');
            socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${response.length}\r\n\r\n${response}`);
        }
        else {
            socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
        }
        socket.end();
    })
});

server.listen(4221, "localhost");