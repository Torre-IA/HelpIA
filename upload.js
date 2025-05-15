document.addEventListener("DOMContentLoaded", function() {
    const uploadButton = document.getElementById("uploadButton");
    const fileInput = document.getElementById("fileInput");

    // 🔹 Reemplaza esta URL con el endpoint de Power Automate
    const powerAutomateUrl = "https://prod-43.westus.logic.azure.com:443/workflows/3931b9486bb44b419d090f19a7e252de/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=plClrLfMr965eOWpVXfKkDTcz4RK1KGUIjuBMVbaPlQ";

    uploadButton.addEventListener("click", async function() {
        if (!fileInput.files || fileInput.files.length === 0) {
            alert("Por favor selecciona un archivo");
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = async function(event) {
            try {
                const fileContent = event.target.result.split(",")[1]; // Base64 content
                const contentType = file.type;

                // 🔹 Enviar datos al flujo de Power Automate
                const response = await fetch(powerAutomateUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fileName: `${file.name}`,
                        fileContent: fileContent,
                        contentType: contentType
                    })
                });

                if (response.ok) {
                    alert(`Archivo ${file.name} subido exitosamente a través de Power Automate!. Se actualizara la base de conocimiento en 5 minutos.`);
                } else {
                    const errorDetails = await response.text();
                    alert(`Error en la subida: ${errorDetails}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert(`Error al subir: ${error.message}`);
            }
        };

        reader.readAsDataURL(file);
    });
});
