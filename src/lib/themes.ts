import { recurse_object } from "./debug";

type Theme_Set = Record<string,object>;
export const themes:Theme_Set = {
  green: {
    color: {
      bg: {
        normal: '#070F00',
        faint:  '#0A2000',
        strong: '#262'
      },
      content: {
        normal: '#AFA',
        faint:  '#595',
        strong: '#FFF'
      }
    }
  }
}

export const apply_theme = (theme_name:string) =>
  recurse_object(themes[theme_name], (val, path) => {
    const css_var_name = '--' + path.join('-');
    document.documentElement.style.setProperty(css_var_name, val);
  });
