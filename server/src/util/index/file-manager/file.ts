export type Path = FilePath | DirPath;
export type FilePath = string;
export type DirPath = string;

export type PathSegment = FilePathSegment | DirPathSegment;
export type FilePathSegment = string;
export type DirPathSegment = string;

export type EmitFileRemoved<F> = (file: F) => boolean;
export type OnFileRemoved<F> = (file: F) => void;

export type EmitFileAdded<F> = (file: F) => boolean;
export type OnFileAdded<F> = (file: F) => void;
export type EmitFileChanged<F> = (file: F) => boolean;
export type OnFileChanged<F> = (file: F) => void;