import express from "express";
import routerStudio from "./routes/studios.js";
import animeRouter from "../src/routes/anime.js";
import routerDirectors from "../src/routes/directors.js";
import routerCharacters from "./routes/characters.js";
import errorHandler from "./middleware/errorHandler.js";
import pc from "picocolors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
//middleware
app.use(express.json());

// middleware Routes
app.use("/animes", animeRouter);
app.use("/studios", routerStudio);
app.use("/directors", routerDirectors);
app.use("/characters", routerCharacters);
//Middleware errors

app.use(errorHandler);

const PORT = process.env.PORT || 0;
app.listen(PORT, () => {
  console.log(pc.green(`The server is running at http://localhost:${PORT}`));
});
