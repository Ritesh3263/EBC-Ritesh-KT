/*
 * General utils for managing cookies in Typescript.
 */
import * as CryptoJS from 'crypto-js';
import * as $ from 'jquery';
import { FormControl, AbstractControl, FormGroup, FormArray } from '@angular/forms';

const rawEncryptionKey = '#572@/.&';

export function encryptValue(value: string): any {

  const ciphertext = CryptoJS.AES.encrypt(value, rawEncryptionKey);
  return ciphertext;
}

export function decryptValue(value: any): any {
  const bytes = CryptoJS.AES.decrypt(value.toString(), rawEncryptionKey);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
}

export function validateEmail(email) {
  const re = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  return re.test(String(email).toLowerCase());
}

export function isMobileNumber(number) {
  const phoneRe = /^[+]*[(]{0,1}[6-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  return phoneRe.test(number);
}

export function setCookie(name: string, val: string, type = null, time: number = 30) {
  const date = new Date();
  const value = encryptValue(val);
  // Set it expire in 7 days
  if (type === 'mins') {
    date.setTime(date.getTime() + (time * 60 * 1000));
  } else if (type === 'hrs') {
    date.setTime(date.getTime() + (time * 60 * 60 * 1000));
  } else if (type === 'days') {
    date.setTime(date.getTime() + (time * 24 * 60 * 60 * 1000));
  }
  // Set it
  document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/';
}

export function getCookie(name: string) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length == 2) {
    return decryptValue(parts.pop().split(';').shift());
  }
}

export function deleteCookie(name: string) {
  const date = new Date();
  // Set it expire in -1 days
  date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
  // Set it
  document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/';
}

export function generateRandomPaymentReferenceNumber() {
  return Math.floor(Math.random() * 1000000000);
}

export class CommonFunction {

  /* This is made for setting errors of invalid form fields dynamically */
  public static _setErrMsgs = (control, errorsObj: any, field: string, validationMessages) => {
    if (control && control.invalid) {
      if (validationMessages !== undefined && validationMessages !== null && validationMessages !== '') {
        const messages = validationMessages[field];
        if (messages !== undefined && messages !== null && messages !== '') {
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              errorsObj[field] = messages[key] + '<br>';
              return;
            }
          }
        }
      } else {
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] = true;
            return;
          }
        }
      }
    }
  }

  public static resetForm = (control, formError = null) => {
    control.reset();
    control.markAsUntouched();
    control.markAsPristine();
    $('form').removeClass('submitted');
    $('.ng2-flatpickr-input').val('');
    if (formError !== null) {
      for (const field in formError) {
        if (formError.hasOwnProperty(field)) {
          formError[field] = '';
        }
      }
    }
  }

  public static formatDateTime = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate
    const year = d.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return [day, month, year].join('-') + ' ' + hours + ':' + minutes + ' ' + ampm;
  }

  public static changedateFormate = (date) => {
    let today;
    if (date) { today = date } else { today = new Date(); }

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    // 2020-02-04 00:00:00
    let finaldate = `${yyyy}-${mm}-${dd} 00:00:00`;
    return finaldate;
  }

  public static changedateTimeFormate = (date) => {
    let today;
    if (date) { today = date } else { today = new Date(); }

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hour = today.getHours();
    var minit = today.getMinutes();
    var second = today.getSeconds();

    // 2020-02-04 12:15:60
    let finaldate = `${yyyy}-${mm}-${dd} ${hour}:${minit}:${second}`;
    return finaldate;
  }

  public static formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) { month = '0' + month; }
    if (day.length < 2) { day = '0' + day; }
    return [day, month, year].join('-');
  }

  public static datetoTimestamp = (date) => {
    return new Date(date).getTime() / 1000;
  }

}

export function validateEmailFormControl(c: FormControl) {
  // tslint:disable:max-line-length
  // tslint:disable:prefer-const
  let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (c.value) {
    return EMAIL_REGEXP.test(c.value) ? null : {
      validateEmail: false
    };
  }
  return null;
}

export class PasswordValidation {
  static passwordValidation() {
    return (AC: AbstractControl) => {
      let password = AC.get('new_password').value;
      let confirmpassword = AC.get('confirm_password').value;
      if (password !== confirmpassword) {
        return AC.get('confirm_password').setErrors({ validatePassword: true });
      }
    };
  }
}

function _getRandomByte() {
  // http://caniuse.com/#feat=getrandomvalues
  let result = null;
  if (window.crypto && window.crypto.getRandomValues) {
    result = new Uint8Array(1);
    window.crypto.getRandomValues(result);
    return result[0];
  } else {
    return Math.floor(Math.random() * 256);
  }
}

export function generateRandomAlphaNumericeString() {
  let result;
  const length = 8;
  const _pattern = /^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$/g;
  const str = Array.apply(null, { 'length': length }).map(function () {
    while (true) {
      result = String.fromCharCode(_getRandomByte());
      if (_pattern.test(result)) {
        return result;
      }
    }
  }, this).join('');
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/;
  return regex.test(str) ? str : generateRandomAlphaNumericeString();
}
export function validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field); //{3}
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control); //{6}
    }
  });
}

export function validateAllFormArrayFields(formArray: any) {
  formArray.controls.forEach((control: any, i) => {
    validateAllFormFields(control)
  });
}

export function enableAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field); //{3}
    if (control instanceof FormControl) {
      control.enable()
    } else if (control instanceof FormGroup) {
      enableAllFormFields(control); //{6}
    }
  });
}

export function keyPressAlphaNumerics(event: any) {
  var inp = String.fromCharCode(event.keyCode);
  if (/[0-9+ ()-]/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

export function keyPressAlpha(event: any) {
  var inp = String.fromCharCode(event.keyCode);
  if (/^[a-zA-Z]+$/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}

export function keyPressAddress(event: any) {
  var inp = String.fromCharCode(event.keyCode);
  if (/^[0-9a-zA-Z,^\ .():+-/^|]+$/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
export function FormFieldsMarkAsUntouched(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach((field) => {
    const control = formGroup.get(field); //{3}
    if (control instanceof FormControl) {
      control.markAsUntouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control); //{6}
    }
  });
}

export let emailRegEx = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
export let countRegEx = /^[0-9]*$/;
export let patternEx = ("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)");
export let youtubeEx = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/i;
export let facebookEx = /^(https?:\/\/)?((w{3}\.)?)facebook.com\/.*/i;
export let linkedInEx = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/.*/i;
export let pdfPatternEx = /\.(pdf|PDF)/;
export let twitterEx = /http(?:s)?:\/\/((?:www\.|[a-z]+\.))?twitter\.com\/([a-zA-Z0-9_]+)/;
export let whatsappEx = /http(?:s)?:\/\/?wa\.me\/([a-zA-Z0-9_]+)/;
export let lineEx = /http(?:s)?:\/\/(?:www\.)?line\.me\/([a-zA-Z0-9_]+)/;
export let wechatEx = /http(?:s)?:\/\/?u\.wechat\.com\/([a-zA-Z0-9_]+)/;
export let numberEx = /^[0-9-+()]*$/;

