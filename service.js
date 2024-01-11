import {Service} from 'node-windows'
const svc = new Service({
    name:'skud_frontend',
    description: 'skud_frontend',
    script: 'C:\\skud\\skud_frontend\\server.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install(); 