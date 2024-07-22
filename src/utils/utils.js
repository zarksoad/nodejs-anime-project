// Read File
import fs from "node:fs/promises";
import pc from "picocolors";

export const readFile = async (path) => {
  try {
    const file = await fs.readFile(path, "utf-8");
    return JSON.parse(file);
  } catch (error) {
    console.error(pc.red("Error reading the file", error));
    throw error;
  }
};
// Function to write into files
export const writeFile = async (data, path) => {
  try {
    const file = JSON.stringify(data, null, 2);
    await fs.writeFile(path, file, "utf-8");
  } catch (error) {
    console.error(pc.red("Error writing the file", error));
    throw error;
  }
};
// function get id and increment
export async function getIdFile(path) {
  try {
    const data = await readFile(path);
    if (!data || !data[0] || !data[0].IdIncrement) {
      throw new Error("Invalid data format");
    }
    let firstIdIncrement = parseInt(data[0].IdIncrement, 10);
    firstIdIncrement++;
    return firstIdIncrement;
  } catch (error) {
    console.error("Error getting ID from file:", error);
    throw error;
  }
}
export async function updateIdfile(id, path, data) {
  try {
    if (!data || !data[0]) {
      throw new Error(pc.red("Invalid data format"));
    }
    data[0].IdIncrement = id.toString();
    const apache = data[0];
    console.log(apache);
    await writeFile(data, path);
  } catch (error) {
    console.error("Error updating ID in file:", error);
    throw error;
  }
}
