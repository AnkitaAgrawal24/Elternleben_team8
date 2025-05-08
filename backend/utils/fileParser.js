// utils/fileParser.js
import pdfParse from "pdf-parse";

export const extractTextFromFile = async (buffer, fileName) => {
  if (fileName.endsWith(".pdf")) {
    const data = await pdfParse(buffer);
    return data.text;
  }
  // Can add DOCX support too
  throw new Error("Unsupported file type. Only PDF supported yet.");
};
