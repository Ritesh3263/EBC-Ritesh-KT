import * as i0 from '@angular/core';
import { Directive, Input, HostListener, NgModule } from '@angular/core';

var VCardEncoding;
(function (VCardEncoding) {
    VCardEncoding["none"] = "";
    VCardEncoding["utf8"] = ";CHARSET=utf-8";
})(VCardEncoding || (VCardEncoding = {}));

/**
 * Encodes string
 */
function e(value) {
    if (value) {
        if (typeof value !== 'string') {
            value = '' + value;
        }
        return value
            .replace(/\n/g, '\n')
            .replace(/,/g, ',')
            .replace(/;/g, ';');
    }
    return '';
}
/**
 * Return new line characters
 */
function nl() {
    return '\n';
}

function propertyToVCardString(property) {
    let str = '';
    if (property.language) {
        str += ';LANGUAGE=' + e(property.language);
    }
    if (property.value) {
        str += ';VALUE=' + e(property.value);
    }
    if (property.altid) {
        str += ';ALTID=' + e(property.altid);
    }
    if (property.pid) {
        str += ';PID=' + property.pid.map(s => e(s)).join(',');
    }
    if (property.type) {
        if (Array.isArray(property.type)) {
            if (property.type.length === 1) {
                str += ';TYPE=' + property.type[0];
            }
            else {
                str += ';TYPE="' + property.type.map(s => s.toLowerCase()).join(',') + '"';
            }
        }
        else {
            str += ';TYPE=' + property.type;
        }
    }
    if (property.mediatype) {
        str += ';MEDIATYPE=' + e(property.mediatype);
    }
    if (property.pref) {
        str += ';PREF=' + property.pref;
    }
    if (property.calscale) {
        str += ';CALSCALE=' + e(property.calscale);
    }
    if (property.sortas) {
        str += ';SORT-AS="' + property.sortas.map(s => e(s)).join(',') + '"';
    }
    if (property.geo) {
        str += ';GEO=' + e(property.geo);
    }
    if (property.timezone) {
        str += ';TZ=' + e(property.timezone);
    }
    return str;
}
function isPropertyWithParameters(object) {
    const test = object;
    if (test == null || test.param == null || test.value == null) {
        return false;
    }
    return (test.param.language !== undefined ||
        test.param.value !== undefined ||
        test.param.pref !== undefined ||
        test.param.altid !== undefined ||
        test.param.pid !== undefined ||
        test.param.type !== undefined ||
        test.param.mediatype !== undefined ||
        test.param.calscale !== undefined ||
        test.param.sortas !== undefined ||
        test.param.geo !== undefined ||
        test.param.timezone !== undefined);
}
function isPropertyWithParametersAddressValue(object) {
    const test = object;
    if (test == null || test.param == null || test.value == null) {
        return false;
    }
    return (test.param.language !== undefined ||
        test.param.value !== undefined ||
        test.param.pref !== undefined ||
        test.param.altid !== undefined ||
        test.param.pid !== undefined ||
        test.param.type !== undefined ||
        test.param.mediatype !== undefined ||
        test.param.calscale !== undefined ||
        test.param.sortas !== undefined ||
        test.param.geo !== undefined ||
        test.param.timezone !== undefined);
}

