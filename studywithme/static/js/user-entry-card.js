class EntryCard extends HTMLElement {
    root;
    constructor() {
        super();

        this.root = this.attachShadow({mode: "closed"});

        this.root.innerHTML = `

<style>

.card-content{
background: #cfcfd0;
width: 350px;
height: 450px;
border-radius: 5px;
}
.image-container{

width: 100%;
overflow: hidden;
}
.image-container{

align-self: center;
width: auto;
height: 70%;
margin: 1%;
margin-bottom: 5%;
flex: 2;
flex-direction: column;

}
img{
    display: block;
    margin: auto;
    margin-top: 10%;
    border-radius: 5px;
    width: 90%;
    height: auto;
    -moz-border-radius: 5px;
}
dl{
flex-direction: column;
}
.minutes-container{
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
width: auto;
height: auto;
color: white;
font-size: 250%;
flex-direction: column;
flex: 1;
background: #3e3e3f;
align-self: baseline;

}

.minutes-container>dt{
width: 95%;
margin: auto;
}
#minutes{
font-size: 130%;
margin-top: -20px;
}

</style>
            <div class="card-content">
            <dl>
                <dt class="image-container">
                    
                        <img id="proof" src = "https://images.vexels.com/media/users/3/131734/isolated/preview/05d86a9b63d1930d6298b27081ddc345-photo-preview-frame-icon-by-vexels.png" width="512" height="512">
                   
                </dt>
                <div class="minutes-container">
                    <dt>Minutes Logged:</dt>
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