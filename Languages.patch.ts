// deno run --allow-read --allow-write Languages.patch.ts

async function main() {
  const originalContent = await Deno.readTextFile("./Languages.ts");

  const objectRegex = new RegExp(`en:\\s*{[^}]+}`, "g");
  const match = originalContent.match(objectRegex);

  if (match) {
    const objectString = match[0];

    const updatedObjectString = objectString.replace(
      /{([^}]+)}/,
      (_, content) => {
        const currentObject = eval(`({${content}})`); // Unsafe, but fine for this purpose
        const updatedObject = { ...currentObject, verified: true };

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

main();