class VCardFormatter {
    static getVCardAsBlob(vCard, encoding = VCardEncoding.none) {
        const data = VCardFormatter.getVCardAsString(vCard, encoding);
        return new Blob([data], { type: 'text/vcard' });
    }
    /**
     * Get formatted vCard in VCF format
     */
    static getVCardAsString(vCard, encodingPrefix = VCardEncoding.none) {
        if (!vCard.version) {
            vCard.version = '4.0';
        }
        const majorVersion = getMajorVersion(vCard.version);
        let formattedVCardString = '';
        formattedVCardString += 'BEGIN:VCARD' + nl();
        formattedVCardString += 'VERSION:' + vCard.version + nl();
        // const encodingPrefix = '';
        let formattedName = '';
        if (vCard.name == null) {
            vCard.name = {};
        }
        let nameArray = [];
        if (vCard.formattedName != null) {
            nameArray = [vCard.formattedName.firstNames, vCard.formattedName.addtionalNames, vCard.formattedName.lastNames];
        }
        else {
            nameArray = [vCard.name.firstNames, vCard.name.addtionalNames, vCard.name.lastNames];
        }
        formattedName = nameArray.filter((string) => string != null).join(' ');
        formattedVCardString += 'FN' + encodingPrefix + ':' + e(formattedName) + nl();
        formattedVCardString +=
            'N' +
                encodingPrefix +
                ':' +
                [
                    e(vCard.name.lastNames),
                    e(vCard.name.firstNames),
                    e(vCard.name.addtionalNames),
                    e(vCard.name.namePrefix),
                    e(vCard.name.nameSuffix),
                ].join(';') +
                nl();
        if (vCard.nickname && majorVersion >= 3) {
            formattedVCardString += 'NICKNAME' + encodingPrefix + ':' + e(vCard.nickname) + nl();
        }
        if (vCard.gender) {
            if (vCard.gender.sex) {
                formattedVCardString += 'GENDER:' + e(vCard.gender.sex);
                if (vCard.gender.text) {
                    formattedVCardString += ';' + e(vCard.gender.text);
                }
                formattedVCardString += nl();
            }
            else {
                formattedVCardString += 'GENDER:;' + e(vCard.gender.text) + nl();
            }
        }
        if (vCard.uid) {
            formattedVCardString += 'UID' + encodingPrefix + ':' + e(vCard.uid) + nl();
        }
        if (vCard.birthday) {
            formattedVCardString += 'BDAY:' + YYYYMMDD(vCard.birthday) + nl();
        }
        if (vCard.anniversary) {
            formattedVCardString += 'ANNIVERSARY:' + YYYYMMDD(vCard.anniversary) + nl();
        }
        if (vCard.language) {
            vCard.language.forEach((language) => {
                if (isPropertyWithParameters(language)) {
                    formattedVCardString += 'LANG' + propertyToVCardString(language.param) + ':' + e(language.value) + nl();
                }
                else {
                    formattedVCardString += 'LANG:' + e(language) + nl();
                }
            });
        }
        if (vCard.organization) {
            if (isPropertyWithParameters(vCard.organization)) {
                formattedVCardString +=
                    'ORG' + propertyToVCardString(vCard.organization.param) + ':' + e(vCard.organization.value) + nl();
            }
            else {
                formattedVCardString += 'ORG' + encodingPrefix + ':' + e(vCard.organization) + nl();
            }
        }
        if (vCard.address) {
            vCard.address.forEach((address) => {
                if (isPropertyWithParametersAddressValue(address)) {
                    formattedVCardString +=
                        'ADR' +
                            propertyToVCardString(address.param) +
                            getFormattedAddress(address.value) +
                            nl();
                }
                else {
                    formattedVCardString += 'ADR' + getFormattedAddress(address) + nl();
                }
            });
        }
        if (vCard.telephone) {
            vCard.telephone.forEach((element) => {
                if (!isPropertyWithParameters(element)) {
                    element = {
                        value: element,
                        param: {
                            type: 'voice',
                        },
                    };
                }
                formattedVCardString +=
                    'TEL' + propertyToVCardString(element.param) + ':' + e(element.value) + nl();
            });
        }
        if (vCard.email) {
            vCard.email.forEach((email) => {
                if (isPropertyWithParameters(email)) {
                    formattedVCardString += 'EMAIL' + propertyToVCardString(email.param) + ':' + e(email.value) + nl();
                }
                else {
                    formattedVCardString += 'EMAIL:' + e(email) + nl();
                }
            });
        }
        if (vCard.title) {
            formattedVCardString += 'TITLE' + encodingPrefix + ':' + e(vCard.title) + nl();
        }
        if (vCard.logo) {
            if (isPropertyWithParameters(vCard.logo)) {
                formattedVCardString += 'LOGO' + propertyToVCardString(vCard.logo.param) + ':' + e(vCard.logo.value) + nl();
            }
            else {
                formattedVCardString += 'LOGO:' + e(vCard.logo) + nl();
            }
        }
        if (vCard.photo) {
            if (isPropertyWithParameters(vCard.photo)) {
                formattedVCardString += 'PHOTO' + propertyToVCardString(vCard.photo.param) + ';' + e(vCard.photo.value) + nl();
            }
            else {
                formattedVCardString += 'PHOTO;' + e(vCard.photo) + nl();
            }
        }
        if (vCard.homeFax) {
            vCard.homeFax.forEach(function (number) {
                if (+majorVersion >= 4) {
                    formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,home":tel:' + e(number) + nl();
                }
                else {
                    formattedVCardString += 'TEL;TYPE=HOME,FAX:' + e(number) + nl();
                }
            });
        }
        if (vCard.workFax) {
            vCard.workFax.forEach(function (number) {
                if (+majorVersion >= 4) {
                    formattedVCardString += 'TEL;VALUE=uri;TYPE="fax,work":tel:' + e(number) + nl();
                }
                else {
                    formattedVCardString += 'TEL;TYPE=WORK,FAX:' + e(number) + nl();
                }
            });
        }
        if (vCard.role) {
            formattedVCardString += 'ROLE' + encodingPrefix + ':' + e(vCard.role) + nl();
        }
        if (vCard.url) {
            let urlNotSet = true;
            if (hasProp(vCard.url, 'home')) {
                formattedVCardString += 'URL;type=HOME' + encodingPrefix + ':' + e(vCard.url.home) + nl();
                urlNotSet = false;
            }
            if (hasProp(vCard.url, 'work')) {
                formattedVCardString += 'URL;type=WORK' + encodingPrefix + ':' + e(vCard.url.work) + nl();
                urlNotSet = false;
            }
            if (urlNotSet) {
                formattedVCardString += 'URL' + encodingPrefix + ':' + e(vCard.url) + nl();
            }
        }
        if (vCard.note) {
            formattedVCardString += 'NOTE' + encodingPrefix + ':' + e(vCard.note) + nl();
        }
        if (vCard.socialUrls) {
            for (const key in vCard.socialUrls) {
                if (vCard.socialUrls.hasOwnProperty(key) && vCard.socialUrls[key]) {
                    formattedVCardString +=
                        'X-SOCIALPROFILE' + encodingPrefix + ';TYPE=' + key + ':' + e(vCard.socialUrls[key]) + nl();
                }
            }
        }
        if (vCard.source) {
            if (isPropertyWithParameters(vCard.source)) {
                formattedVCardString +=
                    'SOURCE' + encodingPrefix + propertyToVCardString(vCard.source.param) + ':' + e(vCard.source.value) + +nl();
            }
            else {
                formattedVCardString += 'SOURCE' + encodingPrefix + ':' + e(vCard.source) + nl();
            }
        }
        if (vCard.rev) {
            formattedVCardString += 'REV:' + vCard.rev + nl();
        }
        formattedVCardString += 'END:VCARD' + nl();
        return formattedVCardString;
    }
}
/**
 * Get formatted photo
 * @param photoType       Photo type (PHOTO, LOGO)
 * @param url             URL to attach photo from
 * @param mediaType       Media-type of photo (JPEG, PNG, GIF)
 */
