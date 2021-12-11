export class PriorityQueue<T> {
  private data: [number, T][] = [];

  get size(): number {
    return this.data.length;
  }

  get isEmpty(): boolean {
    return this.data.length === 0;
  }

  clear(): void {
    this.data = [];
  }

  insert(item: T, priority: number): void {
    for (let i = 0; i < this.data.length; i++) {
      if (priority > this.data[i][0]) {
        this.data.splice(i, 0, [priority, item]);
        return;
      }
    }
    this.data.push([priority, item]);
  }

  peek(): T {
    if (this.isEmpty) {
      return null;
    }
    return this.data[0][1];
  }

  pop(): T {
    if (this.isEmpty) {
      return null;
    }
    return this.data.pop()[1];
  }
}
