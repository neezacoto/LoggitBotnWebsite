class SeasonCard extends HTMLElement {
    root;
    constructor() {
        super();

        this.root = this.attachShadow({mode: "closed"});

        this.root.innerHTML = `

<style>
img{
    padding: 10px;
    border-radius: 50%;
    width: 25%;
    height: auto;
}
dl{
    
    font-family: 'Oswald', sans-serif;
    color: #d3d3d4;
    font-size: 400%;
    display: flex;
    align-items: center;
    background: #3e3e3f;
    border-radius: 5px;
    overflow: hidden;
}
#rank{
margin-left: 50px;
margin-right: 30px;


}
.logged{
white-space: nowrap;
}
</style>
            <div class="card-content">
                <dl>
                    <dt id="rank">#0</dt>
                    <dt ><img src = "https://rb.gy/oremz3" width="128" height="128" alt="avatar"/></dt>
                    <a href="/Season/null"><dt id="username">username</dt></a>
                    <dt class="logged">Minutes Logged:</dt>
                    <dt class="logged" id="minutes">-1</dt>
                </dl>
            </div> 
           
        `
    }
    connectedCallback() {}
    static get observedAttributes() {  return ["rank", "avatar", "username","minutes","profile_link"] }
    attributeChangedCallback(name, old_val, new_val) {

        let modified_tag = this.root.querySelector( "#" + name );
        modified_tag.innerText = new_val;

        if ( "avatar" === name ) {
            let avatar_url = this.root.querySelector("img");
            avatar_url.href = new_val;

        }
        if ("profile_link" === name ) {
            let user_url = this.root.querySelector("a");
            user_url.src = "/Season/"+new_val;

        }

    }


    get rank() {
        return this.getAttribute("rank")
    }
    set rank(new_val) {
        this.setAttribute("rank", new_val);
    }

    get avatar() {
        return this.getAttribute("avatar")
    }
    set avatar(new_val) {
        this.setAttribute("avatar", new_val);
    }

    get username() {
        return this.getAttribute("username")
    }
    set username(new_val) {
        this.setAttribute("username", new_val);
    }
    get minutes() {
        return this.getAttribute("minutes")
    }
    set minutes(new_val) {
        this.setAttribute("minutes", new_val);
    }
    get profile_link() {
        return this.getAttribute("profile_link")
    }
    set profile_link(new_val) {
        this.setAttribute("profile_link", new_val);
    }

}

customElements.define("season-card", SeasonCard);