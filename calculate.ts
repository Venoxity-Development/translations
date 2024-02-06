// deno run --allow-read --allow-write calculate.ts

async function fetchProgress(): Promise<any> {
  const projectId = "645542";
  const apiKey = Deno.env.get("API_KEY");

  if (!apiKey) {
    console.error("API_KEY environment variable is not set.");
    return [];
  }

  const url = `https://api.crowdin.com/api/v2/projects/${projectId}/languages/progress`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData.data;
    } else {
      throw new Error(`Failed to fetch progress: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error fetching progress:", error);
    return [];
  }
}

async function readReadmeTemplate(): Promise<string> {
  try {
    const template = await Deno.readTextFile("README.template.md");
    return template;
  } catch (error) {
    console.error("Error reading README template:", error);
    return "";
  }
}

async function writeToReadme(content: string): Promise<void> {
  try {
    await Deno.writeTextFile("README.md", content);
    console.log("README.md updated successfully.");
  } catch (error) {
    console.error("Error writing to README.md:", error);
  }
}

import { Language, Languages } from "./Languages.ts";

async function main() {
  const template = await readReadmeTemplate();
  if (!template) {
    return;
  }

  const progressData = await fetchProgress();
  if (progressData.length === 0) {
    console.log("No progress data available.");
    return;
  }

  let table = `|   | Language | Translation Progress | Approval Progress |
|:-:|---|---|---|
`;

  for (const item of progressData) {
    const languageId = item.data.languageId;
    console.log(item.data);
    let mappedLanguageId = languageId;
    // Map Brazilian Portuguese (pt-BR) to Portuguese (pt)
    if (languageId === "pt-BR") {
      mappedLanguageId = "pt";
    }

    if (Languages[mappedLanguageId]) {
      const languageData = Languages[mappedLanguageId];
      table += `| ${languageData.emoji} | ${languageData.display} | ${item.data.translationProgress}% | ${item.data.approvalProgress}% |\n`;
    }
  }

  await writeToReadme(template.replace("{{TABLE}}", table));
}

main();
