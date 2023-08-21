import {Service} from 'node-windows'
const svc = new Service({
    name:'skud_backend',
    description: 'skud_backend',
    script: 'D:\\Projects\\skud\\skud_backend\\server.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install();