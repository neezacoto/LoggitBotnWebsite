class SeasonCard extends HTMLElement {
    root;
    constructor() {
        super();

        this.root = this.attachShadow({mode: "closed"});

        this.root.innerHTML = `

<header>
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Squada+One&display=swap" rel="stylesheet">
</header>
<style>

img{
    padding: 10px;
    border-radius: 50%;
    width: 80%;
    height: auto;
    min-width: 50px;
}
dl{
    font-family: 'Oswald', sans-serif;
    color: #ffffff;
    font-size: 400%;
    display: flex;
    align-items: center;
    background: #3e3e3f;
    border-radius: 5px;
    overflow: hidden;
    margin: 5px
}
a{
color: #d3d3d4;
text-decoration: none;
    transition: color 200ms ease-out;
}

a:hover,.logo:hover {
    color: #ccff3e;
}
#rank{
color: #ffffff;
margin-left: 50px;
margin-right: 30px;

}
.user{
flex: 1;
}
.card-content{
align-items: center;
}
.logged{
margin-right: 20px;
overflow: hidden;
}
.logged,.user{
white-space: nowrap;
display: flex;
align-items: center;

}
#minutes{
font-size: 150%;
color: #6bed8b;
font-family: Impact, sans-serif;
}
</style>
            <div class="card-content">
                <dl>
                <div class="user">
                    <dt id="rank">#0</dt>
                    <dt><img id="avatar" src = "https://rb.gy/oremz3" width="128" height="128" alt="avatar"/></dt>
                    <a id = "profile" href="/Entry/User/"><dt id="username">username</dt></a>
                </div>
                    
                    <div class="logged">
                        <dt >Minutes Logged:</dt>
                        <dt id="minutes">-1</dt>
                    </div>
                    
                </dl>
            </div> 
           
        `
    }
    connectedCallback() {}
    static get observedAttributes() {  return ["rank", "avatar", "username","minutes","profile"] }
    attributeChangedCallback(name, old_val, new_val) {

        let modified_tag = this.root.querySelector( "#" + name );
        if(name !== "profile") {modified_tag.innerText = new_val;}


        if ( "avatar" === name ) {
            let avatar_url = this.root.querySelector("#avatar")
            avatar_url.src = new_val;

        }
        if ("profile" === name ) {
            let user_url = this.root.querySelector("a");
            user_url.href = "/Entry/User/"+new_val

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
    get profile() {
        return this.getAttribute("profile")
    }
    set profile(new_val) {
        this.setAttribute("profile", new_val);
    }

}

customElements.define("season-card", SeasonCard);