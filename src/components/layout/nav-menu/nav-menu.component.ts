import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import { HtmlService } from "../../../infrastructure/html-service";
import { PathService } from "../../../infrastructure/path-service";

class NavMenuComponent extends HTMLElement {
    constructor() {
        super();
    }

    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        addGlobalStylesToShadowRoot(shadow);

        const wrapper = document.createElement("div");

        // HtmlService.instance.loadHTML(
        //     "./components/layout/nav-menu/nav-menu.component.html",
        //     wrapper
        // );

        wrapper.innerHTML = `
            <style>
                .sidenav a {
                    padding: 8px 8px 8px 32px;
                    text-decoration: none;
                    font-size: 25px;
                    color: #818181;
                    display: block;
                    transition: 0.3s;
                }

                .sidenav a:hover {
                    color: #f1f1f1;
                }

                .sidenav .closebtn {
                    position: absolute;
                    top: 0;
                    right: 25px;
                    font-size: 36px;
                    margin-left: 50px;
                }
            </style>
            <div id="mySidenav" class="sidenav h-screen w-0 fixed z-1 top-0 left-0 bg-zinc-900 overflow-x-hidden duration-500 pt-16">
                <a href="javascript:void(0)" class="closebtn" onclick="this.getRootNode().host.closeNav()"> &times; </a>
                <a id="homeLink" onclick="this.getRootNode().host.loadPageComponent('home')">Home</a>
                <a id="aboutLink" onclick="this.getRootNode().host.loadPageComponent('about')">About</a>
            </div>
        `;

        // const srcDirectory: string = PathService.instance.getSrcFolderPath();

        // wrapper.querySelector("#homeLink")?.setAttribute("href", srcDirectory + "/index.html");
        // wrapper.querySelector("#aboutLink")?.setAttribute("href", srcDirectory + "/pages/about.html");

        // wrapper.querySelector("#homeLink")?.addEventListener("click", (event) => {
        //     const target = event.target as HTMLElement;

        //     if (target.classList.contains("closebtn")) {
        //         this.closeNav();
        //     }
        // });

        // Append the wrapper to the shadow DOM
        shadow.appendChild(wrapper);
    }

    private loadPageComponent(page: string) {
        let pageDiv = document.querySelector("#page");

        if (pageDiv) {
            pageDiv.innerHTML = `<${page}-component></${page}-component>`;
        }
    }

    private getRootPath(): string {
        const locationOfSrcFolder: number = window.location.pathname.lastIndexOf("/src/");
        const path: string = window.location.origin + window.location.pathname.substring(0, locationOfSrcFolder + 4);

        console.log("path", path);

        return path;
    }

    public openNav() {
        const sidenav = this.shadowRoot?.querySelector("#mySidenav");
        if (sidenav) {
            (sidenav as HTMLElement).style.width = "250px";
        }
    }

    private closeNav() {
        const sidenav = this.shadowRoot?.querySelector("#mySidenav");
        if (sidenav) {
            (sidenav as HTMLElement).style.width = "0";
        }
    }
}

customElements.define("nav-menu", NavMenuComponent);
