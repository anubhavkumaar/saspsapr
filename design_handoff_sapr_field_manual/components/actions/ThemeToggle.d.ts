export interface ThemeToggleProps {
  /** localStorage key that remembers the choice. Default "sapr-theme". */
  storageKey?: string;
  onChange?: (theme: 'day' | 'night') => void;
}
/** Day / Night switch. Sets data-theme="night" on <html>; every token swaps. */
export declare function ThemeToggle(props: ThemeToggleProps): JSX.Element;
