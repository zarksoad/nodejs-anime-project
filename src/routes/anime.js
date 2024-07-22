import { fileURLToPath } from "node:url";
import path from "node:path";
import { Router } from "express";
import pc from "picocolors";
import {
  readFile,
  writeFile,
  getIdFile,
  updateIdfile,
} from "../utils/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const animePath = path.join(__dirname, "../data/anime.json");

// Create a new Router instance for handling anime routes
const animeRouter = Router();

//Get all animes
animeRouter.get("/", async (req, res) => {
  try {
    const data = await readFile(animePath);
    const IdIncrement = data[0].IdIncrement; // Get the current ID increment value
    const newData = data.filter((d) => d.IdIncrement !== IdIncrement); // Filter out the anime with the current ID increment
    res.json({
      animes: newData,
    });
  } catch (error) {
    console.error("error", error);
    res.status(500).send("Error in the server");
  }
});

//Get anime by ID
animeRouter.get("/:id", async (req, res) => {
  try {
    const data = await readFile(animePath);
    const anime = data.find((anime) => anime.id === parseInt(req.params.id));
    if (!anime) return res.status(404).send("Anime not found");
    res.json({
      anime: anime,
    });
  } catch (error) {}
});

// Post a new anime
animeRouter.post("/", async (req, res) => {
  try {
    const data = await readFile(animePath);
    let idAnimes = await getIdFile(animePath);
    const newAnime = {
      id: idAnimes,
      title: req.body.title,
      genre: req.body.genre,
      studioId: req.body.studioId,
    };
    data.push(newAnime);
    await updateIdfile(idAnimes, animePath, data);
    res.status(201).json({
      message: "Anime successfully created",
      newAnime,
    });
  } catch (error) {
    console.error("Error to create anime", error);
    res.status(500).send("Error internal server");
  }
});

// Update an existing anime
animeRouter.put("/:id", async (req, res) => {
  try {
    const data = await readFile(animePath);
    const anime = data.find((anime) => anime.id === parseInt(req.params.id));
    if (!anime) return res.status(404).send("anime not found");
    anime.title = req.body.title;
    anime.genre = req.body.genre;
    anime.studioId = req.body.studioId;
    await writeFile(data, animePath);
    res.status(200).json({
      content: "Contenido modificado",
      anime,
    });
  } catch (error) {
    console.error(pc.red("error"), error);
    res.status(500).send("Error to update the data");
  }
});

// Delete an anime
animeRouter.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(animePath);
    const anime = data.findIndex(
      (anime) => anime.id === parseInt(req.params.id)
    );
    if (anime === -1) return res.status(404).send("Anime not found");
    data.splice(anime, 1);
    await writeFile(data, animePath);
    res.json({
      message: "The anime has been deleted succesfully",
    });
  } catch (error) {
    console.error("error deleting the anime", error);
    res.status(500);
  }
});

export default animeRouter;
