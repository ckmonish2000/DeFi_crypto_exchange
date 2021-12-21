/** Connect to Moralis server */
const serverUrl = "https://uu4mrqtsqnp6.usemoralis.com:2053/server";
const appId = "lA5uMfaNA0tXg5pk2ix2HdUSDujjf3QWeGYyHBQM";
Moralis.start({ serverUrl, appId });

const currentTrade = {};
let selected = "";
let Global_Tokens;

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
  Global_Tokens = tokens?.tokens
  let parent = document.querySelector(".token_list")

  for (const address in tokens?.tokens) {
    const div = document.createElement("div")
    div.className = "token_row";
    div.setAttribute("data-address", address)
    const html = `
    <img class="token_List_img" src="${tokens?.tokens[address]?.logoURI}"/>
    <span>${tokens?.tokens[address]?.symbol}</span>
    `
    div.onclick = () => { selectToken(address) }
    div.innerHTML = html;
    parent.appendChild(div);
  }
}

function selectToken(address) {
  CloseModal()

  if (selected === "from") {
    const token_select1 = document.querySelector("#token_select_1")
    currentTrade["from"] = Global_Tokens[address]

    token_select1.innerHTML = `
    <img class="token_List_img" src="${Global_Tokens[address]?.logoURI}" />
    `
  }
  else {
    const token_select2 = document.querySelector("#token_select_2")
    currentTrade["to"] = Global_Tokens[address]
    token_select2.innerHTML = `
    <img class="token_List_img" src="${Global_Tokens[address]?.logoURI}" />
    `
  }

}

const token_select1 = document.querySelector("#token_select_1")
const token_select2 = document.querySelector("#token_select_2")

token_select1.addEventListener("click", () => {
  OpenModal()
  selected = "from"
})
token_select2.addEventListener("click", () => {
  OpenModal()
  selected = "to"
})

function OpenModal() {
  document.querySelector(".modal").style.display = "block"
}

function CloseModal() {
  document.querySelector(".modal").style.display = "none"
}


const from_token_ip = document.querySelector("#from_amout")
const to_token_ip = document.querySelector("#to_amout")

from_token_ip.addEventListener("blur", async () => {
  let current_value = Number(from_token_ip.value) * 10 ** currentTrade?.from?.decimals


  if (!currentTrade?.from || !currentTrade?.to || !current_value) return;

  const quote = await Moralis.Plugins.oneInch.quote({
    chain: 'eth', // The blockchain you want to use (eth/bsc/polygon)
    fromTokenAddress: currentTrade?.from?.address,
    toTokenAddress: currentTrade?.to?.address,
    amount: current_value,
  });
  console.log(quote);
  to_token_ip.value = (quote?.toTokenAmount) / (10 ** quote?.toToken?.decimals)

})

init();
