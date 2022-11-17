export type Path = FilePath | DirPath;
export type FilePath = string;
export type DirPath = string;

export type PathSegment = FilePathSegment | DirPathSegment;
export type FilePathSegment = string;
export type DirPathSegment = string;

export class FileWithPath<F> {
    file: F;
    path: FilePath;

    constructor(file: F, path: FilePath) {
        this.file = file;
        this.path = path;
    }
}

export function splitPath(path: Path): PathSegment[] {
    return path.split("/");
}