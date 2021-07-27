export interface Component {
  component: string; // 组件的类型
  label?: string;
  tab: number; // tab 键的顺序
  style: {
    width: number;
    height: number;
    'z-index'?: number;
  };
}

export interface DragComponent extends Component {
  x: number;
  y: number;
}

export enum AllType {
  rect = 'rect',
}

export interface InitComponents {
  [AllType.rect]: Component;
}

export const initComponents: InitComponents = {
  [AllType.rect]: {
    component: AllType.rect,
    label: '',
    tab: 0,
    style: {
      width: 80,
      height: 80,
    },
  },
};
