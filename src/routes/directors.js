import { Router } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  readFile,
  writeFile,
  getIdFile,
  updateIdfile,
} from "../utils/utils.js";
import { error } from "node:console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathDirectors = path.join(__dirname, "../data/directors.json");

const routerDirectors = Router();

routerDirectors.post("/", async (req, res) => {
  try {
    const data = await readFile(pathDirectors);
    const idDirector = await getIdFile(pathDirectors);
    const newDirector = {
      id: idDirector,
      name: req.body.name,
    };
    data.push(newDirector);
    await updateIdfile(idDirector, pathDirectors, data);
    res.status(201).json({
      director: newDirector,
    });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
});

routerDirectors.get("/", async (req, res) => {
  try {
    const data = await readFile(pathDirectors);
    res.json({
      directors: data,
    });
  } catch (error) {
    console.error("error", error);
  }
});

routerDirectors.get("/:id", async (req, res) => {
  try {
    const data = await readFile(pathDirectors);
    const director = data.find(
      (director) => director.id === parseInt(req.params.id)
    );
    if (!director) return res.status(404).send("Director not found");
    res.json({
      director: director,
    });
  } catch (error) {
    console.error("error", error);
  }
});

routerDirectors.put("/:id", async (req, res) => {
  try {
    const data = await readFile(pathDirectors);
    const director = data.find(
      (director) => director.id === parseInt(req.params.id)
    );
    if (!director) return res.status(404).send("Director not found");
    director.name = req.body.name;
    await writeFile(data, pathDirectors);
    res.json({
      director,
    });
  } catch (error) {
    console.error("error", error);
  }
});

routerDirectors.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(pathDirectors );
    const director = data.findIndex(
      (director) => director.id === parseInt(req.params.id)
    );
    if (director === -1) return res.status(404).send("director not found");
    data.splice(director, 1);
    await writeFile(data, pathDirectors);
    res.send({
      message: "director has been deleted successfully",
    });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
});

export default routerDirectors;
