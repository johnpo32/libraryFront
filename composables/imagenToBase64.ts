// composables/useImagenToBase64.ts
export const useImagenToBase64 = () => {
  const convertir = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer)
          .reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      
      // Obtener el tipo MIME de la respuesta
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      return `data:${contentType};base64,${base64}`;
    } catch (error) {
      console.error('Error convirtiendo imagen:', error);
      throw error;
    }
  };

  return {
    convertir
  };
};