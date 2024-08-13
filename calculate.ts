// deno run --allow-read --allow-write --allow-env --allow-net calculate.ts

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
  } catch (error) {
    console.error("Error writing to README.md:", error);
  }
}

import { Language, LanguageEntry, Languages } from "./Languages.ts";

async function main() {
  const template = await readReadmeTemplate();
  if (!template) {
    return;
  }

  const progressData = await fetchProgress();
  if (progressData.length === 0) {
    return;
  }

  let table = `|   | Language | Translation Progress | Approval Progress |
|:-:|---|---|---|
`;

  const fileData: any = {
    incomplete: [],
    verified: [],
  };

  for (const item of progressData) {
    const languageId = item.data.languageId;
    let mappedLanguageId = languageId;

    // Map Brazilian Portuguese (pt-BR) to Portuguese (pt)
    if (languageId === "pt-BR") {
      mappedLanguageId = "pt";
    }

    // Map European Spanish (es-ES) to Spanish (es)
    // if (languageId === "es-ES") {
    //   mappedLanguageId = "es";
    // }

    if (Languages[mappedLanguageId]) {
      const translationProgress = item.data.translationProgress;
      const approvalProgress = item.data.approvalProgress;

      if (translationProgress === 100) {
        if (approvalProgress === 100) {
          fileData.verified.push(mappedLanguageId);
          await updateLanguagesEntry(mappedLanguageId, { verified: true });
        } else if (approvalProgress < 100) {
          fileData.incomplete.push(mappedLanguageId);
          await updateLanguagesEntry(mappedLanguageId, { incomplete: true });
        }
      } else if (translationProgress < 100) {
        fileData.incomplete.push(mappedLanguageId);
        await updateLanguagesEntry(mappedLanguageId, { incomplete: true });
      }

      const languageData = Languages[mappedLanguageId];
      table += `| ${languageData.emoji} | ${languageData.display} | ${item.data.translationProgress}% | ${item.data.approvalProgress}% |\n`;
    }
  }

  async function updateLanguagesEntry(
    languageId: Language,
    updates: Partial<LanguageEntry>
  ) {
    const originalContent = await Deno.readTextFile("./Languages.ts");

    const objectRegex = new RegExp(`${languageId}:\\s*{[^}]+}`, "g");
    const match = originalContent.match(objectRegex);

    if (match) {
      const objectString = match[0];
      const updatedObjectString = objectString.replace(
        /{([^}]+)}/,
        (_, content) => {
          const currentObject: LanguageEntry = eval(`({${content}})`); // Unsafe, but fine for this purpose
          const updatedObject: LanguageEntry = { ...currentObject, ...updates };

          const updatedProperties = Object.entries(updatedObject)
            .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
            .join(",\n");
          return `{\n${updatedProperties}\n}`;
        }
      );
      const updatedContent = originalContent.replace(
        objectRegex,
        updatedObjectString
      );

      await Deno.writeTextFile("./Languages.ts", updatedContent);
    }
  }

  await Promise.all([
    Deno.writeTextFile(
      "verified.js",
      "export default " + JSON.stringify(fileData.verified, undefined, "\t")
    ),
    Deno.writeTextFile(
      "incomplete.js",
      "export default " + JSON.stringify(fileData.incomplete, undefined, "\t")
    ),
  ]);

  await writeToReadme(template.replace("{{TABLE}}", table));
}

main();
