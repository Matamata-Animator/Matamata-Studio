import Swal from "sweetalert2";

export async function getSudo(): Promise<string> {
  let psswd = await Swal.fire({
    title:
      "You need elevated permissions to do that. Enter your sudo password:",
    html: `
      <input type="password" id="password" class="swal2-input" placeholder="">`,
    confirmButtonText: "Let's Go!",
    focusConfirm: false,
    preConfirm: async () => {
      //@ts-ignore
      let password = Swal.getPopup().querySelector("#password").value;

      if (!password) {
        Swal.showValidationMessage(`Please enter login and password`);
      }
      return password;
    },
  });
  return psswd.value;
}

document.onkeypress = async (e) => {
  switch (e.key.toLowerCase()) {
    case "enter":
      let x = document.getElementsByClassName("swal2-confirm")[0];
      if (x) {
        eventFire(x, "click");
      }
      break;
  }
};
function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent("on" + etype);
  } else {
    var evObj = document.createEvent("Events");
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

// exports = { getSudo };