function getFormattedPhoto(photoType, url, mediaType, base64, majorVersion) {
    let params;
    if (+majorVersion >= 4) {
        params = base64 ? ';ENCODING=b;MEDIATYPE=image/' : ';MEDIATYPE=image/';
    }
    else if (+majorVersion === 3) {
        params = base64 ? ';ENCODING=b;TYPE=' : ';TYPE=';
    }
    else {
        params = base64 ? ';ENCODING=BASE64;' : ';';
    }
    const formattedPhoto = photoType + params + mediaType + ':' + e(url) + nl();
    return formattedPhoto;
}
/**
 * Get formatted address
 */
function getFormattedAddress(address) {
    return ((address.label ? ';LABEL="' + e(address.label) + '"' : '') +
        ':' +
        e(address.postOfficeBox) +
        ';' +
        e(address.extendedAddress) +
        ';' +
        e(address.street) +
        ';' +
        e(address.locality) +
        ';' +
        e(address.region) +
        ';' +
        e(address.postalCode) +
        ';' +
        e(address.countryName));
}
/**
 * Convert date to YYYYMMDD format
 */
function YYYYMMDD(date) {
    if (!date) {
        return '';
    }
    return date.toLocaleDateString('se').replace(/\D/g, ''); // use Swedish date format
}
/**
 * Get major version from version string
 */
