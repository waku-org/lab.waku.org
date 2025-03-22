import { useState, useEffect } from 'react';

export const usePasskey = () => {
  const [passkeyId, setPasskeyId] = useState<string | null>(null);

  // Load passkey when component mounts
  // useEffect(() => {
  //   const loadPasskey = async () => {
  //     const storedPasskeyId = localStorage.getItem('rlnPasskeyId');
      
  //     if (storedPasskeyId) {
  //       // Try to get the credential from navigator.credentials
  //       try {
  //         const credential = await getPasskeyCredential(storedPasskeyId);
  //         if (credential) {
  //           setPasskeyId(storedPasskeyId);
  //         }
  //       } catch (error) {
  //         console.error("Failed to retrieve passkey:", error);
  //         // If the credential can't be found, clear localStorage
  //         localStorage.removeItem('rlnPasskeyId');
  //       }
  //     }
  //   };

  //   loadPasskey();
  // }, []);

  // Check if a passkey exists
  const hasPasskey = (): boolean => {
    return localStorage.getItem('rlnPasskeyId') !== null;
  };

  const getPasskey = (): string | null => {
    const storedPasskeyId = localStorage.getItem('rlnPasskeyId');
    return storedPasskeyId;
  };

  const getPasskeyCredential = async (credentialId: string): Promise<PublicKeyCredential | null> => {
    try {
      const idBuffer = Uint8Array.from(
        atob(credentialId.replace(/-/g, '+').replace(/_/g, '/')), 
        c => c.charCodeAt(0)
      );

      // Create get options for the credential
      const getOptions = {
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: [{
            id: idBuffer,
            type: 'public-key',
          }],
          userVerification: 'required',
          timeout: 60000
        }
      };

      // Generate random values for the challenge
      window.crypto.getRandomValues(getOptions.publicKey.challenge);

      // Get the credential
      const credential = await navigator.credentials.get(getOptions as any) as PublicKeyCredential;
      return credential;
    } catch (error) {
      console.error("Error retrieving passkey:", error);
      return null;
    }
  };

  // Create a new passkey
  const createPasskey = async (signer: any): Promise<string> => {
    // Generate a random challenge for the passkey
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    
    // Create credential options for the passkey
    const credentialCreationOptions = {
      publicKey: {
        challenge: challenge,
        rp: {
          name: "RLN Membership",
          id: window.location.hostname
        },
        user: {
          id: new Uint8Array([...new TextEncoder().encode(await signer.getAddress())]),
          name: "RLN Membership Passkey",
          displayName: "RLN Membership Passkey"
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          requireResidentKey: true,
          userVerification: "required"
        },
        timeout: 60000
      }
    };
    
    const credential = await navigator.credentials.create(credentialCreationOptions as any) as PublicKeyCredential;
    
    if (!credential) {
      throw new Error("Failed to create passkey");
    }
    
    // Store credential ID in state and localStorage
    setPasskeyId(credential.id);
    localStorage.setItem('rlnPasskeyId', credential.id);
    
    return credential.id;
  };

  // Return the methods and state for passkey management
  return {
    hasPasskey,
    getPasskey,
    passkeyId,
    createPasskey,
    getPasskeyCredential
  };
};