import { apiUrl } from "./constants/ApiUrl";
import { version } from "../package.json";
import ILanguage from "./interfaces/ILanguage";
import IParams from "./interfaces/IParams";
import axios from "axios";

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
          //   background: "url(icons/phone.svg)center/cover",
          background: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDczLjgwNiIgaGVpZ2h0PSI0NzMuODA2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZlcnNpb249IjEuMSIgZmlsbD0iIzAwMDAwMCI+DQoNCiA8Zz4NCiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPg0KICA8ZWxsaXBzZSBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgcnk9IjEyOS44MTY3NCIgcng9IjEyOS44MTY3NCIgaWQ9InN2Z182IiBjeT0iMjM2LjkwMjk5IiBjeD0iMjM2LjkwMzAxIiBmaWxsPSIjMDQ1MzRjIi8+DQogIDxlbGxpcHNlIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iMC4zNSIgc3Ryb2tlLXdpZHRoPSIwIiByeT0iMTg0Ljc4NDg4IiByeD0iMTg0Ljc4NDg4IiBpZD0ic3ZnXzciIGN5PSIyMzYuOTAyOTkiIGN4PSIyMzYuOTAzIiBmaWxsPSIjMDQ1MzRjIi8+DQogIDxlbGxpcHNlIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iMC4xNSIgc3Ryb2tlLXdpZHRoPSIwIiByeT0iMjM1LjUwMDAxIiByeD0iMjM1LjUwMDAxIiBpZD0ic3ZnXzgiIGN5PSIyMzYuOTAzIiBjeD0iMjM2LjkwMjk5IiBmaWxsPSIjMDQ1MzRjIi8+DQogIDxnIHN0cm9rZT0ibnVsbCIgc3Ryb2tlLXdpZHRoPSIwIiBpZD0ic3ZnXzEiPg0KICAgPGcgc3Ryb2tlPSJudWxsIiBpZD0ic3ZnXzIiPg0KICAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgZmlsbD0iI2ZmZmZmZiIgaWQ9InN2Z18zIiBkPSJtMjgwLjE1MjQ5LDI1NC43MDAxNWMtMy4wNDk4OCwtMy4xNzU2NSAtNi43Mjg2MSwtNC44NzM1MiAtMTAuNjI3NDMsLTQuODczNTJjLTMuODY3MzgsMCAtNy41Nzc1NCwxLjY2NjQzIC0xMC43NTMyLDQuODQyMDhsLTkuOTM1Nyw5LjkwNDI2Yy0wLjgxNzQ5LC0wLjQ0MDE5IC0xLjYzNDk5LC0wLjg0ODk0IC0yLjQyMTA0LC0xLjI1NzY4Yy0xLjEzMTkyLC0wLjU2NTk2IC0yLjIwMDk1LC0xLjEwMDQ3IC0zLjExMjc3LC0xLjY2NjQzYy05LjMwNjg2LC01LjkxMTExIC0xNy43NjQ3OCwtMTMuNjE0NDMgLTI1Ljg3Njg0LC0yMy41ODE1N2MtMy45MzAyNiwtNC45Njc4NSAtNi41NzE0LC05LjE0OTY1IC04LjQ4OTM3LC0xMy4zOTQzM2MyLjU3ODI1LC0yLjM1ODE2IDQuOTY3ODUsLTQuODEwNjQgNy4yOTQ1NywtNy4xNjg4YzAuODgwMzgsLTAuODgwMzggMS43NjA3NiwtMS43OTIyIDIuNjQxMTQsLTIuNjcyNThjNi42MDI4NCwtNi42MDI4NCA2LjYwMjg0LC0xNS4xNTUwOSAwLC0yMS43NTc5M2wtOC41ODM2OSwtOC41ODM2OWMtMC45NzQ3LC0wLjk3NDcgLTEuOTgwODUsLTEuOTgwODUgLTIuOTI0MTEsLTIuOTg3Yy0xLjg4NjUzLC0xLjk0OTQxIC0zLjg2NzM4LC0zLjk2MTcgLTUuOTExMTEsLTUuODQ4MjNjLTMuMDQ5ODgsLTMuMDE4NDQgLTYuNjk3MTcsLTQuNjIxOTkgLTEwLjUzMzEsLTQuNjIxOTlzLTcuNTQ2MSwxLjYwMzU1IC0xMC42OTAzMSw0LjYyMTk5Yy0wLjAzMTQ0LDAuMDMxNDQgLTAuMDMxNDQsMC4wMzE0NCAtMC4wNjI4OCwwLjA2Mjg4bC0xMC42OTAzMSwxMC43ODQ2NGMtNC4wMjQ1OSw0LjAyNDU5IC02LjMxOTg2LDguOTI5NTUgLTYuODIyOTMsMTQuNjIwNTdjLTAuNzU0NjEsOS4xODEwOSAxLjk0OTQxLDE3LjczMzM0IDQuMDI0NTksMjMuMzMwMDNjNS4wOTM2MiwxMy43NDAyIDEyLjcwMjYxLDI2LjQ3NDI0IDI0LjA1MzIsNDAuMTIwMTFjMTMuNzcxNjQsMTYuNDQ0MjIgMzAuMzQxNjIsMjkuNDI5OCA0OS4yNjk3NiwzOC41Nzk0NWM3LjIzMTY4LDMuNDI3MTkgMTYuODg0NCw3LjQ4MzIyIDI3LjY2OTA0LDguMTc0OTRjMC42NjAyOCwwLjAzMTQ0IDEuMzUyMDEsMC4wNjI4OCAxLjk4MDg1LDAuMDYyODhjNy4yNjMxMiwwIDEzLjM2Mjg5LC0yLjYwOTY5IDE4LjE0MjA5LC03Ljc5NzY0YzAuMDMxNDQsLTAuMDYyODggMC4wOTQzMywtMC4wOTQzMyAwLjEyNTc3LC0wLjE1NzIxYzEuNjM0OTksLTEuOTgwODUgMy41MjE1MSwtMy43NzMwNSA1LjUwMjM3LC01LjY5MTAyYzEuMzUyMDEsLTEuMjg5MTMgMi43MzU0NiwtMi42NDExNCA0LjA4NzQ3LC00LjA1NjAzYzMuMTEyNzcsLTMuMjM4NTQgNC43NDc3NiwtNy4wMTE1OSA0Ljc0Nzc2LC0xMC44Nzg5NmMwLC0zLjg5ODgyIC0xLjY2NjQzLC03LjY0MDQzIC00Ljg0MjA4LC0xMC43ODQ2NGwtMTcuMjYxNzEsLTE3LjMyNDU5em0xMS4yNTYyNywzMy4xMDg1M2MtMC4wMzE0NCwwIC0wLjAzMTQ0LDAuMDMxNDQgMCwwYy0xLjIyNjI0LDEuMzIwNTcgLTIuNDgzOTMsMi41MTUzNyAtMy44MzU5NCwzLjgzNTk0Yy0yLjA0Mzc0LDEuOTQ5NDEgLTQuMTE4OTEsMy45OTMxNSAtNi4wNjgzMiw2LjI4ODQyYy0zLjE3NTY1LDMuMzk1NzUgLTYuOTE3MjYsNC45OTkyOSAtMTEuODIyMjMsNC45OTkyOWMtMC40NzE2MywwIC0wLjk3NDcsMCAtMS40NDYzNCwtMC4wMzE0NGMtOS4zMzgzLC0wLjU5NzQgLTE4LjAxNjMyLC00LjI0NDY4IC0yNC41MjQ4MywtNy4zNTc0NWMtMTcuNzk2MjMsLTguNjE1MTMgLTMzLjQyMjk1LC0yMC44NDYxMSAtNDYuNDA4NTMsLTM2LjM0NzA2Yy0xMC43MjE3NSwtMTIuOTIyNyAtMTcuODkwNTUsLTI0Ljg3MDcgLTIyLjYzODMxLC0zNy42OTkwN2MtMi45MjQxMSwtNy44MjkwOCAtMy45OTMxNSwtMTMuOTI4ODUgLTMuNTIxNTEsLTE5LjY4Mjc1YzAuMzE0NDIsLTMuNjc4NzMgMS43MjkzMiwtNi43Mjg2MSA0LjMzOTAxLC05LjMzODNsMTAuNzIxNzUsLTEwLjcyMTc1YzEuNTQwNjYsLTEuNDQ2MzQgMy4xNzU2NSwtMi4yMzIzOSA0Ljc3OTIsLTIuMjMyMzljMS45ODA4NSwwIDMuNTg0NCwxLjE5NDggNC41OTA1NSwyLjIwMDk1YzAuMDMxNDQsMC4wMzE0NCAwLjA2Mjg4LDAuMDYyODggMC4wOTQzMywwLjA5NDMzYzEuOTE3OTcsMS43OTIyIDMuNzQxNjEsMy42NDcyOCA1LjY1OTU4LDUuNjI4MTNjMC45NzQ3LDEuMDA2MTUgMS45ODA4NSwyLjAxMjI5IDIuOTg3LDMuMDQ5ODhsOC41ODM2OSw4LjU4MzY5YzMuMzMyODYsMy4zMzI4NiAzLjMzMjg2LDYuNDE0MTkgMCw5Ljc0NzA1Yy0wLjkxMTgyLDAuOTExODIgLTEuNzkyMiwxLjgyMzY0IC0yLjcwNDAyLDIuNzA0MDJjLTIuNjQxMTQsMi43MDQwMiAtNS4xNTY1LDUuMjE5MzkgLTcuODkxOTcsNy42NzE4N2MtMC4wNjI4OCwwLjA2Mjg4IC0wLjEyNTc3LDAuMDk0MzMgLTAuMTU3MjEsMC4xNTcyMWMtMi43MDQwMiwyLjcwNDAyIC0yLjIwMDk1LDUuMzQ1MTYgLTEuNjM0OTksNy4xMzczNmMwLjAzMTQ0LDAuMDk0MzMgMC4wNjI4OCwwLjE4ODY1IDAuMDk0MzMsMC4yODI5OGMyLjIzMjM5LDUuNDA4MDQgNS4zNzY2LDEwLjUwMTY2IDEwLjE1NTgsMTYuNTY5OThsMC4wMzE0NCwwLjAzMTQ0YzguNjc4MDIsMTAuNjkwMzEgMTcuODI3NjcsMTkuMDIyNDcgMjcuOTIwNTgsMjUuNDA1MjFjMS4yODkxMywwLjgxNzQ5IDIuNjA5NjksMS40Nzc3OCAzLjg2NzM4LDIuMTA2NjJjMS4xMzE5MiwwLjU2NTk2IDIuMjAwOTUsMS4xMDA0NyAzLjExMjc3LDEuNjY2NDNjMC4xMjU3NywwLjA2Mjg4IDAuMjUxNTQsMC4xNTcyMSAwLjM3NzMxLDAuMjIwMDljMS4wNjkwMywwLjUzNDUyIDIuMDc1MTgsMC43ODYwNSAzLjExMjc3LDAuNzg2MDVjMi42MDk2OSwwIDQuMjQ0NjgsLTEuNjM0OTkgNC43NzkyLC0yLjE2OTVsMTAuNzUzMiwtMTAuNzUzMmMxLjA2OTAzLC0xLjA2OTAzIDIuNzY2OSwtMi4zNTgxNiA0Ljc0Nzc2LC0yLjM1ODE2YzEuOTQ5NDEsMCAzLjU1Mjk2LDEuMjI2MjQgNC41Mjc2NiwyLjI5NTI3YzAuMDMxNDQsMC4wMzE0NCAwLjAzMTQ0LDAuMDMxNDQgMC4wNjI4OCwwLjA2Mjg4bDE3LjMyNDU5LDE3LjMyNDU5YzMuMjM4NTQsMy4yMDcwOSAzLjIzODU0LDYuNTA4NTEgMC4wMzE0NCw5Ljg0MTM4eiIvPg0KICAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgZmlsbD0iI2ZmZmZmZiIgaWQ9InN2Z180IiBkPSJtMjQyLjkyNTA1LDE5Ny44NTI4NGM4LjIzNzgzLDEuMzgzNDUgMTUuNzIxMDUsNS4yODIyNyAyMS42OTUwNSwxMS4yNTYyN3M5Ljg0MTM4LDEzLjQ1NzIyIDExLjI1NjI3LDIxLjY5NTA1YzAuMzQ1ODYsMi4wNzUxOCAyLjEzODA2LDMuNTIxNTEgNC4xODE4LDMuNTIxNTFjMC4yNTE1NCwwIDAuNDcxNjMsLTAuMDMxNDQgMC43MjMxNywtMC4wNjI4OGMyLjMyNjcyLC0wLjM3NzMxIDMuODY3MzgsLTIuNTc4MjUgMy40OTAwNywtNC45MDQ5N2MtMS42OTc4NywtOS45NjcxNCAtNi40MTQxOSwtMTkuMDUzOTEgLTEzLjYxNDQzLC0yNi4yNTQxNXMtMTYuMjg3MDEsLTExLjkxNjU1IC0yNi4yNTQxNSwtMTMuNjE0NDNjLTIuMzI2NzIsLTAuMzc3MzEgLTQuNDk2MjIsMS4xNjMzNiAtNC45MDQ5NywzLjQ1ODYzczEuMTAwNDcsNC41Mjc2NiAzLjQyNzE5LDQuOTA0OTd6Ii8+DQogICAgPHBhdGggc3Ryb2tlPSJudWxsIiBmaWxsPSIjZmZmZmZmIiBpZD0ic3ZnXzUiIGQ9Im0zMTEuMjE3MjgsMjI4LjEzMTU3Yy0yLjc5ODM1LC0xNi40MTI3NyAtMTAuNTMzMSwtMzEuMzQ3NzcgLTIyLjQxODIxLC00My4yMzI4OHMtMjYuODIwMTEsLTE5LjYxOTg3IC00My4yMzI4OCwtMjIuNDE4MjFjLTIuMjk1MjcsLTAuNDA4NzUgLTQuNDY0NzgsMS4xNjMzNiAtNC44NzM1MiwzLjQ1ODYzYy0wLjM3NzMxLDIuMzI2NzIgMS4xNjMzNiw0LjQ5NjIyIDMuNDkwMDcsNC45MDQ5N2MxNC42NTIwMiwyLjQ4MzkzIDI4LjAxNDkxLDkuNDMyNjMgMzguNjQyMzMsMjAuMDI4NjFjMTAuNjI3NDMsMTAuNjI3NDMgMTcuNTQ0NjksMjMuOTkwMzIgMjAuMDI4NjEsMzguNjQyMzNjMC4zNDU4NiwyLjA3NTE4IDIuMTM4MDYsMy41MjE1MSA0LjE4MTgsMy41MjE1MWMwLjI1MTU0LDAgMC40NzE2MywtMC4wMzE0NCAwLjcyMzE3LC0wLjA2Mjg4YzIuMjk1MjcsLTAuMzQ1ODYgMy44NjczOCwtMi41NDY4MSAzLjQ1ODYzLC00Ljg0MjA4eiIvPg0KICAgPC9nPg0KICA8L2c+DQogPC9nPg0KPC9zdmc+")center/cover`,
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
          //   background: "url(icons/arrow_down.svg)center/cover",
          background: `url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAtNC41IDIwIDIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICAgIA0KICAgIDx0aXRsZT5hcnJvd19kb3duIFsjMzM4XTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnM+DQoNCjwvZGVmcz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4NCiAgICAgICAgPGcgaWQ9IkRyaWJiYmxlLUxpZ2h0LVByZXZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjAuMDAwMDAwLCAtNjY4NC4wMDAwMDApIiBmaWxsPSIjZmZmZmZmIj4NCiAgICAgICAgICAgIDxnIGlkPSJpY29ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCAxNjAuMDAwMDAwKSI+DQogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2NC4yOTIzMDgsNjUyNC4zNjU4MyBMMTY0LjI5MjMwOCw2NTI0LjM2NTgzIEMxNjMuOTAyNTY0LDY1MjQuNzcwNzEgMTYzLjkwMjU2NCw2NTI1LjQyNjE5IDE2NC4yOTIzMDgsNjUyNS44MzAwNCBMMTcyLjU1NTg3Myw2NTM0LjM5MjY3IEMxNzMuMzM2MzYsNjUzNS4yMDI0NCAxNzQuNjAyNTI4LDY1MzUuMjAyNDQgMTc1LjM4MzAxNCw2NTM0LjM5MjY3IEwxODMuNzA3NTQsNjUyNS43Njc5MSBDMTg0LjA5MzI4Niw2NTI1LjM2NzE2IDE4NC4wOTgyODMsNjUyNC43MTk5NyAxODMuNzE3NTMzLDY1MjQuMzE0MDUgQzE4My4zMjg3ODksNjUyMy44OTk4NSAxODIuNjg4MjEsNjUyMy44OTQ2NyAxODIuMjkzNDcsNjUyNC4zMDI2NiBMMTc0LjY3NjQ3OSw2NTMyLjE5NjM2IEMxNzQuMjg1NzM2LDY1MzIuNjAxMjQgMTczLjY1MzE1Miw2NTMyLjYwMTI0IDE3My4yNjI0MDksNjUzMi4xOTYzNiBMMTY1LjcwNTM3OSw2NTI0LjM2NTgzIEMxNjUuMzE1NjM1LDY1MjMuOTYwOTQgMTY0LjY4MzA1MSw2NTIzLjk2MDk0IDE2NC4yOTIzMDgsNjUyNC4zNjU4MyIgaWQ9ImFycm93X2Rvd24tWyMzMzhdIj4NCg0KPC9wYXRoPg0KICAgICAgICAgICAgPC9nPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+")center/cover`,
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
    this.form.addEventListener("submit", async (e: any) => {
      e.preventDefault();
      try {
        const formData = new FormData();
        formData.append("action", "call_request");
        formData.append("phone", this.input.value);
        await axios.post("/wp-admin/admin-ajax.php", formData);
        console.log(this.input.value);
      } catch (err) {
        console.log(err);
      }
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
