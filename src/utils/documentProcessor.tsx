// unidox-mvp/src/utils/documentProcessor.tsx

import { extractDocumentInfo, extractInfoFromImage } from "../GeminiService.ts";
import * as pdfjsLib from 'pdfjs-dist/build/pdf';


pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.mjs`; // Or your correct path/CDN

export const PREDEFINED_TAGS = {
    // Identity & Civil Status
    CARTE_IDENTITE: "Carte Nationale d'Identité",
    PASSEPORT: "Passeport",
    TITRE_SEJOUR: "Titre de Séjour",
    PERMIS_CONDUIRE: "Permis de Conduire",
    ACTE_NAISSANCE: "Acte de Naissance",
    LIVRET_FAMILLE: "Livret de Famille",
    // Housing
    JUSTIFICATIF_DOMICILE: "Justificatif de Domicile", // General
    QUITANCE_LOYER: "Quittance de Loyer",
    FACTURE_ELECTRICITE: "Facture Électricité",
    FACTURE_GAZ: "Facture Gaz",
    FACTURE_EAU: "Facture Eau",
    FACTURE_INTERNET: "Facture Internet",
    FACTURE_TELEPHONE: "Facture Téléphone",
    ASSURANCE_HABITATION: "Assurance Habitation",
    TAXE_FONCIERE: "Taxe Foncière",
    // Work & Income
    CONTRAT_TRAVAIL: "Contrat de Travail",
    FICHE_PAIE: "Fiche de Paie",
    ATTESTATION_EMPLOYEUR: "Attestation Employeur",
    AVIS_IMPOSITION: "Avis d'Imposition",
    RIB: "RIB (Relevé d'Identité Bancaire)",
    KBIS: "Extrait Kbis",
    // Health
    CARTE_VITALE: "Carte Vitale", // Or Attestation de droits
    ATTESTATION_MUTUELLE: "Attestation Mutuelle",
    ORDONNANCE_MEDICALE: "Ordonnance Médicale",
    // Vehicle
    CARTE_GRISE: "Carte Grise (Certificat d'Immatriculation)",
    ASSURANCE_VEHICULE: "Assurance Véhicule",
    // Education & Other
    DIPLOME: "Diplôme",
    CERTIFICAT_SCOLARITE: "Certificat de Scolarité",
    CV: "CV (Curriculum Vitae)",
    LETTRE_MOTIVATION: "Lettre de Motivation",
    RELEVE_BANCAIRE: "Relevé de Compte Bancaire",
    // Default/Fallback
    DOCUMENT_IMPORTANT: "Document Important",
    FACTURE_GENERALE: "Facture Générale",
    ATTESTATION_GENERALE: "Attestation Générale",
} as const; // Using "as const" makes the values string literals

// We can also create a list of keywords for mapping
const TAG_KEYWORDS_MAP: Record<string, string[]> = {
    [PREDEFINED_TAGS.CARTE_IDENTITE]: ['carte nationale', 'cni', 'identité', 'id card', 'national id'],
    [PREDEFINED_TAGS.PASSEPORT]: ['passeport', 'passport'],
    [PREDEFINED_TAGS.TITRE_SEJOUR]: ['titre de séjour', 'carte de séjour', 'residence permit'],
    [PREDEFINED_TAGS.PERMIS_CONDUIRE]: ['permis de conduire', "permis b", "driver's license", "driving license"],
    [PREDEFINED_TAGS.ACTE_NAISSANCE]: ['acte de naissance', 'birth certificate'],
    [PREDEFINED_TAGS.LIVRET_FAMILLE]: ['livret de famille', 'family record book'],
    [PREDEFINED_TAGS.QUITANCE_LOYER]: ['quittance de loyer', 'rent receipt'],
    [PREDEFINED_TAGS.FACTURE_ELECTRICITE]: ['facture d\'électricité', 'électricité', 'edf', 'engie electricite', 'totalenergies electricite', 'electricity bill'],
    [PREDEFINED_TAGS.FACTURE_GAZ]: ['facture de gaz', 'gaz', 'engie gaz', 'totalenergies gaz', 'gas bill'],
    [PREDEFINED_TAGS.FACTURE_EAU]: ['facture d\'eau', 'eau', 'suez', 'veolia eau', 'water bill'],
    [PREDEFINED_TAGS.FACTURE_INTERNET]: ['facture internet', 'freebox', 'livebox', 'sfr box', 'bouygues box', 'internet bill', 'isp bill'],
    [PREDEFINED_TAGS.FACTURE_TELEPHONE]: ['facture téléphone', 'facture mobile', 'phone bill', 'mobile bill'],
    [PREDEFINED_TAGS.ASSURANCE_HABITATION]: ['assurance habitation', 'home insurance', 'maif habitation', 'macif habitation', 'matmut habitation'],
    [PREDEFINED_TAGS.TAXE_FONCIERE]: ['taxe foncière', 'property tax'],
    [PREDEFINED_TAGS.CONTRAT_TRAVAIL]: ['contrat de travail', 'employment contract'],
    [PREDEFINED_TAGS.FICHE_PAIE]: ['fiche de paie', 'bulletin de salaire', 'payslip', 'paystub'],
    [PREDEFINED_TAGS.ATTESTATION_EMPLOYEUR]: ['attestation employeur', "certificat de travail", 'employer certificate'],
    [PREDEFINED_TAGS.AVIS_IMPOSITION]: ['avis d\'imposition', 'impôt sur le revenu', 'tax assessment', 'tax return'],
    [PREDEFINED_TAGS.RIB]: ['rib', 'relevé d\'identité bancaire', 'bank account details'],
    [PREDEFINED_TAGS.KBIS]: ['kbis', 'extrait kbis', 'company registration'],
    [PREDEFINED_TAGS.CARTE_VITALE]: ['carte vitale', 'attestation de droits', 'sécurité sociale', 'social security card'],
    [PREDEFINED_TAGS.ATTESTATION_MUTUELLE]: ['attestation mutuelle', 'mutuelle santé', 'health insurance certificate'],
    [PREDEFINED_TAGS.ORDONNANCE_MEDICALE]: ['ordonnance médicale', 'prescription'],
    [PREDEFINED_TAGS.CARTE_GRISE]: ['carte grise', 'certificat d\'immatriculation', 'vehicle registration'],
    [PREDEFINED_TAGS.ASSURANCE_VEHICULE]: ['assurance véhicule', 'assurance auto', 'assurance moto', 'vehicle insurance'],
    [PREDEFINED_TAGS.DIPLOME]: ['diplôme', 'diploma', 'degree certificate'],
    [PREDEFINED_TAGS.CERTIFICAT_SCOLARITE]: ['certificat de scolarité', 'school certificate', 'proof of enrollment'],
    [PREDEFINED_TAGS.CV]: ['cv', 'curriculum vitae', 'resume'],
    [PREDEFINED_TAGS.LETTRE_MOTIVATION]: ['lettre de motivation', 'cover letter'],
    [PREDEFINED_TAGS.RELEVE_BANCAIRE]: ['relevé de compte', 'relevé bancaire', 'bank statement'],
    // Add more mappings as needed
};
// Interfaces (IDCardInfo, PassportInfo, etc.) and ProcessedData remain the same
interface IDCardInfo {
    documentType: string;
    fullName: string;
    dateOfBirth: string;
    issueDate: string;
    expiryDate: string;
}

interface PassportInfo {
    documentType: string;
    fullName: string;
    passportNumber: string;
    nationality: string;
    dateOfBirth: string;
    issueDate: string;
    expiryDate: string;
}

interface BillInfo {
    documentType: string;
    provider: string;
    customerName: string;
    address: string;
    billDate: string;
    amount: string;
}

interface GenericDocInfo {
    documentType: string;
}

type ExtractedInfo = IDCardInfo | PassportInfo | BillInfo | GenericDocInfo;

interface ProcessedData {
    type: 'image' | 'invoice' | 'payment' | 'generic'; // This 'type' will be based on Gemini's interpretation
    tags: string[];
    status: string;
    validUntil: string;
    addedOn: string;
    extractedInfo: ExtractedInfo;
}

// Helper to determine document type hint (less critical if everything becomes an image for AI)
const determineDocumentHint = (fileName: string): string => {
    const lowerFileName = fileName.toLowerCase();
    if (lowerFileName.includes('id') || lowerFileName.includes('identity') || lowerFileName.includes('carte')) {
        return 'id_card';
    } else if (lowerFileName.includes('passport') || lowerFileName.includes('passeport')) {
        return 'passport';
    } else if (lowerFileName.includes('bill') || lowerFileName.includes('facture')) {
        return 'invoice';
    }
    return 'generic_document';
};

// --- NEW: Function to convert a PDF page to an image Blob ---
const convertPdfPageToImageBlob = async (file: File, pageNumber: number = 1, quality: number = 0.95, type: 'image/png' | 'image/jpeg' = 'image/jpeg'): Promise<Blob | null> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    if (pageNumber < 1 || pageNumber > pdf.numPages) {
        console.error(`Invalid page number: ${pageNumber}. PDF has ${pdf.numPages} pages.`);
        return null;
    }

    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 2.0 }); // Use a good scale for better image quality

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
        console.error('Could not get canvas context');
        return null;
    }
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };

    await page.render(renderContext).promise;

    return new Promise((resolve) => {
        canvas.toBlob(resolve, type, quality);
    });
};

// Helper function to read a plain text file
const readPlainTextFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

// --- REWRITTEN: processDocument function ---
export const processDocument = async (file: File): Promise<ProcessedData> => {
    console.log(`[processDocument START] Received file: name='${file?.name}', type='${file?.type}', size=${file?.size}`);
    try {
        const fileName = file.name;
        const fileType = file.type ? file.type.toLowerCase() : "";
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || "";

        let extractedInfoFromAI: Record<string, any> = { documentType: "Generic Document" };

        if (fileType.startsWith('image/')) {
            console.log('[processDocument BRANCH] Image file - sending to Gemini Vision');
            extractedInfoFromAI = await extractInfoFromImage(file);
        } else if (fileType === 'application/pdf' || fileExtension === 'pdf') {
            console.log('[processDocument BRANCH] PDF file - converting first page to image for Gemini Vision');
            const imageBlob = await convertPdfPageToImageBlob(file, 1);
            if (imageBlob) {
                const pdfPageAsImageFile = new File([imageBlob], `page_1_from_${fileName}.jpg`, { type: imageBlob.type });
                extractedInfoFromAI = await extractInfoFromImage(pdfPageAsImageFile);
            } else {
                console.error('Failed to convert PDF page to image.');
                extractedInfoFromAI = { documentType: "PDF Conversion Error", error: "Failed to convert PDF page to image" };
            }
        } else if (fileType === 'text/plain' || fileExtension === 'txt') {
            console.log('[processDocument BRANCH] TXT file - sending text content to Gemini');
            const textContent = await readPlainTextFile(file);
            extractedInfoFromAI = await extractDocumentInfo(textContent, determineDocumentHint(fileName));
        } else {
            console.warn(`[processDocument BRANCH] Fallback: File type '${fileType}' (ext: '.${fileExtension}') not handled. No content sent to AI.`);
            extractedInfoFromAI = { documentType: "Unsupported File Type", error: `File type ${fileType || fileExtension} not processed for AI extraction.` };
        }

        if (!extractedInfoFromAI.documentType && extractedInfoFromAI.error) { // If error, use that as doctype
            extractedInfoFromAI.documentType = extractedInfoFromAI.error;
        } else if (!extractedInfoFromAI.documentType) {
            extractedInfoFromAI.documentType = determineDocumentHint(fileName) || "Generic Document";
        }

        // Use the NEW determineDocumentType and generateTags
        console.log("----------------------------------------------------");
        console.log("[PROCESS_DOC] RAW Extracted Info from AI:", JSON.stringify(extractedInfoFromAI, null, 2));

        const mappedCategory = determineDocumentType(extractedInfoFromAI);
        console.log("[PROCESS_DOC] Mapped Category by determineDocumentType:", mappedCategory);

        const tags = generateTags(extractedInfoFromAI, mappedCategory);
        console.log("[PROCESS_DOC] Generated Tags by generateTags:", tags);
        console.log("----------------------------------------------------");
        const expiryDate = extractedInfoFromAI.expiryDate || "N/A";

        return {
            type: mappedCategory, // This is the broad category for UI icons etc.
            tags: tags,         // These are the specific, detailed tags
            status: "Vérifié",
            validUntil: expiryDate,
            addedOn: new Date().toLocaleDateString('fr-FR'),
            extractedInfo: extractedInfoFromAI as ExtractedInfo
        };

    } catch (error) {
        console.error(`[processDocument CATCH_ALL] Error processing document '${file?.name}':`, error);
        return {
            type: 'generic',
            tags: ['Erreur de Traitement'],
            status: 'Erreur',
            validUntil: 'N/A',
            addedOn: new Date().toLocaleDateString('fr-FR'),
            extractedInfo: { documentType: "Processing Error", error: (error as Error).message || "Unknown error" } as ExtractedInfo,
        };
    }
};

// Helper function to determine document type from extracted info (relies more on AI now)
const determineDocumentType = (extractedInfo: Record<string, any>): 'image' | 'invoice' | 'payment' | 'generic' => {
    if (!extractedInfo || !extractedInfo.documentType) {
        return 'generic';
    }
    const aiDocType = String(extractedInfo.documentType).toLowerCase(); // Ensure it's a string

    // Broad categorization based on AI's documentType
    if (aiDocType.includes('id') || aiDocType.includes('passport') || aiDocType.includes('license') || aiDocType.includes('permit') || aiDocType.includes('carte') || aiDocType.includes('livret')) {
        return 'image'; // Usually identity or official personal docs
    }
    if (aiDocType.includes('invoice') || aiDocType.includes('bill') || aiDocType.includes('receipt') || aiDocType.includes('quittance') || aiDocType.includes('facture')) {
        return 'invoice';
    }
    if (aiDocType.includes('payslip') || aiDocType.includes('paystub') || aiDocType.includes('payroll') || aiDocType.includes('salary statement') || aiDocType.includes('fiche de paie')) {
        return 'payment';
    }
    if (aiDocType.includes('contract') || aiDocType.includes('agreement') || aiDocType.includes('attestation') || aiDocType.includes('certificate')) {
        return 'generic'; // Could be various official docs, tags will specify
    }
    if (aiDocType.includes('statement') && aiDocType.includes('bank')) {
        return 'payment'; // Or 'generic' depending on how you categorize bank statements
    }
    // If Gemini says it's just an 'image' or 'photo', it's an image.
    if (aiDocType === 'image' || aiDocType === 'photo' || aiDocType === 'picture') return 'image';

    return 'generic';
};

// Helper function to generate tags (relies more on AI now)
const generateTags = (extractedInfo: Record<string, any>, mappedCategory: 'image' | 'invoice' | 'payment' | 'generic'): string[] => {
    const identifiedTags = new Set<string>();
    let foundSpecificTag = false;

    // Use the documentType from AI as a primary source for keywords
    const aiDocumentType = String(extractedInfo.documentType || '').toLowerCase();
    const allTextFromAI = Object.values(extractedInfo).join(' ').toLowerCase(); // Combine all text for broader keyword search

    // Attempt to match keywords to our predefined tags
    for (const [tag, keywords] of Object.entries(TAG_KEYWORDS_MAP)) {
        for (const keyword of keywords) {
            if (aiDocumentType.includes(keyword) || allTextFromAI.includes(keyword)) {
                identifiedTags.add(tag);
                foundSpecificTag = true;
                // Optional: break here if you only want the first matching tag group,
                // or continue to find all possible relevant tags.
            }
        }
    }

    // Add general category tag if no specific one was found from keywords,
    // or if you want both.
    if (mappedCategory === 'invoice' && !identifiedTags.has(PREDEFINED_TAGS.FACTURE_GENERALE) && ![...identifiedTags].some(t => t.toLowerCase().includes('facture'))) {
        identifiedTags.add(PREDEFINED_TAGS.FACTURE_GENERALE);
    }
    if (mappedCategory === 'payment' && ![...identifiedTags].some(t => t.toLowerCase().includes('paiement') || t.toLowerCase().includes('fiche de paie') || t.toLowerCase().includes('rib'))) {
        if(aiDocumentType.includes('bank') && aiDocumentType.includes('statement')){
            identifiedTags.add(PREDEFINED_TAGS.RELEVE_BANCAIRE);
        } else {
            identifiedTags.add("Document de Paiement"); // Generic payment
        }
    }
    if (mappedCategory === 'image' && ![...identifiedTags].some(t => t.toLowerCase().includes('identité') || t.toLowerCase().includes('passeport') || t.toLowerCase().includes('permis') || t.toLowerCase().includes('séjour'))) {
        // If it's categorized as image but no specific ID tag found, it might just be a picture.
        // Or, if AI explicitly said 'image', don't add a generic 'Image Document' unless you want to.
    }


    // Add Justificatif de Domicile if applicable (can be various bills)
    if (identifiedTags.has(PREDEFINED_TAGS.FACTURE_ELECTRICITE) ||
        identifiedTags.has(PREDEFINED_TAGS.FACTURE_GAZ) ||
        identifiedTags.has(PREDEFINED_TAGS.FACTURE_EAU) ||
        identifiedTags.has(PREDEFINED_TAGS.QUITANCE_LOYER) ||
        identifiedTags.has(PREDEFINED_TAGS.ASSURANCE_HABITATION) ||
        (aiDocumentType.includes("taxe d'habitation")) // Old but maybe
    ) {
        identifiedTags.add(PREDEFINED_TAGS.JUSTIFICATIF_DOMICILE);
    }


    // If absolutely no specific tags were found via keywords, and AI gave a generic type.
    if (!foundSpecificTag && identifiedTags.size === 0) {
        if (aiDocumentType && aiDocumentType !== 'generic document' && aiDocumentType !== 'generic_document' && aiDocumentType !== 'document') {
            // Use AI's classification if it's somewhat specific
            const capitalizedAiDocType = aiDocumentType.split(/[\s_]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            identifiedTags.add(capitalizedAiDocType);
        } else {
            identifiedTags.add(PREDEFINED_TAGS.DOCUMENT_IMPORTANT); // Fallback to a general useful tag
        }
    }

    // If still no tags, fall back to the broad category or a very generic tag
    if (identifiedTags.size === 0) {
        switch(mappedCategory) {
            case 'image': identifiedTags.add("Image"); break;
            case 'invoice': identifiedTags.add(PREDEFINED_TAGS.FACTURE_GENERALE); break;
            case 'payment': identifiedTags.add("Document de Paiement"); break;
            default: identifiedTags.add(PREDEFINED_TAGS.DOCUMENT_IMPORTANT);
        }
    }

    return Array.from(identifiedTags);
};

// validateDocument and formatDocumentInfo would remain, but their logic
// will now operate on whatever Gemini Vision extracts from the image.
// You might need to adjust them based on the expected output of Gemini Vision.

export const validateDocument = (info: ExtractedInfo): { isValid: boolean; issues?: string[] } => {
    const issues: string[] = [];
    if (!info || !info.documentType) {
        issues.push("Type de document non identifié par l'IA.");
        return { isValid: issues.length === 0, issues }; // Or isValid: false
    }
    // Example: if Gemini Vision identifies an expiryDate for any document type
    if ('expiryDate' in info && info.expiryDate && typeof info.expiryDate === 'string') {
        try {
            // Attempt to parse the date. Gemini might return various formats.
            // This basic parsing might need a robust date parsing library.
            const dateParts = info.expiryDate.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/) || info.expiryDate.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
            let expiry: Date | null = null;
            if (dateParts) {
                if (dateParts[1].length === 4) { // YYYY-MM-DD
                    expiry = new Date(parseInt(dateParts[1]), parseInt(dateParts[2]) - 1, parseInt(dateParts[3]));
                } else { // DD-MM-YYYY
                    expiry = new Date(parseInt(dateParts[3]), parseInt(dateParts[2]) - 1, parseInt(dateParts[1]));
                }
            }

            if (expiry && expiry < new Date()) {
                issues.push(`Document (type: ${info.documentType}) semble être expiré (${info.expiryDate}).`);
            }
        } catch (e) {
            console.warn("Could not parse expiryDate from AI:", info.expiryDate);
        }
    }
    // Add more general or type-specific validations based on what Gemini Vision provides
    return {
        isValid: issues.length === 0,
        issues: issues.length > 0 ? issues : undefined
    };
};

export const formatDocumentInfo = (info: ExtractedInfo): Record<string, string> => {
    const formattedInfo: Record<string, string> = {};
    if (!info) return { "Erreur": "Aucune information extraite." };

    // Display whatever key-value pairs Gemini returns, trying to make keys readable
    for (const [key, value] of Object.entries(info)) {
        if (value && (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean')) {
            // Convert camelCase or snake_case to Title Case for display
            const formattedKey = key
                .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
                .replace(/_/g, ' ')        // Replace underscores with spaces
                .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

            if (!["rawText", "parseError"].includes(key)) {
                formattedInfo[formattedKey] = String(value);
            }
        }
    }

    if (Object.keys(formattedInfo).length === 0 && info.error) {
        formattedInfo["Erreur de Traitement"] = String(info.error);
    } else if (Object.keys(formattedInfo).length === 0) {
        formattedInfo["Information"] = "Aucun détail spécifique n'a été extrait de l'image.";
    }

    return formattedInfo;
};


export default {
    processDocument,
    validateDocument,
    formatDocumentInfo
};