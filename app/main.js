const net = require("net");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });
  socket.on("data", (data) => {
    let firstLine = data.toString().split('\r\n')[0];
    if (firstLine.split(' ')[1].length === 1 && firstLine.split(' ')[1][0] === '/') {
        socket.write('HTTP/1.1 200 OK\r\n\r\n');
    }
    else {
        socket.write('HTTP/1.1 400 Not Found\r\n\r\n');
    }
    socket.end();
  })
});

server.listen(4221, "127.0.0.1");