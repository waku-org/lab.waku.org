import RLNMembershipRegistration from '../components/RLNMembershipRegistration';
import { WalletInfo } from '../components/WalletInfo';
import { RLNImplementationToggle } from '../components/RLNImplementationToggle';
import KeystoreManager from '../components/KeystoreManager';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 p-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Waku Keystore Management</h2>
          
          <div className="space-y-8">
            {/* RLN Implementation Toggle */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">RLN Implementation</h3>
              <RLNImplementationToggle />
            </div>
            
            {/* Wallet Information Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Wallet Connection</h3>
              <WalletInfo />
            </div>
            
            {/* RLN Membership Registration Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">RLN Membership</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Register a new RLN membership to participate in Waku RLN Relay without exposing your private key on your node.
                Set your desired rate limit for messages per epoch.
              </p>
              <RLNMembershipRegistration />
            </div>
            
            {/* Keystore Management Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Keystore Management</h3>
              <p className="mb-4 text-gray-700 dark:text-gray-300">
                Export your keystore credentials to use them with your Waku node or import existing credentials.
                Keep your keystores safe as they contain your membership information.
              </p>
              <KeystoreManager />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
