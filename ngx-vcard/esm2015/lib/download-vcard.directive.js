import { Directive, HostListener, Input } from '@angular/core';
import { VCardFormatter } from './ngx-vcard.formatter';
import { VCardEncoding } from './types/vCardEncoding';
import * as i0 from "@angular/core";
const ERROR_MESSAGE = "ngx-vcard: No input specified. You must specify either 'vcdDownloadVCard' or 'generateVCardFunction'";
export class DownloadVCardDirective {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmxvYWQtdmNhcmQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmd4LXZjYXJkL3NyYy9saWIvZG93bmxvYWQtdmNhcmQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFdkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDOztBQUV0RCxNQUFNLGFBQWEsR0FDakIsc0dBQXNHLENBQUM7QUFJekcsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUFvQixPQUFtQjtRQUFuQixZQUFPLEdBQVAsT0FBTyxDQUFZO1FBT3ZCLGFBQVEsR0FBa0IsYUFBYSxDQUFDLElBQUksQ0FBQztJQVBuQixDQUFDO0lBVTNDLE9BQU87UUFDTCxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRSxFQUFFO1lBQ3BCLElBQ0UsSUFBSSxDQUFDLHFCQUFxQixJQUFJLFNBQVM7Z0JBQ3ZDLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxFQUFFLEVBQ2hDO2dCQUNBLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7YUFDM0M7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUNoQztTQUNGO1FBQ0QsTUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0RSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDM0IsUUFBUTtnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDekU7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRU8sUUFBUSxDQUFDLElBQVUsRUFBRSxRQUFnQjtRQUMzQyxRQUFRO1FBQ1IsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRTtZQUMvQixNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDN0M7YUFBTTtZQUNMLE1BQU0sQ0FBQyxHQUFzQixRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDckMsQ0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2IsQ0FBQyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDdEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1YsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQ0UsSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ2hCLENBQUMsSUFBSSxDQUFDLHFCQUFxQixJQUFJLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxTQUFTLENBQUMsRUFDMUM7WUFDQSxNQUFNLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQzs7b0hBeERVLHNCQUFzQjt3R0FBdEIsc0JBQXNCOzRGQUF0QixzQkFBc0I7a0JBSGxDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtpQkFDL0I7aUdBTUMsS0FBSztzQkFESixLQUFLO3VCQUFDLGtCQUFrQjtnQkFHekIscUJBQXFCO3NCQURwQixLQUFLO3VCQUFDLHVCQUF1QjtnQkFFZCxRQUFRO3NCQUF2QixLQUFLO2dCQUdOLE9BQU87c0JBRE4sWUFBWTt1QkFBQyxPQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIElucHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBWQ2FyZEZvcm1hdHRlciB9IGZyb20gJy4vbmd4LXZjYXJkLmZvcm1hdHRlcic7XG5pbXBvcnQgeyBWQ2FyZCB9IGZyb20gJy4vdHlwZXMvdkNhcmQnO1xuaW1wb3J0IHsgVkNhcmRFbmNvZGluZyB9IGZyb20gJy4vdHlwZXMvdkNhcmRFbmNvZGluZyc7XG5cbmNvbnN0IEVSUk9SX01FU1NBR0UgPVxuICBcIm5neC12Y2FyZDogTm8gaW5wdXQgc3BlY2lmaWVkLiBZb3UgbXVzdCBzcGVjaWZ5IGVpdGhlciAndmNkRG93bmxvYWRWQ2FyZCcgb3IgJ2dlbmVyYXRlVkNhcmRGdW5jdGlvbidcIjtcbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1t2Y2REb3dubG9hZFZDYXJkXScsXG59KVxuZXhwb3J0IGNsYXNzIERvd25sb2FkVkNhcmREaXJlY3RpdmUge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnQ6IEVsZW1lbnRSZWYpIHt9XG4gIC8vIFRoaXMgcHJvcGVydHkgaXMgYWx3YXlzIHNwZWNpZmllZCBhcyBpdCBpcyB0aGUgc2VsZWN0b3IsXG4gIC8vIHdoaWNoIG1lYW5zIGl0IGNhbid0IGJlIHVuZGVmaW5lZFxuICBASW5wdXQoJ3ZjZERvd25sb2FkVkNhcmQnKVxuICB2Q2FyZCE6IFZDYXJkIHwgJyc7XG4gIEBJbnB1dCgnZ2VuZXJhdGVWQ2FyZEZ1bmN0aW9uJylcbiAgZ2VuZXJhdGVWQ2FyZEZ1bmN0aW9uOiAoKCkgPT4gVkNhcmQpIHwgJycgfCB1bmRlZmluZWQ7XG4gIEBJbnB1dCgpIHB1YmxpYyBlbmNvZGluZzogVkNhcmRFbmNvZGluZyA9IFZDYXJkRW5jb2Rpbmcubm9uZTtcblxuICBASG9zdExpc3RlbmVyKCdjbGljaycpXG4gIG9uY2xpY2soKSB7XG4gICAgaWYgKHRoaXMudkNhcmQgPT0gJycpIHtcbiAgICAgIGlmIChcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVZDYXJkRnVuY3Rpb24gIT0gdW5kZWZpbmVkICYmXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVWQ2FyZEZ1bmN0aW9uICE9ICcnXG4gICAgICApIHtcbiAgICAgICAgdGhpcy52Q2FyZCA9IHRoaXMuZ2VuZXJhdGVWQ2FyZEZ1bmN0aW9uKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoRVJST1JfTUVTU0FHRSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGJsb2IgPSBWQ2FyZEZvcm1hdHRlci5nZXRWQ2FyZEFzQmxvYih0aGlzLnZDYXJkLCB0aGlzLmVuY29kaW5nKTtcbiAgICBsZXQgZmlsZW5hbWUgPSAndkNhcmQnO1xuICAgIGlmICh0aGlzLnZDYXJkLm5hbWUgIT0gbnVsbCkge1xuICAgICAgZmlsZW5hbWUgPVxuICAgICAgICB0aGlzLnZDYXJkLm5hbWUuZmlyc3ROYW1lcyArICcgJyArIHRoaXMudkNhcmQubmFtZS5sYXN0TmFtZXMgKyAnLnZjZic7XG4gICAgfVxuICAgIHRoaXMuZG93bmxvYWQoYmxvYiwgZmlsZW5hbWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBkb3dubG9hZChkYXRhOiBCbG9iLCBmaWxlbmFtZTogc3RyaW5nKSB7XG4gICAgLy8gSUUgMTFcbiAgICBpZiAod2luZG93Lm5hdmlnYXRvci5tc1NhdmVCbG9iKSB7XG4gICAgICB3aW5kb3cubmF2aWdhdG9yLm1zU2F2ZUJsb2IoZGF0YSwgZmlsZW5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhOiBIVE1MQW5jaG9yRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZGF0YSk7XG4gICAgICAoYSBhcyBhbnkpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBhLmhyZWYgPSB1cmw7XG4gICAgICBhLmRvd25sb2FkID0gZmlsZW5hbWU7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpO1xuICAgICAgYS5jbGljaygpO1xuICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChhKTtcbiAgICAgIHdpbmRvdy5VUkwucmV2b2tlT2JqZWN0VVJMKHVybCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKFxuICAgICAgdGhpcy52Q2FyZCA9PSAnJyAmJlxuICAgICAgKHRoaXMuZ2VuZXJhdGVWQ2FyZEZ1bmN0aW9uID09ICcnIHx8XG4gICAgICAgIHRoaXMuZ2VuZXJhdGVWQ2FyZEZ1bmN0aW9uID09IHVuZGVmaW5lZClcbiAgICApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihFUlJPUl9NRVNTQUdFKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==