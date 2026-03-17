import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import http from "http";
import { initSocket } from "./src/sockets/server.socket.js";


const PORT = process.env.PORT || 8000;

const httpserver = http.createServer(app);
initSocket(httpserver);
// testAi();

connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

httpserver.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});