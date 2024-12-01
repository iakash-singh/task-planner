import express from "express";
import cors from "cors";
import path, { dirname } from "path";
import { config } from "dotenv";
import connect from "./db/index.mjs";
import { PORT } from "./config/index.mjs";
import apiAuth from "./routes/auth.mjs";
import apiSettings from "./routes/settings.mjs";
import apiEvents from "./routes/events.mjs";
import apiNotes from "./routes/notes.mjs";
import apiTasks from "./routes/tasks.mjs";
import { fileURLToPath } from "url";
import { sendNotification } from "./controllers/tasks.mjs";
import  cron  from 'node-cron';


const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);
config();
const app = express();

app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/auth", apiAuth);
app.use("/api/settings", apiSettings);
app.use("/api/events", apiEvents);
app.use("/api/notes", apiNotes);
app.use("/api/tasks", apiTasks);

if (process.env.NODE_ENV === "production") {
	app.use(express.static("build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "build", "index.html"));
	});
}

app.listen(4000, () => {
	connect();
	console.info(`Server started at port ${4000}`);
});

cron.schedule('* * * * *', () => {
	// console.log("Cron running");
	sendNotification();
});


