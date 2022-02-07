type DoneRequestEvent = { type: "done", data: { [key: string]: string } };
type RetryRequestEvent = { type: "retry" };
type ErrorRequestEvent = { type: "error", error: Error|string };

type RequestEvent = DoneRequestEvent | RetryRequestEvent | ErrorRequestEvent;

export default RequestEvent;