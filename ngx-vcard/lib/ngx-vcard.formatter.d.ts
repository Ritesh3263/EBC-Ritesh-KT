import { VCard } from './types/vCard';
import { VCardEncoding } from './types/vCardEncoding';
export declare class VCardFormatter {
    static getVCardAsBlob(vCard: VCard, encoding?: VCardEncoding): Blob;
    /**
     * Get formatted vCard in VCF format
     */
    static getVCardAsString(vCard: VCard, encodingPrefix?: VCardEncoding): string;
}
/**
 * Get major version from version string
 */
export declare function getMajorVersion(version: string): number;
