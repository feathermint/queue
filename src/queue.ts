import {
  DeleteMessageBatchCommand,
  DeleteMessageBatchRequestEntry,
  DeleteMessageCommand,
  ReceiveMessageCommand,
  ReceiveMessageCommandInput,
  SQSClient,
  SQSClientConfig,
  SendMessageBatchCommand,
  SendMessageBatchRequestEntry,
  SendMessageCommand,
  SendMessageCommandInput,
} from "@aws-sdk/client-sqs";

interface QueueConfig extends SQSClientConfig {
  defaultQueueUrl: string;
  defaultMaxNumberOfMessages?: number;
}

export class Queue<MessageType = unknown> {
  readonly #client: SQSClient;
  readonly #queueUrl: string;
  readonly #maxNumberOfMessages: number;

  constructor(config: QueueConfig) {
    const { defaultQueueUrl, defaultMaxNumberOfMessages, ...clientConfig } =
      config;
    this.#client = new SQSClient(clientConfig);
    this.#queueUrl = defaultQueueUrl;
    this.#maxNumberOfMessages = defaultMaxNumberOfMessages ?? 1;
  }

  send(
    message: MessageType,
    options?: Partial<Omit<SendMessageCommandInput, "MessageBody">>,
  ) {
    const command = new SendMessageCommand({
      QueueUrl: this.#queueUrl,
      MessageBody: this.#stringify(message),
      ...options,
    });
    return this.#client.send(command);
  }

  sendBatch(entries: SendMessageBatchRequestEntry[], queueUrl?: string) {
    const command = new SendMessageBatchCommand({
      QueueUrl: queueUrl ?? this.#queueUrl,
      Entries: entries,
    });
    return this.#client.send(command);
  }

  receive(options?: Partial<ReceiveMessageCommandInput>) {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.#queueUrl,
      MaxNumberOfMessages: this.#maxNumberOfMessages,
      ...options,
    });
    return this.#client.send(command);
  }

  delete(receiptHandle: string, queueUrl?: string) {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl ?? this.#queueUrl,
      ReceiptHandle: receiptHandle,
    });
    return this.#client.send(command);
  }

  deleteBatch(entries: DeleteMessageBatchRequestEntry[], queueUrl?: string) {
    const command = new DeleteMessageBatchCommand({
      QueueUrl: queueUrl ?? this.#queueUrl,
      Entries: entries,
    });
    return this.#client.send(command);
  }

  destroy() {
    this.#client.destroy();
  }

  #stringify(message: unknown): string {
    return typeof message === "string" ? message : JSON.stringify(message);
  }
}
