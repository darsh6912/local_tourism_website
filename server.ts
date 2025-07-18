import { spawn } from "child_process";
import path from "path";

// Define the paths to each server script
const servers = [
    { name: "Bus Server", script: path.join(__dirname, "durga/bus/server.js") },
    { name: "Durga Server", script: path.join(__dirname, "durga/server.js") },
    { name: "Train Server", script: path.join(__dirname, "durga/trainserver.js") },
    { name: "Tips Backend Server", script: path.join(__dirname, "tips/backend/server.js") },
    { name: "Tourist_Guide Server", script: path.join(__dirname, "guide/APP/backend/server.js")},
    { name: "Hotel Server", script: path.join(__dirname, "LocaleQuest_Hotel-main/server/server.js")},    
    { name: "Payment Server", script: path.join(__dirname, "payment/payment/index.js") } ,
    { name: "wishlist Server", script: path.join(__dirname, "Dharshinee/server.js") } ,
    { name: "Weather Server", script: path.join(__dirname, "LocaleQuest_Hotel-main/weather-api/Weather/server.js") } ,
    { name: "Login Server", script: path.join(__dirname, "saravani/logins/src/index.js") } 
];

// Start each server
servers.forEach(server => {
    console.log(`Starting ${server.name}...`);
    
    const process = spawn("node", [server.script], { stdio: "inherit" });

    process.on("close", (code) => {
        console.log(`${server.name} exited with code ${code}`);
    });
});
