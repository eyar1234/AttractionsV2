import axios from "axios";
export async function coordsToData(latitude, longitude) {
  try {
    const res = await axios.post("/location", {
      latitude,
      longitude,
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
}

export async function srcOfImage(photoReference) {
  const res = await axios.post("/image", { photoReference });

  return res.data;
}
