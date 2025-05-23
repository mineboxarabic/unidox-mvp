// src/utils/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI('AIzaSyBFUUzjexFUyIsh5AlzEGu26lLbrLRspyM');

// Function to extract information from documents
export async function extractDocumentInfo(fileContent: string, documentType?: string): Promise<Record<string, any>> {
    try {
        // Get a generative model - Gemini Pro is good for text
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Create a system prompt that instructs Gemini on what to extract
        const prompt = `
      You are a document analysis assistant. Extract key information from the document.
      ${documentType ? `This document is a ${documentType}.` : 'Determine the document type first.'}
      
      Return ONLY a JSON object with appropriate fields based on the document type.
      For ID cards include: fullName, dateOfBirth, issueDate, expiryDate.
      For passports include: fullName, passportNumber, nationality, dateOfBirth, issueDate, expiryDate.
      For bills/invoices include: provider, customerName, address, billDate, amount.
      For other documents, extract what seems relevant.
      
      Here is the document content:
      ${fileContent}
    `;

        // Send the request to Gemini
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract the JSON part from the response
        // Gemini might wrap the JSON in markdown code blocks or add explanations
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
            text.match(/```\n([\s\S]*?)\n```/) ||
            text.match(/\{[\s\S]*\}/);

        const jsonString = jsonMatch ? jsonMatch[0] : text;

        // Parse the JSON response
        try {
            // Clean the string to ensure it's valid JSON
            const cleanJson = jsonString.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("Error parsing JSON from Gemini response:", parseError);
            console.log("Received text:", text);
            // Return a basic object with the raw text if parsing fails
            return { rawText: text, parseError: true };
        }
    } catch (error) {
        console.error("Error extracting document info with Gemini:", error);
        return { error: "Failed to extract information from document" };
    }
}

// Function to extract information from images
export async function extractInfoFromImage(imageFile: File): Promise<Record<string, any>> {
    try {
        // Convert image file to base64
        const base64Image = await fileToBase64(imageFile);

        // Get a generative model that supports images
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        // Prepare the image part for the request
        const imagePart = {
            inlineData: {
                data: base64Image,
                mimeType: imageFile.type
            }
        };

        // Create a prompt for document analysis
        const prompt = `
    Analyze the following document image.
    1.  Identify the specific type of document. Use clear, common French terms where applicable (e.g., "Carte Nationale d'Identité", "Passeport Français", "Facture EDF", "Fiche de Paie", "Avis d'Imposition", "RIB", "Carte Grise").
    2.  Extract all key information relevant to this document type.
    3.  Return the information ONLY as a JSON object. The JSON object should have a primary field named "documentType" containing your identification from step 1. Include other fields like "fullName", "dateOfBirth", "expiryDate", "documentNumber", "address", "providerName", "amount", "issueDate", "nationality", etc., as appropriate for the identified document.

    Example for an ID card:
    {
      "documentType": "Carte Nationale d'Identité Française",
      "lastName": "Dupont",
      "firstName": "Jean",
      "dateOfBirth": "01/01/1980",
      "documentNumber": "1234567890AB",
      "issueDate": "10/01/2020",
      "expiryDate": "09/01/2030"
    }

    Example for an electricity bill:
    {
      "documentType": "Facture Électricité",
      "providerName": "EDF",
      "customerName": "Michelle Martin",
      "address": "123 Rue de Paris, 75001 Paris",
      "billDate": "15/04/2025",
      "amountEUR": "75.50",
      "consumptionPeriod": "01/02/2025 - 31/03/2025"
    }
    `;

        // Send the multimodal request to Gemini
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Same JSON extraction logic as above
        const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) ||
            text.match(/```\n([\s\S]*?)\n```/) ||
            text.match(/\{[\s\S]*\}/);

        const jsonString = jsonMatch ? jsonMatch[0] : text;

        try {
            const cleanJson = jsonString.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (parseError) {
            console.error("Error parsing JSON from Gemini vision response:", parseError);
            return { rawText: text, parseError: true };
        }
    } catch (error) {
        console.error("Error extracting information from image with Gemini:", error);
        return { error: "Failed to extract information from image" };
    }
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
    });
};

export default {
    extractDocumentInfo,
    extractInfoFromImage
};