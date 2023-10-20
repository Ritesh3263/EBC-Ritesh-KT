import { Directive, HostListener } from "@angular/core";
import { Location } from "@angular/common";

@Directive({
  selector: "[routerBack]",
})
export class RouterBackDirective {
  constructor(private location: Location) {}

  @HostListener("click")
  onClick() {
    this.location.back();
  }
}

@Directive({
  selector: "[onlyCharacters]",
})
export class onlyCharactersDirective {
  constructor(private location: Location) {}

  @HostListener("keypress", ['$event'])
  onClick(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z ]/.test(inp)) {

      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}


@Directive({
  selector: "[onlyNumbers]",
})
export class onlyNumbersAndHyphenDirective {
  constructor(private location: Location) {}

  @HostListener("keypress", ['$event'])
  onClick(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[0-9+ ()-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}

@Directive({
  selector: "[onlyCharaterAndHyphen]",
})
export class onlyCharaterAndHyphenDirective {
  constructor(private location: Location) {}

  @HostListener("keypress", ['$event'])
  onClick(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^[A-Za-z? &\-]+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}