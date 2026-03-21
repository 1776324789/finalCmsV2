document.addEventListener("DOMContentLoaded", function () {
    var socket = io();

    socket.on('connect', function () {
        console.log('Successfully connected to server');
    });

    socket.on('file-changed', function () {
        // console.log('File changed, reloading page...');
        window.location.reload();
    });

    socket.on('disconnect', function () {
        console.log('Disconnected from server');
    });
});