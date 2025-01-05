import { TagColorName } from '../styles/emotion';

export class RandomTagColorList {
  private list: Record<string, TagColorName>;
  private ALL_COLORS: TagColorName[];
  private count: number;
  private static instance: RandomTagColorList;

  private constructor() {
    this.list = {};
    this.count = 0;
    this.ALL_COLORS = [
      'green',
      'purple',
      'mint',
      'orange',
      'pink',
      'gray',
      'cyan',
      'brown',
    ];
  }

  set setColor(tag: string) {
    if (!this.list[tag]) {
      this.list[tag] = this.ALL_COLORS[this.count % this.ALL_COLORS.length];
      this.count++;
    }
  }

  get getColorList() {
    return this.list;
  }

  public static getInstance() {
    if (!RandomTagColorList.instance) {
      RandomTagColorList.instance = new RandomTagColorList();
    }
    return RandomTagColorList.instance;
  }
}
