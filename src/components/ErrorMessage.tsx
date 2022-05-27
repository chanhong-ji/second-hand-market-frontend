function ErrorMessage({ message }: { message: string | undefined }) {
  return message == undefined ? null : <div>{message}</div>;
}

export default ErrorMessage;