function getMajorVersion(version) {
    const majorVersionString = version ? version.slice(0, 1) : '4';
    if (!isNaN(+majorVersionString)) {
        return Number.parseInt(majorVersionString);
    }
    return 4;
}
/**
 * Determines if the object has the Property
 * @param obj Object to test
 * @param property Property to check
 */
function hasProp(obj, property) {
    return Object.prototype.hasOwnProperty.call(obj, property);
}

const ERROR_MESSAGE = "ngx-vcard: No input specified. You must specify either 'vcdDownloadVCard' or 'generateVCardFunction'";
class DownloadVCardDirective {
    constructor(element) {
        this.element = element;
        this.encoding = VCardEncoding.none;
    }
    onclick() {
        if (this.vCard == '') {
            if (this.generateVCardFunction != undefined &&
                this.generateVCardFunction != '') {
                this.vCard = this.generateVCardFunction();
            }
            else {
                throw new Error(ERROR_MESSAGE);
            }
        }
        const blob = VCardFormatter.getVCardAsBlob(this.vCard, this.encoding);
        let filename = 'vCard';
        if (this.vCard.name != null) {
            filename =
                this.vCard.name.firstNames + ' ' + this.vCard.name.lastNames + '.vcf';
        }
        this.download(blob, filename);
    }
    download(data, filename) {
        // IE 11
        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(data, filename);
        }
        else {
            const a = document.createElement('a');
            const url = URL.createObjectURL(data);
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }
    }
    ngOnInit() {
        if (this.vCard == '' &&
            (this.generateVCardFunction == '' ||
                this.generateVCardFunction == undefined)) {
            throw new Error(ERROR_MESSAGE);
        }
    }
}
DownloadVCardDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0, type: DownloadVCardDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
DownloadVCardDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.2.15", type: DownloadVCardDirective, selector: "[vcdDownloadVCard]", inputs: { vCard: ["vcdDownloadVCard", "vCard"], generateVCardFunction: "generateVCardFunction", encoding: "encoding" }, host: { listeners: { "click": "onclick()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0, type: DownloadVCardDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[vcdDownloadVCard]',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { vCard: [{
                type: Input,
                args: ['vcdDownloadVCard']
            }], generateVCardFunction: [{
                type: Input,
                args: ['generateVCardFunction']
            }], encoding: [{
                type: Input
            }], onclick: [{
                type: HostListener,
                args: ['click']
            }] } });

class NgxVcardModule {
}
NgxVcardModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0, type: NgxVcardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgxVcardModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0, type: NgxVcardModule, declarations: [DownloadVCardDirective], exports: [DownloadVCardDirective] });
NgxVcardModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0, type: NgxVcardModule, imports: [[]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0, type: NgxVcardModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [],
                    declarations: [DownloadVCardDirective],
                    exports: [DownloadVCardDirective]
                }]
        }] });

/*
 * Public API Surface of ngx-vcard
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DownloadVCardDirective, NgxVcardModule, VCardEncoding, VCardFormatter, getMajorVersion, isPropertyWithParameters, isPropertyWithParametersAddressValue, propertyToVCardString };
//# sourceMappingURL=ngx-vcard.js.map
