document.addEventListener("DOMContentLoaded", function() {
    // Configuración
    const accountName = "poc01avc";
    const containerName = "ct-poc-ai-avc";
    const accountKey = "Bwcv66LKyga2eF60koRcnW1ctcSCK1gJiHQEO8vhHjbFUmhmPzP47pV0XduEaRG+c4lOrF0eT1lE+AStopCgyg==";

    // Elementos del DOM
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("fileInput");

    uploadButton.addEventListener("click", async function() {
        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Por favor selecciona un archivo");
            return;
        }

        const file = fileInput.files[0];
        
        try {
            // Verifica que la librería esté cargada
            if (!window.azblob && !window.AzureStorage) {
                throw new Error("La librería Azure Storage no se cargó correctamente");
            }

            // Obtiene las clases necesarias
            const { BlobServiceClient, StorageSharedKeyCredential } = window.azblob || window.AzureStorage.Blob;
            
            // Crea las instancias
            const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
            const blobServiceClient = new BlobServiceClient(
                `https://${accountName}.blob.core.windows.net`,
                sharedKeyCredential
            );
            
            // Operaciones con el blob
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const exists = await containerClient.exists();
            
            if (!exists) {
                alert("El contenedor no existe");
                return;
            }

            const blobName = `RFP/${file.name}`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            alert("Subiendo archivo...");
            await blockBlobClient.uploadData(file, {
                blobHTTPHeaders: { blobContentType: file.type }
            });
            
            alert(`Archivo ${file.name} subido exitosamente!\nEl índice se actualizará en 5 minutos.`);
            
        } catch (error) {
            console.error("Error completo:", error);
            alert(`Error al subir: ${error.message}`);
            
            // Diagnóstico adicional
            if (!window.azblob && !window.AzureStorage) {
                alert("⚠️ La librería Azure no se cargó. Verifica:\n1. La conexión a internet\n2. Que el script del CDN se cargó antes que upload.js");
            }
        }
    });
});