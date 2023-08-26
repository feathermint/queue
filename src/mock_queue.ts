/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  DeleteMessageBatchCommandOutput,
  DeleteMessageBatchRequestEntry,
  DeleteMessageCommandOutput,
  ReceiveMessageCommandInput,
  ReceiveMessageCommandOutput,
  SendMessageBatchCommandOutput,
  SendMessageBatchRequestEntry,
  SendMessageCommandInput,
  SendMessageCommandOutput,
} from "@aws-sdk/client-sqs";
import type { Queue } from "./queue";

export class MockQueue implements Required<Queue> {
  send(
    message: unknown,
    options?: Partial<Omit<SendMessageCommandInput, "MessageBody">> | undefined,
  ): Promise<SendMessageCommandOutput> {
    throw new Error("Method not implemented.");
  }

  sendBatch(
    entries: SendMessageBatchRequestEntry[],
    queueUrl?: string | undefined,
  ): Promise<SendMessageBatchCommandOutput> {
    throw new Error("Method not implemented.");
  }

  receive(
    options?: Partial<ReceiveMessageCommandInput> | undefined,
  ): Promise<ReceiveMessageCommandOutput> {
    throw new Error("Method not implemented.");
  }

  delete(
    receiptHandle: string,
    queueUrl?: string | undefined,
  ): Promise<DeleteMessageCommandOutput> {
    throw new Error("Method not implemented.");
  }

  deleteBatch(
    entries: DeleteMessageBatchRequestEntry[],
    queueUrl?: string | undefined,
  ): Promise<DeleteMessageBatchCommandOutput> {
    throw new Error("Method not implemented.");
  }

  destroy(): void {
    throw new Error("Method not implemented.");
  }
}
