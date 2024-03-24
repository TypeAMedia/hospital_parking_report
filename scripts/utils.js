const ARROW_DOWN = `<svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.7075 4.01476L8.7643 10.9579C8.56966 11.1526 8.31715 11.2551 8.06201 11.2657C8.03132 11.2665 8.00064 11.2665 7.96907 11.2657C7.71393 11.2551 7.4623 11.1526 7.26765 10.9579L0.323616 4.01476C-0.0867132 3.60355 -0.0867132 2.93721 0.323616 2.52688L1.8115 1.039C2.22271 0.627789 2.88905 0.627789 3.29938 1.039L8.01554 5.75515L12.7317 1.039C13.1429 0.627789 13.8093 0.627789 14.2196 1.039L15.7075 2.52688C16.1187 2.93721 16.1187 3.60355 15.7075 4.01476Z" fill="#DA4D45"/>
</svg>`;
const LOCATION_PIN = `<svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.95487 0.526367C3.39294 0.526367 0.5 3.41328 0.5 6.98124C0.5 11.8751 6.95487 17.1065 6.95487 17.1065C6.95487 17.1065 13.4158 12.3211 13.4158 6.98124C13.4158 3.41328 10.5228 0.526367 6.95487 0.526367ZM6.95487 10.2057C5.17692 10.2057 3.73045 8.76522 3.73045 6.98124C3.73045 5.19726 5.17692 3.75079 6.95487 3.75079C8.73283 3.75079 10.1853 5.19726 10.1853 6.98124C10.1853 8.76522 8.73885 10.2057 6.95487 10.2057Z" fill="#D8504A"/>
</svg>`;

//----------- PROTOTYPE FUNCTIONS  ----------------------
d3.selection.prototype.patternify = function (params) {
  var container = this;
  var selector = params.selector;
  var elementTag = params.tag;
  var data = params.data || [selector];

  // Pattern in action
  var selection = container.selectAll("." + selector).data(data, (d, i) => {
    if (typeof d === "object") {
      if (d.id) {
        return d.id;
      }
    }
    return i;
  });
  selection.exit().remove();
  selection = selection.enter().append(elementTag).merge(selection);
  selection.attr("class", selector);
  return selection;
};

function loadSvg(url) {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);

  xhr.overrideMimeType("text/plain");

  return new Promise((res, rej) => {
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          res(xhr.responseText);
        } else {
          rej(new Error('Error'));
        }
      }
    };

    xhr.send();
  });
}

function fakePromise(content) {
  return new Promise((res) => res(content));
}

const globals = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      globals.Android() ||
      globals.BlackBerry() ||
      globals.iOS() ||
      globals.Opera() ||
      globals.Windows()
    );
  },
  get isMobile() {
    return window.innerWidth <= 576;
  },
  get device() {
    return window.innerWidth <= 576 ? "mobile" : "desktop";
  }
};

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function formatThousand(num) {
  if (typeof num === "number") {
    return d3.format(",")(num);
  }

  return num;
}

function formatSi(num) {
  if (typeof num === "number") {
    return d3.format("~s")(num);
  }

  return num;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function initDropdown({ list, id, cb, placeholder, ...rest }) {
  const select = document.querySelector(id);
  const options = list.slice();

  const choice = new Choices(select, {
    choices: [
      ...(placeholder
        ? [{ selected: true, disabled: true, value: "", label: placeholder }]
        : []),
      ...options,
    ],
    position: "bottom",
    shouldSort: false,
    itemSelectText: "",
    placeholder: false,
    searchResultLimit: options.length,
    searchEnabled: false,
    ...rest,
  });

  select.addEventListener(
    "change",
    function (event) {
      const value = event.detail.value;
      cb(value);
    },
    false
  );

  return choice;
}

function getRankValue(rank, isSame) {
  return (isSame ? "=" : "") + (rank < 10 ? "0" + rank : rank);
}

const isVisible = function (ele, container) {
  const eleTop = ele.offsetTop;
  const eleBottom = eleTop + ele.clientHeight;

  const containerTop = container.scrollTop;
  const containerBottom = containerTop + container.clientHeight;

  // The element is fully visible in the container
  return (
    eleTop >= containerTop && eleBottom <= containerBottom
    // ||
    // // Some part of the element is visible in the container
    // (eleTop < containerTop && containerTop < eleBottom) ||
    // (eleTop < containerBottom && containerBottom < eleBottom)
  );
};

function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node != null) {
    if (node == parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function updateCssVar(varName, value) {
  const root = document.documentElement;
  root.style.setProperty(varName, value);
}

function sanitize(str) {
  str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim, "");
  return str.trim().split(" ").join("");
}