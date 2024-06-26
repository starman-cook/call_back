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
  inputFrame: HTMLDivElement = document.createElement("div");
  prefix: HTMLDivElement = document.createElement("div");
  text: HTMLParagraphElement = document.createElement("p");
  subText: HTMLParagraphElement = document.createElement("p");
  errorText: HTMLParagraphElement = document.createElement("p");
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
    this.applySubTextStyle(params);
    this.applyFormStyle();
    this.applyInputFrameStyle();
    this.applyPrefixStyle(params);
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
          zIndex: 99,
          //   background: "url(icons/phone.svg)center/cover",
          // background: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDczLjgwNiIgaGVpZ2h0PSI0NzMuODA2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHZlcnNpb249IjEuMSIgZmlsbD0iIzAwMDAwMCI+DQoNCiA8Zz4NCiAgPHRpdGxlPkxheWVyIDE8L3RpdGxlPg0KICA8ZWxsaXBzZSBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMCIgcnk9IjEyOS44MTY3NCIgcng9IjEyOS44MTY3NCIgaWQ9InN2Z182IiBjeT0iMjM2LjkwMjk5IiBjeD0iMjM2LjkwMzAxIiBmaWxsPSIjMjYzNDQ1Ii8+DQogIDxlbGxpcHNlIHN0cm9rZT0iIzAwMCIgb3BhY2l0eT0iMC4zNSIgc3Ryb2tlLXdpZHRoPSIwIiByeT0iMTg0Ljc4NDg4IiByeD0iMTg0Ljc4NDg4IiBpZD0ic3ZnXzciIGN5PSIyMzYuOTAzIiBjeD0iMjM2LjkwMyIgZmlsbD0iIzI2MzQ0NSIvPg0KICA8ZWxsaXBzZSBzdHJva2U9IiMwMDAiIG9wYWNpdHk9IjAuMTUiIHN0cm9rZS13aWR0aD0iMCIgcnk9IjIzNS41MDAwMSIgcng9IjIzNS41MDAwMSIgaWQ9InN2Z184IiBjeT0iMjM2LjkwMyIgY3g9IjIzNi45MDI5OSIgZmlsbD0iIzI2MzQ0NSIvPg0KICA8ZyBzdHJva2U9Im51bGwiIHN0cm9rZS13aWR0aD0iMCIgaWQ9InN2Z18xIj4NCiAgIDxnIHN0cm9rZT0ibnVsbCIgaWQ9InN2Z18yIj4NCiAgICA8cGF0aCBzdHJva2U9Im51bGwiIGZpbGw9IiNmZmZmZmYiIGlkPSJzdmdfMyIgZD0ibTI4MC4xNTI0OSwyNTQuNzAwMTVjLTMuMDQ5ODgsLTMuMTc1NjUgLTYuNzI4NjEsLTQuODczNTIgLTEwLjYyNzQzLC00Ljg3MzUyYy0zLjg2NzM4LDAgLTcuNTc3NTQsMS42NjY0MyAtMTAuNzUzMiw0Ljg0MjA4bC05LjkzNTcsOS45MDQyNmMtMC44MTc0OSwtMC40NDAxOSAtMS42MzQ5OSwtMC44NDg5NCAtMi40MjEwNCwtMS4yNTc2OGMtMS4xMzE5MiwtMC41NjU5NiAtMi4yMDA5NSwtMS4xMDA0NyAtMy4xMTI3NywtMS42NjY0M2MtOS4zMDY4NiwtNS45MTExMSAtMTcuNzY0NzgsLTEzLjYxNDQzIC0yNS44NzY4NCwtMjMuNTgxNTdjLTMuOTMwMjYsLTQuOTY3ODUgLTYuNTcxNCwtOS4xNDk2NSAtOC40ODkzNywtMTMuMzk0MzNjMi41NzgyNSwtMi4zNTgxNiA0Ljk2Nzg1LC00LjgxMDY0IDcuMjk0NTcsLTcuMTY4OGMwLjg4MDM4LC0wLjg4MDM4IDEuNzYwNzYsLTEuNzkyMiAyLjY0MTE0LC0yLjY3MjU4YzYuNjAyODQsLTYuNjAyODQgNi42MDI4NCwtMTUuMTU1MDkgMCwtMjEuNzU3OTNsLTguNTgzNjksLTguNTgzNjljLTAuOTc0NywtMC45NzQ3IC0xLjk4MDg1LC0xLjk4MDg1IC0yLjkyNDExLC0yLjk4N2MtMS44ODY1MywtMS45NDk0MSAtMy44NjczOCwtMy45NjE3IC01LjkxMTExLC01Ljg0ODIzYy0zLjA0OTg4LC0zLjAxODQ0IC02LjY5NzE3LC00LjYyMTk5IC0xMC41MzMxLC00LjYyMTk5cy03LjU0NjEsMS42MDM1NSAtMTAuNjkwMzEsNC42MjE5OWMtMC4wMzE0NCwwLjAzMTQ0IC0wLjAzMTQ0LDAuMDMxNDQgLTAuMDYyODgsMC4wNjI4OGwtMTAuNjkwMzEsMTAuNzg0NjRjLTQuMDI0NTksNC4wMjQ1OSAtNi4zMTk4Niw4LjkyOTU1IC02LjgyMjkzLDE0LjYyMDU3Yy0wLjc1NDYxLDkuMTgxMDkgMS45NDk0MSwxNy43MzMzNCA0LjAyNDU5LDIzLjMzMDAzYzUuMDkzNjIsMTMuNzQwMiAxMi43MDI2MSwyNi40NzQyNCAyNC4wNTMyLDQwLjEyMDExYzEzLjc3MTY0LDE2LjQ0NDIyIDMwLjM0MTYyLDI5LjQyOTggNDkuMjY5NzYsMzguNTc5NDVjNy4yMzE2OCwzLjQyNzE5IDE2Ljg4NDQsNy40ODMyMiAyNy42NjkwNCw4LjE3NDk0YzAuNjYwMjgsMC4wMzE0NCAxLjM1MjAxLDAuMDYyODggMS45ODA4NSwwLjA2Mjg4YzcuMjYzMTIsMCAxMy4zNjI4OSwtMi42MDk2OSAxOC4xNDIwOSwtNy43OTc2NGMwLjAzMTQ0LC0wLjA2Mjg4IDAuMDk0MzMsLTAuMDk0MzMgMC4xMjU3NywtMC4xNTcyMWMxLjYzNDk5LC0xLjk4MDg1IDMuNTIxNTEsLTMuNzczMDUgNS41MDIzNywtNS42OTEwMmMxLjM1MjAxLC0xLjI4OTEzIDIuNzM1NDYsLTIuNjQxMTQgNC4wODc0NywtNC4wNTYwM2MzLjExMjc3LC0zLjIzODU0IDQuNzQ3NzYsLTcuMDExNTkgNC43NDc3NiwtMTAuODc4OTZjMCwtMy44OTg4MiAtMS42NjY0MywtNy42NDA0MyAtNC44NDIwOCwtMTAuNzg0NjRsLTE3LjI2MTcxLC0xNy4zMjQ1OXptMTEuMjU2MjcsMzMuMTA4NTNjLTAuMDMxNDQsMCAtMC4wMzE0NCwwLjAzMTQ0IDAsMGMtMS4yMjYyNCwxLjMyMDU3IC0yLjQ4MzkzLDIuNTE1MzcgLTMuODM1OTQsMy44MzU5NGMtMi4wNDM3NCwxLjk0OTQxIC00LjExODkxLDMuOTkzMTUgLTYuMDY4MzIsNi4yODg0MmMtMy4xNzU2NSwzLjM5NTc1IC02LjkxNzI2LDQuOTk5MjkgLTExLjgyMjIzLDQuOTk5MjljLTAuNDcxNjMsMCAtMC45NzQ3LDAgLTEuNDQ2MzQsLTAuMDMxNDRjLTkuMzM4MywtMC41OTc0IC0xOC4wMTYzMiwtNC4yNDQ2OCAtMjQuNTI0ODMsLTcuMzU3NDVjLTE3Ljc5NjIzLC04LjYxNTEzIC0zMy40MjI5NSwtMjAuODQ2MTEgLTQ2LjQwODUzLC0zNi4zNDcwNmMtMTAuNzIxNzUsLTEyLjkyMjcgLTE3Ljg5MDU1LC0yNC44NzA3IC0yMi42MzgzMSwtMzcuNjk5MDdjLTIuOTI0MTEsLTcuODI5MDggLTMuOTkzMTUsLTEzLjkyODg1IC0zLjUyMTUxLC0xOS42ODI3NWMwLjMxNDQyLC0zLjY3ODczIDEuNzI5MzIsLTYuNzI4NjEgNC4zMzkwMSwtOS4zMzgzbDEwLjcyMTc1LC0xMC43MjE3NWMxLjU0MDY2LC0xLjQ0NjM0IDMuMTc1NjUsLTIuMjMyMzkgNC43NzkyLC0yLjIzMjM5YzEuOTgwODUsMCAzLjU4NDQsMS4xOTQ4IDQuNTkwNTUsMi4yMDA5NWMwLjAzMTQ0LDAuMDMxNDQgMC4wNjI4OCwwLjA2Mjg4IDAuMDk0MzMsMC4wOTQzM2MxLjkxNzk3LDEuNzkyMiAzLjc0MTYxLDMuNjQ3MjggNS42NTk1OCw1LjYyODEzYzAuOTc0NywxLjAwNjE1IDEuOTgwODUsMi4wMTIyOSAyLjk4NywzLjA0OTg4bDguNTgzNjksOC41ODM2OWMzLjMzMjg2LDMuMzMyODYgMy4zMzI4Niw2LjQxNDE5IDAsOS43NDcwNWMtMC45MTE4MiwwLjkxMTgyIC0xLjc5MjIsMS44MjM2NCAtMi43MDQwMiwyLjcwNDAyYy0yLjY0MTE0LDIuNzA0MDIgLTUuMTU2NSw1LjIxOTM5IC03Ljg5MTk3LDcuNjcxODdjLTAuMDYyODgsMC4wNjI4OCAtMC4xMjU3NywwLjA5NDMzIC0wLjE1NzIxLDAuMTU3MjFjLTIuNzA0MDIsMi43MDQwMiAtMi4yMDA5NSw1LjM0NTE2IC0xLjYzNDk5LDcuMTM3MzZjMC4wMzE0NCwwLjA5NDMzIDAuMDYyODgsMC4xODg2NSAwLjA5NDMzLDAuMjgyOThjMi4yMzIzOSw1LjQwODA0IDUuMzc2NiwxMC41MDE2NiAxMC4xNTU4LDE2LjU2OTk4bDAuMDMxNDQsMC4wMzE0NGM4LjY3ODAyLDEwLjY5MDMxIDE3LjgyNzY3LDE5LjAyMjQ3IDI3LjkyMDU4LDI1LjQwNTIxYzEuMjg5MTMsMC44MTc0OSAyLjYwOTY5LDEuNDc3NzggMy44NjczOCwyLjEwNjYyYzEuMTMxOTIsMC41NjU5NiAyLjIwMDk1LDEuMTAwNDcgMy4xMTI3NywxLjY2NjQzYzAuMTI1NzcsMC4wNjI4OCAwLjI1MTU0LDAuMTU3MjEgMC4zNzczMSwwLjIyMDA5YzEuMDY5MDMsMC41MzQ1MiAyLjA3NTE4LDAuNzg2MDUgMy4xMTI3NywwLjc4NjA1YzIuNjA5NjksMCA0LjI0NDY4LC0xLjYzNDk5IDQuNzc5MiwtMi4xNjk1bDEwLjc1MzIsLTEwLjc1MzJjMS4wNjkwMywtMS4wNjkwMyAyLjc2NjksLTIuMzU4MTYgNC43NDc3NiwtMi4zNTgxNmMxLjk0OTQxLDAgMy41NTI5NiwxLjIyNjI0IDQuNTI3NjYsMi4yOTUyN2MwLjAzMTQ0LDAuMDMxNDQgMC4wMzE0NCwwLjAzMTQ0IDAuMDYyODgsMC4wNjI4OGwxNy4zMjQ1OSwxNy4zMjQ1OWMzLjIzODU0LDMuMjA3MDkgMy4yMzg1NCw2LjUwODUxIDAuMDMxNDQsOS44NDEzOHoiLz4NCiAgICA8cGF0aCBzdHJva2U9Im51bGwiIGZpbGw9IiNmZmZmZmYiIGlkPSJzdmdfNCIgZD0ibTI0Mi45MjUwNSwxOTcuODUyODRjOC4yMzc4MywxLjM4MzQ1IDE1LjcyMTA1LDUuMjgyMjcgMjEuNjk1MDUsMTEuMjU2MjdzOS44NDEzOCwxMy40NTcyMiAxMS4yNTYyNywyMS42OTUwNWMwLjM0NTg2LDIuMDc1MTggMi4xMzgwNiwzLjUyMTUxIDQuMTgxOCwzLjUyMTUxYzAuMjUxNTQsMCAwLjQ3MTYzLC0wLjAzMTQ0IDAuNzIzMTcsLTAuMDYyODhjMi4zMjY3MiwtMC4zNzczMSAzLjg2NzM4LC0yLjU3ODI1IDMuNDkwMDcsLTQuOTA0OTdjLTEuNjk3ODcsLTkuOTY3MTQgLTYuNDE0MTksLTE5LjA1MzkxIC0xMy42MTQ0MywtMjYuMjU0MTVzLTE2LjI4NzAxLC0xMS45MTY1NSAtMjYuMjU0MTUsLTEzLjYxNDQzYy0yLjMyNjcyLC0wLjM3NzMxIC00LjQ5NjIyLDEuMTYzMzYgLTQuOTA0OTcsMy40NTg2M3MxLjEwMDQ3LDQuNTI3NjYgMy40MjcxOSw0LjkwNDk3eiIvPg0KICAgIDxwYXRoIHN0cm9rZT0ibnVsbCIgZmlsbD0iI2ZmZmZmZiIgaWQ9InN2Z181IiBkPSJtMzExLjIxNzI4LDIyOC4xMzE1N2MtMi43OTgzNSwtMTYuNDEyNzcgLTEwLjUzMzEsLTMxLjM0Nzc3IC0yMi40MTgyMSwtNDMuMjMyODhzLTI2LjgyMDExLC0xOS42MTk4NyAtNDMuMjMyODgsLTIyLjQxODIxYy0yLjI5NTI3LC0wLjQwODc1IC00LjQ2NDc4LDEuMTYzMzYgLTQuODczNTIsMy40NTg2M2MtMC4zNzczMSwyLjMyNjcyIDEuMTYzMzYsNC40OTYyMiAzLjQ5MDA3LDQuOTA0OTdjMTQuNjUyMDIsMi40ODM5MyAyOC4wMTQ5MSw5LjQzMjYzIDM4LjY0MjMzLDIwLjAyODYxYzEwLjYyNzQzLDEwLjYyNzQzIDE3LjU0NDY5LDIzLjk5MDMyIDIwLjAyODYxLDM4LjY0MjMzYzAuMzQ1ODYsMi4wNzUxOCAyLjEzODA2LDMuNTIxNTEgNC4xODE4LDMuNTIxNTFjMC4yNTE1NCwwIDAuNDcxNjMsLTAuMDMxNDQgMC43MjMxNywtMC4wNjI4OGMyLjI5NTI3LC0wLjM0NTg2IDMuODY3MzgsLTIuNTQ2ODEgMy40NTg2MywtNC44NDIwOHoiLz4NCiAgIDwvZz4NCiAgPC9nPg0KIDwvZz4NCjwvc3ZnPg==")center/cover`,
          background: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTkiIGhlaWdodD0iOTkiIHZpZXdCb3g9IjAgMCA5OSA5OSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDkuNSIgY3k9IjQ5LjUiIHI9IjQ5LjUiIGZpbGw9IiNDREYwRkYiLz4KPGNpcmNsZSBjeD0iNDkuNSIgY3k9IjQ5LjUiIHI9IjQ0LjUiIGZpbGw9IiM5OUQ4RjMiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI0OSIgcj0iMzkiIGZpbGw9IiMwMDlFRTIiLz4KPHBhdGggZD0iTTYwLjk3NDggNDYuOTQ3N0M2MC4wOTY5IDQ2Ljk0NzcgNTkuNDAyNyA0Ni4yMzMxIDU5LjQwMjcgNDUuMzc1NkM1OS40MDI3IDQ0LjYyMDIgNTguNjQ3MyA0My4wNDgxIDU3LjM4MTUgNDEuNjgwMkM1Ni4xMzYxIDQwLjM1MzEgNTQuNzY4MiAzOS41NzczIDUzLjYyNDggMzkuNTc3M0M1Mi43NDY5IDM5LjU3NzMgNTIuMDUyNyAzOC44NjI3IDUyLjA1MjcgMzguMDA1MkM1Mi4wNTI3IDM3LjE0NzcgNTIuNzY3MyAzNi40MzMxIDUzLjYyNDggMzYuNDMzMUM1NS42NjY1IDM2LjQzMzEgNTcuODEwMiAzNy41MzU2IDU5LjY4ODYgMzkuNTE2QzYxLjQ0NDQgNDEuMzczOSA2Mi41NjczIDQzLjY4MSA2Mi41NjczIDQ1LjM1NTJDNjIuNTY3MyA0Ni4yMzMxIDYxLjg1MjcgNDYuOTQ3NyA2MC45NzQ4IDQ2Ljk0NzdaIiBmaWxsPSIjRjdGN0Y3Ii8+CjxwYXRoIGQ9Ik02OC4zNDQzIDQ2Ljk0ODFDNjcuNDY2NCA0Ni45NDgxIDY2Ljc3MjMgNDYuMjMzNSA2Ni43NzIzIDQ1LjM3NkM2Ni43NzIzIDM4LjEyODEgNjAuODcxOCAzMi4yNDgxIDUzLjY0NDMgMzIuMjQ4MUM1Mi43NjY0IDMyLjI0ODEgNTIuMDcyMyAzMS41MzM1IDUyLjA3MjMgMzAuNjc2QzUyLjA3MjMgMjkuODE4NSA1Mi43NjY0IDI5LjA4MzUgNTMuNjIzOSAyOS4wODM1QzYyLjYwNzMgMjkuMDgzNSA2OS45MTY0IDM2LjM5MjcgNjkuOTE2NCA0NS4zNzZDNjkuOTE2NCA0Ni4yMzM1IDY5LjIwMTggNDYuOTQ4MSA2OC4zNDQzIDQ2Ljk0ODFaIiBmaWxsPSIjRjdGN0Y3Ii8+CjxwYXRoIG9wYWNpdHk9IjAuNCIgZD0iTTQ5LjA3MTkgNTQuMDEyMkw0Mi4zOTU3IDYwLjY4ODVDNDEuNjYwNyA2MC4wMzUyIDQwLjk0NjEgNTkuMzYxNCA0MC4yNTE5IDU4LjY2NzJDMzguMTQ5IDU2LjU0MzkgMzYuMjUwMiA1NC4zMTg1IDM0LjU1NTcgNTEuOTkxQzMyLjg4MTUgNDkuNjYzNSAzMS41MzQgNDcuMzM2IDMwLjU1NCA0NS4wMjg5QzI5LjU3NCA0Mi43MDE0IDI5LjA4NCA0MC40NzYgMjkuMDg0IDM4LjM1MjdDMjkuMDg0IDM2Ljk2NDMgMjkuMzI5IDM1LjYzNzIgMjkuODE5IDM0LjQxMjJDMzAuMzA5IDMzLjE2NjggMzEuMDg0OCAzMi4wMjM1IDMyLjE2NjkgMzEuMDAyN0MzMy40NzM2IDI5LjcxNjQgMzQuOTAyNyAyOS4wODM1IDM2LjQxMzYgMjkuMDgzNUMzNi45ODUyIDI5LjA4MzUgMzcuNTU2OSAyOS4yMDYgMzguMDY3MyAyOS40NTFDMzguNTk4MiAyOS42OTYgMzkuMDY3NyAzMC4wNjM1IDM5LjQzNTIgMzAuNTk0M0w0NC4xNzE5IDM3LjI3MDZDNDQuNTM5NCAzNy43ODEgNDQuODA0OCAzOC4yNTA2IDQ0Ljk4ODYgMzguNjk5N0M0NS4xNzIzIDM5LjEyODUgNDUuMjc0NCAzOS41NTcyIDQ1LjI3NDQgMzkuOTQ1MkM0NS4yNzQ0IDQwLjQzNTIgNDUuMTMxNSA0MC45MjUyIDQ0Ljg0NTcgNDEuMzk0N0M0NC41ODAyIDQxLjg2NDMgNDQuMTkyMyA0Mi4zNTQzIDQzLjcwMjMgNDIuODQ0M0w0Mi4xNTA2IDQ0LjQ1NzJDNDEuOTI2MSA0NC42ODE4IDQxLjgyNCA0NC45NDcyIDQxLjgyNCA0NS4yNzM5QzQxLjgyNCA0NS40MzcyIDQxLjg0NDQgNDUuNTgwMiA0MS44ODUyIDQ1Ljc0MzVDNDEuOTQ2NSA0NS45MDY4IDQyLjAwNzcgNDYuMDI5MyA0Mi4wNDg2IDQ2LjE1MThDNDIuNDE2MSA0Ni44MjU2IDQzLjA0OSA0Ny43MDM1IDQzLjk0NzMgNDguNzY1MkM0NC44NjYxIDQ5LjgyNjggNDUuODQ2MSA1MC45MDg5IDQ2LjkwNzcgNTEuOTkxQzQ3LjY0MjcgNTIuNzA1NiA0OC4zNTczIDUzLjM5OTcgNDkuMDcxOSA1NC4wMTIyWiIgZmlsbD0iI0Y3RjdGNyIvPgo8cGF0aCBkPSJNNjkuODU1IDYyLjQyMzhDNjkuODU1IDYyLjk5NTUgNjkuNzUyOSA2My41ODc1IDY5LjU0ODggNjQuMTU5MkM2OS40ODc1IDY0LjMyMjUgNjkuNDI2MyA2NC40ODU5IDY5LjM0NDYgNjQuNjQ5MkM2OC45OTc1IDY1LjM4NDIgNjguNTQ4NCA2Ni4wNzg0IDY3Ljk1NjMgNjYuNzMxN0M2Ni45NTU5IDY3LjgzNDIgNjUuODUzNCA2OC42MzA1IDY0LjYwNzkgNjkuMTQwOUM2NC41ODc1IDY5LjE0MDkgNjQuNTY3MSA2OS4xNjEzIDY0LjU0NjcgNjkuMTYxM0M2My4zNDIxIDY5LjY1MTMgNjIuMDM1NCA2OS45MTY3IDYwLjYyNjcgNjkuOTE2N0M1OC41NDQyIDY5LjkxNjcgNTYuMzE4OCA2OS40MjY3IDUzLjk3MDkgNjguNDI2M0M1MS42MjI5IDY3LjQyNTkgNDkuMjc1IDY2LjA3ODQgNDYuOTQ3NSA2NC4zODM4QzQ2LjE1MTMgNjMuNzkxNyA0NS4zNTUgNjMuMTk5NiA0NC41OTk2IDYyLjU2NjdMNTEuMjc1OSA1NS44OTA1QzUxLjg0NzUgNTYuMzE5MiA1Mi4zNTc5IDU2LjY0NTkgNTIuNzg2NyA1Ni44NzA1QzUyLjg4ODggNTYuOTExMyA1My4wMTEzIDU2Ljk3MjUgNTMuMTU0MiA1Ny4wMzM4QzUzLjMxNzUgNTcuMDk1IDUzLjQ4MDkgNTcuMTE1NSA1My42NjQ2IDU3LjExNTVDNTQuMDExNyA1Ny4xMTU1IDU0LjI3NzEgNTYuOTkzIDU0LjUwMTcgNTYuNzY4NEw1Ni4wNTM0IDU1LjIzNzFDNTYuNTYzOCA1NC43MjY3IDU3LjA1MzggNTQuMzM4OCA1Ny41MjM0IDU0LjA5MzhDNTcuOTkyOSA1My44MDggNTguNDYyNSA1My42NjUgNTguOTcyOSA1My42NjVDNTkuMzYwOSA1My42NjUgNTkuNzY5MiA1My43NDY3IDYwLjIxODQgNTMuOTMwNUM2MC42Njc1IDU0LjExNDIgNjEuMTM3MSA1NC4zNzk2IDYxLjY0NzUgNTQuNzI2N0w2OC40MDU0IDU5LjUyNDZDNjguOTM2MyA1OS44OTIxIDY5LjMwMzggNjAuMzIwOSA2OS41Mjg0IDYwLjgzMTNDNjkuNzMyNSA2MS4zNDE3IDY5Ljg1NSA2MS44NTIxIDY5Ljg1NSA2Mi40MjM4WiIgZmlsbD0iI0Y3RjdGNyIvPgo8L3N2Zz4K")center/cover`,
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
          maxWidth: "482px",
          zIndex: 98,
          //   height: "240px",
          background: "#fff",
          position: "fixed",
          bottom: "60px",
          right: window.screen.width < 500 ? "0" : "60px",
          borderRadius: "25px",
          display: this.show ? "block" : "none",
          boxSizing: "border-box",
          padding: "28px 32px",
          border: "2px solid #009EE2",
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
          width: "45px",
          height: "45px",
          //   background: "url(icons/arrow_down.svg)center/cover",
          // background: `url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAtNC41IDIwIDIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPg0KICAgIA0KICAgIDx0aXRsZT5hcnJvd19kb3duIFsjMzM4XTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnM+DQoNCjwvZGVmcz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4NCiAgICAgICAgPGcgaWQ9IkRyaWJiYmxlLUxpZ2h0LVByZXZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMjAuMDAwMDAwLCAtNjY4NC4wMDAwMDApIiBmaWxsPSIjZmZmZmZmIj4NCiAgICAgICAgICAgIDxnIGlkPSJpY29ucyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNTYuMDAwMDAwLCAxNjAuMDAwMDAwKSI+DQogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE2NC4yOTIzMDgsNjUyNC4zNjU4MyBMMTY0LjI5MjMwOCw2NTI0LjM2NTgzIEMxNjMuOTAyNTY0LDY1MjQuNzcwNzEgMTYzLjkwMjU2NCw2NTI1LjQyNjE5IDE2NC4yOTIzMDgsNjUyNS44MzAwNCBMMTcyLjU1NTg3Myw2NTM0LjM5MjY3IEMxNzMuMzM2MzYsNjUzNS4yMDI0NCAxNzQuNjAyNTI4LDY1MzUuMjAyNDQgMTc1LjM4MzAxNCw2NTM0LjM5MjY3IEwxODMuNzA3NTQsNjUyNS43Njc5MSBDMTg0LjA5MzI4Niw2NTI1LjM2NzE2IDE4NC4wOTgyODMsNjUyNC43MTk5NyAxODMuNzE3NTMzLDY1MjQuMzE0MDUgQzE4My4zMjg3ODksNjUyMy44OTk4NSAxODIuNjg4MjEsNjUyMy44OTQ2NyAxODIuMjkzNDcsNjUyNC4zMDI2NiBMMTc0LjY3NjQ3OSw2NTMyLjE5NjM2IEMxNzQuMjg1NzM2LDY1MzIuNjAxMjQgMTczLjY1MzE1Miw2NTMyLjYwMTI0IDE3My4yNjI0MDksNjUzMi4xOTYzNiBMMTY1LjcwNTM3OSw2NTI0LjM2NTgzIEMxNjUuMzE1NjM1LDY1MjMuOTYwOTQgMTY0LjY4MzA1MSw2NTIzLjk2MDk0IDE2NC4yOTIzMDgsNjUyNC4zNjU4MyIgaWQ9ImFycm93X2Rvd24tWyMzMzhdIj4NCg0KPC9wYXRoPg0KICAgICAgICAgICAgPC9nPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+")center/cover`,
          background: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHZpZXdCb3g9IjAgMCA0NSA0NSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggb3BhY2l0eT0iMC40IiBkPSJNMjIuNSA0MS4yNUMzMi44NTUzIDQxLjI1IDQxLjI1IDMyLjg1NTMgNDEuMjUgMjIuNUM0MS4yNSAxMi4xNDQ3IDMyLjg1NTMgMy43NSAyMi41IDMuNzVDMTIuMTQ0NyAzLjc1IDMuNzUgMTIuMTQ0NyAzLjc1IDIyLjVDMy43NSAzMi44NTUzIDEyLjE0NDcgNDEuMjUgMjIuNSA0MS4yNVoiIGZpbGw9IiMwMDlFRTIiLz4KPHBhdGggZD0iTTI0LjQ4ODMgMjIuNDk5OEwyOC44MDA4IDE4LjE4NzNDMjkuMzQ0NSAxNy42NDM2IDI5LjM0NDUgMTYuNzQzNiAyOC44MDA4IDE2LjE5OThDMjguMjU3IDE1LjY1NjEgMjcuMzU3IDE1LjY1NjEgMjYuODEzMyAxNi4xOTk4TDIyLjUwMDggMjAuNTEyM0wxOC4xODgzIDE2LjE5OThDMTcuNjQ0NSAxNS42NTYxIDE2Ljc0NDUgMTUuNjU2MSAxNi4yMDA4IDE2LjE5OThDMTUuNjU3IDE2Ljc0MzYgMTUuNjU3IDE3LjY0MzYgMTYuMjAwOCAxOC4xODczTDIwLjUxMzMgMjIuNDk5OEwxNi4yMDA4IDI2LjgxMjNDMTUuNjU3IDI3LjM1NjEgMTUuNjU3IDI4LjI1NjEgMTYuMjAwOCAyOC43OTk4QzE2LjQ4MiAyOS4wODExIDE2LjgzODMgMjkuMjEyMyAxNy4xOTQ1IDI5LjIxMjNDMTcuNTUwOCAyOS4yMTIzIDE3LjkwNyAyOS4wODExIDE4LjE4ODMgMjguNzk5OEwyMi41MDA4IDI0LjQ4NzNMMjYuODEzMyAyOC43OTk4QzI3LjA5NDUgMjkuMDgxMSAyNy40NTA4IDI5LjIxMjMgMjcuODA3IDI5LjIxMjNDMjguMTYzMyAyOS4yMTIzIDI4LjUxOTUgMjkuMDgxMSAyOC44MDA4IDI4Ljc5OThDMjkuMzQ0NSAyOC4yNTYxIDI5LjM0NDUgMjcuMzU2MSAyOC44MDA4IDI2LjgxMjNMMjQuNDg4MyAyMi40OTk4WiIgZmlsbD0iIzAwOUVFMiIvPgo8L3N2Zz4K")center/cover`,
          position: "absolute",
          top: "28px",
          right: "32px",
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
          marginTop: "65px",
          marginBottom: "20px",
          fontWeight: "700",
          fontSize: "40px",
          color: "black",
          textAlign: "left",
          fontFamily: "Gilroy, Helvetica, sans-serif",
        },
        params.textStyle || {}
      )
    );
    this.text.innerText = params.text || "Zavolejte mi zpět";
  };

  applySubTextStyle = (params: IParams): void => {
    Object.assign(
      this.subText.style,
      Object.assign(
        {
          marginTop: "0",
          marginBottom: "20px",
          fontWeight: "500",
          fontSize: "19px",
          color: "#999999",
          textAlign: "left",
          fontFamily: "Gilroy, Helvetica, sans-serif",
        },
        params.subTextStyle || {}
      )
    );
    this.subText.innerText =
      params.subText || "Zadejte prosím své telefonní číslo, zavoláme vám zpět";
  };

  applyInputStyle = (params: IParams): void => {
    Object.assign(
      this.input.style,
      Object.assign(
        {
          border: "none",
          width: "100%",
          // padding: "5px",
          outline: "none",
          color: "rgba(0, 0, 0, 0.40)",
          background: "transparent",
          //   borderRadius: "5px",
          // fontSize: window.screen.width < 500 ? "22px" : "26px",
          fontSize: "19px",
          fontWeight: "600",
        },
        params.inputStyle || {}
      )
    );
    this.input.setAttribute("placeholder", "___ - ___ - ___");
    this.input.setAttribute("class", "CallBackButton_input");
  };

  applyInputFrameStyle = (): void => {
    Object.assign(this.inputFrame.style, {
      display: "flex",
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "9px",
      border: `1px solid #E6E6E6`,
      background: "white",
      marginBottom: "20px",
      padding: "13px 20px",
      boxSizing: "border-box",
    });
  };

  applyPrefixStyle = (params: IParams): void => {
    Object.assign(this.prefix.style, {
      fontSize: "19px",
      color: "rgba(0, 0, 0, 0.40)",
      fontWeight: "600",
      margin: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      lineHeight: "0",
      fontFamily: "Gilroy, Helvetica, sans-serif",
    });
    this.prefix.innerText = params.code || "+420-";
  };

  applySendButtonStyle = (params: IParams): void => {
    Object.assign(
      this.sendButton.style,
      Object.assign(
        {
          width: "100%",
          border: "none",
          padding: "20px",
          outline: "none",
          borderRadius: "9px",
          background: "#FF6B35",
          color: " #fff",
          cursor: "pointer",
          fontFamily: "Gilroy, Helvetica, sans-serif",
          fontSize: "25px",
          fontWeight: "700",
          textTransform: "uppercase",
        },
        params.sendButtonStyle || {}
      )
    );
    this.sendButton.innerText = params.text || "Odeslat";
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
    this.form.addEventListener("submit", this.submit);
  };

  submit = async (e: any): Promise<void> => {
    e.preventDefault();
    const answer = document.createElement("p");
    Object.assign(answer.style, {
      fontSize: "40px",
      color: "#009EE2",
      textAlign: "center",
      fontWeight: "700",
      fontFamily: "Gilroy, Helvetica, sans-serif",
      marginTop: "45px",
      marginBottom: "20px",
    });
    try {
      const value = this.input.value.replace(/-/g, "");
      const regExp = new RegExp(
        /^(2[0-9]{2}|3[0-9]{2}|4[0-9]{2}|5[0-9]{2}|72[0-9]|73[0-9]|77[0-9]|60[1-8]|56[0-9]|70[2-5]|79[0-9])[0-9]{3}[0-9]{3}$/
      );
      //  /^(\+?420)?(2[0-9]{2}|3[0-9]{2}|4[0-9]{2}|5[0-9]{2}|72[0-9]|73[0-9]|77[0-9]|60[1-8]|56[0-9]|70[2-5]|79[0-9])[0-9]{3}[0-9]{3}$/

      if (!regExp.test(value)) {
        Object.assign(this.errorText.style, {
          display: "block",
          fontSize: "19px",
          color: "#CA150C",
          fontWeight: "700",
          marginBottom: "20px",
          marginTop: "0",
          fontFamily: "Gilroy, Helvetica, sans-serif",
          textAlign: "left",
          alignSelf: "flex-start",
        });
        Object.assign(this.inputFrame.style, {
          border: "1px solid #CA150C",
        });
        this.errorText.innerText = "Chyba formátu";
        return;
      }
      const formData = new FormData();
      formData.append("action", "call_request");
      formData.append("phone", value);
      await axios.post("/wp-admin/admin-ajax.php", formData);
      answer.innerHTML = "Děkujeme, </br>brzy se vám ozveme";
    } catch (err) {
      console.log(err);
      answer.innerText = "Error :(";
    }
    this.popup.innerHTML = "";
    this.popup.append(this.closeButton);
    this.popup.append(answer);
  };

  handleInput = (e: any) => {
    e.target.value = this.phoneMask(e.target.value);
  };

  phoneMask = (phone: string) => {
    return (
      phone
        .replace(/\D/g, "")
        //   .replace(/^(\d)/, "$1")
        // .replace(/(\d{0})(\d{1,2})/, "$1-$2")
        .replace(/(\d{3})(\d{1,4})/, "$1-$2")
        .replace(/(\d{3})(\d{1,4})/, "$1-$2")
        .replace(/(-\d{3})\d+?$/, "$1")
    );
  };
  /**
   *   phoneMask = (phone: string) => {
    return phone
      .replace(/\D/g, "")
      .replace(/^(\d)/, "($1")
      .replace(/^(\(\d{2})(\d)/, "$1) $2")
      .replace(/(\d{4})(\d{1,5})/, "$1-$2")
      .replace(/(-\d{5})\d+?$/, "$1");
  };
   */

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
    const style = document.createElement("style");
    style.innerText =
      ".CallBackButton_input::placeholder {color: rgba(0, 0, 0, 0.40);opacity: 1;}";
    document.body.append(this.popup);
    this.popup.append(this.closeButton);
    this.popup.append(this.text);
    this.popup.append(this.subText);
    this.inputFrame.append(this.prefix);
    this.inputFrame.append(this.input);
    this.form.append(this.inputFrame);
    this.form.append(this.errorText);
    this.form.append(this.sendButton);
    this.popup.append(this.form);
    document.body.append(this.btn);
    document.body.append(style);
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
