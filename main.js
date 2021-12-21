/** Connect to Moralis server */
const serverUrl = "https://uu4mrqtsqnp6.usemoralis.com:2053/server";
const appId = "lA5uMfaNA0tXg5pk2ix2HdUSDujjf3QWeGYyHBQM";
Moralis.start({ serverUrl, appId });

const currentTrade = {};

/** Add from here down */
async function login() {
  let user = Moralis.User.current();
  if (!user) {
    try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" })
      console.log(user)
      console.log(user.get('ethAddress'))
    } catch (error) {
      console.log(error)
    }
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;


async function init() {
  await Moralis.initPlugins();
  await Moralis.enable();

  const tokens = await Moralis.Plugins.oneInch.getSupportedTokens({
    chain: 'eth', // The blockchain you want to use (eth/bsc/polygon)
  });

  let parent = document.querySelector(".token_list")

  for (const address in tokens?.tokens) {
    const div = document.createElement("div")
    div.className = "token_row";
    div.setAttribute("data-address", address)
    const html = `
    <img class="token_List_img" src="${tokens?.tokens[address]?.logoURI}"/>
    <span>${tokens?.tokens[address]?.symbol}</span>
    `
    div.onclick = selectToken
    div.innerHTML = html;
    parent.appendChild(div);
  }
}

function selectToken(event) {
  CloseModal()
  let address = event.target.getAttribute("data-address")
  console.log(address)

}

const token_select1 = document.querySelector("#token_select_1")
const token_select2 = document.querySelector("#token_select_2")

token_select1.addEventListener("click", OpenModal)
token_select2.addEventListener("click", OpenModal)

function OpenModal() {
  document.querySelector(".modal").style.display = "block"
}

function CloseModal() {
  document.querySelector(".modal").style.display = "none"
}


init();
