import { ElementRef } from '@angular/core';
import { VCard } from './types/vCard';
import { VCardEncoding } from './types/vCardEncoding';
import * as i0 from "@angular/core";
export declare class DownloadVCardDirective {
    private element;
    constructor(element: ElementRef);
    vCard: VCard | '';
    generateVCardFunction: (() => VCard) | '' | undefined;
    encoding: VCardEncoding;
    onclick(): void;
    private download;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DownloadVCardDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DownloadVCardDirective, "[vcdDownloadVCard]", never, { "vCard": "vcdDownloadVCard"; "generateVCardFunction": "generateVCardFunction"; "encoding": "encoding"; }, {}, never>;
}
