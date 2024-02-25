type Intensity = 'normal' | 'faint' | 'strong';
export type Theme = {
  color: {
    bg: { [k in Intensity]: string },
    content: { [k in Intensity]: string }
  }
}

type Theme_Set = Record<string,Theme>;
export const themes:Theme_Set = {
  green: {
    color: {
      bg: {
        normal: '#070F00',
        faint:  '#0A2000',
        strong: '#474'
      },
      content: {
        normal: '#DFC',
        faint:  '#474',
        strong: '#FFF'
      }
    }
  }
}

