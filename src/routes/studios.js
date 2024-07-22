import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import pc from "picocolors";
import {
  readFile,
  writeFile,
  getIdFile,
  updateIdfile,
} from "../utils/utils.js";
import fs from "node:fs/promises";

// path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const studiosPath = path.join(__dirname, "../data/studios.json");

const routerStudio = Router();

routerStudio.post("/", async (req, res) => {
  try {
    const data = await readFile(studiosPath);
    let studioID = await getIdFile(studiosPath);
    const newStudio = {
      id: studioID,
      name: req.body.name,
    };
    data.push(newStudio);
    await updateIdfile(studioID, studiosPath, data);
    res.status(201).json({
      studio: newStudio,
    });
  } catch (error) {
    console.error("Error to create the studio", error);
    res.status(500).send("Internal Server Error");
    throw error;
  }
});

routerStudio.get("/", async (req, res) => {
  try {
    const data = await readFile(studiosPath);
    const InformationId = data[0].IdIncrement;
    const newData = data.filter((data) => data.IdIncrement !== InformationId);
    res.json({
      studios: newData,
    });
  } catch (error) {
    console.error("Error to get the data", error);
    res.status(500);
  }
});

routerStudio.get("/:id", async (req, res) => {
  try {
    const data = await readFile(studiosPath);
    const studio = data.find((studio) => studio.id === parseInt(req.params.id));
    if (!studio) return res.status(404).send("Studio not found");
    res.json({ studio: studio });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
});

routerStudio.put("/:id", async (req, res) => {
  try {
    const data = await readFile(studiosPath);
    const studio = data.find((studio) => studio.id === parseInt(req.params.id));
    if (!studio) return res.status(404).send("Studio not found");
    studio.name = req.body.name;
    await writeFile(data, studiosPath);
    res.json(studio);
  } catch (error) {
    console.error("error to update the data", error);
    res.status(500);
  }
});

routerStudio.delete("/:id", async (req, res) => {
  try {
    const data = await readFile(studiosPath);
    const studio = data.findIndex(
      (studio) => studio.id === parseInt(req.params.id)
    );
    if (studio === -1) return res.status(404).send("Studio not found");
    data.splice(studio, 1);
    await writeFile(data, studiosPath);
    res.send({
      message: "studio has been deleted successfully",
    });
  } catch (error) {
    console.error("error", error);
    throw error;
  }
});

export default routerStudio;
