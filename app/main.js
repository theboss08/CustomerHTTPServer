const net = require("net");

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on("close", () => {
    socket.end();
    server.close();
  });
  socket.on("data", (data) => {
    let firstLine = data.toString().split('\r\n')[0];
    let str = firstLine.split(' ')[1].match(/\/echo\/(.*)/);
    socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str[1].length}\r\n${str[1]}\r\n`);
    socket.end();
  })
});

server.listen(4221, "localhost");