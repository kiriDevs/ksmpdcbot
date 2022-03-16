type DoneRequestEvent = { type: "done", data: object };
type RetryRequestEvent = { type: "retry" };
type ErrorRequestEvent = { type: "error", error: Error|string };

type RequestEvent = DoneRequestEvent | RetryRequestEvent | ErrorRequestEvent;

export default RequestEvent;