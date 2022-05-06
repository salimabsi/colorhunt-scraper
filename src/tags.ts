import { getPage } from "./page";
import * as cheerio from "cheerio";

type Node = cheerio.Node & {
  data: string;
}

type Tag = {
  name: string;
  alt: string;
}

export const getTags = async () => {
  const $ = await getPage("https://colorhunt.co/", {
    loadOnScroll: false,
  });

  // This selector will be changed after the browser js is loaded.
  const tags = $(".tagBank .button.tag");

  const collections: Tag[] = [];
  const colors: Tag[] = [];

  tags.each((_, tag) => {
    const name = (tag.children[0] as Node).data;
    const alt = tag.attribs["alt"];

    if (tag.attribs["type"] === "color") {
      colors.push({ name, alt });
    } else {
      collections.push({ name, alt });
    }
  });

  return {
    colors,
    collections,
  };
};
