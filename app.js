const products = [
{category:"Cricket",name:"Cricket bats",description:"Explore willow bats for practice and match day. Ask about weight, grade and available models."},
{category:"Cricket",name:"Batting & protection",description:"Batting gloves, pads, helmets and protective gear. Adult, youth and junior enquiries welcome."},
{category:"Cricket",name:"Kit bags & accessories",description:"Keep your match-day essentials together. Kit bags, grips and cricket accessories."},
{category:"Badminton",name:"Rackets & shuttlecocks",description:"Rackets, shuttlecocks, grips and nets for club sessions and everyday play."},
{category:"Football",name:"Football essentials",description:"Footballs, playing kits, footwear and training equipment for your team."},
{category:"Other sports",name:"Court & field equipment",description:"Ask us about volleyball, basketball, table tennis, kabaddi, hockey and athletics equipment."},
{category:"Fitness",name:"Training equipment",description:"Cones, hurdles, resistance bands and fitness accessories for your next training session."},
{category:"Sportswear",name:"Custom jerseys & kits",description:"Team colours, player names, numbers and sponsor logos. Make your squad look the part."},
{category:"Footwear",name:"Sports shoes & spikes",description:"Cricket spikes, non-marking court shoes and training footwear. Check available sizes."}
];
const wa = text => "https://wa.me/919736325100?text="+encodeURIComponent(text);
let selected="All";
const filters=document.getElementById("filters"),grid=document.getElementById("products-grid"),search=document.getElementById("search");
for(const category of ["All",...new Set(products.map(p=>p.category))]){
 const button=document.createElement("button");button.textContent=category;button.type="button";button.setAttribute("aria-pressed",String(category===selected));
 button.addEventListener("click",()=>{selected=category;for(const b of filters.children)b.setAttribute("aria-pressed",String(b.textContent===category));render()});filters.append(button);
}
function render(){grid.replaceChildren();const matches=products.filter(p=>(selected==="All"||p.category===selected)&&(p.name+" "+p.description+" "+p.category).toLowerCase().includes(search.value.trim().toLowerCase()));for(const [i,p] of matches.entries()){const card=document.createElement("article");card.className="product";const top=document.createElement("div");top.className="number";const category=document.createElement("span");category.textContent=p.category.toUpperCase();const number=document.createElement("span");number.textContent=String(i+1).padStart(2,"0");top.append(category,number);const title=document.createElement("h3");title.textContent=p.name;const desc=document.createElement("p");desc.textContent=p.description;const link=document.createElement("a");link.href=wa("Hi Dogra Sports, I would like to enquire about "+p.name+". Please share available models, sizes and prices.");link.textContent="Enquire on WhatsApp ↗";card.append(top,title,desc,link);grid.append(card)}if(!matches.length){const empty=document.createElement("p");empty.textContent="No matching items. Try another search or contact us for your requirement.";grid.append(empty)}}
search.addEventListener("input",render);render();
document.getElementById("menu").addEventListener("click",e=>{const open=document.getElementById("nav").classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(open))});
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>{document.getElementById("nav").classList.remove("open");document.getElementById("menu").setAttribute("aria-expanded","false")}));
document.getElementById("enquiry").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.currentTarget);const message="Hi Dogra Sports,\nName: "+f.get("name").trim()+"\nMobile: "+f.get("phone").trim()+"\nRequirement: "+f.get("type")+"\n"+f.get("message").trim();window.location.assign(wa(message))});
document.getElementById("year").textContent=new Date().getFullYear();
