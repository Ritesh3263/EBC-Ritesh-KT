(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-vcard', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ngx-vcard"] = {}, global.ng.core));
})(this, (function (exports, i0) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);

    exports.VCardEncoding = void 0;
    (function (VCardEncoding) {
        VCardEncoding["none"] = "";
        VCardEncoding["utf8"] = ";CHARSET=utf-8";
    })(exports.VCardEncoding || (exports.VCardEncoding = {}));

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
        var str = '';
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
            str += ';PID=' + property.pid.map(function (s) { return e(s); }).join(',');
        }
        if (property.type) {
            if (Array.isArray(property.type)) {
                if (property.type.length === 1) {
                    str += ';TYPE=' + property.type[0];
                }
                else {
                    str += ';TYPE="' + property.type.map(function (s) { return s.toLowerCase(); }).join(',') + '"';
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
            str += ';SORT-AS="' + property.sortas.map(function (s) { return e(s); }).join(',') + '"';
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
        var test = object;
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
        var test = object;
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

    var VCardFormatter = /** @class */ (function () {
        function VCardFormatter() {
        }
        VCardFormatter.getVCardAsBlob = function (vCard, encoding) {
            if (encoding === void 0) { encoding = exports.VCardEncoding.none; }
            var data = VCardFormatter.getVCardAsString(vCard, encoding);
            return new Blob([data], { type: 'text/vcard' });
        };
        /**
         * Get formatted vCard in VCF format
         */
        VCardFormatter.getVCardAsString = function (vCard, encodingPrefix) {
            if (encodingPrefix === void 0) { encodingPrefix = exports.VCardEncoding.none; }
            if (!vCard.version) {
                vCard.version = '4.0';
            }
            var majorVersion = getMajorVersion(vCard.version);
            var formattedVCardString = '';
            formattedVCardString += 'BEGIN:VCARD' + nl();
            formattedVCardString += 'VERSION:' + vCard.version + nl();
            // const encodingPrefix = '';
            var formattedName = '';
            if (vCard.name == null) {
                vCard.name = {};
            }
            var nameArray = [];
            if (vCard.formattedName != null) {
                nameArray = [vCard.formattedName.firstNames, vCard.formattedName.addtionalNames, vCard.formattedName.lastNames];
            }
            else {
                nameArray = [vCard.name.firstNames, vCard.name.addtionalNames, vCard.name.lastNames];
            }
            formattedName = nameArray.filter(function (string) { return string != null; }).join(' ');
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
                vCard.language.forEach(function (language) {
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
                vCard.address.forEach(function (address) {
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
                vCard.telephone.forEach(function (element) {
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
                vCard.email.forEach(function (email) {
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
                var urlNotSet = true;
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
                for (var key in vCard.socialUrls) {
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
        };
        return VCardFormatter;
    }());
    /**
     * Get formatted photo
     * @param photoType       Photo type (PHOTO, LOGO)
     * @param url             URL to attach photo from
     * @param mediaType       Media-type of photo (JPEG, PNG, GIF)
     */
    function getFormattedPhoto(photoType, url, mediaType, base64, majorVersion) {
        var params;
        if (+majorVersion >= 4) {
            params = base64 ? ';ENCODING=b;MEDIATYPE=image/' : ';MEDIATYPE=image/';
        }
        else if (+majorVersion === 3) {
            params = base64 ? ';ENCODING=b;TYPE=' : ';TYPE=';
        }
        else {
            params = base64 ? ';ENCODING=BASE64;' : ';';
        }
        var formattedPhoto = photoType + params + mediaType + ':' + e(url) + nl();
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
        var majorVersionString = version ? version.slice(0, 1) : '4';
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

    var ERROR_MESSAGE = "ngx-vcard: No input specified. You must specify either 'vcdDownloadVCard' or 'generateVCardFunction'";
    var DownloadVCardDirective = /** @class */ (function () {
        function DownloadVCardDirective(element) {
            this.element = element;
            this.encoding = exports.VCardEncoding.none;
        }
        DownloadVCardDirective.prototype.onclick = function () {
            if (this.vCard == '') {
                if (this.generateVCardFunction != undefined &&
                    this.generateVCardFunction != '') {
                    this.vCard = this.generateVCardFunction();
                }
                else {
                    throw new Error(ERROR_MESSAGE);
                }
            }
            var blob = VCardFormatter.getVCardAsBlob(this.vCard, this.encoding);
            var filename = 'vCard';
            if (this.vCard.name != null) {
                filename =
                    this.vCard.name.firstNames + ' ' + this.vCard.name.lastNames + '.vcf';
            }
            this.download(blob, filename);
        };
        DownloadVCardDirective.prototype.download = function (data, filename) {
            // IE 11
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(data, filename);
            }
            else {
                var a = document.createElement('a');
                var url = URL.createObjectURL(data);
                a.style.display = 'none';
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
        };
        DownloadVCardDirective.prototype.ngOnInit = function () {
            if (this.vCard == '' &&
                (this.generateVCardFunction == '' ||
                    this.generateVCardFunction == undefined)) {
                throw new Error(ERROR_MESSAGE);
            }
        };
        return DownloadVCardDirective;
    }());
    DownloadVCardDirective.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0__namespace, type: DownloadVCardDirective, deps: [{ token: i0__namespace.ElementRef }], target: i0__namespace.ɵɵFactoryTarget.Directive });
    DownloadVCardDirective.ɵdir = i0__namespace.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "12.2.15", type: DownloadVCardDirective, selector: "[vcdDownloadVCard]", inputs: { vCard: ["vcdDownloadVCard", "vCard"], generateVCardFunction: "generateVCardFunction", encoding: "encoding" }, host: { listeners: { "click": "onclick()" } }, ngImport: i0__namespace });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0__namespace, type: DownloadVCardDirective, decorators: [{
                type: i0.Directive,
                args: [{
                        selector: '[vcdDownloadVCard]',
                    }]
            }], ctorParameters: function () { return [{ type: i0__namespace.ElementRef }]; }, propDecorators: { vCard: [{
                    type: i0.Input,
                    args: ['vcdDownloadVCard']
                }], generateVCardFunction: [{
                    type: i0.Input,
                    args: ['generateVCardFunction']
                }], encoding: [{
                    type: i0.Input
                }], onclick: [{
                    type: i0.HostListener,
                    args: ['click']
                }] } });

    var NgxVcardModule = /** @class */ (function () {
        function NgxVcardModule() {
        }
        return NgxVcardModule;
    }());
    NgxVcardModule.ɵfac = i0__namespace.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0__namespace, type: NgxVcardModule, deps: [], target: i0__namespace.ɵɵFactoryTarget.NgModule });
    NgxVcardModule.ɵmod = i0__namespace.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0__namespace, type: NgxVcardModule, declarations: [DownloadVCardDirective], exports: [DownloadVCardDirective] });
    NgxVcardModule.ɵinj = i0__namespace.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0__namespace, type: NgxVcardModule, imports: [[]] });
    i0__namespace.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "12.2.15", ngImport: i0__namespace, type: NgxVcardModule, decorators: [{
                type: i0.NgModule,
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

    exports.DownloadVCardDirective = DownloadVCardDirective;
    exports.NgxVcardModule = NgxVcardModule;
    exports.VCardFormatter = VCardFormatter;
    exports.getMajorVersion = getMajorVersion;
    exports.isPropertyWithParameters = isPropertyWithParameters;
    exports.isPropertyWithParametersAddressValue = isPropertyWithParametersAddressValue;
    exports.propertyToVCardString = propertyToVCardString;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-vcard.umd.js.map
