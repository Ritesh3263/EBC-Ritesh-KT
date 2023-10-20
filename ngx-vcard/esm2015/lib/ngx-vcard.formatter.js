import { VCardEncoding } from './types/vCardEncoding';
import { isPropertyWithParameters, propertyToVCardString, isPropertyWithParametersAddressValue, } from './types/parameter/BasicPropertyParameters.type';
import { nl, e } from './helpers';
export class VCardFormatter {
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
export function getMajorVersion(version) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXZjYXJkLmZvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC12Y2FyZC9zcmMvbGliL25neC12Y2FyZC5mb3JtYXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFDTCx3QkFBd0IsRUFDeEIscUJBQXFCLEVBRXJCLG9DQUFvQyxHQUNyQyxNQUFNLGdEQUFnRCxDQUFDO0FBQ3hELE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sT0FBTyxjQUFjO0lBQ2xCLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBWSxFQUFFLFdBQTBCLGFBQWEsQ0FBQyxJQUFJO1FBQ3JGLE1BQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQVksRUFBRSxpQkFBZ0MsYUFBYSxDQUFDLElBQUk7UUFDN0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDbEIsS0FBSyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7U0FDdkI7UUFDRCxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXBELElBQUksb0JBQW9CLEdBQUcsRUFBRSxDQUFDO1FBQzlCLG9CQUFvQixJQUFJLGFBQWEsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQUM3QyxvQkFBb0IsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLEVBQUUs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LENBQUMsT0FBZTtJQUM3QyxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztJQUMvRCxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsa0JBQWtCLENBQUMsRUFBRTtRQUMvQixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztLQUM1QztJQUNELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxHQUFRLEVBQUUsUUFBZ0I7SUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzdELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWQ2FyZCwgQWRkcmVzcyB9IGZyb20gJy4vdHlwZXMvdkNhcmQnO1xuaW1wb3J0IHsgVkNhcmRFbmNvZGluZyB9IGZyb20gJy4vdHlwZXMvdkNhcmRFbmNvZGluZyc7XG5pbXBvcnQge1xuICBpc1Byb3BlcnR5V2l0aFBhcmFtZXRlcnMsXG4gIHByb3BlcnR5VG9WQ2FyZFN0cmluZyxcbiAgQmFzaWNQcm9wZXJ0eVBhcmFtZXRlcnMsXG4gIGlzUHJvcGVydHlXaXRoUGFyYW1ldGVyc0FkZHJlc3NWYWx1ZSxcbn0gZnJvbSAnLi90eXBlcy9wYXJhbWV0ZXIvQmFzaWNQcm9wZXJ0eVBhcmFtZXRlcnMudHlwZSc7XG5pbXBvcnQgeyBubCwgZSB9IGZyb20gJy4vaGVscGVycyc7XG5cbmV4cG9ydCBjbGFzcyBWQ2FyZEZvcm1hdHRlciB7XG4gIHB1YmxpYyBzdGF0aWMgZ2V0VkNhcmRBc0Jsb2IodkNhcmQ6IFZDYXJkLCBlbmNvZGluZzogVkNhcmRFbmNvZGluZyA9IFZDYXJkRW5jb2Rpbmcubm9uZSk6IEJsb2Ige1xuICAgIGNvbnN0IGRhdGEgPSBWQ2FyZEZvcm1hdHRlci5nZXRWQ2FyZEFzU3RyaW5nKHZDYXJkLCBlbmNvZGluZyk7XG4gICAgcmV0dXJuIG5ldyBCbG9iKFtkYXRhXSwgeyB0eXBlOiAndGV4dC92Y2FyZCcgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0IGZvcm1hdHRlZCB2Q2FyZCBpbiBWQ0YgZm9ybWF0XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldFZDYXJkQXNTdHJpbmcodkNhcmQ6IFZDYXJkLCBlbmNvZGluZ1ByZWZpeDogVkNhcmRFbmNvZGluZyA9IFZDYXJkRW5jb2Rpbmcubm9uZSk6IHN0cmluZyB7XG4gICAgaWYgKCF2Q2FyZC52ZXJzaW9uKSB7XG4gICAgICB2Q2FyZC52ZXJzaW9uID0gJzQuMCc7XG4gICAgfVxuICAgIGNvbnN0IG1ham9yVmVyc2lvbiA9IGdldE1ham9yVmVyc2lvbih2Q2FyZC52ZXJzaW9uKTtcblxuICAgIGxldCBmb3JtYXR0ZWRWQ2FyZFN0cmluZyA9ICcnO1xuICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdCRUdJTjpWQ0FSRCcgKyBubCgpO1xuICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdWRVJTSU9OOicgKyB2Q2FyZC52ZXJzaW9uICsgbmwoKTtcblxuICAgIC8vIGNvbnN0IGVuY29kaW5nUHJlZml4ID0gJyc7XG4gICAgbGV0IGZvcm1hdHRlZE5hbWUgPSAnJztcbiAgICBpZiAodkNhcmQubmFtZSA9PSBudWxsKSB7XG4gICAgICB2Q2FyZC5uYW1lID0ge307XG4gICAgfVxuXG4gICAgbGV0IG5hbWVBcnJheSA9IFtdO1xuICAgIGlmICh2Q2FyZC5mb3JtYXR0ZWROYW1lICE9IG51bGwpIHtcbiAgICAgIG5hbWVBcnJheSA9IFt2Q2FyZC5mb3JtYXR0ZWROYW1lLmZpcnN0TmFtZXMsIHZDYXJkLmZvcm1hdHRlZE5hbWUuYWRkdGlvbmFsTmFtZXMsIHZDYXJkLmZvcm1hdHRlZE5hbWUubGFzdE5hbWVzXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZUFycmF5ID0gW3ZDYXJkLm5hbWUuZmlyc3ROYW1lcywgdkNhcmQubmFtZS5hZGR0aW9uYWxOYW1lcywgdkNhcmQubmFtZS5sYXN0TmFtZXNdO1xuICAgIH1cblxuICAgIGZvcm1hdHRlZE5hbWUgPSBuYW1lQXJyYXkuZmlsdGVyKChzdHJpbmcpID0+IHN0cmluZyAhPSBudWxsKS5qb2luKCcgJyk7XG5cbiAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnRk4nICsgZW5jb2RpbmdQcmVmaXggKyAnOicgKyBlKGZvcm1hdHRlZE5hbWUpICsgbmwoKTtcblxuICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9XG4gICAgICAnTicgK1xuICAgICAgZW5jb2RpbmdQcmVmaXggK1xuICAgICAgJzonICtcbiAgICAgIFtcbiAgICAgICAgZSh2Q2FyZC5uYW1lLmxhc3ROYW1lcyksXG4gICAgICAgIGUodkNhcmQubmFtZS5maXJzdE5hbWVzKSxcbiAgICAgICAgZSh2Q2FyZC5uYW1lLmFkZHRpb25hbE5hbWVzKSxcbiAgICAgICAgZSh2Q2FyZC5uYW1lLm5hbWVQcmVmaXgpLFxuICAgICAgICBlKHZDYXJkLm5hbWUubmFtZVN1ZmZpeCksXG4gICAgICBdLmpvaW4oJzsnKSArXG4gICAgICBubCgpO1xuXG4gICAgaWYgKHZDYXJkLm5pY2tuYW1lICYmIG1ham9yVmVyc2lvbiA+PSAzKSB7XG4gICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnTklDS05BTUUnICsgZW5jb2RpbmdQcmVmaXggKyAnOicgKyBlKHZDYXJkLm5pY2tuYW1lKSArIG5sKCk7XG4gICAgfVxuXG4gICAgaWYgKHZDYXJkLmdlbmRlcikge1xuICAgICAgaWYgKHZDYXJkLmdlbmRlci5zZXgpIHtcbiAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ0dFTkRFUjonICsgZSh2Q2FyZC5nZW5kZXIuc2V4KTtcbiAgICAgICAgaWYgKHZDYXJkLmdlbmRlci50ZXh0KSB7XG4gICAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJzsnICsgZSh2Q2FyZC5nZW5kZXIudGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gbmwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdHRU5ERVI6OycgKyBlKHZDYXJkLmdlbmRlci50ZXh0KSArIG5sKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZDYXJkLnVpZCkge1xuICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ1VJRCcgKyBlbmNvZGluZ1ByZWZpeCArICc6JyArIGUodkNhcmQudWlkKSArIG5sKCk7XG4gICAgfVxuXG4gICAgaWYgKHZDYXJkLmJpcnRoZGF5KSB7XG4gICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnQkRBWTonICsgWVlZWU1NREQodkNhcmQuYmlydGhkYXkpICsgbmwoKTtcbiAgICB9XG5cbiAgICBpZiAodkNhcmQuYW5uaXZlcnNhcnkpIHtcbiAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdBTk5JVkVSU0FSWTonICsgWVlZWU1NREQodkNhcmQuYW5uaXZlcnNhcnkpICsgbmwoKTtcbiAgICB9XG5cbiAgICBpZiAodkNhcmQubGFuZ3VhZ2UpIHtcbiAgICAgIHZDYXJkLmxhbmd1YWdlLmZvckVhY2goKGxhbmd1YWdlKSA9PiB7XG4gICAgICAgIGlmIChpc1Byb3BlcnR5V2l0aFBhcmFtZXRlcnMobGFuZ3VhZ2UpKSB7XG4gICAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ0xBTkcnICsgcHJvcGVydHlUb1ZDYXJkU3RyaW5nKGxhbmd1YWdlLnBhcmFtKSArICc6JyArIGUobGFuZ3VhZ2UudmFsdWUpICsgbmwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnTEFORzonICsgZShsYW5ndWFnZSkgKyBubCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodkNhcmQub3JnYW5pemF0aW9uKSB7XG4gICAgICBpZiAoaXNQcm9wZXJ0eVdpdGhQYXJhbWV0ZXJzKHZDYXJkLm9yZ2FuaXphdGlvbikpIHtcbiAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz1cbiAgICAgICAgICAnT1JHJyArIHByb3BlcnR5VG9WQ2FyZFN0cmluZyh2Q2FyZC5vcmdhbml6YXRpb24ucGFyYW0pICsgJzonICsgZSh2Q2FyZC5vcmdhbml6YXRpb24udmFsdWUpICsgbmwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdPUkcnICsgZW5jb2RpbmdQcmVmaXggKyAnOicgKyBlKHZDYXJkLm9yZ2FuaXphdGlvbikgKyBubCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2Q2FyZC5hZGRyZXNzKSB7XG4gICAgICB2Q2FyZC5hZGRyZXNzLmZvckVhY2goKGFkZHJlc3MpID0+IHtcbiAgICAgICAgaWYgKGlzUHJvcGVydHlXaXRoUGFyYW1ldGVyc0FkZHJlc3NWYWx1ZShhZGRyZXNzKSkge1xuICAgICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9XG4gICAgICAgICAgICAnQURSJyArXG4gICAgICAgICAgICBwcm9wZXJ0eVRvVkNhcmRTdHJpbmcoYWRkcmVzcy5wYXJhbSBhcyBCYXNpY1Byb3BlcnR5UGFyYW1ldGVycykgK1xuICAgICAgICAgICAgZ2V0Rm9ybWF0dGVkQWRkcmVzcyhhZGRyZXNzLnZhbHVlKSArXG4gICAgICAgICAgICBubCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdBRFInICsgZ2V0Rm9ybWF0dGVkQWRkcmVzcyhhZGRyZXNzKSArIG5sKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh2Q2FyZC50ZWxlcGhvbmUpIHtcbiAgICAgIHZDYXJkLnRlbGVwaG9uZS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmICghaXNQcm9wZXJ0eVdpdGhQYXJhbWV0ZXJzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgZWxlbWVudCA9IHtcbiAgICAgICAgICAgIHZhbHVlOiBlbGVtZW50LFxuICAgICAgICAgICAgcGFyYW06IHtcbiAgICAgICAgICAgICAgdHlwZTogJ3ZvaWNlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPVxuICAgICAgICAgICdURUwnICsgcHJvcGVydHlUb1ZDYXJkU3RyaW5nKGVsZW1lbnQucGFyYW0gYXMgQmFzaWNQcm9wZXJ0eVBhcmFtZXRlcnMpICsgJzonICsgZShlbGVtZW50LnZhbHVlKSArIG5sKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodkNhcmQuZW1haWwpIHtcbiAgICAgIHZDYXJkLmVtYWlsLmZvckVhY2goKGVtYWlsKSA9PiB7XG4gICAgICAgIGlmIChpc1Byb3BlcnR5V2l0aFBhcmFtZXRlcnMoZW1haWwpKSB7XG4gICAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ0VNQUlMJyArIHByb3BlcnR5VG9WQ2FyZFN0cmluZyhlbWFpbC5wYXJhbSkgKyAnOicgKyBlKGVtYWlsLnZhbHVlKSArIG5sKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ0VNQUlMOicgKyBlKGVtYWlsKSArIG5sKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh2Q2FyZC50aXRsZSkge1xuICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ1RJVExFJyArIGVuY29kaW5nUHJlZml4ICsgJzonICsgZSh2Q2FyZC50aXRsZSkgKyBubCgpO1xuICAgIH1cblxuICAgIGlmICh2Q2FyZC5sb2dvKSB7XG4gICAgICBpZiAoaXNQcm9wZXJ0eVdpdGhQYXJhbWV0ZXJzKHZDYXJkLmxvZ28pKSB7XG4gICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdMT0dPJyArIHByb3BlcnR5VG9WQ2FyZFN0cmluZyh2Q2FyZC5sb2dvLnBhcmFtKSArICc6JyArIGUodkNhcmQubG9nby52YWx1ZSkgKyBubCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ0xPR086JyArIGUodkNhcmQubG9nbykgKyBubCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh2Q2FyZC5waG90bykge1xuICAgICAgaWYgKGlzUHJvcGVydHlXaXRoUGFyYW1ldGVycyh2Q2FyZC5waG90bykpIHtcbiAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ1BIT1RPJyArIHByb3BlcnR5VG9WQ2FyZFN0cmluZyh2Q2FyZC5waG90by5wYXJhbSkgKyAnOycgKyBlKHZDYXJkLnBob3RvLnZhbHVlKSArIG5sKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnUEhPVE87JyArIGUodkNhcmQucGhvdG8pICsgbmwoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodkNhcmQuaG9tZUZheCkge1xuICAgICAgdkNhcmQuaG9tZUZheC5mb3JFYWNoKGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgaWYgKCttYWpvclZlcnNpb24gPj0gNCkge1xuICAgICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdURUw7VkFMVUU9dXJpO1RZUEU9XCJmYXgsaG9tZVwiOnRlbDonICsgZShudW1iZXIpICsgbmwoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnVEVMO1RZUEU9SE9NRSxGQVg6JyArIGUobnVtYmVyKSArIG5sKCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh2Q2FyZC53b3JrRmF4KSB7XG4gICAgICB2Q2FyZC53b3JrRmF4LmZvckVhY2goZnVuY3Rpb24gKG51bWJlcikge1xuICAgICAgICBpZiAoK21ham9yVmVyc2lvbiA+PSA0KSB7XG4gICAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ1RFTDtWQUxVRT11cmk7VFlQRT1cImZheCx3b3JrXCI6dGVsOicgKyBlKG51bWJlcikgKyBubCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdURUw7VFlQRT1XT1JLLEZBWDonICsgZShudW1iZXIpICsgbmwoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHZDYXJkLnJvbGUpIHtcbiAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdST0xFJyArIGVuY29kaW5nUHJlZml4ICsgJzonICsgZSh2Q2FyZC5yb2xlKSArIG5sKCk7XG4gICAgfVxuXG4gICAgaWYgKHZDYXJkLnVybCkge1xuICAgICAgbGV0IHVybE5vdFNldCA9IHRydWU7XG4gICAgICBpZiAoaGFzUHJvcCh2Q2FyZC51cmwsICdob21lJykpIHtcbiAgICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ1VSTDt0eXBlPUhPTUUnICsgZW5jb2RpbmdQcmVmaXggKyAnOicgKyBlKCh2Q2FyZC51cmwgYXMgeyBob21lOiBzdHJpbmcgfSkuaG9tZSkgKyBubCgpO1xuICAgICAgICB1cmxOb3RTZXQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc1Byb3AodkNhcmQudXJsLCAnd29yaycpKSB7XG4gICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdVUkw7dHlwZT1XT1JLJyArIGVuY29kaW5nUHJlZml4ICsgJzonICsgZSgodkNhcmQudXJsIGFzIHsgd29yazogc3RyaW5nIH0pLndvcmspICsgbmwoKTtcbiAgICAgICAgdXJsTm90U2V0ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAodXJsTm90U2V0KSB7XG4gICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9ICdVUkwnICsgZW5jb2RpbmdQcmVmaXggKyAnOicgKyBlKHZDYXJkLnVybCBhcyBzdHJpbmcpICsgbmwoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodkNhcmQubm90ZSkge1xuICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ05PVEUnICsgZW5jb2RpbmdQcmVmaXggKyAnOicgKyBlKHZDYXJkLm5vdGUpICsgbmwoKTtcbiAgICB9XG5cbiAgICBpZiAodkNhcmQuc29jaWFsVXJscykge1xuICAgICAgZm9yIChjb25zdCBrZXkgaW4gdkNhcmQuc29jaWFsVXJscykge1xuICAgICAgICBpZiAodkNhcmQuc29jaWFsVXJscy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHZDYXJkLnNvY2lhbFVybHNba2V5XSkge1xuICAgICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9XG4gICAgICAgICAgICAnWC1TT0NJQUxQUk9GSUxFJyArIGVuY29kaW5nUHJlZml4ICsgJztUWVBFPScgKyBrZXkgKyAnOicgKyBlKHZDYXJkLnNvY2lhbFVybHNba2V5XSkgKyBubCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHZDYXJkLnNvdXJjZSkge1xuICAgICAgaWYgKGlzUHJvcGVydHlXaXRoUGFyYW1ldGVycyh2Q2FyZC5zb3VyY2UpKSB7XG4gICAgICAgIGZvcm1hdHRlZFZDYXJkU3RyaW5nICs9XG4gICAgICAgICAgJ1NPVVJDRScgKyBlbmNvZGluZ1ByZWZpeCArIHByb3BlcnR5VG9WQ2FyZFN0cmluZyh2Q2FyZC5zb3VyY2UucGFyYW0pICsgJzonICsgZSh2Q2FyZC5zb3VyY2UudmFsdWUpICsgK25sKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3JtYXR0ZWRWQ2FyZFN0cmluZyArPSAnU09VUkNFJyArIGVuY29kaW5nUHJlZml4ICsgJzonICsgZSh2Q2FyZC5zb3VyY2UpICsgbmwoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHZDYXJkLnJldikge1xuICAgICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ1JFVjonICsgdkNhcmQucmV2ICsgbmwoKTtcbiAgICB9XG4gICAgZm9ybWF0dGVkVkNhcmRTdHJpbmcgKz0gJ0VORDpWQ0FSRCcgKyBubCgpO1xuICAgIHJldHVybiBmb3JtYXR0ZWRWQ2FyZFN0cmluZztcbiAgfVxufVxuXG4vKipcbiAqIEdldCBmb3JtYXR0ZWQgcGhvdG9cbiAqIEBwYXJhbSBwaG90b1R5cGUgICAgICAgUGhvdG8gdHlwZSAoUEhPVE8sIExPR08pXG4gKiBAcGFyYW0gdXJsICAgICAgICAgICAgIFVSTCB0byBhdHRhY2ggcGhvdG8gZnJvbVxuICogQHBhcmFtIG1lZGlhVHlwZSAgICAgICBNZWRpYS10eXBlIG9mIHBob3RvIChKUEVHLCBQTkcsIEdJRilcbiAqL1xuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkUGhvdG8oXG4gIHBob3RvVHlwZTogJ1BIT1RPJyB8ICdMT0dPJyxcbiAgdXJsOiBzdHJpbmcsXG4gIG1lZGlhVHlwZTogc3RyaW5nLFxuICBiYXNlNjQ6IGJvb2xlYW4sXG4gIG1ham9yVmVyc2lvbjogbnVtYmVyXG4pIHtcbiAgbGV0IHBhcmFtcztcblxuICBpZiAoK21ham9yVmVyc2lvbiA+PSA0KSB7XG4gICAgcGFyYW1zID0gYmFzZTY0ID8gJztFTkNPRElORz1iO01FRElBVFlQRT1pbWFnZS8nIDogJztNRURJQVRZUEU9aW1hZ2UvJztcbiAgfSBlbHNlIGlmICgrbWFqb3JWZXJzaW9uID09PSAzKSB7XG4gICAgcGFyYW1zID0gYmFzZTY0ID8gJztFTkNPRElORz1iO1RZUEU9JyA6ICc7VFlQRT0nO1xuICB9IGVsc2Uge1xuICAgIHBhcmFtcyA9IGJhc2U2NCA/ICc7RU5DT0RJTkc9QkFTRTY0OycgOiAnOyc7XG4gIH1cblxuICBjb25zdCBmb3JtYXR0ZWRQaG90byA9IHBob3RvVHlwZSArIHBhcmFtcyArIG1lZGlhVHlwZSArICc6JyArIGUodXJsKSArIG5sKCk7XG4gIHJldHVybiBmb3JtYXR0ZWRQaG90bztcbn1cblxuLyoqXG4gKiBHZXQgZm9ybWF0dGVkIGFkZHJlc3NcbiAqL1xuZnVuY3Rpb24gZ2V0Rm9ybWF0dGVkQWRkcmVzcyhhZGRyZXNzOiBBZGRyZXNzKSB7XG4gIHJldHVybiAoXG4gICAgKGFkZHJlc3MubGFiZWwgPyAnO0xBQkVMPVwiJyArIGUoYWRkcmVzcy5sYWJlbCkgKyAnXCInIDogJycpICtcbiAgICAnOicgK1xuICAgIGUoYWRkcmVzcy5wb3N0T2ZmaWNlQm94KSArXG4gICAgJzsnICtcbiAgICBlKGFkZHJlc3MuZXh0ZW5kZWRBZGRyZXNzKSArXG4gICAgJzsnICtcbiAgICBlKGFkZHJlc3Muc3RyZWV0KSArXG4gICAgJzsnICtcbiAgICBlKGFkZHJlc3MubG9jYWxpdHkpICtcbiAgICAnOycgK1xuICAgIGUoYWRkcmVzcy5yZWdpb24pICtcbiAgICAnOycgK1xuICAgIGUoYWRkcmVzcy5wb3N0YWxDb2RlKSArXG4gICAgJzsnICtcbiAgICBlKGFkZHJlc3MuY291bnRyeU5hbWUpXG4gICk7XG59XG5cbi8qKlxuICogQ29udmVydCBkYXRlIHRvIFlZWVlNTUREIGZvcm1hdFxuICovXG5mdW5jdGlvbiBZWVlZTU1ERChkYXRlOiBEYXRlIHwgdW5kZWZpbmVkKTogc3RyaW5nIHtcbiAgaWYgKCFkYXRlKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBkYXRlLnRvTG9jYWxlRGF0ZVN0cmluZygnc2UnKS5yZXBsYWNlKC9cXEQvZywgJycpOyAvLyB1c2UgU3dlZGlzaCBkYXRlIGZvcm1hdFxufVxuXG4vKipcbiAqIEdldCBtYWpvciB2ZXJzaW9uIGZyb20gdmVyc2lvbiBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1ham9yVmVyc2lvbih2ZXJzaW9uOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBtYWpvclZlcnNpb25TdHJpbmcgPSB2ZXJzaW9uID8gdmVyc2lvbi5zbGljZSgwLCAxKSA6ICc0JztcbiAgaWYgKCFpc05hTigrbWFqb3JWZXJzaW9uU3RyaW5nKSkge1xuICAgIHJldHVybiBOdW1iZXIucGFyc2VJbnQobWFqb3JWZXJzaW9uU3RyaW5nKTtcbiAgfVxuICByZXR1cm4gNDtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIHRoZSBvYmplY3QgaGFzIHRoZSBQcm9wZXJ0eVxuICogQHBhcmFtIG9iaiBPYmplY3QgdG8gdGVzdFxuICogQHBhcmFtIHByb3BlcnR5IFByb3BlcnR5IHRvIGNoZWNrXG4gKi9cbmZ1bmN0aW9uIGhhc1Byb3Aob2JqOiBhbnksIHByb3BlcnR5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3BlcnR5KTtcbn1cbiJdfQ==