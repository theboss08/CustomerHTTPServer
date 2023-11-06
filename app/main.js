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
    if(str[1] != '') {
        socket.write(`HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nContent-Length: ${str[1].length}\r\n${str[1]}\r\n`);
    }
    else {
        socket.write('HTTP/1.1 200 OK\r\n\r\n');
    }
    socket.end();
  })
});

server.listen(4221, "localhost");