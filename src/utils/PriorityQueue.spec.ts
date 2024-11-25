import { expect, it } from "vitest";

import { PriorityQueue } from "./PriorityQueue";

it("does not have any items in it when initialized", () => {
  const queue = new PriorityQueue();

  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBeTruthy();
  expect(queue.peek()).toBeNull();
  expect(queue.pop()).toBeNull();
});

it("returns the correct size after elements are added", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(1, 1);
  queue.insert(2, 2);
  queue.insert(2, 3);

  expect(queue.size).toBe(3);
  expect(queue.isEmpty).toBeFalsy();
});

it("returns the correct size when cleared", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(1, 1);
  queue.insert(2, 2);
  queue.insert(2, 3);

  queue.clear();

  expect(queue.size).toBe(0);
  expect(queue.isEmpty).toBeTruthy();
});

it("returns an element of higher priority on peek", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(1, 1);
  queue.insert(2, 2);

  expect(queue.peek()).toBe(2);
});

it("returns an element of higher priority on pop", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(1, 1);
  queue.insert(2, 2);

  expect(queue.pop()).toBe(2);
});

it("does not remove an element on peek", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(2, 2);
  queue.peek();

  expect(queue.size).toBe(1);
});

it("removes element on pop", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(2, 2);
  queue.pop();

  expect(queue.size).toBe(0);
});

it("returns the element which was inserted first when all elements have the same priority", () => {
  const queue = new PriorityQueue<number>();
  queue.insert(1, 1);
  queue.insert(2, 1);

  expect(queue.pop()).toBe(1);
});
