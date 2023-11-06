const net = require("net");
const fs = require("fs")

const args = process.argv.slice(2);
const directory = args[0] === '--directory' ? args[1] : __dirname;

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
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
        if (firstLine.split(' ')[0] === 'GET') {
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
            else if (path.match(/\/files\/(.*)/) && path.match(/\/files\/(.*)/)[1] != '') {
                let filePath = directory + path.match(/\/files\/(.*)/)[1];
                try {
                    const file = fs.readFileSync(filePath);
                    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: application/octet-stream\r\nContent-Length: ${file.length}\r\n\r\n${file}`);
                } catch (err) {
                    socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
                }
            }
            else {
                socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
            }
        }
        else if (firstLine.split(' ')[0] === 'POST') {
            let path = firstLine.split(' ')[1];
            if (path.match(/\/files\/(.*)/) && path.match(/\/files\/(.*)/)[1] != '') {
                let filePath = directory + path.match(/\/files\/(.*)/)[1];
                console.log(filePath);
                let file = data.toString().split('\r\n\r\n').slice(1).join('');
                console.log(file.toString())
                fs.writeFileSync(filePath, file.toString());
                socket.write('HTTP/1.1 201 OK\r\n\r\n');
            }
        }
        socket.end();
    })
});

server.listen(4221, "localhost");