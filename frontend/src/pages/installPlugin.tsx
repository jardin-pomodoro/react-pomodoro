import { NetworkErrorMessage } from '../components/NetworkErrorAlert';

export interface ConnectWalletProps {
  networkErrorMessage: string;
  dismiss: () => void;
}

// eslint-disable-next-line import/prefer-default-export
export function InstallPlugin({
  networkErrorMessage,
  dismiss,
}: ConnectWalletProps) {
  return (
    <div className="container">
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {networkErrorMessage && (
            <NetworkErrorMessage
              message={networkErrorMessage}
              dismiss={dismiss}
            />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          <p>
            Pour utilisé ce site vous avez besoin d'installer le plugin metamask
          </p>
        </div>
      </div>
    </div>
  );
}
