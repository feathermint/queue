import { expect } from "chai";
import { Queue } from "../src/queue";

describe("Queue", () => {
  const queue = new Queue({
    defaultQueueUrl: process.env.SQS_URL ?? "",
    defaultMaxNumberOfMessages: 10,
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
    },
  });

  describe("send", () => {
    it("sends a message to the queue", async () => {
      const response = await queue.send("test message");
      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  describe("receive", () => {
    it("receives messages from the queue", async () => {
      const response = await queue.receive();
      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  describe("sendBatch", () => {
    it("sends a batch of messages to the queue", async () => {
      const response = await queue.sendBatch([
        { Id: "1", MessageBody: "test message" },
      ]);
      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  describe("delete", () => {
    it("deletes a message from the queue", async () => {
      await queue.send("test message");
      const handle = (await queue.receive()).Messages?.[0].ReceiptHandle;
      if (!handle) throw new Error("A receipt handle is required.");
      const response = await queue.delete(handle);
      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  describe("deleteBatch", () => {
    it("deletes a message from the queue", async () => {
      await queue.send("test message");
      const handle = (await queue.receive()).Messages?.[0].ReceiptHandle;
      if (!handle) throw new Error("A receipt handle is required.");
      const response = await queue.deleteBatch([
        { Id: "1", ReceiptHandle: handle },
      ]);
      expect(response.$metadata.httpStatusCode).to.equal(200);
    });
  });

  after(() => {
    queue.destroy();
  });
});
