export interface Flags {
    url_png: string;
    url_svg: string;
    html_entity: string;
}

export interface Names {
    common: string;
    alternates: string[];
}

export type Demonyms = string | Record<string, Record<string, string>>;

export interface Country {
    names: Names;
    population: number;
    demonyms: Demonyms;
    flag: Flags;
}