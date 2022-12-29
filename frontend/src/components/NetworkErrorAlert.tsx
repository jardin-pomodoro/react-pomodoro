// eslint-disable-next-line import/prefer-default-export
export function NetworkErrorMessage({ message, dismiss }: any) {
  return (
    <div className="alert alert-danger" role="alert">
      {message}
      <button type="button" className="close" onClick={dismiss}>
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
