class EntryCard extends HTMLElement {
    root;
    constructor() {
        super();

        this.root = this.attachShadow({mode: "closed"});

        this.root.innerHTML = `

<style>

.card-content{
background: gray;
width: 100%;
height: 60%;

}
.image-container{
width: 100%;
overflow: hidden;
}
.image-container>dt{
align-content: center;
margin: 0;

}
img{
    margin-left: 5%;
    margin-top: 5%;
    padding: 0;
    width: 90%;
    height: auto;
}
dl{
flex-direction: column;
}
.minutes-container{
align-self: baseline;
margin-bottom: 0;
}

</style>
            <div class="card-content">
            <dl>
                <div class="image-container">
                    <dt>
                        <img id="proof" src = "https://images.vexels.com/media/users/3/131734/isolated/preview/05d86a9b63d1930d6298b27081ddc345-photo-preview-frame-icon-by-vexels.png" width="512" height="512">
                    </dt>
                </div>
                <div class="minutes-container">
                    <dt>Minutes Logged</dt>
                    <dt id="minutes">-1</dt>
                </div>
                </dl>
            </div> 
           
        `
    }
    connectedCallback() {}
    static get observedAttributes() {  return ["proof", "minutes"] }
    attributeChangedCallback(name, old_val, new_val) {

        let modified_tag = this.root.querySelector( "#" + name );
        modified_tag.innerText = new_val;

        if ( "proof" === name ) {
            let avatar_url = this.root.querySelector("#proof")
            avatar_url.src = new_val;

        }

    }


    get proof() {
        return this.getAttribute("proof")
    }
    set proof(new_val) {
        this.setAttribute("proof", new_val);
    }

    get minutes() {
        return this.getAttribute("minutes")
    }
    set minutes(new_val) {
        this.setAttribute("minutes", new_val);
    }

}

customElements.define("entry-card", EntryCard);