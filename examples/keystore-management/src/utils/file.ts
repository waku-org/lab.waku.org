/**
 * Utility functions for handling keystore file operations
 */

/**
 * Save a keystore JSON string to a file
 * @param keystoreJson The keystore JSON as a string
 * @param filename Optional filename (defaults to 'waku-rln-keystore.json')
 */
export const saveKeystoreToFile = (keystoreJson: string, filename: string = 'waku-rln-keystore.json'): void => {
  const blob = new Blob([keystoreJson], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  document.body.appendChild(link);
  
  link.click();
  
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

/**
 * Read a keystore file and return its content as a string
 * @returns Promise resolving to the file content as a string
 */
export const readKeystoreFromFile = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    
    input.onchange = (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = () => {
        const content = reader.result as string;
        resolve(content);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  });
}; 