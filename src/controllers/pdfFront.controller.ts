import { Request, Response } from 'express';
import Pdf from '../models/pdfFront.models';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_KEY || 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define API_BASE from environment or fallback
const API_BASE = process.env.API_BASE || 'http://localhost:3001/api';

// Función corregida para el upload de PDFs
const handlePdfUploadFront = async (file: File, title: string, category: string) => {
  try {
    const token = localStorage.getItem("token") || "";
    
    // 1. VALIDACIONES INICIALES
    if (!file) {
      alert("No se ha seleccionado ningún archivo");
      return;
    }
    
    if (file.type !== "application/pdf") {
      alert("Solo se permiten archivos PDF");
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB límite
      alert("El archivo es demasiado grande. Máximo 10MB");
      return;
    }

    // 2. LIMPIAR NOMBRE DEL ARCHIVO (MÁS ESTRICTO)
    const timestamp = Date.now();
    const fileExtension = ".pdf";
    const baseName = file.name
      .replace(/\.pdf$/i, "") // Remover extensión
      .replace(/[^a-zA-Z0-9_-]/g, "_") // Solo caracteres seguros
      .substring(0, 50); // Limitar longitud
    
    const fileName = `${timestamp}_${baseName}${fileExtension}`;
    
    console.log("Subiendo archivo:", fileName, "Tamaño:", file.size);

    // 3. SUBIR A SUPABASE CON CONFIGURACIÓN EXPLÍCITA
    const { data, error: storageError } = await supabase.storage
      .from("pdf-front")
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false, // No sobrescribir si existe
        contentType: 'application/pdf'
      });

    if (storageError) {
      console.error("Error de Supabase Storage:", storageError);
      
      // Manejo específico de errores de Supabase
      if (storageError.message.includes("Duplicate")) {
        alert("Ya existe un archivo con ese nombre. Inténtalo de nuevo.");
      } else if (storageError.message.includes("too large")) {
        alert("El archivo es demasiado grande para el bucket.");
      } else if (storageError.message.includes("Invalid")) {
        alert("Formato de archivo no válido o nombre incorrecto.");
      } else if (storageError.message.includes("bucket")) {
        alert("Error de configuración del bucket. Contacta al administrador.");
      } else {
        alert(`Error al subir archivo: ${storageError.message}`);
      }
      return;
    }

    // 4. VERIFICAR QUE EL ARCHIVO SE SUBIÓ CORRECTAMENTE
    if (!data || !data.path) {
      alert("Error: No se pudo confirmar la subida del archivo");
      return;
    }

    // 5. OBTENER URL PÚBLICA
    const { data: { publicUrl } } = supabase.storage
      .from("pdf-front")
      .getPublicUrl(fileName);

    if (!publicUrl) {
      alert("Error: No se pudo generar la URL pública");
      return;
    }

    console.log("URL generada:", publicUrl);

    // 6. GUARDAR EN BASE DE DATOS
    const endpoint = `${API_BASE}/pdf-front`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        title: title.trim(), 
        fileUrl: publicUrl, 
        category: category.trim() 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Error del backend:", response.status, errorData);
      
      // Si falla guardar en BD, limpiar archivo de Supabase
      await supabase.storage.from("pdf-front").remove([fileName]);
      
      if (response.status === 400) {
        alert(`Error de validación: ${errorData.message || "Datos incorrectos"}`);
      } else if (response.status === 401) {
        alert("No autorizado. Verifica tu sesión.");
      } else if (response.status === 500) {
        alert("Error del servidor. Inténtalo más tarde.");
      } else {
        alert(`Error al guardar PDF: ${errorData.message || response.statusText}`);
      }
      return;
    }

    // 7. ÉXITO - LIMPIAR Y ACTUALIZAR
    const savedPdf = await response.json();
    console.log("PDF guardado exitosamente:", savedPdf);
    
    fetchPdfsFront(); // Actualizar lista
    setPdfFile(null);
    setPdfFile(null);
    setPdfCategory("");
    
    alert("PDF subido y guardado exitosamente!");

  } catch (err) {
    console.error("Error inesperado en upload:", err);
    
    // Manejo detallado de errores de red
    if (err instanceof TypeError && err.message.includes('fetch')) {
      alert("Error de conexión. Verifica tu conexión a internet.");
    } else if (err instanceof Error) {
      if (err.message.includes('JSON')) {
        alert("Error al procesar la respuesta del servidor.");
      } else if (err.message.includes('network')) {
        alert("Error de red. Verifica tu conexión.");
      } else {
        alert(`Error: ${err.message}`);
      }
    } else {
      alert("Error desconocido. Revisa la consola para más detalles.");
    }
  }
};

function fetchPdfsFront() {
  throw new Error('Function not implemented.');
}
function setPdfFile(arg0: null) {
  throw new Error('Function not implemented.');
}

function setPdfCategory(arg0: string) {
  throw new Error('Function not implemented.');
}

