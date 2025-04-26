import { addGlobalStylesToShadowRoot } from "../../../infrastructure/global-styles";
import HtmlService from "../../../infrastructure/html-service";

class NavMenuComponent extends HTMLElement {
    private htmlService: HtmlService;

    constructor() {
        super();
        this.htmlService = new HtmlService();
    }

    public connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        const wrapper = document.createElement("div");

        // this.htmlService.loadHTML(
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
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Clients</a>
                <a href="#">Contact</a>
            </div>
        `;

        // Attach the closeNav method to the close button
        // wrapper.addEventListener("click", (event) => {
        //     const target = event.target as HTMLElement;
        //     if (target.classList.contains("closebtn")) {
        //         this.closeNav();
        //     }
        // });

        addGlobalStylesToShadowRoot(shadow);

        // Append the wrapper to the shadow DOM
        shadow.appendChild(wrapper);
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
