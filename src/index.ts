import { apiUrl } from "./constants/ApiUrl";
import { version } from "../package.json";
import ILanguage from "./interfaces/ILanguage";
import IParams from "./interfaces/IParams";

/**
 * class CallBack, init it with custom or default styles
 */
export class CallBack {
  /**
   * Language
   */
  language: ILanguage = Object.assign({}, require(`./languages/en.json`));

  /**
   * Set language
   */
  setLanguage = (lang: string) => {
    try {
      this.language = Object.assign({}, require(`./languages/${lang}.json`));
    } catch (e) {
      console.log(`Language ${lang} is not supported`);
    }
  };

  btn: HTMLDivElement = document.createElement("div");
  popup: HTMLDivElement = document.createElement("div");
  closeButton: HTMLDivElement = document.createElement("div");
  text: HTMLParagraphElement = document.createElement("p");
  sendButton: HTMLButtonElement = document.createElement("button");
  form: HTMLFormElement = document.createElement("form");
  input: HTMLInputElement = document.createElement("input");
  show: boolean = false;

  /**
   * Function that will be saved to window, can be launched from anywhere.
   */
  init = async (params: IParams): Promise<void> => {
    const html: HTMLElement | null = document.querySelector("html");
    const lang: string | null | undefined =
      params.lang || html?.getAttribute("lang");
    this.setLanguage(lang || "en");
    const elm = await this.waitForElement("body");
    if (elm) {
      this.renderCallBack(params);
    }
  };

  /**
   * Function to wait for the HTML element
   */
  waitForElement = (selector: string): Promise<Element | null> => {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  };

  /**
   * Main function that renders a callback button and popup with phone input
   */
  renderCallBack = (params: IParams): void => {
    this.applyButtonStyle(params);
    this.applyPopupStyle(params);
    this.applyCloseButtonStyle(params);
    this.applyTextStyle(params);
    this.applyFormStyle();
    this.applyInputStyle(params);
    this.applySendButtonStyle(params);
    this.addEvents(params);
    this.appendAll();
  };

  applyButtonStyle = (params: IParams): void => {
    Object.assign(
      this.btn.style,
      Object.assign(
        {
          cursor: "pointer",
          width: "80px",
          height: "80px",
          background: "url(icons/phone.svg)center/cover",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          boxShadow: "none",
          transform: "scale(1)",
          transition: "0.2s",
        },
        params.buttonStyle || {}
      )
    );
  };
  applyButtonHoverStyle = (params: IParams): void => {
    Object.assign(
      this.btn.style,
      params.hoverButtonStyle || {
        transform: "scale(1.1)",
      }
    );
  };
  applyPopupStyle = (params: IParams): void => {
    Object.assign(
      this.popup.style,
      Object.assign(
        {
          width: "100%",
          maxWidth: "440px",
          height: "240px",
          background: "rgb(5, 168, 154)",
          position: "fixed",
          bottom: "60px",
          right: "60px",
          borderRadius: "5px",
          display: this.show ? "block" : "none",
          boxSizing: "border-box",
          padding: "20px",
        },
        params.popupStyle || {}
      )
    );
  };

  applyCloseButtonStyle = (params: IParams): void => {
    Object.assign(
      this.closeButton.style,
      Object.assign(
        {
          cursor: "pointer",
          width: "20px",
          height: "20px",
          background: "url(icons/arrow_down.svg)center/cover",
          position: "absolute",
          top: "10px",
          right: "10px",
          boxShadow: "none",
          transform: "scale(1)",
          transition: "0.2s",
        },
        params.buttonStyle || {}
      )
    );
  };

  applyTextStyle = (params: IParams): void => {
    Object.assign(
      this.text.style,
      Object.assign(
        {
          color: "white",
        },
        params.textStyle || {}
      )
    );
    this.text.innerText =
      params.text ||
      "Nemáte čas, nevíte si rady? Zanechte nám telefonní číslo a my vám pomůžeme ušetřit";
  };

  applyInputStyle = (params: IParams): void => {
    Object.assign(
      this.input.style,
      Object.assign(
        {
          border: "none",
          width: "100%",
          padding: "5px",
          outline: "none",
          borderRadius: "5px",
          fontSize: "30px",
          margin: "10px auto 20px",
        },
        params.inputStyle || {}
      )
    );
  };

  applySendButtonStyle = (params: IParams): void => {
    Object.assign(
      this.sendButton.style,
      Object.assign(
        {
          color: "white",
          border: "none",
          padding: "5px",
          outline: "none",
          borderRadius: "5px",
          fontSize: "20px",
          background: "rgb(6, 83, 76)",
          cursor: "pointer",
        },
        params.sendButtonStyle || {}
      )
    );
    this.sendButton.innerText = params.text || "ODESLAT";
  };

  applyFormStyle = (): void => {
    Object.assign(this.form.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    });
    this.form.setAttribute("id", "call_back_form_vlsr");
  };

  addEvents = (params: IParams): void => {
    this.btn.addEventListener("mouseover", (e: MouseEvent) => {
      this.applyButtonHoverStyle(params);
    });
    this.btn.addEventListener("mouseout", (e: MouseEvent) => {
      this.applyButtonStyle(params);
    });
    this.input.addEventListener("input", this.handleInput);
    this.closeButton.addEventListener("click", this.pressButtonHandler);
    this.btn.addEventListener("click", this.pressButtonHandler);
    this.btn.addEventListener("touch", this.pressButtonHandler);
    this.btn.addEventListener("dblclick", (e: MouseEvent) => {
      e.preventDefault();
    });
  };

  handleInput = (e: any) => {
    e.target.value = this.phoneMask(e.target.value);
  };

  phoneMask = (phone: string) => {
    return phone
      .replace(/\D/g, "")
      .replace(/^(\d)/, "($1")
      .replace(/^(\(\d{2})(\d)/, "$1) $2")
      .replace(/(\d{4})(\d{1,5})/, "$1-$2")
      .replace(/(-\d{5})\d+?$/, "$1");
  };

  /**
   * Function which is responsible for click or touch event on callback button
   */
  pressButtonHandler = (): void => {
    this.show = !this.show;
    Object.assign(this.popup.style, {
      display: this.show ? "block" : "none",
    });
  };

  appendAll = (): void => {
    document.body.append(this.popup);
    this.popup.append(this.closeButton);
    this.popup.append(this.text);
    this.form.append(this.input);
    this.form.append(this.sendButton);
    this.popup.append(this.form);
    document.body.append(this.btn);
  };
}

/**
 * Declaring global variable for the init function to render callback button, it accepts Parameters as argument.
 */
declare global {
  interface Window {
    CallBack: Object;
  }
}
if (typeof window !== "undefined") {
  window.CallBack = CallBack;
}
