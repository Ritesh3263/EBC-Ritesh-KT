import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VCard } from 'ngx-vcard';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-end-user',
  templateUrl: './end-user.component.html',
  styleUrls: ['./end-user.component.scss']
})
export class EndUserComponent implements OnInit {

  data: any;
  objectDetails: any;
  isLoading: boolean = true;
  isMessage: any;
  ipAddress: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {

    if (this.activatedRoute.snapshot.queryParams['tc'] && this.activatedRoute.snapshot.queryParams['em']) {
      this.data = { tenantCode: atob(this.activatedRoute.snapshot.queryParams['tc']), emailId: atob(this.activatedRoute.snapshot.queryParams['em']) }
      if (this.data.tenantCode && this.data.emailId) {
        this.getIpAddress();
      }
    }

  }

  ngOnInit(): void { }

  getIpAddress(){
    fetch("https://www.cloudflare.com/cdn-cgi/trace")
      .then(response => response.text())
      .then(result => {
        let data: any = result.trim().split('\n').reduce(function (obj, pair: any) {
          pair = pair.split('=');
          return obj[pair[0]] = pair[1], obj;
        }, {});
        this.ipAddress = data.ip
        this.getCardPreview();
      })
      .catch(error => {
        this.getCardPreview();
      });
  }

  getCardPreview(): void {
    const params = {
      TenantCode: this.data.tenantCode,
      userEmailId: this.data.emailId
    }
    this.isLoading = true;
    this.authService.cardPreview(params, this.ipAddress).subscribe((res) => {
      this.isLoading = false;
      if (res.status == "Ok") {
        this.objectDetails = res.data.templates;
        let a: any = document.getElementById("endUsercardFrame")
        a.innerHTML = this.objectDetails.html
      }

      if (res.status == "Error") {
        if (!res.enquiryForm) {
          this.isMessage = true;
        } else {
          this.router.navigateByUrl(`/end-user/enquiry?tc=${btoa(this.data.tenantCode)}&em=${btoa(this.data.emailId)}`)
        }
      }

    }, (err) => { this.isLoading = false; })
  }

  public generateVCardOnTheFly = (): VCard => {
    let address: string = `${this.objectDetails?.address?.building} ${this.objectDetails?.address?.street} ${this.objectDetails?.address?.locality} ${this.objectDetails?.address?.city} ${this.objectDetails?.address?.state} ${this.objectDetails?.address?.country}-${this.objectDetails?.address?.postalcode}`
    // TODO: Generate the VCard before Download
    if (this.objectDetails) {
      let telePhone = [];
      if (this.objectDetails.primaryContact) {
        telePhone.push({
          value: this.objectDetails.primaryContact,
          param: { type: ['home'], value: 'uri' },
        })
      }
      if (this.objectDetails.secondaryContact) {
        telePhone.push({
          value: this.objectDetails.secondaryContact,
          param: { type: ['work'], value: 'uri' },
        })
      }
      return {
        version: '3.0',
        name: {
          firstNames: this.objectDetails.firstName, lastNames: this.objectDetails.lastName,
          // namePrefix: 'Mr.'
        },
        organization: this.objectDetails.companyName,
        title: this.objectDetails.designation,
        email: [this.objectDetails.email],
        telephone: telePhone,
        note: `${window.location.href}`,
        url: `${this.objectDetails?.website} `,
        address: [{ street: address }],
        // rev: '20080424T195243Z',
        // photo: `ENCODING = b; TYPE = JPEG:${ this.base64Image } `,
      };
    }
    else {
      return {
        name: {
          firstNames: 'NEC',
          lastNames: 'NEC',
        },
      }
    }
  };

  async shareDialog() {
    const blob = await (await fetch(this.objectDetails.message)).blob();
    const file = new File([blob], 'qr.png', { type: blob.type });
    navigator.share({
      title: `${this.objectDetails.firstName} ${this.objectDetails.lastName}`,
      text: `${this.objectDetails.companyName}\n${this.objectDetails.firstName} ${this.objectDetails.lastName}\nScan this QR or Open the given below link.`,
      files: [file],
      url: `${environment.frontEndURL}end-user?tc=${btoa(this.data.tenantCode)}&em=${btoa(this.data.emailId)}`
    })
  }

  /** TO Check the Tag name and check the ID of element than click  */
  @HostListener('document:click', ['$event'])
  clickout(event) {
    let temp: any = event.target.outerHTML;

    // for BUTTON TAG
    temp = (String(temp));
    if (temp[0] == '<' && temp[1] == 'b' && temp[2] == 'u' && temp[3] == 't' && temp[4] == 't' && temp[5] == 'o' && temp[6] == 'n') {
      if (temp.includes('id="save_contact"')) {
        document.getElementById('carddown').click()
      }
      if (temp.includes('id="share_contact"')) {
        this.shareDialog();
      }
    }
    // for DIV TAG
    else if (temp[0] == '<' && temp[1] == 'd' && temp[2] == 'i' && temp[3] == 'v') {
      if (temp.includes('title="YouTube video player"')) {
        let iframe = document.getElementsByTagName('iframe')[0].src += "?autoplay=0";
      }
    }

    // for IMG TAG
    else if (temp[0] == '<' && temp[1] == 'i' && temp[2] == 'm' && temp[3] == 'g') {
      if (temp.includes('id="save_contact"')) {
        document.getElementById('carddown').click()
      }
      if (temp.includes('id="share_contact"')) {
        this.shareDialog();
      }
    }

    // for SPAN TAG
    else if (temp[0] == '<' && temp[1] == 's' && temp[2] == 'p' && temp[3] == 'a' && temp[4] == 'n') {
      if (temp.includes('id="save_contact"')) {
        document.getElementById('carddown').click()
      }
      if (temp.includes('id="share_contact"')) {
        this.shareDialog();
      }
    }

  }
}
