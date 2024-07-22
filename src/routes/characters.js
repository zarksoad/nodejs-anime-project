import { fileURLToPath } from "node:url";
import path from "node:path";
import { json, Router } from "express";
import pc from "picocolors";
import {
  readFile,
  writeFile,
  getIdFile,
  updateIdfile,
} from "../utils/utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pathCharacters = path.join(__dirname, "../data/characters.json");

const routerCharacters = Router();

routerCharacters.post("/", async (req, res) => {
  try {
    const data = await readFile(pathCharacters);
    const characterId = await getIdFile(pathCharacters);
    const newCharacter = {
      id: characterId,
      name: req.body.name,
      animeId: req.body.animeId,
    };
    data.push(newCharacter);
    await updateIdfile(characterId, pathCharacters, data);
    res.status(201).json({
      newCharacter: newCharacter,
    });
  } catch (error) {
    console.error("error", error);
  }
});

routerCharacters.get("/", async (req, res) => {
  try {
    const data = await readFile(pathCharacters);
    const IdIncrement = data[0].IdIncrement;
    const newData = data.filter((d) => d.IdIncrement !== IdIncrement);
    res.json({
      characters: newData,
    });
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
});

routerCharacters.get("/:id", async (req, res) => {
  try {
    const data = await readFile(pathCharacters);
    const character = data.find(
      (character) => character.id === parseInt(req.params.id)
    );
    if (!character) return res.status(404).send("Character not found");
    res.json({
      character: character,
    });
  } catch (error) {
    console.error("error", error);
  }
});

routerCharacters.put("/:id", async (req, res) => {
  try {
    const data = await readFile(pathCharacters);
    const character = data.find(
      (character) => character.id === parseInt(req.params.id)
    );
    if (!character) return res.status(404).send("Character not found");
    character.name = req.body.name;
    character.animeId = req.body.name;
    await writeFile(data, pathCharacters);
    res.json({
      character,
    });
  } catch (error) {
    console.error("error", error);
  }
});

routerCharacters.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(pathCharacters);
    const character = data.findIndex((c) => c.id === parseInt(req.params.id));
    if (character === -1) return res.status(404).send("Character not found");
    data.splice(character, 1);
    await writeFile(data, pathCharacters);
    res.json({
      message: "The character has been deleted succesfully",
    });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
});

export default routerCharacters;
