import type { ReactNode } from 'react';
export interface InputProps { /** Bold mono — Citizen IDs, codes */ mono?: boolean; invalid?: boolean; type?: string; placeholder?: string; value?: string; defaultValue?: string; required?: boolean; disabled?: boolean; onChange?: (e: any) => void; className?: string; style?: any; autoFocus?: boolean; name?: string; minLength?: number; }
/** 2px-framed square field; focus adds a hard offset shadow. */
export declare function Input(props: InputProps): JSX.Element;
export interface TextareaProps { placeholder?: string; value?: string; defaultValue?: string; rows?: number; required?: boolean; onChange?: (e: any) => void; className?: string; }
export declare function Textarea(props: TextareaProps): JSX.Element;
export interface SelectProps { options?: (string | { value: string; label: string })[]; placeholder?: string; value?: string; defaultValue?: string; required?: boolean; onChange?: (e: any) => void; className?: string; children?: ReactNode; }
export declare function Select(props: SelectProps): JSX.Element;
export interface SearchInputProps { placeholder?: string; value?: string; onChange?: (e: any) => void; }
export declare function SearchInput(props: SearchInputProps): JSX.Element;
