const spawn = require('child_process').spawn


const proc = spawn("sudo su -c 'sleep 5 && echo oi'", {
    shell:true
});

proc.stdout.on('data', ()=>{
    console.log("AIO")
});

setTimeout(()=>{
    try {
        process.kill(proc.pid, "SIGKILL");
    } catch(e){}
}, 6000)
