(function () {
    const configJsonRequest = new XMLHttpRequest();
    configJsonRequest.open('GET', '/config.json', false);
    configJsonRequest.send(null);
    try {
        window.envConfig = JSON.parse(configJsonRequest.responseText);
    } catch (e) {
        console.log(`Config load error! ${e}`);
    }
}());
