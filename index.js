console.log("loaded");

function checkLocalStorage() {
  let cookie = JSON.parse(localStorage.getItem("inputs"));
  if (cookie != null) {
    $("#fm").val(cookie.fm);
    $("#to").val(cookie.to);
    $("#em").val(cookie.em);
    $("#su").val(cookie.su);
  }
}

function getInputs() {
  let r = {
    fm: $("#fm").val(),
    to: $("#to").val(),
    em: $("#em").val(),
    su: $("#su").val(),
  };

  // localStorage.setItem("inputs", JSON.stringify(r));
  return r;
}

function dailyArray(fm, to) {
  if (fm == "" || to == "") return [];
  let efm = fm.split("-");
  let eto = to.split("-");
  let r = [];

  for (let q = parseInt(efm[2]); q <= parseInt(eto[2]); q++) {
    r.push(moment(`${efm[0]}-${efm[1]}-${q}`).format("MMM DD, YYYY"));
  }

  // localStorage.setItem("daily", JSON.stringify(r));
  return r;
}

function initActiArray(dailyArray) {
  if (dailyArray.length == 0) return [];
  let r = [];

  dailyArray.forEach((el) => {
    switch (moment(el, "MMM DD, YYYY").day()) {
      case 0:
        r.push("Sunday");
        break;
      case 6:
        r.push("Saturday");
        break;
      default:
        r.push("");
        break;
    }
  });

  return r;
}

function editClicked() {
  let dailyArr = dailyArray(getInputs().fm, getInputs().to);
  let actsArr = initActiArray(dailyArr);

  pushToHtml(dailyArr, actsArr);
}

function printClicked() {
  window.print();
}

function saveClicked() {
  localStorage.setItem("inputs", JSON.stringify(getInputs()));
  localStorage.setItem("daily", JSON.stringify(dailyArray(getInputs().fm, getInputs().to)));
  localStorage.setItem("savedActs", $("#tbl").html().toString());
}

function pushToHtml(range, acts) {
  // reset element first
  $("#tbl > tbody").html("");

  // fix Header
  $("#dtrange").html(`${range[0]} - ${range[range.length - 1]}`);

  let savedActs = localStorage.getItem("savedActs");
  let inpFM = getInputs().fm;
  let inpTO = getInputs().to;
  let stored = JSON.parse(localStorage.getItem("inputs")) ?? {};
  // console.log(savedActs == null);
  if (inpFM == stored.fm && inpTO == stored.to && savedActs) {
    $("#tbl").html(savedActs);
    console.log("use past");
  } else {
    console.log("make");
    range.forEach((el, elind) => {
      $("#tbl > tbody:last-child").append(`
      <tr>
      <td class="border border-black text-center">${el}</td>
      <td class="border border-black pl-5 pr-2" contentEditable>
        <ul class="list-disc">
          <li>${acts[elind]}</li>
        </ul>
      </td>
      <td class="border border-black text-center" contentEditable></td>
      <td class="border border-black text-center" contentEditable></td>
      </tr>
      `);
    });
  }

  // fix footer
  $("#emp").html(getInputs().em);
  $("#sup").html(getInputs().su);
}
